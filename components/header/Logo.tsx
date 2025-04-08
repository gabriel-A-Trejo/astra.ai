import { Rocket } from "lucide-react";

/**
 * @component Logo
 * @description A header component that displays the Astra AI logo with a rocket icon.
 * The component features a gradient-colored rocket icon in a square container
 * alongside the "Astra AI" text. The logo uses a blue-to-indigo gradient for the icon
 * and a white-to-gray gradient for the text, creating a modern, tech-focused appearance.
 *
 * @author Gabriel Trejo
 * @version 1.0.0
 * @since 2025
 *
 * @styling
 * - Responsive layout that centers on mobile and aligns left on desktop (md breakpoint)
 * - Interactive shadow effect on the rocket icon container
 * - Gradient backgrounds for both icon container and text
 * - Rocket icon is rotated -45 degrees for visual appeal
 *
 * @accessibility
 * - Uses semantic HTML with header and h1 tags
 * - Decorative elements marked with aria-hidden
 *
 * @returns {JSX.Element} A header component containing the Astra AI logo with a
 * gradient-styled rocket icon and text branding
 */
const Logo = () => {
  return (
    <header className="flex justify-center gap-3 md:justify-start">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
        aria-hidden="true"
      >
        <Rocket
          className="size-6 text-white transform -rotate-45"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Astra AI
        </h1>
      </div>
    </header>
  );
};

export default Logo;
