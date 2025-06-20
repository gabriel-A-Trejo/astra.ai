import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const NewWorkSpaceBTN = () => {
  return (
    <div className="mb-6">
      <Button
        asChild
        className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
      >
        <Link href="/" className="flex items-center gap-3 py-3">
          <Plus className="size-5" />
          <span className="font-semibold">New Workspace</span>
        </Link>
      </Button>
    </div>
  );
};

export default NewWorkSpaceBTN;
