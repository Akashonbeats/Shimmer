// afterPack hook to ensure dynamic macOS icon asset catalog & fallback icon are present pre-signing.
// Runs only for macOS builds.

const fs = require("fs");
const path = require("path");

/**
 * @param {import('electron-builder').AfterPackContext} context
 */
module.exports = async function afterPack(context) {
  const { electronPlatformName, appOutDir, packager } = context;
  if (electronPlatformName !== "darwin") return;

  const appName = packager.appInfo.productFilename;
  const contentsDir = path.join(appOutDir, `${appName}.app`, "Contents");
  const resourcesDir = path.join(contentsDir, "Resources");
  if (!fs.existsSync(resourcesDir))
    fs.mkdirSync(resourcesDir, { recursive: true });

  const projectRoot = path.resolve(__dirname, "..");
  let pkg;
  try {
    pkg = require(path.join(projectRoot, "package.json"));
  } catch {
    pkg = {};
  }
  const configuredIconRel = pkg?.build?.mac?.icon; // e.g. build/mac/Shimmer.icns
  const configuredIconAbs = configuredIconRel
    ? path.join(projectRoot, configuredIconRel)
    : null;

  const bundleIconName =
    pkg?.build?.mac?.extendInfo?.CFBundleIconName || "Shimmer";

  const sourceAssetsCar = path.join(
    path.resolve(__dirname, "mac"),
    "Assets.car"
  );
  const destAssetsCar = path.join(resourcesDir, "Assets.car");
  const destIcns = path.join(resourcesDir, `${bundleIconName}.icns`);

  const copyIfMissing = (src, dest, label) => {
    try {
      if (fs.existsSync(dest)) return;
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`[afterPack] Copied ${label}`);
      } else console.warn(`[afterPack] Missing ${label} at ${src}`);
    } catch (e) {
      console.error(`[afterPack] Failed copy ${label}:`, e);
    }
  };

  copyIfMissing(sourceAssetsCar, destAssetsCar, "Assets.car");

  if (configuredIconAbs) {
    try {
      if (!fs.existsSync(configuredIconAbs))
        console.warn(
          `[afterPack] Configured mac.icon not found: ${configuredIconAbs}`
        );
      else {
        fs.copyFileSync(configuredIconAbs, destIcns);
        console.log(
          `[afterPack] Synced fallback icon -> Resources/${bundleIconName}.icns`
        );
      }
    } catch (e) {
      console.error("[afterPack] Failed syncing fallback icon:", e);
    }
  } else {
    console.warn(
      "[afterPack] No build.mac.icon configured in package.json; cannot sync fallback icon."
    );
  }

  const plistPath = path.join(contentsDir, "Info.plist");
  try {
    if (fs.existsSync(plistPath)) {
      const plistData = fs.readFileSync(plistPath, "utf8");
      if (
        !new RegExp(
          `<key>CFBundleIconName</key>\\s*<string>${bundleIconName}</string>`
        ).test(plistData)
      ) {
        console.warn(
          `[afterPack] CFBundleIconName=${bundleIconName} missing. Ensure extendInfo configured.`
        );
      }
    }
  } catch (e) {
    console.warn("[afterPack] Could not validate Info.plist:", e);
  }
};
