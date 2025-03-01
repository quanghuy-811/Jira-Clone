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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { projectService } from "@/lib/services/projectService";
import { AddMemberDialog } from "../add-member-dialog";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { fetchProject } from "@/store/slices/projectSlice";
import { getAllUsers } from "@/store/slices/userSlice";
import { toast } from "sonner";

export function ProjectList() {
  // const [projects, setProjects] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState({});
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const { projectList, loading } = useSelector((state) => state.projects);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);

      dispatch(fetchProject());

      toast.success("Delete success");
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleAddMember = (project) => {
    setProject(project);
    setIsAddMemberOpen(true);
  };

  const isCreator = (project) => {
    return project.creator?.id === currentUser?.id;
  };

  const filteredProjects = projectList.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProjectTableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Project Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Creator</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[250px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-8 rounded-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(fetchProject());
  }, []);

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

      {loading ? (
        <ProjectTableSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow
                className="hover:bg-gray-200 transition-all duration-300"
                key={project.id}
              >
                <TableCell>{project.id}</TableCell>
                <TableCell>
                  <Link
                    className="hover:underline"
                    href={`/dashboard/projects/${project.id}/board`}
                  >
                    {project.projectName}
                  </Link>
                </TableCell>
                <TableCell>{project.categoryName}</TableCell>
                <TableCell>{project.creator?.name}</TableCell>
                <TableCell>
                  <Button
                    className="hover:shadow-md"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddMember(project)}
                  >
                    Members ({project.members?.length || 0})
                  </Button>
                </TableCell>
                <TableCell>
                  {isCreator(project) ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          •••
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
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="cursor-not-allowed opacity-50"
                            >
                              •••
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          You are not the owner of this project
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AddMemberDialog
        project={project}
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        // onSuccess={fetchProjects}
      />
    </div>
  );
}
