import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiCloud,
  FiMapPin,
  FiDroplet,
  FiActivity,
  FiAirplay,
} from "react-icons/fi";
import { FaBicycle, FaCar, FaBus, FaWalking } from "react-icons/fa";
import { TbPlane } from "react-icons/tb";
import { MdOutlineTrain } from "react-icons/md";
import { GiElectric } from "react-icons/gi";
import { useCarbonStore } from "@/store/carbonStore";
import { calculateEmission } from "@/lib/calculations";

const transportModes = [
  { id: "car", label: "Car", icon: <FaCar className="w-6 h-6" /> },
  { id: "bus", label: "Bus", icon: <FaBus className="w-6 h-6" /> },
  { id: "train", label: "Train", icon: <MdOutlineTrain className="w-6 h-6" /> },
  { id: "bike", label: "Bike", icon: <FaBicycle className="w-6 h-6" /> },
  { id: "walk", label: "Walk", icon: <FaWalking className="w-6 h-6" /> },
  { id: "airplane", label: "Airplane", icon: <TbPlane className="w-6 h-6" /> },
];

const fuelTypes = {
  petrol: {
    label: "Petrol",
    icon: <FiDroplet className="w-5 h-5 text-orange-500" />,
  },
  diesel: {
    label: "Diesel",
    icon: <FiDroplet className="w-5 h-5 text-gray-500" />,
  },
  electric: {
    label: "Electric",
    icon: <GiElectric className="w-5 h-5 text-blue-500" />,
  },
  hybrid: {
    label: "Hybrid",
    icon: <GiElectric className="w-5 h-5 text-green-500" />,
  },
  aviation_fuel: {
    label: "Aviation Fuel",
    icon: <FiAirplay className="w-5 h-5 text-purple-500" />,
  },
};

const fuelOptions = {
  car: ["petrol", "diesel", "electric", "hybrid"],
  bus: ["diesel", "electric"],
  train: ["diesel", "electric"],
  airplane: ["aviation_fuel"],
  bike: [],
  walk: [],
} as const;

type TransportType = keyof typeof fuelOptions;

export const CalculatorForm = () => {
  const [transport, setTransport] = useState<TransportType>("car");
  const [fuelType, setFuelType] = useState("petrol");
  const [fuelAmount, setFuelAmount] = useState("");
  const [unit, setUnit] = useState("liters");
  const [distance, setDistance] = useState("");
  const [destination, setDestination] = useState("");
  const [emission, setEmission] = useState<number | null>(null);

  const requiresFuel = ["car", "bus", "train", "airplane"].includes(transport);

  const handleSubmit = async () => {
    const numericDistance = parseFloat(distance) || 0;
    const numericFuel = parseFloat(fuelAmount) || 0;

    const emissionValue = calculateEmission(
      transport,
      numericDistance,
      fuelType,
      numericFuel,
      unit
    );

    const recommendations = await useCarbonStore
      .getState()
      .fetchRecommendations({
        transport,
        fuelType,
        fuelAmount: numericFuel,
        unit,
        distance: numericDistance,
        emission: emissionValue,
      });

    useCarbonStore.getState().addCalculation({
      transport,
      distance: numericDistance,
      emission: emissionValue,
      recommendations,
    });

    setEmission(emissionValue);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-shadow">
        <header className="border-b border-gray-200 bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500 rounded-xl text-white shadow-lg">
              <FiActivity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Carbon Emission Calculator
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                Calculate Your Footprint
              </h1>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          <section>
            <Label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaCar className="text-gray-500" />
              Transportation Mode
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {transportModes.map((mode) => (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTransport(mode.id as TransportType)}
                  className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-all duration-200 ${
                    transport === mode.id
                      ? "bg-teal-500 text-white shadow-lg"
                      : "bg-gray-50 hover:bg-gray-100 shadow-sm"
                  }`}
                >
                  <span className="text-3xl">{mode.icon}</span>
                  <span className="font-medium">{mode.label}</span>
                </motion.button>
              ))}
            </div>
          </section>

          <AnimatePresence>
            {transport && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {requiresFuel && (
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-gray-700 mb-2">
                        <FiDroplet className="text-blue-500" />
                        Fuel Configuration
                      </Label>
                      <div className="space-y-4">
                        <Select
                          value={
                            fuelOptions[transport].some(
                              (fuel) => fuel === fuelType
                            )
                              ? fuelType
                              : ""
                          }
                          onValueChange={setFuelType}
                        >
                          <SelectTrigger className="bg-gray-50">
                            <SelectValue placeholder="Select Fuel Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fuelOptions[transport].map((fuel) => (
                              <SelectItem key={fuel} value={fuel}>
                                <div className="flex items-center gap-3">
                                  {fuelTypes[fuel].icon}
                                  {fuelTypes[fuel].label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={fuelAmount}
                            onChange={(e) => setFuelAmount(e.target.value)}
                            placeholder="Fuel amount"
                            className="bg-gray-50"
                            min="0"
                          />
                          <Select
                            value={unit}
                            onValueChange={setUnit}
                            disabled={transport === "airplane"}
                          >
                            <SelectTrigger className="w-[120px] bg-gray-50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="liters">Liters</SelectItem>
                              <SelectItem value="gallons">Gallons</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-gray-700 mb-2">
                      <FiMapPin className="text-teal-500" />
                      Journey Details
                    </Label>
                    <div className="space-y-4">
                      <Input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="Distance in kilometers"
                        className="bg-gray-50"
                        min="0"
                      />
                      <Input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Destination city"
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-lg h-12 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Calculate Carbon Emission
                </Button>

                {emission !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 bg-teal-50/50 rounded-xl border border-teal-100 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-teal-500/10 rounded-xl">
                        <FiActivity className="w-8 h-8 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700">
                          Carbon Emission:{" "}
                          <span className="text-teal-600">
                            {emission.toFixed(2)} kg CO₂
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          This equals {Math.round(emission / 2.3)} trees needed
                          to offset
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
