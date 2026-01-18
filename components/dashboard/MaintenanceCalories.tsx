"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little or no exercise)", multiplier: 1.2 },
  { value: "light", label: "Light (1-3 days/week)", multiplier: 1.375 },
  { value: "moderate", label: "Moderate (3-5 days/week)", multiplier: 1.55 },
  { value: "very", label: "Very active (6-7 days/week)", multiplier: 1.725 },
];

type Gender = "male" | "female";

type CalorieRow = {
  label: string;
  subtitle: string;
  calories: number;
  percent: string;
};

const clampCalories = (calories: number, gender: Gender) => {
  const min = gender === "male" ? 1500 : 1200;
  return Math.max(Math.round(calories), min);
};

export const MaintenanceCalories = () => {
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [activity, setActivity] = useState("moderate");

  const rows = useMemo<CalorieRow[]>(() => {
    const hasInputs =
      weightKg !== "" &&
      heightCm !== "" &&
      age !== "" &&
      Boolean(gender) &&
      Boolean(activity);

    if (!hasInputs) return [];

    const w = Math.max(parseFloat(weightKg) || 0, 0);
    const h = Math.max(parseFloat(heightCm) || 0, 0);
    const a = Math.max(parseFloat(age) || 0, 0);
    const multiplier =
      activityLevels.find((l) => l.value === activity)?.multiplier || 1.2;

    const bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * multiplier;

    const maintain = clampCalories(tdee, gender);
    const mildLoss = clampCalories(tdee - 250, gender);
    const loss = clampCalories(tdee - 500, gender);
    const extremeLoss = clampCalories(tdee - 1000, gender);

    return [
      {
        label: "Maintain weight",
        subtitle: "Calories/day",
        calories: maintain,
        percent: "100%",
      },
      {
        label: "Mild weight loss (0.25 kg/week)",
        subtitle: "Calories/day",
        calories: mildLoss,
        percent: "~91%",
      },
      {
        label: "Weight loss (0.5 kg/week)",
        subtitle: "Calories/day",
        calories: loss,
        percent: "~83%",
      },
      {
        label: "Extreme weight loss (1 kg/week)",
        subtitle: "Calories/day",
        calories: extremeLoss,
        percent: "~66%",
      },
    ];
  }, [weightKg, heightCm, age, gender, activity]);

  const { bmi, bmiCategory } = useMemo(() => {
    if (weightKg === "" || heightCm === "") {
      return { bmi: null as number | null, bmiCategory: "" };
    }

    const w = Math.max(parseFloat(weightKg) || 0, 0);
    const h = Math.max(parseFloat(heightCm) || 0, 0);
    const heightMeters = h / 100;

    if (w <= 0 || heightMeters <= 0) {
      return { bmi: null as number | null, bmiCategory: "" };
    }

    const value = w / (heightMeters * heightMeters);
    const rounded = Math.round(value * 10) / 10;

    const category =
      rounded < 18.5
        ? "Underweight"
        : rounded < 25
        ? "Normal"
        : rounded < 30
        ? "Overweight"
        : "Obese";

    return { bmi: rounded, bmiCategory: category };
  }, [weightKg, heightCm]);

  const bodyFat = useMemo(() => {
    if (bmi === null || age === "") return null as number | null;

    const ageValue = Math.max(parseFloat(age) || 0, 0);
    if (ageValue <= 0) return null as number | null;

    const sex = gender === "male" ? 1 : 0;
    const estimate = 1.2 * bmi + 0.23 * ageValue - 10.8 * sex - 5.4;
    return Math.round(estimate * 10) / 10;
  }, [age, bmi, gender]);

  return (
    <Card className="p-4 sm:p-6">
      <CardHeader className="flex flex-col gap-1">
        <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          Maintenance Calorie Calculator
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Metric units • Mifflin–St Jeor • Updates instantly
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Weight (kg)"
            type="number"
            min={0}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
          <Input
            label="Height (cm)"
            type="number"
            min={0}
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
          <Input
            label="Age (years)"
            type="number"
            min={0}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <Select
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
          <Select
            label="Activity level"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            options={activityLevels.map((level) => ({
              value: level.value,
              label: level.label,
            }))}
            className="sm:col-span-2"
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-800/60 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 tracking-wide">
            <div className="col-span-6 px-4 py-3">Goal</div>
            <div className="col-span-4 px-4 py-3">Calories / day</div>
            <div className="col-span-2 px-4 py-3 text-right">% of TDEE</div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {rows.length === 0 ? (
              <div className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                Enter weight, height, age, gender, and activity level to see targets.
              </div>
            ) : (
              rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-12 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="col-span-6 px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {row.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {row.subtitle}
                    </div>
                  </div>
                  <div className="col-span-4 px-4 py-3 flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                    {row.calories.toLocaleString()} cal
                  </div>
                  <div className="col-span-2 px-4 py-3 flex items-center justify-end text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    {row.percent}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">BMI</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {bmi !== null ? bmi.toFixed(1) : "--"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{bmiCategory || "Enter weight and height"}</div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Body Fat % (Deurenberg)</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {bodyFat !== null ? bodyFat.toFixed(1) : "--"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Uses BMI, age, and gender</div>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          Calorie targets are estimates and should not replace professional medical guidance. Minimum calories are clamped to protect against unsafe deficits (men ≥ 1500 kcal, women ≥ 1200 kcal).
        </div>
      </CardBody>
    </Card>
  );
};
