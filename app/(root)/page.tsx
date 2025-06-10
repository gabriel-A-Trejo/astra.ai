import Footer from "@/components/footer/Footer";
import Hero from "@/components/hero/Hero";

import React from "react";

const HomeSection = () => {
  return (
    <section className="flex flex-col justify-center items-between min-h-screen">
      <div className="flex-1 flex items-center justify-center">
        <section className="w-full ">
          <Hero />
        </section>
      </div>
      <div className="mb-20">
        <Footer />
      </div>
    </section>
  );
};

export default HomeSection;
