"use client";

import { motion } from "framer-motion";
import FeatureItem from "./featureItem";

const FeatureSection = () => {
  return (
    <motion.section
      className="space-y-12 text-[#4b4b4b]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <p className="text-base leading-relaxed">
        YouTube Scholar transforms educational playlists into structured courses
        — track your progress, take notes, and compete on a global leaderboard.
        Whether you're brushing up on old topics or diving into something new,
        we've got your back.
      </p>

      <div className="grid grid-cols-1 gap-8 mt-6 text-left">
        <FeatureItem
          icon="📚"
          title="Structured Learning"
          description="Turn scattered playlists into focused, trackable learning paths — complete videos and unlock progress."
          delay={0.1}
        />
        <FeatureItem
          icon="📝"
          title="Smart Notes"
          description="Take timestamped notes while watching. Your thoughts stay with the video, always."
          delay={0.2}
        />
        <FeatureItem
          icon="🏆"
          title="Gamified Progress"
          description="Earn points as you learn and climb the global leaderboard. Learning has never been more fun."
          delay={0.3}
        />
      </div>
    </motion.section>
  );
};

export default FeatureSection;
