"use server";
import EditForm from "@/components/projects/formEditProject";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { projectService } from "@/lib/services/projectService";
import Link from "next/link";

const Edit = async (props) => {
  const { id } = await props.params;

  const categories = await projectService.getCategories();
  const resGetById = await projectService.getProjectById(id);
  const detail = resGetById.content;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link className="text-gray-800" href="/dashboard/projects">
                Projects
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-800" />
            <Link
              className="text-gray-800"
              href={`/dashboard/projects/edit/${id}`}
            >
              Detail
            </Link>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Form Detail */}
      <div className="mt-5">
        <EditForm categories={categories} detail={detail} />
      </div>
    </div>
  );
};

export default Edit;
