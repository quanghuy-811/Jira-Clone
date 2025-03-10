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
  addMember,
  getAllUsers,
  getUserByProjectId,
  removedMember,
} from "@/store/slices/projectDetailSlice";

export function AddMemberDialog({ project, isOpen, onClose }) {
  const [searchUser, setSearchUser] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { allUser } = useSelector((state) => state.detailProject.listUser);
  const { listMember, loadingListMember } = useSelector(
    (state) => state.detailProject.membersInProject
  );

  // add member
  const handleAddMember = (item) => {
    if (!checkUserPermission(user.id, project.creator.id)) {
      toast.warning("User is unauthorized !!!");
      return;
    }
    dispatch(addMember({ projectId: project.id, item }))
      .unwrap()
      .then(() => {
        toast.success("Add Member Success");
      })
      .catch((error) => {
        toast.warning(error || "Failed");
      });
  };
  // remove member
  const handleRemoveMember = async (item) => {
    if (!checkUserPermission(user.id, project.creator.id)) {
      toast.warning("User is unauthorized !!!");
      return;
    }
    dispatch(removedMember({ projectId: project.id, item }))
      .unwrap()
      .then(() => {
        toast.success("Remove Success");
      })
      .catch((error) => {
        toast.warning(error || "Failed");
      });
  };
  useEffect(() => {
    if (!isOpen) return;
    setSearchUser("");
    dispatch(getAllUsers());
    dispatch(getUserByProjectId(project.id));
  }, [isOpen]);

  const filteredUsers = useMemo(() => {
    if (!searchUser.trim()) return allUser;

    return allUser.filter((item) => {
      return item.name.toLowerCase().includes(searchUser.toLowerCase());
    });
  }, [allUser, searchUser]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={null} className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Member to Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter search user name"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            required
          />
          {loadingListMember ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="flex space-x-3">
              <div className="w-1/2 ">
                <h4 className="mb-4 text-base font-semibold leading-none">
                  Not yet added
                </h4>
                <ScrollArea className="h-72 rounded-md border">
                  <div className="p-4">
                    {filteredUsers?.length > 0 ? (
                      filteredUsers.map((item) => (
                        <div key={item.userId}>
                          <div className="text-sm">
                            <div className="flex">
                              <div className="w-2/12">
                                <img
                                  className="w-10 h-10 rounded-full"
                                  src={
                                    item.avatar
                                      ? item.avatar
                                      : "/static/user-icon.png"
                                  }
                                  alt="img"
                                />
                              </div>
                              <div className="flex-1">
                                <p>{item.name}</p>
                                <p className="text-xs text-gray-400">
                                  ID: {item.userId}
                                </p>
                              </div>
                              <div className="w-2/12">
                                <Button
                                  onClick={() => {
                                    handleAddMember(item);
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
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
              <div className="w-1/2 ">
                <h4 className="mb-4 text-base font-semibold leading-none">
                  Already in project
                </h4>
                <ScrollArea className="h-72 rounded-md border">
                  <div className="p-4">
                    {listMember?.length > 0 ? (
                      listMember.map((item) => (
                        <div key={item.userId}>
                          <div className="text-sm">
                            <div className="flex">
                              <div className="w-2/12">
                                <img
                                  className="w-10 h-10 rounded-full"
                                  src={
                                    item.avatar
                                      ? item.avatar
                                      : "/static/user-icon.png"
                                  }
                                  alt="img"
                                />
                              </div>
                              <div className="flex-1">
                                <p>{item.name}</p>
                                <p className="text-xs text-gray-400">
                                  ID: {item.userId}
                                </p>
                              </div>
                              <div className="w-3/12">
                                <Button
                                  onClick={() => {
                                    handleRemoveMember(item);
                                  }}
                                  variant="destructive"
                                >
                                  Remove
                                </Button>
                              </div>
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
  );
}
