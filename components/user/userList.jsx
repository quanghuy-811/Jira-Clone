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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, Search, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PaginationData from "../projects/paginationData";
import FormEditUser from "./formEditUser";
import { userService } from "@/lib/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const UserList = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15; // Số project trên mỗi trang
  const router = useRouter();

  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      router.refresh();
      toast.success("Delete success");
    } catch (error) {
      console.log(error);
      toast.warning(error.response?.data?.content || "Delete user Failed");
    }
  };

  const filterUser = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const paginateUsers = filterUser.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>UserId</TableHead>
              <TableHead className="hidden lg:table-cell">Mail</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginateUsers.map((user, index) => (
              <TableRow
                className="hover:bg-gray-200 transition-all duration-300"
                key={user.userId}
              >
                <TableCell>
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.userId}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {user.email}
                </TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    {/* Form edit user */}
                    <FormEditUser user={user} />
                    <Button
                      onClick={() => handleDeleteUser(user.userId)}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash size={16} color="#ec5158" strokeWidth={2} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="space-y-3">
          {paginateUsers.map((user) => (
            <Card key={user.userId}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <h2 className="text-sm">User ID: {user.userId}</h2>
                  <div>
                    {/* Form edit user */}
                    <FormEditUser user={user} />
                    <Button
                      onClick={() => handleDeleteUser(user.userId)}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash size={16} color="#ec5158" strokeWidth={2} />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 text-sm">
                  <h3 className="w-1/5"> Name </h3>
                  <p className="flex-1 font-semibold">: {user.name}</p>
                </div>
                <div className="flex items-center space-x-3 text-sm mt-3">
                  <h3 className="w-1/5"> Email </h3>
                  <p className="flex-1 font-semibold">: {user.email}</p>
                </div>
                <div className="flex items-center space-x-3 text-sm mt-3">
                  <h3 className="w-1/5">Phone</h3>
                  <p className="flex-1 font-semibold ">
                    : <span className="text-green-500">{user.phoneNumber}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <PaginationData
        totalItems={filterUser.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UserList;
