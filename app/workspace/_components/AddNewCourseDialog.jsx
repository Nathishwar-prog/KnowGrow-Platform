import React, { useState } from "react";
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
import { Loader2Icon, Sparkle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddNewCourseDialog({ children }) {
  const [loading, setLoading] = useState(false);
  const [queued, setQueued] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    noOfChapters: 1,
    includeVideo: false,
    level: "",
    category: "",
  });
  const router = useRouter();
  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(formData);
  };

  const requestOnce = async () => {
    console.log("Form data before request:", formData);
    const courseId = uuidv4();
    console.log("Generated UUID for course:", courseId);

    try {
      setLoading(true);

      const result = await axios.post("/api/generate-course-layout", {
        ...formData,
        courseId,
      });

      console.log("Raw API response:", result); // full Axios response
      console.log("API response data:", result.data); // payload only

      if (!result?.data?.courseId) {
        console.error("❌ No courseId returned from API!", result.data);
        setLoading(false);
        return;
      }

      const newId = result.data.courseId;
      console.log("✅ Redirecting to course:", newId);

      router.push("/workspace/edit-course/" + newId);
    } catch (err) {
      console.error("❌ Error during course generation:", err);
      const apiMessage = err?.response?.data?.message || err?.message || 'Unknown error';
      toast.error(`Generation failed: ${apiMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = async () => {
    if (loading) return;
    setQueued(false);
    setAttempt(0);
    try {
      await requestOnce();
    } catch (e) {
      setQueued(true);
      let delay = 1200;
      for (let i = 0; i < 2; i++) {
        setAttempt(i + 1);
        await new Promise(res => setTimeout(res, delay));
        try {
          await requestOnce();
          setQueued(false);
          return;
        } catch (err) {
          delay *= 2;
        }
      }
      setQueued(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Create New Course Using KG-AI</DialogTitle>
          {/* ✅ keep description simple text only */}
          <DialogDescription>
            Fill in the course details below
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <div className="h-1 flex-1 rounded bg-emerald-200"></div>
          <div className="h-1 w-16 rounded bg-emerald-500"></div>
          <div className="h-1 w-8 rounded bg-emerald-200"></div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label>Course Name</label>
            <Input
              placeholder="e.g. Python .."
              onChange={(event) =>
                onHandleInputChange("name", event?.target.value)
              }
            />
          </div>
          <div>
            <label>Course Description (optional)</label>
            <Textarea
              placeholder="Course Description"
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
              onChange={(event) =>
                onHandleInputChange(
                  "noOfChapters",
                  parseInt(event?.target.value)
                )
              }
            />
          </div>
          <div className="flex gap-3 items-center">
            <label>Include Videos</label>
            <Switch
              onCheckedChange={() =>
                onHandleInputChange("includeVideo", !formData?.includeVideo)
              }
            />
          </div>
          <div>
            <label className="">Difficulty Level</label>
            <Select
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
                  {queued ? `Queued, retrying (attempt ${attempt+1}/3)…` : 'Generating with KG-AI…'}
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
