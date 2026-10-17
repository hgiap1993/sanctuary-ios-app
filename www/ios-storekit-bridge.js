/**
 * ============================================================================
 * THE TWELVE SACRED VESSELS — NATIVE iOS STOREKIT 2 & HAPTICS BRIDGE
 * ============================================================================
 * Automatically detects whether the app is running inside a Native iOS
 * Capacitor WebView (`window.Capacitor.isNativePlatform()`) or in a standard
 * Desktop/Mobile web browser.
 *
 * Product IDs configured in App Store Connect:
 * - Annual ($19.99/yr + 7-Day Free Trial): com.sacredvessels.pass.yearly
 * - Monthly ($2.99/mo):                    com.sacredvessels.pass.monthly
 * - Entitlement Identifier in RevenueCat:  sanctuary_vip
 */

(function () {
  const REVENUECAT_IOS_PUBLIC_API_KEY = "appl_REPLACE_WITH_YOUR_REVENUECAT_IOS_KEY";
  const ENTITLEMENT_ID = "sanctuary_vip";

  const isNativeIOS = Boolean(
    window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === "function" &&
    window.Capacitor.isNativePlatform()
  );

  const SacredIOSBridge = {
    isNativeIOS,

    async initStoreKit() {
      if (!isNativeIOS) {
        console.log("[SacredIOSBridge] Web/Desktop mode active — Using interactive StoreKit 2 simulator.");
        return;
      }
      try {
        const Purchases = window.Capacitor.Plugins.Purchases;
        if (!Purchases) return;

        await Purchases.configure({ apiKey: REVENUECAT_IOS_PUBLIC_API_KEY });
        const { customerInfo } = await Purchases.getCustomerInfo();
        const isVIP = Boolean(
          customerInfo &&
          customerInfo.entitlements &&
          customerInfo.entitlements.active &&
          customerInfo.entitlements.active[ENTITLEMENT_ID]
        );

        if (isVIP && typeof window.confirmApplePaySubscription === "function") {
          window.isSanctuaryVIP = true;
          window.saveSubscriptionState();
          window.updateSubscriptionUI();
        }
      } catch (err) {
        console.warn("[SacredIOSBridge] StoreKit initialization note:", err);
      }
    },

    async purchasePlan(planType) {
      if (!isNativeIOS) return false;
      try {
        const Purchases = window.Capacitor.Plugins.Purchases;
        if (!Purchases) return false;

        const offerings = await Purchases.getOfferings();
        if (!offerings || !offerings.current) return false;

        const isAnnual = planType === "annual" || planType === "yearly";
        const targetPackage = isAnnual
          ? offerings.current.annual
          : offerings.current.monthly;

        if (!targetPackage) return false;

        const { customerInfo } = await Purchases.purchasePackage({ aPackage: targetPackage });
        return Boolean(
          customerInfo &&
          customerInfo.entitlements &&
          customerInfo.entitlements.active &&
          customerInfo.entitlements.active[ENTITLEMENT_ID]
        );
      } catch (err) {
        console.warn("[SacredIOSBridge] StoreKit purchase cancelled or failed:", err);
        return false;
      }
    },

    async restorePurchases() {
      if (!isNativeIOS) return true;
      try {
        const Purchases = window.Capacitor.Plugins.Purchases;
        if (!Purchases) return false;

        const { customerInfo } = await Purchases.restorePurchases();
        return Boolean(
          customerInfo &&
          customerInfo.entitlements &&
          customerInfo.entitlements.active &&
          customerInfo.entitlements.active[ENTITLEMENT_ID]
        );
      } catch (err) {
        console.warn("[SacredIOSBridge] Restore purchases failed:", err);
        return false;
      }
    },

    async triggerHapticImpact() {
      try {
        if (isNativeIOS && window.Capacitor.Plugins.Haptics) {
          await window.Capacitor.Plugins.Haptics.impact({ style: "HEAVY" });
        } else if (navigator.vibrate) {
          navigator.vibrate([40, 30, 80]);
        }
      } catch (e) {}
    }
  };

  window.SacredIOSBridge = SacredIOSBridge;
  document.addEventListener("DOMContentLoaded", () => {
    SacredIOSBridge.initStoreKit();
  });
})();
