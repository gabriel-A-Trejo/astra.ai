"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * @component ThemeProvider
 * @description A client-side wrapper component that provides theme functionality
 * throughout the application. It utilizes next-themes library to manage
 * theme switching and persistence. This component must be used on the client side,
 * as indicated by the "use client" directive.
 *
 * @author Gabriel Trejo
 * @version 1.0.0
 * @since 2025
 *
 * @props
 * - children: React nodes to be wrapped with theme context
 * - ...props: Additional properties passed to NextThemesProvider
 *
 * @implementation
 * - Uses next-themes for theme management
 * - Implements React.ComponentProps for type safety
 * - Client-side rendering enabled for theme switching functionality
 *
 * @usage
 * - Wrap your application or component tree with this provider
 * - Enables theme switching capabilities in child components
 * - Handles theme persistence across page reloads
 *
 * @param {Readonly<React.ComponentProps<typeof NextThemesProvider>>} props - Component properties
 * @returns {JSX.Element} A theme provider wrapper component that enables theme
 * functionality for its children
 */
export function ThemeProvider({
  children,
  ...props
}: Readonly<React.ComponentProps<typeof NextThemesProvider>>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
