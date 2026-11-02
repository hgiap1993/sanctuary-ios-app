/**
 * Generates `expo-store-app/sanctuaryHtml.js` from `../www/index.html` (V5.8) and `../ios-storekit-bridge.js`
 * in 100% READ-ONLY mode (never modifies any file outside `expo-store-app`).
 *
 * Automatically strips all Web-only payment/install elements (Gumroad Overlay, Stripe/Gumroad URLs,
 * License Keys, Gift Pass, Simulated Apple Pay Sheet, Web Install Guide, Exit-Intent PWA Popup,
 * Buy Us a Coffee / Donate drawers, Anti-Tamper Debugger Traps, and Dev Mode toggles) for 100%
 * Google Play Store & Apple App Store compliance, and inlines `ios-storekit-bridge.js` for 100% offline reliability.
 */
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const wwwIndexFile = path.join(rootDir, "www", "index.html");
const fallbackIndexFile = path.join(rootDir, "index.html");
const sourceIndexFile = fs.existsSync(wwwIndexFile) ? wwwIndexFile : fallbackIndexFile;

// READ-ONLY: Never write back to sourceIndexFile or ../www/index.html
let html = fs.readFileSync(sourceIndexFile, "utf8");
let bridgeJs = fs.readFileSync(path.join(rootDir, "ios-storekit-bridge.js"), "utf8");

function removeBetweenMarkers(source, startMarker, endMarker) {
  const s = source.indexOf(startMarker);
  const e = source.indexOf(endMarker);
  if (s !== -1 && e !== -1 && e > s) {
    return source.slice(0, s) + source.slice(e);
  }
  return source;
}

// 0. Strip Web-only GTM, Anti-Tamper Domain Lock / Debugger Trap, Gumroad Script & Meta Pixel from <head>
html = removeBetweenMarkers(
  html,
  "<!-- Google Tag Manager (GTM-PJRPDQJQ) -->",
  "<meta charset=\"UTF-8\" />"
);
html = removeBetweenMarkers(
  html,
  "<!-- Google tag (gtag.js) - Google Analytics 4 (G-R0J6PEDB30) -->",
  "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">"
);
html = removeBetweenMarkers(
  html,
  "<!-- Google Tag Manager (noscript) -->",
  "<!-- Desktop Controls Bar"
);

// Provide safe no-op tracking helper so existing calls never throw
html = html.replace(
  "<meta charset=\"UTF-8\" />",
  "<meta charset=\"UTF-8\" />\n  <script>window.trackSanctuaryMarketingEvent = function() {};</script>"
);

