const sharp = require("sharp");
const wallpaper = require("wallpaper");
const path = require("path");

const updateWallpaper = async (goals, settings = {}) => {
  try {
    // Default settings
    const {
      textColor = "#ffffff",
      textSize = 32,
      backgroundType = "default",
    } = settings;

    // Format goals text
    const goalsText = goals
      .map((goal, index) => `${index + 1}. ${goal}`)
      .join("\n");

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
            channels: 3,
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
          channels: 3,
          background: colors[backgroundType] || "#667eea",
        },
      });
    }

    // Create SVG with goals text
    const svgText = `
      <svg width="1800" height="1000">
        <defs>
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
        </defs>
        <text x="60" y="80" class="date">Daily Goals - ${new Date().toLocaleDateString()}</text>
        ${goalsText
          .split("\n")
          .map(
            (line, index) =>
              `<text x="60" y="${
                140 + index * (textSize + 10)
              }" class="title">${line}</text>`
          )
          .join("")}
      </svg>
    `;

    const svgBuffer = Buffer.from(svgText);

    // Composite the text onto the background
    const outputPath = path.join(process.cwd(), "current_wallpaper.jpg");

    await backgroundImage
      .composite([
        {
          input: svgBuffer,
          top: 100,
          left: 60,
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
    throw error;
  }
};

module.exports = { updateWallpaper };
