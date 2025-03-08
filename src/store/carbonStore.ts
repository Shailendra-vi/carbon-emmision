import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Calculation {
  id: string;
  transport: string;
  distance: number;
  emission: number;
  date: Date;
  recommendations: Recommendation[];
}

interface Recommendation {
  id: string;
  text: string;
  category: string;
}

interface CarbonState {
  history: Calculation[];
  activeCalculation: Calculation;
  addCalculation: (
    calc: Omit<Calculation, "id" | "date"> & {
      recommendations: Recommendation[];
    }
  ) => void;
  fetchRecommendations: (data: any) => Promise<Recommendation[]>;
  setActiveCalculation: (recommendation: Calculation) => void;
}

export const useCarbonStore = create<CarbonState>()(
  persist(
    (set) => ({
      history: [],
      activeCalculation: {
        id: "",
        transport: "",
        distance: 0,
        emission: 0,
        date: new Date(),
        recommendations: [],
      },

      addCalculation: (calc) => {
        const newCalc = {
          ...calc,
          id: Date.now().toString(),
          date: new Date(),
        };
        set((state) => ({
          ...state,
          activeCalculation: newCalc,
          history: [newCalc, ...state.history].slice(0, 20),
        }));
      },

      setActiveCalculation: (recommendation: Calculation) => {
        set((state) => ({
          ...state,
          activeCalculation: recommendation,
        }));
      },

      fetchRecommendations: async (data) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/recommendations`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) throw new Error("Failed to fetch");
          const recommendation = await response.json();

          return recommendation;
        } catch (error) {
          console.error("Error:", error);
          return [];
        }
      },
    }),
    {
      name: "carbon-storage",
    }
  )
);
