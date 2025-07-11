import { Rocket } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="cursor-pointer">
      <section className="flex justify-center items-center gap-3 md:justify-start">
        <div
          className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
          aria-hidden="true"
        >
          <Rocket
            className="size-6 text-white transform -rotate-45"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-xl font-bold ">Astra AI</h1>
      </section>
    </Link>
  );
};

export default Logo;
