const sharp = require("sharp");
const wallpaper = require("wallpaper");
const path = require("path");
const fs = require("fs");

async function updateWallpaper(goals, settings = {}) {
  try {
    if (!goals || !Array.isArray(goals)) {
      throw new Error("Invalid goals data");
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Default settings
    const {
      textColor = "#ffffff",
      textSize = 32,
      backgroundType = "default",
    } = settings;

    // Create SVG text
    const svgContent = `
      <svg width="1920" height="1080">
        <style>
          .title { 
            fill: ${textColor}; 
            font-size: ${textSize}px; 
            font-family: 'Segoe UI', Arial, sans-serif; 
            font-weight: bold;
          }
          .date { 
            fill: ${textColor}; 
            font-size: ${Math.floor(textSize * 0.6)}px; 
            font-family: 'Segoe UI', Arial, sans-serif; 
            opacity: 0.8;
          }
        </style>
        <text x="60" y="80" class="date">Daily Goals - ${new Date().toLocaleDateString()}</text>
        ${goals
          .map(
            (goal, index) =>
              `<text x="60" y="${
                140 + index * (textSize + 10)
              }" class="title">${index + 1}. ${goal}</text>`
          )
          .join("")}
      </svg>`;

    // Create background
    const colors = {
      gradient1: "#667eea",
      gradient2: "#f093fb",
      gradient3: "#4facfe",
      default: "#2c3e50",
    };

    const backgroundColor = colors[backgroundType] || colors.default;

    // Create the base image
    const image = sharp({
      create: {
        width: 1920,
        height: 1080,
        channels: 4,
        background: backgroundColor,
      },
    });

    // Add text overlay
    const outputPath = path.join(outputDir, "current_wallpaper.jpg");

    await image
      .composite([
        {
          input: Buffer.from(svgContent),
          top: 0,
          left: 0,
        },
      ])
      .jpeg()
      .toFile(outputPath);

    // Set as wallpaper
    await wallpaper.set(outputPath);

    return { success: true };
  } catch (error) {
    console.error("Error in updateWallpaper:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { updateWallpaper };
