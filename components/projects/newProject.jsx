// app/dashboard/projects/new/page.jsx
"use client";
import * as Yup from "yup";
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
import { useFormik } from "formik";

const NewProject = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      projectName: "",
      description: "",
      categoryId: "",
    },
    validationSchema: Yup.object().shape({
      projectName: Yup.string().required("Project Name is required"),
      description: Yup.string().required("Description is required"),
      categoryId: Yup.string().required(" Category is required"),
    }),
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        await projectService.createProject(values);
        toast.success("Create Success");
        await router.push("/dashboard/projects");
        router.refresh();
      } catch (error) {
        console.log("error: ", error);
        toast.error(
          error?.response.data.content || "Failed to create project:"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await projectService.getCategories();

        setCategories(response);
      } catch (error) {}
    };

    fetchCategories();
  }, []);

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
          <h1 className="text-xl md:text-2xl lg:text-3xl text-black font-semibold">
            Create New Project
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text__lable mb-1">Project Name</label>
              <Input
                name="projectName"
                value={formik.values.projectName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.projectName && formik.errors.projectName && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.projectName}
                </p>
              )}
            </div>

            <div>
              <label className="block text__lable mb-1">Description</label>
              <Textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                onValueChange={(value) => {
                  formik.setFieldValue("categoryId", value);
                }}
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
              {formik.touched.categoryId && formik.errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.categoryId}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                className="btn hover:text-red-600"
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/projects")}
              >
                Cancel
              </Button>
              <Button
                className="btn"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProject;
