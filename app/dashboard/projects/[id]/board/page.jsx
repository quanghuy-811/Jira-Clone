import { projectService } from "@/lib/services/projectService";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import BoardContent from "@/components/projects/boardContent";
import { boardService } from "@/lib/services/broadService";

const Board = async (props) => {
  const { id } = await props.params;

  try {
    const [resProjectById, allStatus, allPriority, allTaskType] =
      await Promise.all([
        projectService.getProjectById(id),
        boardService.getAllStatus(),
        boardService.getAllPriority(),
        boardService.getAllTaskType(),
      ]);
    if (!resProjectById.content) throw new Error("Không tim thấy dự án");
    if (!allStatus.content) throw new Error("Không có dữ liệu status");
    if (!allPriority.content) throw new Error("Không có dữ liệu Priority");
    if (!allTaskType.content) throw new Error("Không có dữ liệu TaskType");

    const boarData = {
      resProjectById: resProjectById.content,
      allStatus: allStatus.content,
      allPriority: allPriority.content,
      allTaskType: allTaskType.content,
    };

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
                href={`/dashboard/projects/${id}/broad`}
              >
                {boarData.resProjectById.projectName}
              </Link>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mt-5">
          <h1 className="text-3xl text-black font-medium">Board</h1>
          <div className="mt-4">
            <BoardContent boarData={boarData} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <div className="text-center">Server Error</div>;
  }
};

export default Board;
