import { Loading } from "@/components/loading";
import { ProjectList } from "@/components/projects/project-list";
import { Button } from "@/components/ui/button";
import { projectService } from "@/lib/services/projectService";
import { userService } from "@/lib/services/userService";
import Link from "next/link";
import { Suspense } from "react";

export default async function ProjectsPage() {
  try {
    const allProject = await projectService.getAllProjects();
    const allUsers = await userService.getUser();

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Projects</h1>
          <Button className="bg-[#FDA700] btn" asChild>
            <Link href={"projects/new"} prefetch={true}>
              Create Project
            </Link>
          </Button>
        </div>
        <Suspense fallback={<Loading />}>
          <ProjectList projects={allProject.content} users={allUsers.content} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.log("error: ", error);
    return <div className="text-center text-gray-500">Serrver Error</div>;
  }
}
