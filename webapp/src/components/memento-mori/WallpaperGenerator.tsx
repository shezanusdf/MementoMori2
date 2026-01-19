import { useCallback, useRef, useEffect } from 'react';
import {
  WallpaperSettings,
  DotShape,
  DEVICE_SPECS,
  DeviceSpec,
  calculateWeeksLived,
  calculateTotalWeeks,
  getThemeColors,
  ThemeColors,
} from './types';

interface WallpaperGeneratorProps {
  settings: WallpaperSettings;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: DotShape,
  isLived: boolean,
  colors: ThemeColors
) {
  const color = isLived ? colors.lived : colors.future;
  ctx.fillStyle = color;

  const halfSize = size / 2;
  const cornerRadius = shape === 'rounded' ? size * 0.25 : 0;

  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x + halfSize, y + halfSize, halfSize, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'square') {
    ctx.fillRect(x, y, size, size);
  } else {
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, cornerRadius);
    ctx.fill();
  }
}

/**
 * Calculate the safe top offset for the grid based on device type and widget position.
 * This ensures the grid never overlaps with:
 * - Dynamic Island (on newer iPhones)
 * - Notch (on older iPhones)
 * - Lock screen clock and date
 * - Lock screen widgets (if enabled)
 */
function calculateTopOffset(device: DeviceSpec, widgetPosition: string): number {
  // Base offset: clock height (which already accounts for Dynamic Island/notch)
  let offset = device.clockHeight;

  // Add extra space for top widgets
  if (widgetPosition === 'top') {
    // Lock screen widgets take approximately 120pt (360px at 3x)
    offset += Math.round(device.width * 0.28);
  } else {
    // Add a small buffer below the clock for visual balance
    offset += Math.round(device.width * 0.05);
  }

  return offset;
}

/**
 * Calculate the safe bottom offset for the grid.
 * This accounts for:
 * - Home indicator bar
 * - Bottom widgets (if enabled)
 * - Flashlight/Camera buttons on lock screen
 */
function calculateBottomOffset(device: DeviceSpec, widgetPosition: string): number {
  // Base offset: safe area bottom + space for lock screen buttons
  let offset = device.safeAreaBottom + Math.round(device.width * 0.12);

  // Add extra space for bottom widgets
  if (widgetPosition === 'bottom') {
    offset += Math.round(device.width * 0.2);
  }

  return offset;
}

export function generateWallpaper(
  canvas: HTMLCanvasElement,
  settings: WallpaperSettings
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const device = DEVICE_SPECS[settings.device] || DEVICE_SPECS['iphone-16-pro'];
  const colors = getThemeColors(settings);

  // Set canvas to device native resolution for high quality
  canvas.width = device.width;
  canvas.height = device.height;

  // Fill background
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const weeksLived = calculateWeeksLived(settings.birthDate);
  const totalWeeks = calculateTotalWeeks(settings.lifeExpectancy);

  const cols = 52;
  const rows = Math.ceil(totalWeeks / cols);

  // Calculate spacing for labels
  const labelSpace = settings.showLabels ? Math.round(device.width * 0.025) : 0;
  const axisTitleSpace = settings.showLabels ? Math.round(device.width * 0.015) : 0;
  const padding = device.width * 0.04;

  // Use device-specific safe area calculations
  const topOffset = calculateTopOffset(device, settings.widgetPosition);
  const bottomOffset = calculateBottomOffset(device, settings.widgetPosition);

  // Equal margins on both sides for visual balance
  const labelOffset = settings.showLabels ? labelSpace + axisTitleSpace : 0;
  const sidePadding = padding + labelOffset;
  const topPadding = settings.showLabels ? labelSpace + axisTitleSpace : 0;

  const availableWidth = device.width - sidePadding * 2;
  const availableHeight = device.height - topOffset - bottomOffset - topPadding;

  // Calculate cell and dot sizes
  const gapRatio = 0.2;
  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;
  const cellSize = Math.min(cellWidth, cellHeight);
  const dotSize = cellSize * (1 - gapRatio);
  const gap = cellSize * gapRatio;

  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  // Center the grid horizontally and vertically within available space
  const remainingWidth = availableWidth - gridWidth;
  const remainingHeight = availableHeight - gridHeight;
  const startX = sidePadding + remainingWidth / 2;
  const startY = topOffset + topPadding + remainingHeight / 2;

  // Draw labels if enabled
  if (settings.showLabels) {
    const fontSize = Math.round(cellSize * 0.55);
    const titleFontSize = Math.round(device.width * 0.016);
    ctx.fillStyle = colors.text;
    ctx.globalAlpha = 0.4;

    // X-axis title: "WEEK OF YEAR"
    ctx.save();
    ctx.font = `300 ${titleFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const xTitleY = startY - labelSpace * 0.6;
    ctx.fillText('WEEK OF YEAR', startX + gridWidth / 2, xTitleY);
    ctx.restore();

    // X-axis labels (Week numbers)
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    const weekLabels = [1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (const week of weekLabels) {
      const col = week - 1;
      const x = startX + col * cellSize + cellSize / 2;
      const y = startY - fontSize * 0.2;
      ctx.fillText(week.toString(), x, y);
    }

    // Y-axis title: "AGE"
    ctx.save();
    ctx.font = `300 ${titleFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const yTitleX = startX - labelSpace - axisTitleSpace * 0.6;
    const yTitleY = startY + gridHeight / 2;
    ctx.translate(yTitleX, yTitleY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('AGE', 0, 0);
    ctx.restore();

    // Y-axis labels (Age markers)
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let age = 10; age <= settings.lifeExpectancy; age += 10) {
      const row = age;
      if (row < rows) {
        const x = startX - fontSize * 0.4;
        const y = startY + row * cellSize + cellSize / 2;
        ctx.fillText(age.toString(), x, y);
      }
    }

    ctx.globalAlpha = 1;
  }

  // Draw the week dots
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const weekIndex = row * cols + col;
      if (weekIndex >= totalWeeks) continue;

      const isLived = weekIndex < weeksLived;
      const x = startX + col * cellSize + gap / 2;
      const y = startY + row * cellSize + gap / 2;

      drawDot(ctx, x, y, dotSize, settings.shape, isLived, colors);
    }
  }
}

export function WallpaperCanvas({ settings, onCanvasReady }: WallpaperGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      generateWallpaper(canvasRef.current, settings);
      onCanvasReady?.(canvasRef.current);
    }
  }, [settings, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="hidden"
      aria-hidden="true"
    />
  );
}

export function useWallpaperDownload() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setCanvas = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  const download = useCallback(() => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = 'inspogrid-wallpaper.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  return { setCanvas, download };
}
