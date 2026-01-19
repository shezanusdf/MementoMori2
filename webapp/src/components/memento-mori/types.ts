export type DotShape = 'circle' | 'rounded' | 'square';
export type WidgetPosition = 'none' | 'top' | 'bottom';
export type ThemeId = 'light' | 'dark' | 'midnight' | 'sepia' | 'ocean' | 'forest' | 'custom';

export interface ThemeColors {
  background: string;
  lived: string;
  future: string;
  text: string;
}

export interface WallpaperTheme {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
}

export const THEMES: WallpaperTheme[] = [
  {
    id: 'light',
    name: 'Light',
    colors: {
      background: '#f5f2ed',
      lived: '#d35233',
      future: '#d9d4cc',
      text: '#141414',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      background: '#0a0c10',
      lived: '#c9a24d',
      future: '#1e2128',
      text: '#f2f0eb',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      background: '#0f0f1a',
      lived: '#6366f1',
      future: '#1e1e2e',
      text: '#e2e8f0',
    },
  },
  {
    id: 'sepia',
    name: 'Sepia',
    colors: {
      background: '#f4ecd8',
      lived: '#8b4513',
      future: '#d4c4a8',
      text: '#3d2914',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      background: '#0c1929',
      lived: '#0ea5e9',
      future: '#1e3a5f',
      text: '#e0f2fe',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      background: '#0f1a0f',
      lived: '#22c55e',
      future: '#1a2e1a',
      text: '#dcfce7',
    },
  },
  {
    id: 'custom',
    name: 'Custom',
    colors: {
      background: '#ffffff',
      lived: '#000000',
      future: '#e5e5e5',
      text: '#000000',
    },
  },
];

export interface WallpaperSettings {
  birthDate: string;
  lifeExpectancy: number;
  device: string;
  shape: DotShape;
  widgetPosition: WidgetPosition;
  theme: ThemeId;
  customColors?: ThemeColors;
  showLabels: boolean;
}

export interface DeviceSpec {
  name: string;
  width: number;
  height: number;
  // Safe area in pixels (at native resolution)
  safeAreaTop: number;      // Space for Dynamic Island/notch + status bar
  safeAreaBottom: number;   // Space for home indicator
  // Lock screen specific offsets
  clockHeight: number;      // Height reserved for clock/date on lock screen
  hasDynamicIsland: boolean;
  hasNotch: boolean;
}

