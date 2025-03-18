import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import BoardContent from "@/components/board/boardContent";
import { boardService } from "@/lib/services/broadService";
import { projectService } from "@/lib/services/projectService";
import { userService } from "@/lib/services/userService";

const Board = async (props) => {
  const { id } = await props.params;

  try {
    const response = await projectService.getProjectById(id);
    const projectDetail = response.content;
    const allUsers = await userService.getUser();

    return (
      <div className="px-8 mx-auto">
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
                href={`/dashboard/projects/${id}/board`}
              >
                {projectDetail.projectName}
              </Link>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mt-5">
          <BoardContent
            project={structuredClone(projectDetail)}
            users={allUsers.content}
          />
        </div>
      </div>
    );
  } catch (error) {
    return <div>Server error</div>;
  }
};

export default Board;
