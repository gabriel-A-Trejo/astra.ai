import React from "react";
import { Button } from "../ui/button";
import { Ghost, LogOut, CreditCard, Settings, User } from "lucide-react";

const SidebarLinks = () => {
  return (
    <div className="flex flex-col gap-3 w-full py-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
          Subscription
        </h3>
        <Button
          variant="ghost"
          className="flex justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2"
          aria-label="Manage billing"
        >
          <CreditCard className="size-4" />
          <span>Manage Plan</span>
        </Button>
      </div>

      <div className="pt-2 border-t border-gray-700/30">
        <Button
          variant="ghost"
          className="flex justify-start gap-3 w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2"
          aria-label="Log out"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarLinks;