// Safe area calculations based on Apple's HIG and device specs
// Points are multiplied by scale factor (3x for most modern iPhones)
// Lock screen clock typically occupies ~100-120pt below Dynamic Island
export const DEVICE_SPECS: Record<string, DeviceSpec> = {
  // iPhone 17 Series (2025)
  'iphone-17-pro-max': {
    name: 'iPhone 17 Pro Max',
    width: 1320, height: 2868,
    safeAreaTop: 186, // 62pt * 3
    safeAreaBottom: 102, // 34pt * 3
    clockHeight: 330, // Clock + date area on lock screen
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-17-pro': {
    name: 'iPhone 17 Pro',
    width: 1206, height: 2622,
    safeAreaTop: 186,
    safeAreaBottom: 102,
    clockHeight: 300,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-17': {
    name: 'iPhone 17',
    width: 1206, height: 2622,
    safeAreaTop: 186,
    safeAreaBottom: 102,
    clockHeight: 300,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-17-air': {
    name: 'iPhone 17 Air',
    width: 1260, height: 2736,
    safeAreaTop: 204, // 68pt * 3
    safeAreaBottom: 87, // 29pt * 3
    clockHeight: 310,
    hasDynamicIsland: true,
    hasNotch: false
  },

  // iPhone 16 Series (2024)
  'iphone-16-pro-max': {
    name: 'iPhone 16 Pro Max',
    width: 1320, height: 2868,
    safeAreaTop: 186,
    safeAreaBottom: 102,
    clockHeight: 330,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-16-pro': {
    name: 'iPhone 16 Pro',
    width: 1206, height: 2622,
    safeAreaTop: 186,
    safeAreaBottom: 102,
    clockHeight: 300,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-16-plus': {
    name: 'iPhone 16 Plus',
    width: 1290, height: 2796,
    safeAreaTop: 177, // 59pt * 3
    safeAreaBottom: 102,
    clockHeight: 320,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-16': {
    name: 'iPhone 16',
    width: 1179, height: 2556,
    safeAreaTop: 177,
    safeAreaBottom: 102,
    clockHeight: 290,
    hasDynamicIsland: true,
    hasNotch: false
  },

  // iPhone 15 Series (2023)
  'iphone-15-pro-max': {
    name: 'iPhone 15 Pro Max',
    width: 1290, height: 2796,
    safeAreaTop: 177,
    safeAreaBottom: 102,
    clockHeight: 320,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-15-pro': {
    name: 'iPhone 15 Pro',
    width: 1179, height: 2556,
    safeAreaTop: 177,
    safeAreaBottom: 102,
    clockHeight: 290,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-15-plus': {
    name: 'iPhone 15 Plus',
    width: 1290, height: 2796,
    safeAreaTop: 177,
    safeAreaBottom: 102,
    clockHeight: 320,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-15': {
    name: 'iPhone 15',
    width: 1179, height: 2556,
    safeAreaTop: 177,
    safeAreaBottom: 102,
    clockHeight: 290,
    hasDynamicIsland: true,
    hasNotch: false
  },

  // iPhone 14 Series (2022)
  'iphone-14-pro-max': {
    name: 'iPhone 14 Pro Max',
    width: 1290, height: 2796,
    safeAreaTop: 177,
    safeAreaBottom: 102,
    clockHeight: 320,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-14-pro': {
    name: 'iPhone 14 Pro',
    width: 1179, height: 2556,
    safeAreaTop: 177,
    safeAreaBottom: 102,
    clockHeight: 290,
    hasDynamicIsland: true,
    hasNotch: false
  },
  'iphone-14-plus': {
    name: 'iPhone 14 Plus',
    width: 1284, height: 2778,
    safeAreaTop: 141,
    safeAreaBottom: 102,
    clockHeight: 310,
    hasDynamicIsland: false,
    hasNotch: true
  },
  'iphone-14': {
    name: 'iPhone 14',
    width: 1170, height: 2532,
    safeAreaTop: 141,
    safeAreaBottom: 102,
    clockHeight: 280,
    hasDynamicIsland: false,
    hasNotch: true
  },

  // Older models with notch
  'iphone-13': {
    name: 'iPhone 13/12',
    width: 1170, height: 2532,
    safeAreaTop: 141,
    safeAreaBottom: 102,
    clockHeight: 280,
    hasDynamicIsland: false,
    hasNotch: true
  },

  // iPhone SE (no notch, no Dynamic Island)
  'iphone-se': {
    name: 'iPhone SE',
    width: 750, height: 1334,
    safeAreaTop: 60,
    safeAreaBottom: 0,
    clockHeight: 180,
    hasDynamicIsland: false,
    hasNotch: false
  },
};

export const COUNTRIES = [
  { code: 'US', name: 'United States', lifeExpectancy: 77 },
  { code: 'UK', name: 'United Kingdom', lifeExpectancy: 81 },
  { code: 'CA', name: 'Canada', lifeExpectancy: 82 },
  { code: 'AU', name: 'Australia', lifeExpectancy: 83 },
  { code: 'DE', name: 'Germany', lifeExpectancy: 81 },
  { code: 'FR', name: 'France', lifeExpectancy: 83 },
  { code: 'JP', name: 'Japan', lifeExpectancy: 84 },
  { code: 'IT', name: 'Italy', lifeExpectancy: 83 },
  { code: 'ES', name: 'Spain', lifeExpectancy: 83 },
  { code: 'BR', name: 'Brazil', lifeExpectancy: 76 },
  { code: 'MX', name: 'Mexico', lifeExpectancy: 75 },
  { code: 'IN', name: 'India', lifeExpectancy: 70 },
  { code: 'CN', name: 'China', lifeExpectancy: 78 },
  { code: 'KR', name: 'South Korea', lifeExpectancy: 83 },
  { code: 'SG', name: 'Singapore', lifeExpectancy: 84 },
  { code: 'NL', name: 'Netherlands', lifeExpectancy: 82 },
  { code: 'SE', name: 'Sweden', lifeExpectancy: 83 },
  { code: 'CH', name: 'Switzerland', lifeExpectancy: 84 },
  { code: 'NZ', name: 'New Zealand', lifeExpectancy: 82 },
  { code: 'OTHER', name: 'Other', lifeExpectancy: 73 },
];

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
  if (settings.theme === 'custom' && settings.customColors) {
    return settings.customColors;
  }
  const theme = THEMES.find(t => t.id === settings.theme);
  return theme?.colors ?? THEMES[0].colors;
}
