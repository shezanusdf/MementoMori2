import { Hono } from "hono";
import { createCanvas, type SKRSContext2D } from "@napi-rs/canvas";
import {
  WallpaperSettingsSchema,
  decodeToken,
  getThemeColors,
  calculateWeeksLived,
  calculateTotalWeeks,
  DEVICE_SPECS,
  type WallpaperSettings,
  type DotShape,
  type ThemeColors,
} from "../types";

const wallpaperRouter = new Hono();

function drawDot(
  ctx: SKRSContext2D,
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
  const cornerRadius = shape === "rounded" ? size * 0.25 : 0;

  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(x + halfSize, y + halfSize, halfSize, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === "square") {
    ctx.fillRect(x, y, size, size);
  } else {
    ctx.beginPath();
    roundRect(ctx, x, y, size, size, cornerRadius);
    ctx.fill();
  }
}

function roundRect(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function generateWallpaper(settings: WallpaperSettings): Buffer {
  const device = DEVICE_SPECS[settings.device] ?? DEVICE_SPECS["iphone-15-pro"]!;
  const colors = getThemeColors(settings);

  const canvas = createCanvas(device.width, device.height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, device.width, device.height);

  const weeksLived = calculateWeeksLived(settings.birthDate);
  const totalWeeks = calculateTotalWeeks(settings.lifeExpectancy);

  const cols = 52;
  const rows = Math.ceil(totalWeeks / cols);

  const labelSpace = settings.showLabels ? Math.round(device.width * 0.025) : 0;
  const axisTitleSpace = settings.showLabels ? Math.round(device.width * 0.015) : 0;
  const padding = device.width * 0.04;
  const topOffset =
    settings.widgetPosition === "top"
      ? device.safeAreaTop + 320
      : device.safeAreaTop + 180;
  const bottomOffset =
    settings.widgetPosition === "bottom"
      ? device.safeAreaBottom + 250
      : device.safeAreaBottom + 80;

  const labelOffset = settings.showLabels ? labelSpace + axisTitleSpace : 0;
  const sidePadding = padding + labelOffset;
  const topPadding = settings.showLabels ? labelSpace + axisTitleSpace : 0;

  const availableWidth = device.width - sidePadding * 2;
  const availableHeight = device.height - topOffset - bottomOffset - topPadding;

  const gapRatio = 0.2;
  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;
  const cellSize = Math.min(cellWidth, cellHeight);
  const dotSize = cellSize * (1 - gapRatio);
  const gap = cellSize * gapRatio;

  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  const remainingWidth = availableWidth - gridWidth;
  const startX = sidePadding + remainingWidth / 2;
  const startY =
    topOffset + topPadding + (availableHeight - gridHeight) / 2;

  if (settings.showLabels) {
    const fontSize = Math.round(cellSize * 0.55);
    const titleFontSize = Math.round(device.width * 0.016);
    ctx.fillStyle = colors.text;
    ctx.globalAlpha = 0.4;

    ctx.save();
    ctx.font = `300 ${titleFontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("WEEK OF YEAR", startX + gridWidth / 2, startY - labelSpace * 0.6);
    ctx.restore();

    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const weekLabels = [1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52];
    for (const week of weekLabels) {
      const col = week - 1;
      ctx.fillText(
        week.toString(),
        startX + col * cellSize + cellSize / 2,
        startY - fontSize * 0.2
      );
    }

    ctx.save();
    ctx.font = `300 ${titleFontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(
      startX - labelSpace - axisTitleSpace * 0.6,
      startY + gridHeight / 2
    );
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("AGE", 0, 0);
    ctx.restore();

    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let age = 10; age <= settings.lifeExpectancy; age += 10) {
      const row = age;
      if (row < rows) {
        ctx.fillText(
          age.toString(),
          startX - fontSize * 0.4,
          startY + row * cellSize + cellSize / 2
        );
      }
    }

    ctx.globalAlpha = 1;
  }

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

  return canvas.toBuffer("image/png");
}

// ✅ FIXED: GET /api/wallpaper?token=...
wallpaperRouter.get("/", async (c) => {
  const token = c.req.query("token");

  if (!token) {
    return c.json(
      { error: { message: "Missing token", code: "MISSING_TOKEN" } },
      400
    );
  }

  const settings = decodeToken(token);

  if (!settings) {
    return c.json(
      { error: { message: "Invalid token", code: "INVALID_TOKEN" } },
      400
    );
  }

  try {
    const imageBuffer = generateWallpaper(settings);

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="memento-mori.png"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Wallpaper generation error:", error);
    return c.json(
      { error: { message: "Failed to generate wallpaper", code: "GENERATION_ERROR" } },
      500
    );
  }
});

// POST /api/wallpaper/token (unchanged)
wallpaperRouter.post("/token", async (c) => {
  try {
    const body = await c.req.json();
    const settings = WallpaperSettingsSchema.parse(body);

    const token = Buffer.from(JSON.stringify(settings)).toString("base64url");

    return c.json({ data: { token } });
  } catch {
    return c.json(
      { error: { message: "Invalid settings", code: "INVALID_SETTINGS" } },
      400
    );
  }
});

export { wallpaperRouter };

