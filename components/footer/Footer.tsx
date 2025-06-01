import { useMemo } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { FooterLinks } from "@/constants/FooterLinks";

const Footer = () => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="flex justify-between items-center border-gray-600/80 p-4">
      <div className="f">
        <h1 className="text-md font-bold">© {year} Astra AI</h1>
      </div>
      <div className="">
        {FooterLinks.map(({ href, title }) => (
          <Button key={title} size="lg" asChild variant="link">
            <Link key={title} href={href}>
              <p>{title}</p>
            </Link>
          </Button>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
