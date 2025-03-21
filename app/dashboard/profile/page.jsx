"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchProject, setProjectUser } from "@/store/slices/projectSlice";
import Link from "next/link";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { projectList, projectUser, loading } = useSelector(
    (state) => state.projects
  );

  useEffect(() => {
    if (projectList.length > 0) {
      dispatch(setProjectUser(user?.id));
    } else {
      dispatch(fetchProject());
    }
  }, [projectList]);

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg md:text-xl lg:text-2xl text-black font-semibold">
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
          <h2 className="text-lg md:text-xl lg:text-2xl text-black font-semibold">
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    <span className="text-gray-500">Loading...</span>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {projectUser?.map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-100">
                      <TableCell>
                        <Link
                          className="hover:underline hover:text-blue-600 text-blue-700"
                          href={`/dashboard/projects/${project.id}/board`}
                        >
                          {project.projectName}
                        </Link>
                      </TableCell>
                      <TableCell>{project.categoryName}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {project.members?.length || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {projectUser?.length === 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      <span className="text-gray-500">No Data</span>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
