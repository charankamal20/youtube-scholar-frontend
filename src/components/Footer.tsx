"use client";

import {
  Github,
  Linkedin,
  Youtube,
  Instagram,
  Twitter,
  Quote,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-24 text-center text-[#9f9f9f] space-y-6 py-12">
      {/* Logo or App Name */}
      <div>
        <p className="text-xl font-bold text-black">YouTube Scholar</p>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center items-center space-x-4 text-[#888]">
        <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
          <Twitter className="w-5 h-5 hover:text-black transition" />
        </Link>
        <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
          <Linkedin className="w-5 h-5 hover:text-black transition" />
        </Link>
        <Link
          href="https://instagram.com"
          target="_blank"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5 hover:text-black transition" />
        </Link>
        <Link href="https://github.com" target="_blank" aria-label="GitHub">
          <Github className="w-5 h-5 hover:text-black transition" />
        </Link>
        <Link href="https://youtube.com" target="_blank" aria-label="YouTube">
          <Youtube className="w-5 h-5 hover:text-black transition" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-[#aaa]">
        <Link href="#">Course</Link>
        <Link href="#">Profile</Link>
      </div>

      {/* ❗ Add this disclaimer block */}
      <div className="text-xs text-[#999] max-w-[500px] mx-auto leading-snug">
        We do not claim ownership of any YouTube content. All rights belong to
        the original creators.
      </div>

      {/* Quote */}
      <div className="flex flex-col items-center text-sm italic text-[#c0c0c0]">
        <Quote className="w-4 h-4 mb-1" />
        <p>
          Do one thing every day that scares you. –{" "}
          <span className="not-italic">Eleanor Roosevelt</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
