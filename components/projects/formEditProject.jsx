"use client";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useFormik } from "formik";
import * as yup from "yup";
import { projectService } from "@/lib/services/projectService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EditForm = ({ categories, detail }) => {
  const router = useRouter();
  // Formik
  const formik = useFormik({
    initialValues: {
      id: detail.id || "",
      projectName: detail.projectName || "",
      categoryId: detail.projectCategory?.id.toString() || "",
      description: detail.description || "",
    },
    validationSchema: yup.object().shape({
      projectName: yup.string().required("Name is not required"),
    }),
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        const reponse = await projectService.updateProject(values.id, values);

        router.push("/dashboard/projects");
        toast.success("Success");
      } catch (error) {
        toast.error("Update failed");
      }
    },
  });

  return (
    <div>
      <Card className="space-x-2 md:space-y-4">
        <CardHeader className="text-xl md:text-2xl lg:text-3xl text-black font-semibold">
          Update Project
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6 ">
            <div className="">
              <label className="block text__lable mb-2" htmlFor="id">
                ID
              </label>
              <Input
                className="border-gray-200 shadow"
                disabled
                type="text"
                name="id"
                value={formik.values.id}
                onChange={formik.handleChange}
              />
            </div>

            <div>
              <label className="block text__lable mb-2" htmlFor="projectName">
                Name
              </label>
              <Input
                className={`border-gray-200 shadow `}
                type="text"
                name="projectName"
                value={formik.values.projectName}
                onChange={formik.handleChange}
              />
              {formik.errors.projectName && (
                <p className="text-red-400 text-sm mt-2">
                  {formik.errors.projectName}
                </p>
              )}
            </div>
            <div>
              <label className="block text__lable mb-2" htmlFor="category">
                Category
              </label>
              <Select
                value={formik.values.categoryId}
                onValueChange={(value) =>
                  formik.setFieldValue("categoryId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.length > 0
                    ? categories.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.projectCategoryName}
                        </SelectItem>
                      ))
                    : ""}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="description"
              >
                Description
              </label>

              <Textarea
                value={formik.values.description}
                onChange={formik.handleChange}
                className="border-gray-200 shadow"
                id="description"
                name="description"
              />
            </div>

            <CardFooter className="flex justify-end pr-0 space-x-2">
              <Button className="btn" variant="destructive">
                Cancel
              </Button>
              <Button className="btn" type="submit">
                Update
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditForm;
