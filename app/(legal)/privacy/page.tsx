"use client";

import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { PrivacyContent } from "@/constants/Privacy";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Privacy() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section
        className="h-[90vh] overflow-auto p-16 no-scrollbar"
        ref={containerRef}
        aria-label="Privacy Content"
      >
        <div
          className="pointer-events-none absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-gray-900 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] no-scrollbar"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-0 w-full"
          aria-hidden="true"
        >
          <div className="absolute left-0 top-0 h-0.5 w-full bg-gray-800" />
          <ScrollProgress
            className="absolute top-1 h-1 bg-blue-800"
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          />
        </div>

        <section className="w-full max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hover:text-blue-400 transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="size-8 text-gray-400 hover:text-blue-400 transition-colors" />
              </Link>
              <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Privacy Policy
              </h1>
            </div>
          </header>

          {PrivacyContent.map(
            ({ title, content }: { title: string; content: string }) => (
              <section key={title} className="mb-14 px-12">
                <h2 className="mb-8 text-3xl sm:text-4xl font-semibold text-blue-500">
                  {title}
                </h2>
                <p className="text-gray-300 leading-relaxed text-xl">
                  {content}
                </p>
              </section>
            )
          )}
        </section>
      </section>
    </>
  );
}
