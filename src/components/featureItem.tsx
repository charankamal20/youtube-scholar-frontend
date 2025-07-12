"use client";

import { motion } from "framer-motion";

type Props = {
  icon: string;
  title: string;
  description: string;
  delay?: number;
};

const FeatureItem = ({ icon, title, description, delay = 0 }: Props) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <h3 className="font-semibold text-lg text-neutral-800">
        {icon} {title}
      </h3>
      <p className="text-sm leading-relaxed text-[#4b4b4b]">{description}</p>
    </motion.div>
  );
};

export default FeatureItem;
