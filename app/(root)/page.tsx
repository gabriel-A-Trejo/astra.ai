import Hero from "@/components/hero/Hero";

import React from "react";

const HomeSection = () => {
  return (
    <section className="flex flex-col justify-center items-center min-h-screen">
      <section className="w-full">
        <Hero />
      </section>
    </section>
  );
};

export default HomeSection;
