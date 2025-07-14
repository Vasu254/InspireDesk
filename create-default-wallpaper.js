const sharp = require("sharp");

// Create a simple default wallpaper
const createDefaultWallpaper = async () => {
  try {
    await sharp({
      create: {
        width: 1920,
        height: 1080,
        channels: 3,
        background: { r: 102, g: 126, b: 234 },
      },
    })
      .png()
      .toFile("default_wallpaper.jpg");

    console.log("✅ Default wallpaper created successfully!");
  } catch (error) {
    console.error("❌ Error creating default wallpaper:", error);
  }
};

createDefaultWallpaper();
