import { boardService } from "./broadService";

export async function axiosTaskMetaData() {
  try {
    const [allStatus, allPriority, allTaskType] = await Promise.all([
      boardService.getAllStatus(),
      boardService.getAllPriority(),
      boardService.getAllTaskType(),
    ]);

    return {
      allStatus: allStatus.content,
      allPriority: allPriority.content,
      allTaskType: allTaskType.content,
    };
  } catch (error) {
    console.log("error: ", error);
    return { allStatus: [], allPriority: [], allTaskType: [] };
  }
}
