const sharp = require("sharp");
const wallpaper = require("wallpaper");
const path = require("path");
const fs = require("fs");

const updateWallpaper = async (goals, settings = {}) => {
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

    // Validate settings
    if (!textColor || typeof textColor !== "string") {
      throw new Error("Invalid text color");
    }
    if (!textSize || typeof textSize !== "number") {
      throw new Error("Invalid text size");
    }

    // Create background based on type
    let backgroundImage;

    if (backgroundType === "default") {
      // Check if default wallpaper exists
      const defaultWallpaperPath = path.join(
        process.cwd(),
        "default_wallpaper.jpg"
      );
      try {
        backgroundImage = sharp(defaultWallpaperPath);
      } catch (error) {
        console.log(
          "Default wallpaper not found, creating gradient background"
        );
        backgroundImage = sharp({
          create: {
            width: 1920,
            height: 1080,
            channels: 4,
            background: "#667eea",
          },
        });
      }
    } else {
      // Create gradient backgrounds
      const colors = {
        gradient1: "#667eea",
        gradient2: "#f093fb",
        gradient3: "#4facfe",
      };

      backgroundImage = sharp({
        create: {
          width: 1920,
          height: 1080,
          channels: 4,
          background: colors[backgroundType] || "#667eea",
        },
      });
    }

    // Create SVG with goals text
    const svgText = `
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

    // Create temporary file path for the wallpaper
    const outputPath = path.join(outputDir, "current_wallpaper.jpg");

    // Create final image with text overlay
    await backgroundImage
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    // Set as wallpaper
    await wallpaper.set(outputPath);

    console.log("✅ Wallpaper updated successfully!");
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating wallpaper:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { updateWallpaper };
