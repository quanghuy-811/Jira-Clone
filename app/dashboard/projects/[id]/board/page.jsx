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

  const getBoardData = async () => {
    try {
      const [allStatus, allPriority, allTaskType] = await Promise.all([
        boardService.getAllStatus(),
        boardService.getAllPriority(),
        boardService.getAllTaskType(),
      ]);
      if (!allStatus.content) throw new Error("Không có dữ liệu status");
      if (!allPriority.content) throw new Error("Không có dữ liệu Priority");
      if (!allTaskType.content) throw new Error("Không có dữ liệu TaskType");

      return {
        allStatus: allStatus.content,
        allPriority: allPriority.content,
        allTaskType: allTaskType.content,
      };
    } catch (error) {
      return null;
    }
  };

  const boardData = await getBoardData();
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
              {/* {boardData.resProjectById.projectName} */}
            </Link>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-5">
        <BoardContent boardData={boardData} projectId={id} />
      </div>
    </div>
  );
};

export default Board;
