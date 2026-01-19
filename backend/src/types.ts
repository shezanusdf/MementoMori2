import { z } from "zod";

export const DotShapeSchema = z.enum(["circle", "rounded", "square"]);
export const WidgetPositionSchema = z.enum(["none", "top", "bottom"]);
export const ThemeIdSchema = z.enum([
  "light",
  "dark",
  "midnight",
  "sepia",
  "ocean",
  "forest",
  "custom",
]);

export const ThemeColorsSchema = z.object({
  background: z.string(),
  lived: z.string(),
  future: z.string(),
  text: z.string(),
});

export const WallpaperSettingsSchema = z.object({
  birthDate: z.string(),
  lifeExpectancy: z.number(),
  device: z.string(),
  shape: DotShapeSchema,
  widgetPosition: WidgetPositionSchema,
  theme: ThemeIdSchema,
  customColors: ThemeColorsSchema.optional(),
  showLabels: z.boolean().default(true),
});

export type DotShape = z.infer<typeof DotShapeSchema>;
export type WidgetPosition = z.infer<typeof WidgetPositionSchema>;
export type ThemeId = z.infer<typeof ThemeIdSchema>;
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;
export type WallpaperSettings = z.infer<typeof WallpaperSettingsSchema>;

export interface WallpaperTheme {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
}

export const THEMES: WallpaperTheme[] = [
  {
    id: "light",
    name: "Light",
    colors: {
      background: "#f5f2ed",
      lived: "#d35233",
      future: "#d9d4cc",
      text: "#141414",
    },
  },
  {
    id: "dark",
    name: "Dark",
    colors: {
      background: "#0a0c10",
      lived: "#c9a24d",
      future: "#1e2128",
      text: "#f2f0eb",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    colors: {
      background: "#0f0f1a",
      lived: "#6366f1",
      future: "#1e1e2e",
      text: "#e2e8f0",
    },
  },
  {
    id: "sepia",
    name: "Sepia",
    colors: {
      background: "#f4ecd8",
      lived: "#8b4513",
      future: "#d4c4a8",
      text: "#3d2914",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      background: "#0c1929",
      lived: "#0ea5e9",
      future: "#1e3a5f",
      text: "#e0f2fe",
    },
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      background: "#0f1a0f",
      lived: "#22c55e",
      future: "#1a2e1a",
      text: "#dcfce7",
    },
  },
  {
    id: "custom",
    name: "Custom",
    colors: {
      background: "#ffffff",
      lived: "#000000",
      future: "#e5e5e5",
      text: "#000000",
    },
  },
];

export interface DeviceSpec {
  name: string;
  width: number;
  height: number;
  safeAreaTop: number;
  safeAreaBottom: number;
}

export const DEVICE_SPECS: Record<string, DeviceSpec> = {
  "iphone-15-pro-max": {
    name: "iPhone 15 Pro Max",
    width: 1290,
    height: 2796,
    safeAreaTop: 145,
    safeAreaBottom: 102,
  },
  "iphone-15-pro": {
    name: "iPhone 15 Pro",
    width: 1179,
    height: 2556,
    safeAreaTop: 145,
    safeAreaBottom: 102,
  },
  "iphone-15-plus": {
    name: "iPhone 15 Plus",
    width: 1290,
    height: 2796,
    safeAreaTop: 145,
    safeAreaBottom: 102,
  },
  "iphone-15": {
    name: "iPhone 15",
    width: 1179,
    height: 2556,
    safeAreaTop: 145,
    safeAreaBottom: 102,
  },
  "iphone-14-pro-max": {
    name: "iPhone 14 Pro Max",
    width: 1290,
    height: 2796,
    safeAreaTop: 145,
    safeAreaBottom: 102,
  },
  "iphone-14-pro": {
    name: "iPhone 14 Pro",
    width: 1179,
    height: 2556,
    safeAreaTop: 145,
    safeAreaBottom: 102,
  },
  "iphone-14-plus": {
    name: "iPhone 14 Plus",
    width: 1284,
    height: 2778,
    safeAreaTop: 141,
    safeAreaBottom: 102,
  },
  "iphone-14": {
    name: "iPhone 14",
    width: 1170,
    height: 2532,
    safeAreaTop: 141,
    safeAreaBottom: 102,
  },
  "iphone-13": {
    name: "iPhone 13/12",
    width: 1170,
    height: 2532,
    safeAreaTop: 141,
    safeAreaBottom: 102,
  },
  "iphone-se": {
    name: "iPhone SE",
    width: 750,
    height: 1334,
    safeAreaTop: 60,
    safeAreaBottom: 0,
  },
};

export function calculateWeeksLived(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffTime = now.getTime() - birth.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, diffWeeks);
}

export function calculateTotalWeeks(lifeExpectancy: number): number {
  return lifeExpectancy * 52;
}

export function getThemeColors(settings: WallpaperSettings): ThemeColors {
  if (settings.theme === "custom" && settings.customColors) {
    return settings.customColors;
  }
  const theme = THEMES.find((t) => t.id === settings.theme);
  return theme?.colors ?? THEMES[0]!.colors;
}

// Token encoding/decoding for iOS Shortcut
export function encodeToken(settings: WallpaperSettings): string {
  const data = JSON.stringify(settings);
  return Buffer.from(data).toString("base64url");
}

export function decodeToken(token: string): WallpaperSettings | null {
  try {
    const data = Buffer.from(token, "base64url").toString("utf-8");
    const parsed = JSON.parse(data);
    return WallpaperSettingsSchema.parse(parsed);
  } catch {
    return null;
  }
}
