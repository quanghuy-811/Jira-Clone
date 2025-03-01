"use client";

import { ProjectList } from "@/components/projects/project-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => router.push("projects/new")}>
          Create Project
        </Button>
      </div>
      <ProjectList />
    </div>
  );
}
