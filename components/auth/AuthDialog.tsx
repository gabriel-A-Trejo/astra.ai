/**
 * @fileoverview Authentication Dialog Component for Astra AI
 * @author Gabriel Trejo
 * @description Provides a modal dialog for user authentication with Google OAuth
 */

// Import UI components from shadcn/ui library
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Import Kinde Auth components for authentication
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

import React from "react";
// Import Button component for interactive elements
import { Button } from "../ui/button";
import Logo from "../header/Logo";

/**
 * AuthDialog Component - Displays a modal dialog for user authentication
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.openDialog - Controls whether the dialog is open
 * @param {Function} props.closeDialog - Function to close the dialog
 * @returns {JSX.Element} Rendered AuthDialog component
 */
const AuthDialog = ({
  openDialog,
  closeDialog,
}: {
  openDialog: boolean;
  closeDialog: () => void;
}) => {
  return (
    // Dialog component with controlled open state
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md ">
        <DialogHeader className="space-y-4">
          <DialogTitle className="mx-auto ">
            <Logo />
          </DialogTitle>

          <DialogDescription className="mx-auto text-center max-w-md text-white text-md">
            Sign in to unlock the full potential of AI-powered development and
            start building your next project.
          </DialogDescription>
          {/* Authentication options section */}
          <section className="flex justify-center items-center space-y-6">
            {/* Google Sign-in button */}
            <Button
              className="flex  justify-center items-center py-6 w-full text-black bg-white shadow-md transition-colors cursor-pointer hover:bg-gray-300"
              asChild
            >
              {/* RegisterLink component from Kinde Auth for Google OAuth */}
              <RegisterLink
                authUrlParams={{
                  // Use environment variable for Google connection ID
                  connection_id:
                    process.env.NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE || "",
                }}
              >
                <svg className="size-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>

                <span className="ml-4">Sign in with Google</span>
              </RegisterLink>
            </Button>
          </section>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
