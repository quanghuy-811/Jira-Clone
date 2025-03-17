"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { projectService } from "@/lib/services/projectService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchProject } from "@/store/slices/projectSlice";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { projectUser } = useSelector((state) => state.projects);

  useEffect(() => {
    // fetchUserProjects();
    dispatch(fetchProject());
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <h2 className="text-xl md:text-2xl lg:text-3xl text-black font-semibold">
            Profile Information
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text__lable text-gray-500">User ID</label>
              <p className="text-base xl:text-lg">{user?.id}</p>
            </div>
            <div>
              <label className="text__lable text-gray-500">Email</label>
              <p className="text-base xl:text-lg break-words">{user?.email}</p>
            </div>
            <div>
              <label className="text__lable text-gray-500">Name</label>
              <p className="text-base xl:text-lg break-words">{user?.name}</p>
            </div>

            <div>
              <label className="text__lable text-gray-500">Phone Number</label>
              <p className="text-base xl:text-lg break-words">
                {user?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Projects Card */}
      <Card>
        <CardHeader>
          <h2 className="text-xl md:text-2xl lg:text-3xl text-black font-semibold">
            My Projects
          </h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden sm:table-cell">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectUser?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.categoryName}</TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {project.members?.length || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {projectUser?.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              You haven't joined any projects yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
