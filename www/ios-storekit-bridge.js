/**
 * ============================================================================
 * THE TWELVE SACRED VESSELS — UNIVERSAL STOREKIT 2, REVENUECAT, WEB CHECKOUT & HAPTICS
 * ============================================================================
 * Automatically detects the runtime environment:
 * 1. Native iOS / Android Capacitor (`window.Capacitor.isNativePlatform()`)
 * 2. Native Expo / React Native WebView (`window.ReactNativeWebView`)
 * 3. Direct Web / PWA Checkout (LemonSqueezy, Gumroad, Stripe Payment Links, PayPal)
 * 4. Interactive StoreKit 2 Apple Pay Simulator (when no live key/URL is set yet)
 *
 * Product IDs configured in App Store Connect & Google Play Console:
 * - Annual ($19.99/yr + 7-Day Free Trial): com.sacredvessels.pass.yearly
 * - Monthly ($2.99/mo):                    com.sacredvessels.pass.monthly
 * - Lifetime ($49.99 One-Time Forever):    com.sacredvessels.pass.lifetime
 * - Gift Pass ($19.99 1-Year Gift):        com.sacredvessels.pass.gift1yr
 * - Entitlement Identifier in RevenueCat:  sanctuary_vip
 */

(function () {
  const DEFAULT_REVENUECAT_IOS_KEY = "appl_REPLACE_WITH_YOUR_REVENUECAT_IOS_KEY";
  const DEFAULT_REVENUECAT_ANDROID_KEY = "goog_REPLACE_WITH_YOUR_REVENUECAT_ANDROID_KEY";
  const ENTITLEMENT_ID = "sanctuary_vip";

  /**
   * DIRECT WEB / PWA PAYMENT LINKS (0% Apple/Google 30% Tax!)
   * Paste your LemonSqueezy, Gumroad, Stripe, or PayPal links here (or in the in-app Admin panel):
   */
  const DEFAULT_WEB_CHECKOUT_URLS = {
    annual: "",   // e.g. "https://yourstore.gumroad.com/l/sanctuary-yearly"
    lifetime: "", // e.g. "https://yourstore.gumroad.com/l/sanctuary-lifetime"
    monthly: "",  // e.g. "https://yourstore.gumroad.com/l/sanctuary-monthly"
    gift: ""      // e.g. "https://yourstore.gumroad.com/l/sanctuary-gift"
  };

  /**
   * VALID VIP LICENSE KEYS / PROMO CODES (for buyers who receive a code after web checkout)
   * Any code starting with "SANCTUARY-", "JESUS-", "ETERNAL-", or listed below unlocks VIP!
   */
  const MASTER_VIP_CODES = [
    "SANCTUARY-VIP-2026",
    "SANCTUARY-LIFETIME-777",
    "JESUS-WORDS-365",
    "FOUNDER-ETERNAL"
  ];

  const PRODUCT_IDS = {
    annual: "com.sacredvessels.pass.yearly",
    yearly: "com.sacredvessels.pass.yearly",
    monthly: "com.sacredvessels.pass.monthly",
    lifetime: "com.sacredvessels.pass.lifetime",
    gift: "com.sacredvessels.pass.gift1yr"
  };

  const isCapacitorNative = Boolean(
    window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === "function" &&
    window.Capacitor.isNativePlatform()
  );

  const isExpoReactNative = Boolean(
    window.ReactNativeWebView &&
    typeof window.ReactNativeWebView.postMessage === "function"
  );

  const isNativeApp = isCapacitorNative || isExpoReactNative;

  // Pending promise resolvers for Expo React Native WebView bridge
  const pendingNativeRequests = new Map();
  let reqCounter = 1;

  function getConfiguredApiKey() {
    try {
      const savedKey = localStorage.getItem("sacred_revenuecat_api_key");
      if (savedKey && savedKey.trim().length > 8) {
        return savedKey.trim();
      }
    } catch (e) {}
    const ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return DEFAULT_REVENUECAT_ANDROID_KEY;
    return DEFAULT_REVENUECAT_IOS_KEY;
  }

  function hasLiveRevenueCatKey() {
    const key = getConfiguredApiKey();
    return Boolean(
      key &&
      !key.includes("REPLACE_WITH_YOUR") &&
      (key.startsWith("appl_") || key.startsWith("goog_") || key.startsWith("rcb_"))
    );
  }

  function getWebCheckoutUrls() {
    try {
      const saved = JSON.parse(localStorage.getItem("sacred_web_checkout_urls_v1"));
      if (saved && typeof saved === "object") {
        return { ...DEFAULT_WEB_CHECKOUT_URLS, ...saved };
      }
    } catch (e) {}
    return { ...DEFAULT_WEB_CHECKOUT_URLS };
  }

  function sendToExpoNative(type, payload = {}, timeoutMs = 45000) {
    if (!isExpoReactNative) return Promise.resolve(null);
    return new Promise((resolve) => {
      const requestId = "rc_req_" + (reqCounter++) + "_" + Date.now();
      const timer = setTimeout(() => {
        if (pendingNativeRequests.has(requestId)) {
          pendingNativeRequests.delete(requestId);
          resolve(null);
        }
      }, timeoutMs);

      pendingNativeRequests.set(requestId, (result) => {
        clearTimeout(timer);
        resolve(result);
      });

      try {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            source: "SacredIOSBridge",
            requestId,
            type,
            payload
          })
        );
      } catch (e) {
        clearTimeout(timer);
        pendingNativeRequests.delete(requestId);
        resolve(null);
      }
    });
  }

  const SacredIOSBridge = {
    isNativeIOS: isNativeApp,
    isCapacitorNative,
    isExpoReactNative,
    PRODUCT_IDS,
    ENTITLEMENT_ID,

    getApiKey: getConfiguredApiKey,
    hasLiveKey: hasLiveRevenueCatKey,
    getWebCheckoutUrls,

    setWebCheckoutUrls(urlsObj) {
      try {
        localStorage.setItem("sacred_web_checkout_urls_v1", JSON.stringify(urlsObj || {}));
        return true;
      } catch (e) {
        return false;
      }
    },

    verifyLicenseCode(rawCode) {
      if (!rawCode) return { valid: false };
      const code = rawCode.trim().toUpperCase();
      const isLifetime =
        code.includes("LIFETIME") ||
        code.includes("ETERNAL") ||
        code.includes("FOUNDER") ||
        code.endsWith("-777");
      const isValid =
        MASTER_VIP_CODES.includes(code) ||
        code.startsWith("SANCTUARY-") ||
        code.startsWith("JESUS-") ||
        code.startsWith("ETERNAL-") ||
        (code.length >= 12 && /^[A-Z0-9-]{12,}$/.test(code)); // Supports Gumroad/LemonSqueezy license keys
      return {
        valid: isValid,
        plan: isLifetime ? "lifetime" : "annual"
      };
    },

    setCustomApiKey(newKey) {
      try {
        if (!newKey || !newKey.trim()) {
          localStorage.removeItem("sacred_revenuecat_api_key");
        } else {
          localStorage.setItem("sacred_revenuecat_api_key", newKey.trim());
        }
        this.initStoreKit();
        return true;
      } catch (e) {
        return false;
      }
    },

    // Called by Expo React Native WebView `injectJavaScript` when a native action completes
    handleNativeResponse(message) {
      try {
        const data = typeof message === "string" ? JSON.parse(message) : message;
        if (!data) return;

        if (data.requestId && pendingNativeRequests.has(data.requestId)) {
          const resolver = pendingNativeRequests.get(data.requestId);
          pendingNativeRequests.delete(data.requestId);
          resolver(data);
        }

        if (data.isVIP && typeof window.confirmApplePaySubscription === "function") {
          window.isSanctuaryVIP = true;
          if (data.plan) window.selectedPaywallPlan = data.plan;
          if (typeof window.saveSubscriptionState === "function") window.saveSubscriptionState();
          if (typeof window.updateSubscriptionUI === "function") window.updateSubscriptionUI();
        }
      } catch (err) {
        console.warn("[SacredIOSBridge] Failed to parse native response:", err);
      }
    },

    async initStoreKit() {
      const apiKey = getConfiguredApiKey();

      // 1. Expo / React Native Bridge
      if (isExpoReactNative) {
        const res = await sendToExpoNative("INIT_STOREKIT", {
          apiKey,
          entitlementId: ENTITLEMENT_ID,
          productIds: PRODUCT_IDS
        }, 8000);
        if (res && res.isVIP) {
          window.isSanctuaryVIP = true;
          if (typeof window.saveSubscriptionState === "function") window.saveSubscriptionState();
          if (typeof window.updateSubscriptionUI === "function") window.updateSubscriptionUI();
        }
        return;
      }

      // 2. Capacitor Native Bridge
      if (isCapacitorNative) {
        try {
          const Purchases = window.Capacitor.Plugins && window.Capacitor.Plugins.Purchases;
          if (!Purchases || !hasLiveRevenueCatKey()) return;

          await Purchases.configure({ apiKey });
          const { customerInfo } = await Purchases.getCustomerInfo();
          const isVIP = Boolean(
            customerInfo &&
            customerInfo.entitlements &&
            customerInfo.entitlements.active &&
            customerInfo.entitlements.active[ENTITLEMENT_ID]
          );

          if (isVIP) {
            window.isSanctuaryVIP = true;
            if (typeof window.saveSubscriptionState === "function") window.saveSubscriptionState();
            if (typeof window.updateSubscriptionUI === "function") window.updateSubscriptionUI();
          }
        } catch (err) {
          console.warn("[SacredIOSBridge] Capacitor StoreKit initialization note:", err);
        }
        return;
      }

      console.log("[SacredIOSBridge] Web/PWA mode active — Web Checkout & StoreKit 2 Simulator ready.");
    },

    /**
     * Triggers Native Purchase or Direct Web Checkout if configured.
     */
    async purchasePlan(planType) {
      const normalizedPlan = planType === "yearly" ? "annual" : (planType || "annual");
      const productId = PRODUCT_IDS[normalizedPlan] || PRODUCT_IDS.annual;

      // 1. Expo / React Native WebView with live RevenueCat
      if (isExpoReactNative && hasLiveRevenueCatKey()) {
        const res = await sendToExpoNative("PURCHASE_PLAN", {
          planType: normalizedPlan,
          productId,
          entitlementId: ENTITLEMENT_ID
        });
        if (res && res.handled) {
          return { handled: true, success: Boolean(res.success), planType: normalizedPlan };
        }
      }

      // 2. Capacitor Native with live RevenueCat
      if (isCapacitorNative && hasLiveRevenueCatKey()) {
        try {
          const Purchases = window.Capacitor.Plugins && window.Capacitor.Plugins.Purchases;
          if (Purchases) {
            const offerings = await Purchases.getOfferings();
            if (offerings && offerings.current) {
              let targetPackage = null;
              if (normalizedPlan === "lifetime") {
                targetPackage =
                  offerings.current.lifetime ||
                  (offerings.current.availablePackages || []).find(
                    (p) => p.identifier === "$rc_lifetime" || (p.product && p.product.identifier === productId)
                  );
              } else if (normalizedPlan === "monthly") {
                targetPackage = offerings.current.monthly;
              } else {
                targetPackage = offerings.current.annual;
              }

              if (targetPackage) {
                const { customerInfo } = await Purchases.purchasePackage({ aPackage: targetPackage });
                const unlocked = Boolean(
                  customerInfo &&
                  customerInfo.entitlements &&
                  customerInfo.entitlements.active &&
                  customerInfo.entitlements.active[ENTITLEMENT_ID]
                );
                return { handled: true, success: unlocked, planType: normalizedPlan };
              }
            }
          }
        } catch (err) {
          console.warn("[SacredIOSBridge] Native StoreKit purchase cancelled or failed:", err);
          return { handled: true, success: false, cancelled: true };
        }
      }

      // 3. Direct Web / PWA Checkout URL (Stripe / LemonSqueezy / Gumroad / PayPal)
      const webUrls = getWebCheckoutUrls();
      const targetWebUrl = webUrls[normalizedPlan] || webUrls.annual;
      if (targetWebUrl && targetWebUrl.startsWith("http")) {
        window.open(targetWebUrl, "_blank", "noopener,noreferrer");
        return { handled: true, success: false, openedWebCheckout: true, checkoutUrl: targetWebUrl };
      }

      // 4. Fallback to Interactive StoreKit 2 Sheet in UI
      return { handled: false, productId, planType: normalizedPlan };
    },

    async restorePurchases() {
      // 1. Expo / React Native WebView
      if (isExpoReactNative && hasLiveRevenueCatKey()) {
        const res = await sendToExpoNative("RESTORE_PURCHASES", {
          entitlementId: ENTITLEMENT_ID
        });
        if (res && res.handled) {
          return Boolean(res.success);
        }
      }

      // 2. Capacitor Native
      if (isCapacitorNative && hasLiveRevenueCatKey()) {
        try {
          const Purchases = window.Capacitor.Plugins && window.Capacitor.Plugins.Purchases;
          if (Purchases) {
            const { customerInfo } = await Purchases.restorePurchases();
            return Boolean(
              customerInfo &&
              customerInfo.entitlements &&
              customerInfo.entitlements.active &&
              customerInfo.entitlements.active[ENTITLEMENT_ID]
            );
          }
        } catch (err) {
          console.warn("[SacredIOSBridge] Restore purchases failed:", err);
          return false;
        }
      }

      // 3. Simulator / Offline restore
      return true;
    },

    async triggerHapticImpact(style = "HEAVY") {
      try {
        if (isExpoReactNative) {
          sendToExpoNative("HAPTIC_IMPACT", { style }, 1500);
          return;
        }
        if (isCapacitorNative && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
          await window.Capacitor.Plugins.Haptics.impact({ style });
        } else if (navigator.vibrate) {
          navigator.vibrate(style === "LIGHT" ? [20] : [40, 30, 80]);
        }
      } catch (e) {}
    }
  };

  window.SacredIOSBridge = SacredIOSBridge;
  document.addEventListener("DOMContentLoaded", () => {
    SacredIOSBridge.initStoreKit();
  });
})();
