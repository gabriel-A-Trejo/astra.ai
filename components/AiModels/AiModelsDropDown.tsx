import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot } from "lucide-react";
import { Gemini } from "@lobehub/icons";

import { Button } from "../ui/button";

export const AiModelsDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="AI Models" title="AI models" variant="ghost">
          <Bot className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <section className="flex flex-col justify-center">
            <h1 className="font-bold">AI Models</h1>
            <p className="text-sm text-gray-300">Current Models</p>
          </section>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <section className="flex items-center gap-2">
            <Gemini.Color size={20} />
            <p className="">Gemini 2.0 Flash</p>
          </section>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
