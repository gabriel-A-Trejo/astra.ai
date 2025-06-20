"use client";

import { motion, type Variants } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Logo from "../header/Logo";
import SideBarWorkSpaceHistory from "@/components/sidebar/SideBarWorkSpaceHistory";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import SidebarFooter from "./SidebarFooter";
import NewWorkSpaceBTN from "./NewWorkSpaceBTN";
import SidbarLinks from "./SidbarLinks";
import { useSidebarStore } from "@/store/sidebar";

const sidebarVariants: Variants = {
  closed: {
    x: -300,
    opacity: 0,
    transition: { type: "tween", duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  open: {
    x: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};

const contentVariants: Variants = {
  closed: { opacity: 0, y: 20, transition: { duration: 0.15 } },
  open: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.1 } },
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isOpen = useSidebarStore((s) => s.isOpen);
  const openSidebar = useSidebarStore((s) => s.openSidebar);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);

  const [isHovering, setIsHovering] = useState(false);

  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const userKindeId = user?.id;

  useEffect(() => {
    const handleRouteChange = () => closeSidebar();

    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      handleRouteChange();
      return originalPush.apply(router, args);
    };
    router.replace = (...args) => {
      handleRouteChange();
      return originalReplace.apply(router, args);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [router, closeSidebar]);

  // 🧠 Hover-based open/close
  const throttledMouseMove = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return (event: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const enterThreshold = 50;
        const exitThreshold = 0;

        if (event.clientX <= enterThreshold && !isOpen) {
          openSidebar();
          setIsHovering(true);
        }

        if (sidebarRef.current && isOpen) {
          const sidebarRect = sidebarRef.current.getBoundingClientRect();
          const isOutside = event.clientX > sidebarRect.right + exitThreshold;

          if (isOutside && !isHovering) {
            closeSidebar();
          }
        }
      }, 16);
    };
  }, [isOpen, isHovering, openSidebar, closeSidebar]);

  const handleSidebarEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleSidebarLeave = useCallback(() => {
    setIsHovering(false);
    setTimeout(() => {
      if (!isHovering) closeSidebar();
    }, 300);
  }, [isHovering, closeSidebar]);

  useEffect(() => {
    const moveHandler = throttledMouseMove();
    window.addEventListener("mousemove", moveHandler, { passive: true });
    return () => window.removeEventListener("mousemove", moveHandler);
  }, [throttledMouseMove]);

  if (!userKindeId) return null;

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <motion.aside
        ref={sidebarRef}
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
        className={`fixed top-0 left-0 h-screen w-80 z-50 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-700/50 shadow-2xl shadow-black/20 backdrop-blur-sm ${className}`}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      >
        <motion.div
          variants={contentVariants}
          animate={isOpen ? "open" : "closed"}
          className="flex flex-col h-full p-6"
        >
          <header className="mb-6 pb-4 border-b border-gray-700/30">
            <Logo />
          </header>

          <NewWorkSpaceBTN />
          <SideBarWorkSpaceHistory
            userKindeId={userKindeId}
            onWorkspaceDeleted={closeSidebar} // ✅ triggers on delete
          />
          <SidbarLinks />
          <SidebarFooter user={user} />
        </motion.div>
      </motion.aside>

      <div
        className="fixed top-0 left-0 w-2 h-screen z-30 cursor-pointer"
        onMouseEnter={openSidebar}
      />
    </>
  );
};

export default Sidebar;
