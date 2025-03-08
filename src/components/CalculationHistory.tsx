import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { useCarbonStore } from "@/store/carbonStore";

export const CalculationHistory = () => {
  const history = useCarbonStore((state) => state.history);
  const activeCalculation = useCarbonStore((state) => state.activeCalculation);
  const setActiveCalculation = useCarbonStore(
    (state) => state.setActiveCalculation
  );

  if (history.length === 0) return null;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700 mb-4">
        <FiClock className="text-purple-500" />
        Calculation History
      </h3>
      <div className="space-y-3">
        {history.map((calc) => {
          const isActive = activeCalculation?.id === calc.id;
          return (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border flex justify-between items-center cursor-pointer transition-all
                ${
                  isActive
                    ? "bg-teal-500 text-white border-teal-600 shadow-md"
                    : "bg-teal-50/50 border-teal-100 hover:bg-teal-100"
                }`}
              onClick={() => setActiveCalculation(calc)}
            >
              <div>
                <p
                  className={`font-medium capitalize ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {calc.transport}
                </p>
                <p
                  className={`text-sm ${
                    isActive ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  {calc.distance} km
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    isActive ? "text-white" : "text-teal-600"
                  }`}
                >
                  {calc.emission.toFixed(2)} kg
                </p>
                <p
                  className={`text-xs ${
                    isActive ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {new Date(calc.date).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
