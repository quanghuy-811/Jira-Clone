import { ProjectList } from "@/components/projects/project-list";
import { Button } from "@/components/ui/button";
import { projectService } from "@/lib/services/projectService";
import { userService } from "@/lib/services/userService";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  try {
    console.log("Fetching projects..."); // Kiểm tra xem có chạy đến đây không
    const allProject = await projectService.getAllProjects();
    const allUsers = await userService.getUser();

    console.log("allUsers: ", allUsers);
    console.log("allProject: ", allProject);

    if (!allProject?.content || !allUsers?.content) {
      throw new Error("Dữ liệu không hợp lệ");
    }

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
        <ProjectList projects={allProject.content} users={allUsers.content} />
      </div>
    );
  } catch (error) {
    console.log("error: ", error);
    return <div className="text-center text-gray-500">Serrver Error</div>;
  }
}
