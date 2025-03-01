// app/dashboard/projects/new/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { projectService } from "@/lib/services/projectService";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateProjectPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    categoryId: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await projectService.getCategories();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await projectService.createProject(formData);
      toast.success("Create Success");
      router.push("/dashboard/projects");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create project:");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link className="text-gray-800" href="/dashboard/projects">
                Projects
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-800" />
            <Link className="text-gray-800" href={`/dashboard/projects/new`}>
              New
            </Link>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <h1 className="text-2xl font-bold">Create New Project</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Project Name
              </label>
              <Input
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.projectCategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => router.push("/dashboard/projects")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
