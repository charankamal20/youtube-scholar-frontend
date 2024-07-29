import ProtectedRoute from "@/components/ProtectedRoute";
import CourseNavbar from "@/components/shared/CourseNavbar";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const fontHeading = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Youtube Scholar Course",
  description: "Generated by create next app",
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute callback="course">
      <CourseNavbar />
      <main className="h-screen pt-14">{children}</main>
    </ProtectedRoute>
  );
}
