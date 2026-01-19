import { useEffect, useRef } from 'react';
import { WallpaperSettings, DEVICE_SPECS, calculateWeeksLived, calculateTotalWeeks, DotShape, getThemeColors, ThemeColors } from './types';

interface IPhoneMockupProps {
  settings: WallpaperSettings;
}

function drawMiniDot(
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

  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x + halfSize, y + halfSize, halfSize, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'square') {
    ctx.fillRect(x, y, size, size);
  } else {
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, size * 0.25);
    ctx.fill();
  }
}

export function IPhoneMockup({ settings }: IPhoneMockupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = getThemeColors(settings);
  const device = DEVICE_SPECS[settings.device] || DEVICE_SPECS['iphone-16-pro'];

  // Determine if theme is dark for frame styling
  const isDarkTheme = isColorDark(colors.background);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previewWidth = 260;
    const previewHeight = 560;
    canvas.width = previewWidth * 2;
    canvas.height = previewHeight * 2;
    ctx.scale(2, 2);

    // Fill background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, previewWidth, previewHeight);

    // Calculate grid
    const weeksLived = calculateWeeksLived(settings.birthDate);
    const totalWeeks = calculateTotalWeeks(settings.lifeExpectancy);

    const cols = 52;
    const rows = Math.ceil(totalWeeks / cols);

    // Scale factor from actual device to preview (preview is ~260px, device is ~1200px)
    const scaleFactor = previewWidth / device.width;

    // Scale clock height to preview size
    const scaledClockHeight = device.clockHeight * scaleFactor;

    // Calculate offsets similar to wallpaper generator but scaled
    const labelSpace = settings.showLabels ? 12 : 0;
    const axisTitleSpace = settings.showLabels ? 8 : 0;
    const padding = 12;

    // Top offset based on widget position and scaled clock height
    let topOffset = scaledClockHeight + (previewWidth * 0.05);
    if (settings.widgetPosition === 'top') {
      topOffset += previewWidth * 0.28;
    }

    // Bottom offset
    let bottomOffset = (device.safeAreaBottom * scaleFactor) + (previewWidth * 0.12);
    if (settings.widgetPosition === 'bottom') {
      bottomOffset += previewWidth * 0.2;
    }

    const leftPadding = padding + (settings.showLabels ? labelSpace + axisTitleSpace : 0);
    const topPadding = settings.showLabels ? labelSpace + axisTitleSpace : 0;

    const availableWidth = previewWidth - leftPadding - padding;
    const availableHeight = previewHeight - topOffset - bottomOffset - topPadding;

    const gapRatio = 0.25;
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;
    const cellSize = Math.min(cellWidth, cellHeight);
    const dotSize = cellSize * (1 - gapRatio);
    const gap = cellSize * gapRatio;

    const gridWidth = cols * cellSize;
    const gridHeight = rows * cellSize;

    // Center the grid
    const remainingWidth = availableWidth - gridWidth;
    const remainingHeight = availableHeight - gridHeight;
    const startX = leftPadding + remainingWidth / 2;
    const startY = topOffset + topPadding + remainingHeight / 2;

    // Draw labels if enabled
    if (settings.showLabels) {
      ctx.fillStyle = colors.text;
      ctx.globalAlpha = 0.4;
      const fontSize = Math.max(4, cellSize * 0.5);
      const titleFontSize = 5;

      // X-axis title: "WEEK OF YEAR"
      ctx.save();
      ctx.font = `300 ${titleFontSize}px -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('WEEK OF YEAR', startX + gridWidth / 2, startY - labelSpace * 0.8);
      ctx.restore();

      // X-axis labels
      ctx.font = `${fontSize}px -apple-system, sans-serif`;
      const weekLabels = [1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      for (const week of weekLabels) {
        const col = week - 1;
        const x = startX + col * cellSize + cellSize / 2;
        const y = startY - 2;
        ctx.fillText(week.toString(), x, y);
      }

      // Y-axis title: "AGE"
      ctx.save();
      ctx.font = `300 ${titleFontSize}px -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(padding + axisTitleSpace * 0.35, startY + gridHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('AGE', 0, 0);
      ctx.restore();

      // Y-axis labels
      ctx.font = `${fontSize}px -apple-system, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let age = 10; age <= settings.lifeExpectancy; age += 10) {
        const row = age;
        if (row < rows) {
          const x = startX - 3;
          const y = startY + row * cellSize + cellSize / 2;
          ctx.fillText(age.toString(), x, y);
        }
      }

      ctx.globalAlpha = 1;
    }

    // Draw dots
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const weekIndex = row * cols + col;
        if (weekIndex >= totalWeeks) continue;

        const isLived = weekIndex < weeksLived;
        const x = startX + col * cellSize + gap / 2;
        const y = startY + row * cellSize + gap / 2;

        drawMiniDot(ctx, x, y, dotSize, settings.shape, isLived, colors);
      }
    }

    // Bottom indicator line (home indicator)
    ctx.fillStyle = colors.text;
    ctx.beginPath();
    ctx.roundRect(previewWidth / 2 - 55, previewHeight - 14, 110, 4, 2);
    ctx.fill();

  }, [settings, colors, device]);

  return (
    <div className="relative">
      <div
        className="relative rounded-[3rem] border-[10px] shadow-xl"
        style={{
          borderColor: isDarkTheme ? '#1a1a1f' : '#e8e8ed',
          backgroundColor: colors.background,
          boxShadow: isDarkTheme ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.1)',
        }}
      >
        {/* Dynamic Island - only show for devices with Dynamic Island */}
        {device.hasDynamicIsland && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-[#1a1a1a] rounded-full z-10" />
        )}
        {/* Notch - for older devices */}
        {device.hasNotch && !device.hasDynamicIsland && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#1a1a1a] rounded-b-3xl z-10" />
        )}

        <canvas
          ref={canvasRef}
          className="rounded-[2.2rem] w-[260px] h-[560px]"
          style={{ display: 'block' }}
        />

        {/* Side buttons */}
        <div
          className="absolute -left-[13px] top-32 w-[3px] h-10 rounded-l"
          style={{ backgroundColor: isDarkTheme ? '#1a1a1f' : '#d4d4d8' }}
        />
        <div
          className="absolute -left-[13px] top-48 w-[3px] h-16 rounded-l"
          style={{ backgroundColor: isDarkTheme ? '#1a1a1f' : '#d4d4d8' }}
        />
        <div
          className="absolute -left-[13px] top-[17rem] w-[3px] h-16 rounded-l"
          style={{ backgroundColor: isDarkTheme ? '#1a1a1f' : '#d4d4d8' }}
        />
        <div
          className="absolute -right-[13px] top-40 w-[3px] h-20 rounded-r"
          style={{ backgroundColor: isDarkTheme ? '#1a1a1f' : '#d4d4d8' }}
        />
      </div>

      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </div>
  );
}

function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
