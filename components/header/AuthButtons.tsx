"use client";

import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-200 transition-all duration-300 hover:text-white hover:bg-white/10"
      >
        login
      </Button>
      <Button
        size="sm"
        className="text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/20 hover:scale-105"
      >
        Sign up
      </Button>
    </>
  );
}