// Ensure .ios-push-banner never peeks out at the top edge when hidden
html = html.replace(
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

// 1. Remove Website-Only Install Buttons & Install Guide Drawer (#installAppDrawer)
html = html.replace(
  /<button class="bar-btn" id="installBtnDesktop"[\s\S]*?<\/button>/,
  ""
);
html = html.replace(
  /<button class="icon-btn" id="webBrowserSaveAppBtn"[\s\S]*?<\/button>/,
  ""
);
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

// 2. Transform Buy Us a Coffee / Creator Tip Jar for 100% Apple App Store & Google Play Compliance (Guideline 3.1.1 & 3.2.1)
html = html.replace(
  /🕊️ <strong>Spread the Gospel:<\/strong> Help us share Jesus's Words with weary souls worldwide\./g,
  "☕ <strong>Buy Us a Coffee:</strong> Support the creators &amp; light a 24h Supporter Candle."
);
html = html.replace(
  /☕ Just want to bless the ministry\? Send a \$3\+ Gospel Offering →/g,
  "☕ Want to support the creators? Buy Us a Coffee (+100 Grace) →"
);
html = removeBetweenMarkers(
  html,
  "<!-- Drawer 12: ☕ Buy Us a Coffee",
  "<!-- iOS Bottom Sanctuary Navigation Dock"
);
html = html.replace(
  "<!-- iOS Bottom Sanctuary Navigation Dock",
  `<!-- Drawer 12: ☕ Buy Us a Coffee & Creator Tip Jar (100% Native StoreKit Compliant) -->
      <div class="library-drawer" id="donateGospelDrawer">
        <div class="drawer-header">
          <div>
            <div class="sanctuary-subtitle" id="donatePromptReasonSub">☕ Creator Tip Jar • Support Sanctuary</div>
            <h2 style="font-family:'Cinzel',serif; font-size:16.5px; color:var(--gold-bright);">☕ Buy Us a Coffee</h2>
          </div>
          <button class="icon-btn" onclick="closeAllDrawers()">✕ Close</button>
        </div>

        <div class="drawer-list" style="gap:10px; justify-content:space-between;">
          <div style="background:radial-gradient(circle at 50% 15%, rgba(212,175,55,0.22), rgba(22,15,8,0.96)); border:1.5px solid rgba(255,217,125,0.48); border-radius:16px; padding:14px 14px 12px; text-align:center; box-shadow:0 10px 28px rgba(0,0,0,0.65);">
            <div style="font-size:34px; line-height:1.1; margin-bottom:6px; filter:drop-shadow(0 0 14px rgba(255,215,0,0.55));">☕🕊️✨</div>
            <div style="font-family:'Cinzel',serif; font-size:14.5px; font-weight:700; color:#fff8e7; line-height:1.35; margin-bottom:6px;">
              Support the Sanctuary Development Team
            </div>
            <p style="font-size:13.5px; color:#f3e5c8; line-height:1.45; margin-bottom:8px;">
              Buying our small team a coffee helps us maintain Sanctuary, compose peaceful harp &amp; night rain soundscapes, and keep daily scripture readings running smoothly.
            </p>
            <div style="background:rgba(0,0,0,0.42); border:1px solid rgba(212,175,55,0.32); border-radius:11px; padding:7px 10px; font-style:italic; font-size:13px; color:var(--gold-bright);">
              “Every good and perfect gift is from above.” — James 1:17
            </div>
          </div>

          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(212,175,55,0.28); border-radius:13px; padding:10px 12px; font-size:12.5px; color:var(--text-light); line-height:1.5;">
            <div style="font-family:'Cinzel',serif; font-size:10.5px; color:var(--gold-bright); font-weight:700; margin-bottom:4px;">
              🌟 SUPPORTER REWARDS INCLUDED:
            </div>
            <div>✅ Support <strong>New Angelic Voices &amp; Sleep Soundscapes</strong></div>
            <div>✅ Light a <strong>🕯️ 24-Hour Sanctuary Supporter Candle</strong> &amp; earn <strong>+100 Grace</strong></div>
            <div>✅ Includes <strong>30-Day Sanctuary Pass VIP Access</strong> when supporting via App Store</div>
          </div>

          <div style="background:linear-gradient(135deg, rgba(212,175,55,0.18), rgba(32,22,10,0.95)); border:1.5px solid #ffd97d; border-radius:15px; padding:14px;">
            <button class="btn-sacred btn-primary-gold" id="mainDonateGospelBtn" style="width:100%; padding:13px 14px; font-size:13.5px; box-shadow:0 6px 20px rgba(212,175,55,0.38); font-weight:700;" onclick="handleDonateGospelClick()">
              ☕ Buy Us a Coffee &amp; Unlock 30-Day VIP ($2.99) →
            </button>
            <div style="font-size:11px; color:#e6d5b8; text-align:center; margin-top:7px;">
              🔒 Secure In-App Purchase • Instant +100 Grace &amp; 24h Supporter Candle
            </div>

            <div id="donateEmailReserveBox" style="margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,217,125,0.28);">
              <div style="font-size:12px; color:#fde68a; margin-bottom:6px; line-height:1.35; text-align:center;">
                🕊️ <strong>Leave a Prayer Intention or Email:</strong> Light your Free 24h Sanctuary Candle (+100 Grace) &amp; receive our daily morning blessing:
              </div>
              <div style="display:flex; gap:6px;">
                <input type="text" id="donatePatronEmailInput" class="search-input" placeholder="Your email or prayer intention..." style="flex:1; margin-bottom:0; padding:8px 10px; font-size:13px;" />
                <button class="btn-sacred btn-primary-gold" style="padding:8px 12px; font-size:11px; white-space:nowrap;" onclick="submitDonatePledgeEmail()">
                  🙏 Bless (+100)
                </button>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <button class="btn-sacred btn-secondary-outline" style="flex:1; font-size:11px; padding:8px;" onclick="openViralShareDrawer()">
              📲 Share a Verse Free (+30 Grace)
            </button>
            <button class="btn-sacred btn-secondary-outline" style="flex:1; font-size:11px; padding:8px; color:var(--text-muted); border-color:rgba(255,255,255,0.18);" onclick="closeAllDrawers()">
              Continue to Sanctuary →
            </button>
          </div>
        </div>
      </div>

      <!-- iOS Bottom Sanctuary Navigation Dock`
);

// 3. Remove Exit-Intent PWA Install Prompt Modal (#sanctuaryExitPromptModal)
html = removeBetweenMarkers(
  html,
  "<!-- Exit-Intent PWA Install Prompt Modal",
  "<!-- Custom Floating Sacred Hammer -->"
);

// 4. Remove Simulated / Direct Web Checkout Sheet (#applePaySheet) on Native Builds
html = removeBetweenMarkers(
  html,
  "<!-- Secure Direct Web Checkout / StoreKit Sheet",
  '<button class="btn-sacred btn-primary-gold" id="mainSubscribeBtn"'
);
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

// 5. Keep Buy Us a Coffee row (#webPaywallDonateRow), remove Web-only Gift Pass, VIP License Key Input, and Dev Web Checkout Box
html = removeBetweenMarkers(
  html,
  '<div id="webGiftPassWrapper"',
  '<div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted); padding:4px 4px 0;">'
);

// 6. Remove Dev Switch Free/VIP link, Secret Dev Tap handler, and normalize Web-only promo labels to Apple StoreKit 2 labels
html = html.replace(
  /<span id="devSwitchVipLink"[\s\S]*?<\/span>/,
  ""
);
html = html.replace(
  'onclick="handleSecretDevTap()" title="Tap 5 times for StoreKit / RevenueCat Dev Settings"',
  ""
);
html = html.replace(
  'onclick="closePaywallDrawerWithDonateCheck()"',
  'onclick="closeAllDrawers()"'
);
html = html.replace(
  "SAVE 50% WEB SPECIAL • 7-DAY FREE TRIAL",
  "BEST VALUE • 7-DAY FREE TRIAL"
);
html = html.replace(
  "SAVE 50% WEB SPECIAL • MOST POPULAR ($1.66/MO)",
  "BEST VALUE • 7-DAY FREE TRIAL"
);
html = html.replace(
  "Full 365-Day VIP Access • Only $1.66/month ($19.99/yr)",
  "7 days free ($0 today), then $19.99/yr ($1.66/mo)"
);
html = html.replace(
  /✨ Unlock 1-Year Sanctuary Pass \(50% Off • \$19\.99\) →/g,
  "✨ Start 7-Day Free Trial ($19.99/yr) →"
);
html = html.replace(
  /<span style="text-decoration:line-through; color:var\(--text-muted\); font-size:11px; margin-right:3px;">\$(?:39|99|7)\.99<\/span>/g,
  ""
);

// 7. Replace Web Gumroad Overlay JS functions with Native StoreKit Buy Us a Coffee & Supporter functions
html = removeBetweenMarkers(
  html,
  "function closePaywallDrawerWithDonateCheck()",
  "document.addEventListener(\"keydown\", (e) => {"
);
html = html.replace(
  "document.addEventListener(\"keydown\", (e) => {",
  `function closePaywallDrawerWithDonateCheck() {
      closeAllDrawers();
    }

    function openDonateGospelDrawer(source) {
      closeAllDrawers();
      const subEl = document.getElementById("donatePromptReasonSub");
      if (subEl) {
        subEl.textContent = source === "candles_altar"
          ? "🕯️ 24-Hour Sanctuary Altar • Creator Tip Jar"
          : "☕ Creator Tip Jar • Support Sanctuary";
      }
      const drawer = document.getElementById("donateGospelDrawer");
      if (drawer) drawer.classList.add("open");
      playCathedralBellChime();
    }

    function rewardGospelPatronBlessing() {
      addGracePoints(100);
      playCathedralBellChime();
      activeCandles.unshift({
        intention: "🕯️ Sanctuary Supporter — Spreading Peace & Light",
        time: "24h 00m left"
      });
      try {
        localStorage.setItem("sacred_candles", JSON.stringify(activeCandles));
      } catch (e) {}
      if (typeof renderCandlesAltar === "function") {
        renderCandlesAltar();
      }
    }

    async function handleDonateGospelClick() {
      const bridge = window.SacredIOSBridge;
      if (bridge && typeof bridge.purchasePlan === "function") {
        const res = await bridge.purchasePlan("coffee");
        if (res && res.success) {
          isSanctuaryVIP = true;
          selectedPaywallPlan = res.planType || "monthly";
          saveSubscriptionState();
          updateSubscriptionUI();
          rewardGospelPatronBlessing();
          closeAllDrawers();
          triggerSanctuaryNotification(
            "☕ Thank You for Supporting Sanctuary! (+100 Grace)",
            "Your 24-Hour Supporter Candle is lit on the Altar and 30-Day Sanctuary Pass VIP is unlocked!"
          );
          return;
        }
        if (res && res.cancelled) {
          return;
        }
      }
      const input = document.getElementById("donatePatronEmailInput");
      if (input) input.focus();
    }

    async function submitDonatePledgeEmail() {
      const input = document.getElementById("donatePatronEmailInput");
      const val = input ? input.value.trim() : "";
      if (!val) {
        triggerSanctuaryNotification(
          "🕊️ Enter Email or Prayer Intention",
          "Please enter your email or prayer intention below to light your Free 24-Hour Sanctuary Candle (+100 Grace)!"
        );
        return;
      }
      try {
        const list = JSON.parse(localStorage.getItem("sacred_donate_pledges_v1") || "[]");
        list.push({ contact: val, ts: new Date().toISOString() });
        localStorage.setItem("sacred_donate_pledges_v1", JSON.stringify(list));
      } catch (e) {}

      if (val.includes("@")) {
        try {
          fetch("https://sanctuaryjesus.com/api/push/email-subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: val.toLowerCase(),
              source: "gospel_donate_pledge",
              tzOffset: new Date().getTimezoneOffset()
            })
          }).catch(() => {});
          localStorage.setItem("sacred_daily_email_v1", val.toLowerCase());
          localStorage.setItem("sacred_morning_subscribed_email", val.toLowerCase());
        } catch (e) {}
      }

      if (input) input.value = "";
      rewardGospelPatronBlessing();
      closeAllDrawers();
      triggerSanctuaryNotification(
        "🕯️ 24-Hour Sanctuary Candle Lit! (+100 Grace)",
        "Amen! Your prayer intention is inscribed on the Sanctuary Altar."
      );
    }

    document.addEventListener("keydown", (e) => {`
);

// 8. Strip Web-only Checkout Reservation, License Key Redemption & Dev Mode functions
html = removeBetweenMarkers(
  html,
  "function refreshRevenueCatStatusUI()",
  "function openPaywallDrawer(reason)"
);
html = html.replace(
  "refreshRevenueCatStatusUI();",
  ""
);
html = removeBetweenMarkers(
  html,
  "function selectPaywallPlan(plan)",
  "async function showApplePaySheet()"
);
html = html.replace(
  "async function showApplePaySheet()",
  `function selectPaywallPlan(plan) {
      selectedPaywallPlan = plan || "annual";
      const isAnnual = (selectedPaywallPlan === "annual" || selectedPaywallPlan === "yearly");
      const isLifetime = (selectedPaywallPlan === "lifetime");
      const isMonthly = (selectedPaywallPlan === "monthly");
      const annualCard = document.getElementById("planAnnual");
      const lifetimeCard = document.getElementById("planLifetime");
      const monthlyCard = document.getElementById("planMonthly");
      if (annualCard) annualCard.classList.toggle("selected", isAnnual);
      if (lifetimeCard) lifetimeCard.classList.toggle("selected", isLifetime);
      if (monthlyCard) monthlyCard.classList.toggle("selected", isMonthly);
      updateSubscriptionUI();
    }

    async function showApplePaySheet()`
);

// 9. Strip Web Checkout Redirect params & PWA Exit-Intent JS engines inside Native WebView
html = removeBetweenMarkers(
  html,
  "// 1. Check if buyer returned from Stripe",
  "// 5. Check if opened from Evening Sleep Push Notification"
);
html = removeBetweenMarkers(
  html,
  "// 19. SMART PWA HOME SCREEN INSTALL ENGINE",
  "// Live Sanctuary Community Fellowship Ticker"
);
html = html.replace(
  "initSmartInstallBanner();",
  ""
);
html = html.replace(
  "initExitIntentSystem();",
  ""
);

// 10. Fix active VIP button so real subscribers never accidentally toggle off their VIP status
html = html.replace(
  `if (subscribeBtn) {
          subscribeBtn.textContent = isLifetimeVIP
            ? "👑 Lifetime Sanctuary Pass Active (Tap to Test Free Tier)"
            : "✅ Sanctuary Pass Active (Tap to Test Free Tier)";
          subscribeBtn.onclick = toggleVIPStatusDirectly;
        }`,
  `if (subscribeBtn) {
          subscribeBtn.textContent = isLifetimeVIP
            ? "👑 Lifetime Sanctuary Pass Active"
            : "✅ Sanctuary Pass VIP Active";
          subscribeBtn.onclick = null;
        }`
);

// 11. Ensure Cloudflare Email / Push API endpoints use absolute https://sanctuaryjesus.com URL inside native WebView
html = html.replace(
  'const CLOUDFLARE_PUSH_API_BASE = "/api/push";',
  'const CLOUDFLARE_PUSH_API_BASE = "https://sanctuaryjesus.com/api/push";'
);
html = html.replace(
  /fetch\("\/api\/push\/email-subscribe"/g,
  'fetch("https://sanctuaryjesus.com/api/push/email-subscribe"'
);

// 12. Prevent Service Worker from caching stale HTML inside ReactNativeWebView
html = html.replace(
  /if\s*\("serviceWorker"\s*in\s*navigator\s*&&\s*location\.protocol\.startsWith\("http"\)\)\s*\{[\s\S]*?\}\s*\}/,
  `if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !window.ReactNativeWebView) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").then((reg) => {
          reg.update().catch(() => {});
        }).catch(() => {});
      });
    }`
);

// 13. Clean web checkout URLs, comments, and license key bypass from inlined ios-storekit-bridge.js
bridgeJs = bridgeJs.replace(/\/\*[\s\S]*?\*\//g, "");
bridgeJs = bridgeJs.replace(/^\s*\/\/.*$/gm, "");
bridgeJs = bridgeJs.replace(
  /const DEFAULT_WEB_CHECKOUT_URLS = \{[\s\S]*?\};/,
  "const DEFAULT_WEB_CHECKOUT_URLS = {};"
);
bridgeJs = bridgeJs.replace(
  /verifyLicenseCode\(rawCode\)\s*\{[\s\S]*?\},\s*setCustomApiKey/,
  "setCustomApiKey"
);
bridgeJs = removeBetweenMarkers(
  bridgeJs,
  "const webUrls = getWebCheckoutUrls();",
  "return { handled: false, productId, planType: normalizedPlan };"
);

// 14. Inline cleaned bridge directly so StoreKit / Play Billing works 100% offline
html = html.replace(
  '<script src="./ios-storekit-bridge.js" onerror=""></script>',
  `<script>\n${bridgeJs}\n</script>`
);

// 15. Validate all <script> blocks inside generated HTML before saving
const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
scriptBlocks.forEach((match, idx) => {
  try {
    new Function(match[1]);
  } catch (err) {
    console.error(`❌ Syntax error in <script> block #${idx + 1}:`, err.message);
    process.exit(1);
  }
});

const outPath = path.join(__dirname, "sanctuaryHtml.js");
fs.writeFileSync(outPath, `export const SANCTUARY_HTML = ${JSON.stringify(html)};\n`, "utf8");
console.log("✅ Verified JS syntax (" + scriptBlocks.length + " script blocks) & generated Store-compliant sanctuaryHtml.js (" + html.length + " chars)");
