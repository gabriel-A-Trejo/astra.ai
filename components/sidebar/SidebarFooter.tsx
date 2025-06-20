import React from "react";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type user = {
  id: string;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
} | null;

const SidebarFooter = ({ user }: Readonly<{ user: user }>) => {
  return (
    <footer className="mt-auto pt-4 border-t border-gray-700/30">
      <Button
        variant="ghost"
        className="w-full justify-start p-3 h-auto text-gray-400 hover:text-white hover:bg-gray-800/50"
      >
        <Avatar className="size-8 mr-3">
          <AvatarImage src={user?.picture ?? undefined} alt="User Image" />
          <AvatarFallback className="bg-blue-600 text-white text-sm">
            {user?.given_name?.[0]}
            {user?.family_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-200 truncate w-full">
            {user?.given_name} {user?.family_name}
          </span>
          <span className="text-xs text-gray-500 truncate w-full">
            {user?.email}
          </span>
        </div>
      </Button>
    </footer>
  );
};

export default SidebarFooter;
