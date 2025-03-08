const EMISSION_FACTORS = {
  car: {
    petrol: 2.31,
    diesel: 2.68,
    electric: 0.05,
    hybrid: 1.12,
  },
  bus: 0.089,
  train: 0.041,
  bike: 0,
  walk: 0,
  airplane: 0.242,
} as const;

export const calculateEmission = (
  transport: string,
  distance: number,
  fuelType?: string,
  fuelAmount?: number,
  unit?: string
): number => {
  if (!transport || distance <= 0) return 0;

  const convertedDistance = unit === "miles" ? distance * 1.60934 : distance;

  if (transport === "car" && fuelType) {
    const fuelFactor =
      EMISSION_FACTORS.car[fuelType as keyof typeof EMISSION_FACTORS.car];
    if (fuelFactor !== undefined) {
      return fuelType === "electric" || fuelType === "hybrid"
        ? convertedDistance * fuelFactor
        : (fuelAmount || 0) * fuelFactor;
    }
  }

  const factor = EMISSION_FACTORS[transport as keyof typeof EMISSION_FACTORS];
  return typeof factor === "number" ? convertedDistance * factor : 0;
};
