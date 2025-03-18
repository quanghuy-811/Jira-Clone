"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { SelectSeparator } from "./ui/select";
import { useDispatch, useSelector } from "react-redux";
import { checkUserPermission } from "@/lib/utils";
import {
  getUserByProjectId,
  setMemberInProject,
} from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { userService } from "@/lib/services/userService";
import { X } from "lucide-react";

export function AddMemberDialog({ children, projectDetail, users }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { listMember, loadingListMember } = useSelector(
    (state) => state.user.membersInProject
  );

  // add member
  const handleAddMember = async (itemUser) => {
    if (!checkUserPermission(user.id, projectDetail.creator.id)) {
      toast.warning("User is unauthorized !!!");
      return;
    }
    try {
      await userService.assignUserToProject(projectDetail.id, itemUser.userId);
      dispatch(setMemberInProject(itemUser));
      toast.success("Add Success");
      router.refresh();
    } catch (error) {
      toast.warning(error.response?.data?.content || "Add member failed");
    }
  };
  // remove member
  const handleRemoveMember = async (itemUser) => {
    if (!checkUserPermission(user.id, projectDetail.creator.id)) {
      toast.warning("User is unauthorized !!!");
      return;
    }
    try {
      await userService.removeUserFromProject(
        projectDetail.id,
        itemUser.userId
      );
      dispatch(setMemberInProject(itemUser));
      toast.success("Remove Success");
      router.refresh();
    } catch (error) {
      toast.warning(error.response?.data?.content || "Remove member failed");
    }
  };
  useEffect(() => {
    // console.log("Dialog open state:", isOpen);

    if (!isOpen) return;
    setSearchUser("");
    dispatch(getUserByProjectId({ projectId: projectDetail.id }));
  }, [isOpen]);

  const filteredUsers = useMemo(() => {
    if (!searchUser.trim()) return users;

    return users.filter((item) => {
      return item.name.toLowerCase().includes(searchUser.toLowerCase());
    });
  }, [users, searchUser]);

  return (
    <div>
      {children(() => setIsOpen(true))}
      {/* Dialog add member */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
          <DialogContent
            aria-describedby={null}
            className=" h-[450px] sm:h-auto overflow-y-auto sm:overflow-auto"
          >
            <div className="flex justify-between items-center">
              <DialogTitle>Add Member to Project</DialogTitle>

              <Button
                className="btn"
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
              >
                <X />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                className="h-7 md:h-9 w-full"
                placeholder="Enter search user name"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                required
              />

              {loadingListMember ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-2">
                  <div>
                    <h4 className="mb-4 text-sm md:text-base  font-semibold leading-none">
                      Not yet added
                    </h4>
                    <ScrollArea className="h-56 md:h-72 rounded-md border flex-shrink">
                      <div className="p-2 md:p-4">
                        {filteredUsers?.length > 0 ? (
                          filteredUsers.map((item) => (
                            <div key={item.userId}>
                              <div className="text-xs md:text-sm">
                                <div className="flex items-center justify-between flex-wrap">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      className="icon"
                                      src={
                                        item.avatar
                                          ? item.avatar
                                          : "/static/user-icon.png"
                                      }
                                      alt="img"
                                    />
                                    <div className="flex-1">
                                      <p className="text-xs md:text-sm break-words">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        ID: {item.userId}
                                      </p>
                                    </div>
                                  </div>

                                  <Button
                                    color="primary"
                                    className="btn"
                                    onClick={() => {
                                      handleAddMember(item);
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                              <SelectSeparator className="my-2" />
                            </div>
                          ))
                        ) : (
                          <>
                            <p>No data</p>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                  <div>
                    <h4 className="mb-4 text-sm md:text-base font-semibold leading-none">
                      Already in project
                    </h4>
                    <ScrollArea className="h-56 md:h-72 rounded-md border">
                      <div className="p-2 md:p-4">
                        {listMember?.length > 0 ? (
                          listMember.map((item) => (
                            <div key={item.userId}>
                              <div className="text-sm">
                                <div className="flex items-center justify-between flex-wrap">
                                  <div className="flex space-x-2 ">
                                    <img
                                      className="icon"
                                      src={
                                        item.avatar
                                          ? item.avatar
                                          : "/static/user-icon.png"
                                      }
                                      alt="img"
                                    />

                                    <div>
                                      <p className="text-xs md:text-sm break-words">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        ID: {item.userId}
                                      </p>
                                    </div>
                                  </div>

                                  <Button
                                    className="btn"
                                    onClick={() => {
                                      handleRemoveMember(item);
                                    }}
                                    variant="destructive"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                              <SelectSeparator className="my-2" />
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No member</p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
