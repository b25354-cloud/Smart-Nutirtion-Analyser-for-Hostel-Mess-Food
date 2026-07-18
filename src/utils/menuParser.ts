import Papa from "papaparse";
import menuCSV from "@/data/mess_menu.csv?raw";

export interface WeeklyMenu {
  [day: string]: {
    Breakfast: string[];
    Lunch: string[];
    Dinner: string[];
  };
}

let cachedMenu: WeeklyMenu | null = null;

export function loadMenuCSV(): WeeklyMenu {
  if (cachedMenu) return cachedMenu;

  const parsed = Papa.parse(menuCSV, {
    header: true,
    skipEmptyLines: true,
  });

  const menu: WeeklyMenu = {};

  parsed.data.forEach((row: any) => {
    const meal = row.Meal?.trim();

    if (!meal) return;

    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((day) => {
      if (!menu[day]) {
        menu[day] = {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
        };
      }

      const food = row[day]?.trim();

      if (food) {
        menu[day][meal as "Breakfast" | "Lunch" | "Dinner"].push(food);
      }
    });
  });

  cachedMenu = menu;

  return menu;
}

export function getMealsByDayAndType(
  day: string,
  meal: "Breakfast" | "Lunch" | "Dinner"
) {
  return loadMenuCSV()[day]?.[meal] ?? [];
}