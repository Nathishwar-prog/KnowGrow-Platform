import React, { useState, useRef } from "react";
import axios from "axios";
import { Button } from "../../../@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../@/components/ui/dialog";
import { Input } from "../../../@/components/ui/input";
import { Textarea } from "../../../@/components/ui/textarea";
import { Switch } from "../../../@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../@/components/ui/select";
import { Sparkle, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddNewCourseDialog({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    noOfChapters: 1,
    includeVideo: false,
    level: "",
    category: "",
  });
  const router = useRouter();
  const requestLockRef = useRef(false);
  const lastRequestTimeRef = useRef(0);

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [open, setOpen] = useState(false);

  const onGenerate = async () => {
    if (requestLockRef.current || loading) {
      return;
    }

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    if (timeSinceLastRequest < 5000) {
      toast.error("Please wait a few seconds before trying again.");
      return;
    }

    if (!formData.name?.trim()) {
      toast.error("Please enter a course name.");
      return;
    }

    if (!formData.level) {
      toast.error("Please select a difficulty level.");
      return;
    }

    requestLockRef.current = true;
    lastRequestTimeRef.current = now;
    setLoading(true);
    setError(null);

    const courseId = uuidv4();

    try {
      const result = await axios.post("/api/generate-course-layout", {
        ...formData,
        courseId,
      }, {
        timeout: 120000,
      });

      if (!result?.data?.success && result?.data?.error) {
        throw new Error(result.data.error);
      }

      if (!result?.data?.courseId) {
        throw new Error("No course ID returned from server.");
      }

      const newId = result.data.courseId;
      toast.success("Course generated successfully!");
      setOpen(false);
      router.push("/workspace/edit-course/" + newId);
    } catch (err) {
      console.error("Course generation error:", err);
      
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.error || err?.response?.data?.message;
      
      let userMessage = "Failed to generate course. Please try again.";
      
      if (status === 429) {
        userMessage = serverMessage || "Too many requests. Please wait 30 seconds before trying again.";
        setError(userMessage);
      } else if (status === 401) {
        userMessage = "Please sign in to generate courses.";
      } else if (status === 403) {
        userMessage = serverMessage || "You don't have permission to generate courses.";
      } else if (serverMessage) {
        userMessage = serverMessage;
      } else if (err.code === "ECONNABORTED") {
        userMessage = "Request timed out. The AI is busy, please try again later.";
      }
      
      toast.error(userMessage);
      setError(userMessage);
    } finally {
      setLoading(false);
      setTimeout(() => {
        requestLockRef.current = false;
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!loading) {
        setOpen(val);
        if (!val) setError(null);
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Create New Course Using KG-AI</DialogTitle>
          <DialogDescription>
            Fill in the course details below
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <div className="h-1 flex-1 rounded bg-emerald-200"></div>
          <div className="h-1 w-16 rounded bg-emerald-500"></div>
          <div className="h-1 w-8 rounded bg-emerald-200"></div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label>Course Name</label>
            <Input
              placeholder="e.g. Python .."
              disabled={loading}
              onChange={(event) =>
                onHandleInputChange("name", event?.target.value)
              }
            />
          </div>
          <div>
            <label>Course Description (optional)</label>
            <Textarea
              placeholder="Course Description"
              disabled={loading}
              onChange={(event) =>
                onHandleInputChange("description", event?.target.value)
              }
            />
          </div>
          <div>
            <label>No of Chapters</label>
            <Input
              placeholder="No of chapters"
              type="number"
              min={1}
              max={20}
              disabled={loading}
              defaultValue={1}
              onChange={(event) =>
                onHandleInputChange(
                  "noOfChapters",
                  parseInt(event?.target.value) || 1
                )
              }
            />
          </div>
          <div className="flex gap-3 items-center">
            <label>Include Videos</label>
            <Switch
              disabled={loading}
              onCheckedChange={() =>
                onHandleInputChange("includeVideo", !formData?.includeVideo)
              }
            />
          </div>
          <div>
            <label className="">Difficulty Level</label>
            <Select
              disabled={loading}
              onValueChange={(value) => onHandleInputChange("level", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Difficulty Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>Category</label>
            <Input
              placeholder="Category (Separated by Comma)"
              disabled={loading}
              onChange={(event) =>
                onHandleInputChange("category", event?.target.value)
              }
            />
          </div>
          <div className="mt-5">
            <Button
              className={"w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"}
              onClick={onGenerate}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="relative h-5 w-5">
                    <div className="h-5 w-5 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin"></div>
                    <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-400 animate-ping m-auto"></div>
                  </div>
                  Generating with KG-AI…
                </div>
              ) : (
                <>
                  <Sparkle />
                  Generate Course
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;
