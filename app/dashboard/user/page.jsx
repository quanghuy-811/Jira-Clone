import { Loading } from "@/components/loading";
import UserList from "@/components/user/userList";
import { userService } from "@/lib/services/userService";
import React, { Suspense } from "react";

const UserPage = async () => {
  try {
    const allUsers = await userService.getUser();

    return (
      <div>
        <div className="flex justify-between items-center mb-6"></div>
        <Suspense fallback={<Loading />}>
          <UserList users={allUsers.content} />
        </Suspense>
      </div>
    );
  } catch (error) {
    return <div className="text-center text-gray-500">Server error</div>;
  }
};

export default UserPage;
