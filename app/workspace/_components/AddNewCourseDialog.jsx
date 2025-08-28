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

  const onGenerate = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course Using KG-AI</DialogTitle>
          {/* ✅ keep description simple text only */}
          <DialogDescription>
            Fill in the course details below
          </DialogDescription>
        </DialogHeader>

        {/* ✅ form content moved outside description */}
        <div className="flex flex-col gap-4 mt-3">
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
              className={"w-full"}
              onClick={onGenerate}
              disabled={loading}
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <Sparkle />}
              Generate Course
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;
