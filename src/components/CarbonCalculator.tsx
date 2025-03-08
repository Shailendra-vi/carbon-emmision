import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalculatorForm } from "@/components/CalculatorForm";
import { Recommendations } from "@/components/Recommendations";
import { CalculationHistory } from "@/components/CalculationHistory";
import { FiCloud } from "react-icons/fi";

export const CarbonCalculator = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-6">
      <AnimatePresence>
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="p-6 bg-white rounded-full shadow-2xl"
            >
              <FiCloud className="w-24 h-24 text-teal-500/80" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Carbon Footprint Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Measure your environmental impact and discover ways to reduce it
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <CalculatorForm />
            </div>

            <div className="space-y-8">
              <Recommendations />
              <CalculationHistory />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
