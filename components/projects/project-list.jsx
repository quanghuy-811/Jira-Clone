"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ellipsis, Pen, Search, Trash } from "lucide-react";
import { projectService } from "@/lib/services/projectService";
import { AddMemberDialog } from "../add-member-dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import PaginationData from "./paginationData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tooltip } from "antd";
import { setProject } from "@/store/slices/projectSlice";

export function ProjectList({ projects, users }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Số project trên mỗi trang
  const currentUser = useSelector((state) => state.auth.user);
  const { projectList } = useSelector((state) => state.projects);

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      router.refresh();

      toast.success("Delete success");
    } catch (error) {
      toast.warning(error?.response?.data?.content || "Delete Project Failed");
    }
  };

  const isCreator = (project) => {
    return project.creator?.id === currentUser?.id;
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
    dispatch(setProject(projects));
  }, [projects]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="hidden md:flex">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Creator</TableHead>
              <TableHead className="hidden sm:table-cell">Members</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.map((project) => (
              <TableRow
                className="hover:bg-gray-200 transition-all duration-300"
                key={project.id}
              >
                <TableCell>{project.id}</TableCell>
                <TableCell>
                  <Link
                    className="hover:underline hover:text-blue-600 text-blue-700"
                    href={`/dashboard/projects/${project.id}/board`}
                  >
                    {project.projectName}
                  </Link>
                </TableCell>
                <TableCell className={`hidden md:table-cell  `}>
                  {project.categoryName}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {project.creator?.name || (
                    <p className="text-gray-500">No data</p>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <AddMemberDialog projectDetail={project} users={users}>
                    {(openDialog) => (
                      <Button
                        className="text-white"
                        variant="outline"
                        color="primary"
                        onClick={openDialog} // ✅ Vẫn dùng như cũ
                      >
                        Members ({project.members?.length || 0})
                      </Button>
                    )}
                  </AddMemberDialog>
                </TableCell>
                <TableCell>
                  {isCreator(project) ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Ellipsis size={16} color="#00ff1e" strokeWidth={3} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/projects/${project.id}/edit`
                            )
                          }
                        >
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Tooltip
                      title={"You are not the owner of this project"}
                      trigger="click"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-not-allowed"
                      >
                        <Ellipsis color="#ff0000" strokeWidth={3} />
                      </Button>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="space-y-3">
          {paginatedProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <h2 className="text-sm">ID: {project.id}</h2>
                  <div>
                    {isCreator(project) ? (
                      <>
                        <Button
                          onClick={() =>
                            router.push(
                              `/dashboard/projects/${project.id}/edit`
                            )
                          }
                          variant="ghost"
                          size="icon"
                        >
                          <Pen color="#519cec" strokeWidth={2} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteProject(project.id)}
                          variant="ghost"
                          size="icon"
                        >
                          <Trash color="#ec5158" strokeWidth={2} />
                        </Button>
                      </>
                    ) : (
                      <Tooltip title="You are not the owner of this project">
                        <Button variant="ghost" size="icon">
                          <Pen color={"#519cec"} strokeWidth={2} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash color="#ec5158" strokeWidth={2} />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 text-sm">
                  <h3 className="w-1/5">Project Name </h3>
                  <p className="flex-1 font-medium ">
                    :{" "}
                    <Link
                      className=" hover:text-blue-600 underline text-blue-700"
                      href={`/dashboard/projects/${project.id}/board`}
                    >
                      {project.projectName}
                    </Link>
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-sm mt-3">
                  <h3 className="w-1/5"> Creator </h3>
                  <p className="flex-1 font-semibold">
                    : {project.creator?.name}
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-sm mt-3">
                  <h3 className="w-1/5">Category</h3>
                  <p className="flex-1 font-semibold ">
                    :{" "}
                    <span className="text-green-500">
                      {project.categoryName}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-sm mt-3">
                  <h3 className="w-1/5"> Members </h3>

                  <AddMemberDialog projectDetail={project} users={users}>
                    {(openDialog) => (
                      <Button
                        className="hover:shadow-md"
                        size="sm"
                        onClick={openDialog} // ✅ Vẫn dùng như cũ
                      >
                        Members ({project.members?.length || 0})
                      </Button>
                    )}
                  </AddMemberDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <PaginationData
        totalItems={filteredProjects.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
