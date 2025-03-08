import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiSun, FiPackage } from "react-icons/fi";
import { useCarbonStore } from "@/store/carbonStore";
import { FaLeaf } from "react-icons/fa";
import { JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  energy: <FiZap className="w-5 h-5 text-yellow-500" />,
  travel: <FiSun className="w-5 h-5 text-blue-500" />,
  general: <FaLeaf className="w-5 h-5 text-green-500" />,
  consumption: <FiPackage className="w-5 h-5 text-purple-500" />,
};

export const Recommendations = () => {
  const activeCalculation = useCarbonStore((state) => state.activeCalculation);

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700 mb-4">
        <FaLeaf className="text-green-500" />
        Eco Recommendations
      </h3>
      <div className="grid gap-3">
        <AnimatePresence>
          {activeCalculation?.recommendations?.map((rec) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-white rounded-lg border border-green-100 shadow-sm flex items-start gap-3"
            >
              <span className="shrink-0 mt-1">
                {iconMap[rec.category] || iconMap.general}
              </span>
              <p className="text-gray-600 text-sm">{rec.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
