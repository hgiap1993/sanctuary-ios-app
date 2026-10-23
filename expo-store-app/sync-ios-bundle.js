/**
 * Generates `expo-store-app/sanctuaryHtml.js` from the master `index.html` and `ios-storekit-bridge.js`,
 * automatically stripping all Web-only payment/install elements (License Keys, Gift Pass, Simulated Apple Pay Sheet,
 * Web Install Guide, Buy Us a Coffee web drawer, and Dev Mode toggles) for 100% Apple App Store & Google Play Store
 * compliance, and inlining `ios-storekit-bridge.js` for 100% offline StoreKit / Play Billing reliability.
 */
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const indexFile = path.join(rootDir, "index.html");
let masterHtml = fs.readFileSync(indexFile, "utf8");

// Ensure .ios-push-banner never peeks out at the top edge when hidden
masterHtml = masterHtml.replace(
  /\.ios-push-banner\s*\{[\s\S]*?\.ios-push-banner\.show\s*\{[\s\S]*?\}/,
  `.ios-push-banner {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      background: rgba(28, 20, 12, 0.96);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 217, 125, 0.55);
      border-radius: 22px;
      padding: 12px 14px;
      z-index: 150;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(212, 175, 55, 0.28);
      transform: translateY(-220%);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
      cursor: pointer;
    }

    .ios-push-banner.show {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }`
);

// Ensure maybeShowDonatePrompt never triggers inside native App Store / Google Play WebView
if (!masterHtml.includes("if (window.ReactNativeWebView")) {
  masterHtml = masterHtml.replace(
    "function maybeShowDonatePrompt(reasonSource) {",
    "function maybeShowDonatePrompt(reasonSource) {\n      if (window.ReactNativeWebView || (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) return false;"
  );
}

// Prevent Service Worker from caching stale HTML inside ReactNativeWebView
masterHtml = masterHtml.replace(
  /if\s*\("serviceWorker"\s*in\s*navigator\s*&&\s*location\.protocol\.startsWith\("http"\)\)\s*\{[\s\S]*?\}\s*\}/,
  `if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      if (window.ReactNativeWebView) {
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
      } else {
        window.addEventListener("load", () => {
          navigator.serviceWorker.register("./sw.js").then((reg) => {
            reg.update().catch(() => {});
          }).catch(() => {});
        });
      }
    }`
);

fs.writeFileSync(indexFile, masterHtml, "utf8");
if (fs.existsSync(path.join(rootDir, "www"))) {
  fs.writeFileSync(path.join(rootDir, "www", "index.html"), masterHtml, "utf8");
}

let html = masterHtml;
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
  "<!-- Sacred 2-Step Personalization Intro"
);
html = removeBetweenMarkers(
  html,
  "<!-- Drawer 12: Website-Only Install Guide",
  "<!-- Sacred 3-Step Onboarding"
);

// 2. Remove Website-Only Buy Us a Coffee Drawer (#donateGospelDrawer) on Native Store Builds
html = removeBetweenMarkers(
  html,
  "<!-- Drawer 12: ☕ Buy Us a Coffee",
  "<!-- iOS Bottom Sanctuary Navigation Dock"
);

// 3. Remove Simulated HTML Apple Pay Sheet (#applePaySheet) on Native iOS/Android
html = removeBetweenMarkers(
  html,
  "<!-- Simulated / Native iOS StoreKit 2 & Apple Pay Sheet -->",
  '<button class="btn-sacred btn-primary-gold" id="mainSubscribeBtn"'
);
html = removeBetweenMarkers(
  html,
  "<!-- Native Google Play Billing / Google Pay & iOS StoreKit 2 Sheet -->",
  '<button class="btn-sacred btn-primary-gold" id="mainSubscribeBtn"'
);

// 4. Remove Website Gift Pass, VIP License Key Input, and Dev Web Checkout Box
html = removeBetweenMarkers(
  html,
  "<!-- Gift a Sanctuary Pass to Family / Friends",
  '<div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted); padding:4px 4px 0;">'
);

// 5. Remove Dev Switch Free/VIP link
html = html.replace(
  /<span id="devSwitchVipLink"[\s\S]*?<\/span>/,
  ""
);

// 6. Inline ios-storekit-bridge.js directly so StoreKit / Play Billing works 100% offline inside the native WebView
html = html.replace(
  '<script src="./ios-storekit-bridge.js" onerror=""></script>',
  `<script>\n${bridgeJs}\n</script>`
);

const outPath = path.join(__dirname, "sanctuaryHtml.js");
fs.writeFileSync(outPath, `export const SANCTUARY_HTML = ${JSON.stringify(html)};\n`, "utf8");
console.log("✅ Synced master index.html & generated Store-compliant sanctuaryHtml.js (" + html.length + " chars)");
