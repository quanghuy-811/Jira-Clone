"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        // Filter projects where user is either creator or member
        const filteredProjects = response.content.filter(
          (project) =>
            project.creator?.id === user?.id ||
            project.members?.some((member) => member.userId === user?.id)
        );
        setUserProjects(filteredProjects);
      } catch (error) {
        console.error("Failed to fetch user projects:", error);
      }
    };

    fetchUserProjects();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Profile Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                User ID
              </label>
              <p className="text-lg">{user?.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <p className="text-lg">{user?.phoneNumber || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Projects Card */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">My Projects</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.categoryName}</TableCell>
                  <TableCell>
                    {project.creator?.id === user?.id ? "Creator" : "Member"}
                  </TableCell>
                  <TableCell>{project.members?.length || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {userProjects.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              You haven't joined any projects yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
