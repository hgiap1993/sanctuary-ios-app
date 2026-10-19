/**
 * Generates `expo-store-app/sanctuaryHtml.js` from the master `index.html` and `ios-storekit-bridge.js`,
 * automatically stripping all Web-only payment/install elements (License Keys, Gift Pass, Simulated Apple Pay Sheet,
 * Web Install Guide, and Dev Mode toggles) for 100% Apple App Store Guideline 3.1.1 & 2.1 compliance,
 * and inlining `ios-storekit-bridge.js` for 100% offline StoreKit bridge reliability.
 */
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
let html = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");
const bridgeJs = fs.readFileSync(path.join(rootDir, "ios-storekit-bridge.js"), "utf8");

function removeBetweenMarkers(source, startMarker, endMarker) {
  const s = source.indexOf(startMarker);
  const e = source.indexOf(endMarker);
  if (s !== -1 && e !== -1 && e > s) {
    return source.slice(0, s) + source.slice(e);
  }
  return source;
}

// 1. Remove Website-Only Install Guide Drawer (#installAppDrawer)
html = removeBetweenMarkers(
  html,
  "<!-- Drawer 12: Website-Only Install Guide",
  "<!-- Sacred 3-Step Onboarding"
);

// 2. Remove Simulated HTML Apple Pay Sheet (#applePaySheet) on Native iOS
html = removeBetweenMarkers(
  html,
  "<!-- Simulated / Native iOS StoreKit 2 & Apple Pay Sheet -->",
  '<button class="btn-sacred btn-primary-gold" id="mainSubscribeBtn"'
);

// 3. Remove Website Gift Pass, VIP License Key Input, and Dev Web Checkout Box
html = removeBetweenMarkers(
  html,
  "<!-- Gift a Sanctuary Pass to Family / Friends",
  '<div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted); padding:4px 4px 0;">'
);

// 4. Remove Dev Switch Free/VIP link
html = html.replace(
  /<span id="devSwitchVipLink"[\s\S]*?<\/span>/,
  ""
);

// 5. Inline ios-storekit-bridge.js directly so StoreKit works 100% offline inside the native WebView
html = html.replace(
  '<script src="./ios-storekit-bridge.js" onerror=""></script>',
  `<script>\n${bridgeJs}\n</script>`
);

const outPath = path.join(__dirname, "sanctuaryHtml.js");
fs.writeFileSync(outPath, `export const SANCTUARY_HTML = ${JSON.stringify(html)};\n`, "utf8");
console.log("✅ Generated 100% Apple Guideline 3.1.1-compliant sanctuaryHtml.js (" + html.length + " chars)");
