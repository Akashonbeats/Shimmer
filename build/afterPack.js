// Compile the macOS haptics Swift helper into the app bundle during packaging
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") return;
  const appName = context.packager.appInfo.productFilename;
  const resourcesDir = path.join(
    context.appOutDir,
    `${appName}.app`,
    "Contents",
    "Resources"
  );
  const src = path.join(
    context.packager.projectDir,
    "native",
    "macos",
    "HapticCli.swift"
  );
  const out = path.join(resourcesDir, "HapticCli");

  // Ensure Resources directory exists
  fs.mkdirSync(resourcesDir, { recursive: true });

  await new Promise((resolve) => {
    exec(`xcrun swiftc "${src}" -o "${out}"`, (err, _stdout, stderr) => {
      if (err) {
        console.error("afterPack haptics compile error:", err?.message || err);
        if (stderr) console.error(stderr);
      } else {
        try {
          fs.chmodSync(out, 0o755);
        } catch (_) {}
      }
      resolve();
    });
  });
};
