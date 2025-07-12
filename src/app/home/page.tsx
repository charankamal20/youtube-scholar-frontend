"use client";

import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

const AboutSection = () => {
  return (
    <section className="mt-24 space-y-4 text-[#4b4b4b] text-center">
      <h2 className="text-2xl font-medium">What is YouTube Scholar?</h2>
      <p className="text-base leading-relaxed">
        YouTube Scholar was born out of a simple idea — turn YouTube playlists
        into real, structured learning journeys. It’s built by students who
        understand the chaos of unorganized learning, and aims to fix it.
      </p>
    </section>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="mt-24 space-y-6 text-left text-[#4b4b4b]">
      <h2 className="text-2xl font-medium text-center">How It Works</h2>
      <ul className="list-disc list-inside space-y-3">
        <li>
          <strong>Paste a Playlist:</strong> Just drop in any YouTube playlist
          URL.
        </li>
        <li>
          <strong>Track Your Progress:</strong> As you watch, we auto-track what
          you’ve completed.
        </li>
        <li>
          <strong>Take Notes:</strong> Jot down timestamped notes tied to each
          video.
        </li>
        <li>
          <strong>Earn Points:</strong> Complete videos and rise up the
          leaderboard.
        </li>
      </ul>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="mt-24 text-center space-y-4">
      <h2 className="text-2xl font-medium">Ready to start learning?</h2>
      <p className="text-base text-[#4b4b4b]">
        Turn your first playlist into a course today.
      </p>
      <Link
        href="/dashboard"
        className="inline-block scale-100 active:scale-95 transition-all bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-neutral-800"
      >
        Start Learning
      </Link>
    </section>
  );
};

const AcknowledgementSection = () => {
  return (
    <section className="font-serif text-center text-[#666] italic text-base leading-relaxed max-w-[600px] mx-auto mt-24">
      <p>
        This project is a humble tribute to all the creators on YouTube who
        share free knowledge with the world. Your passion makes learning
        accessible to everyone, everywhere. ❤️
      </p>
    </section>
  );
};

const page = () => {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen mt-20 my-12 w-[600px] mx-auto">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-center uppercase text-sm text-[#7C7C7C] font-bold tracking-[0.99px] leading-[115%]">
          Sabka College
        </h3>
        <h1 className="text-4xl font-medium tracking-wide leading-[130%]">
          Welcome to Youtube Scholar!
        </h1>
        <h2 className="text-xl font-medium text-center text-[#383838] tracking-wide leading-[150%]">
          Created by learners, for learners.
        </h2>
        <div>
          <hr className="w-3/5 mx-auto bg-gray-600 text-gray-200 my-12" />
        </div>
      </motion.div>
      <FeatureSection />
      <AboutSection />
      <AcknowledgementSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default page;
