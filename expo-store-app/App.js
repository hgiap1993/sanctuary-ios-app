import React, { useRef, useCallback, useEffect } from "react";
import { StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar, Vibration, Share } from "react-native";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import { SANCTUARY_HTML } from "./sanctuaryHtml";

/**
 * Direct Apple StoreKit 2 / Google Play Billing Bridge (react-native-iap) + Optional RevenueCat SDK:
 * Connects directly to Apple App Store Connect & Google Play Console SKUs:
 * - com.sacredvessels.pass.yearly   (Subscription: $19.99/yr + 7-Day Free Trial)
 * - com.sacredvessels.pass.monthly  (Subscription: $2.99/mo)
 * - com.sacredvessels.pass.lifetime (Non-Consumable: $49.99 Lifetime Pass)
 */
const SUBSCRIPTION_SKUS = [
  "com.sacredvessels.pass.yearly",
  "com.sacredvessels.pass.monthly"
];
const INAPP_SKUS = [
  "com.sacredvessels.pass.lifetime"
];
const ALL_VALID_SKUS = [...SUBSCRIPTION_SKUS, ...INAPP_SKUS];

let RNIap = null;
try {
  RNIap = require("react-native-iap");
} catch (e) {
  RNIap = null;
}

let Purchases = null;
try {
  Purchases = require("react-native-purchases").default;
} catch (e) {
  Purchases = null;
}

export default function App() {
  const webViewRef = useRef(null);
  const storeKitConnectedRef = useRef(false);
  const subscriptionsMapRef = useRef({});

  const sendResponseToWebView = useCallback((payload) => {
    if (!webViewRef.current) return;
    const jsonStr = JSON.stringify(payload);
    webViewRef.current.injectJavaScript(`
      if (window.SacredIOSBridge && typeof window.SacredIOSBridge.handleNativeResponse === "function") {
        window.SacredIOSBridge.handleNativeResponse(${jsonStr});
      }
      true;
    `);
  }, []);

  const ensureStoreKitConnected = useCallback(async () => {
    if (!RNIap) return false;
    if (storeKitConnectedRef.current) return true;
    try {
      await RNIap.initConnection();
      if (Platform.OS === "android" && typeof RNIap.flushFailedPurchasesCachedAsPendingAndroid === "function") {
        try {
          await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        } catch (e) {}
      }
      storeKitConnectedRef.current = true;
      try {
        const subs = await RNIap.getSubscriptions({ skus: SUBSCRIPTION_SKUS });
        if (Array.isArray(subs)) {
          subs.forEach((sub) => {
            if (sub?.productId) {
              subscriptionsMapRef.current[sub.productId] = sub;
            }
          });
        }
      } catch (e) {}
      try {
        await RNIap.getProducts({ skus: INAPP_SKUS });
      } catch (e) {}
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  useEffect(() => {
    ensureStoreKitConnected();
    return () => {
      if (RNIap && storeKitConnectedRef.current) {
        try {
          RNIap.endConnection();
        } catch (e) {}
        storeKitConnectedRef.current = false;
      }
    };
  }, [ensureStoreKitConnected]);

  const handleWebViewMessage = useCallback(async (event) => {
    try {
      const raw = event?.nativeEvent?.data;
      if (!raw) return;
      const msg = JSON.parse(raw);
      if (!msg || msg.source !== "SacredIOSBridge") return;

      const { requestId, type, payload } = msg;

      if (type === "HAPTIC_IMPACT") {
        Vibration.vibrate(payload?.style === "LIGHT" ? 15 : 45);
        sendResponseToWebView({ requestId, handled: true, success: true });
        return;
      }

      if (type === "SHARE_BLESSING_CARD") {
        try {
          await Share.share({
            title: payload?.title || "⚱️ Sanctuary: 12 Sacred Vessels",
            message: payload?.caption || "",
            url: payload?.dataUrl || payload?.deepLink || ""
          });
          sendResponseToWebView({ requestId, handled: true, success: true });
        } catch (e) {
          sendResponseToWebView({ requestId, handled: true, success: false });
        }
        return;
      }

      if (type === "INIT_STOREKIT") {
        // 1. Direct Apple StoreKit / Google Play Billing via react-native-iap
        const connected = await ensureStoreKitConnected();
        if (connected && RNIap) {
          try {
            const available = await RNIap.getAvailablePurchases();
            const ownedPurchase = Array.isArray(available)
              ? available.find((p) => ALL_VALID_SKUS.includes(p?.productId))
              : null;
            if (ownedPurchase) {
              const plan = ownedPurchase.productId.includes("lifetime")
                ? "lifetime"
                : ownedPurchase.productId.includes("monthly")
                ? "monthly"
                : "annual";
              sendResponseToWebView({ requestId, handled: true, isVIP: true, plan });
              return;
            }
          } catch (e) {}
        }

        // 2. Optional RevenueCat fallback if API key is provided
        if (Purchases && payload?.apiKey && !payload.apiKey.includes("REPLACE_WITH_YOUR")) {
          await Purchases.configure({ apiKey: payload.apiKey });
          const customerInfo = await Purchases.getCustomerInfo();
          const entitlementId = payload.entitlementId || "sanctuary_vip";
          const isVIP = Boolean(customerInfo?.entitlements?.active?.[entitlementId]);
          sendResponseToWebView({ requestId, handled: true, isVIP });
        } else {
          sendResponseToWebView({ requestId, handled: true, isVIP: false });
        }
        return;
      }

      if (type === "PURCHASE_PLAN") {
        const planType = payload?.planType || "annual";
        const productId =
          payload?.productId ||
          (planType === "lifetime"
            ? "com.sacredvessels.pass.lifetime"
            : planType === "monthly"
            ? "com.sacredvessels.pass.monthly"
            : "com.sacredvessels.pass.yearly");

        // 1. Direct Apple StoreKit / Google Play Billing Purchase via react-native-iap
        const connected = await ensureStoreKitConnected();
        if (connected && RNIap) {
          try {
            let purchaseResult = null;
            if (planType === "lifetime") {
              purchaseResult = await RNIap.requestPurchase(
                Platform.OS === "android"
                  ? { skus: [productId] }
                  : {
                      sku: productId,
                      andDangerouslyFinishTransactionAutomaticallyIOS: false
                    }
              );
            } else {
              if (Platform.OS === "android") {
                let subItem = subscriptionsMapRef.current[productId];
                if (!subItem) {
                  try {
                    const fetched = await RNIap.getSubscriptions({ skus: [productId] });
                    if (Array.isArray(fetched) && fetched[0]) {
                      subItem = fetched[0];
                      subscriptionsMapRef.current[productId] = subItem;
                    }
                  } catch (e) {}
                }
                const offerToken =
                  subItem?.subscriptionOfferDetails?.[0]?.offerToken || null;
                purchaseResult = await RNIap.requestSubscription(
                  offerToken
                    ? {
                        sku: productId,
                        subscriptionOffers: [{ sku: productId, offerToken }]
                      }
                    : { sku: productId }
                );
              } else {
                purchaseResult = await RNIap.requestSubscription({
                  sku: productId,
                  andDangerouslyFinishTransactionAutomaticallyIOS: false
                });
              }
            }

            const purchaseObj = Array.isArray(purchaseResult) ? purchaseResult[0] : purchaseResult;
            if (purchaseObj) {
              try {
                await RNIap.finishTransaction({ purchase: purchaseObj, isConsumable: false });
              } catch (e) {}
              sendResponseToWebView({
                requestId,
                handled: true,
                success: true,
                isVIP: true,
                plan: planType
              });
              return;
            }
          } catch (err) {
            const isCancelled =
              err?.code === "E_USER_CANCELLED" ||
              String(err?.message || "").toLowerCase().includes("cancel");
            sendResponseToWebView({
              requestId,
              handled: true,
              success: false,
              cancelled: isCancelled,
              errorMessage: isCancelled
                ? ""
                : Platform.OS === "ios"
                ? "Unable to complete App Store purchase at this moment. Please try again."
                : "Unable to complete Google Play / Google Pay purchase at this moment. Please try again."
            });
            return;
          }
        }

        // 2. Optional RevenueCat fallback if installed & configured
        if (Purchases) {
          try {
            const offerings = await Purchases.getOfferings();
            const current = offerings?.current;
            if (current) {
              const entitlementId = payload?.entitlementId || "sanctuary_vip";
              let pkg = null;
              if (planType === "lifetime") {
                pkg =
                  current.lifetime ||
                  (current.availablePackages || []).find(
                    (p) => p.identifier === "$rc_lifetime" || p.product?.identifier === productId
                  );
              } else if (planType === "monthly") {
                pkg = current.monthly;
              } else {
                pkg = current.annual;
              }
              if (pkg) {
                const { customerInfo } = await Purchases.purchasePackage(pkg);
                const unlocked = Boolean(customerInfo?.entitlements?.active?.[entitlementId]);
                sendResponseToWebView({
                  requestId,
                  handled: true,
                  success: unlocked,
                  isVIP: unlocked,
                  plan: planType
                });
                return;
              }
            }
          } catch (err) {
            sendResponseToWebView({ requestId, handled: true, success: false, cancelled: true });
            return;
          }
        }

        sendResponseToWebView({
          requestId,
          handled: true,
          success: false,
          cancelled: false,
          errorMessage:
            Platform.OS === "ios"
              ? "Connecting to Apple App Store StoreKit... Please ensure you are signed in to your Apple ID."
              : "Connecting to Google Play Billing... Please ensure you are signed in to your Google Play account."
        });
        return;
      }

      if (type === "RESTORE_PURCHASES") {
        // 1. Direct StoreKit / Google Play Billing Restore via react-native-iap
        const connected = await ensureStoreKitConnected();
        if (connected && RNIap) {
          try {
            const available = await RNIap.getAvailablePurchases();
            const ownedPurchase = Array.isArray(available)
              ? available.find((p) => ALL_VALID_SKUS.includes(p?.productId))
              : null;
            if (ownedPurchase) {
              const plan = ownedPurchase.productId.includes("lifetime")
                ? "lifetime"
                : ownedPurchase.productId.includes("monthly")
                ? "monthly"
                : "annual";
              sendResponseToWebView({
                requestId,
                handled: true,
                success: true,
                isVIP: true,
                plan
              });
              return;
            }
            sendResponseToWebView({ requestId, handled: true, success: false, isVIP: false });
            return;
          } catch (err) {
            sendResponseToWebView({ requestId, handled: true, success: false, isVIP: false });
            return;
          }
        }

        // 2. Optional RevenueCat Restore
        if (Purchases) {
          try {
            const customerInfo = await Purchases.restorePurchases();
            const entitlementId = payload?.entitlementId || "sanctuary_vip";
            const unlocked = Boolean(customerInfo?.entitlements?.active?.[entitlementId]);
            sendResponseToWebView({ requestId, handled: true, success: unlocked, isVIP: unlocked });
            return;
          } catch (err) {}
        }

        sendResponseToWebView({ requestId, handled: true, success: false, isVIP: false });
      }
    } catch (e) {}
  }, [ensureStoreKitConnected, sendResponseToWebView]);

  const platformHtml =
    Platform.OS === "android"
      ? SANCTUARY_HTML.replace(/Apple App Store Compliance \(Guideline 3\.1\.2\)/g, "Google Play Subscription Terms")
          .replace(/Settings > Apple ID/g, "Google Play > Payments & subscriptions")
          .replace(/Apple ID or Google Play account/g, "Google Play account")
          .replace(/Apple App Store/g, "Google Play Store")
          .replace(/Apple StoreKit 2/g, "Google Play Billing")
          .replace(/Apple StoreKit/g, "Google Play Billing")
          .replace(/App Store/g, "Google Play")
          .replace(/Apple ID/g, "Google Play account")
      : SANCTUARY_HTML;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0b0805" />
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: platformHtml, baseUrl: "https://sanctuaryprayer.cloud/" }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        bounces={false}
        overScrollMode="never"
        onMessage={handleWebViewMessage}
        injectedJavaScriptBeforeContentLoaded={`
          document.addEventListener("DOMContentLoaded", function() {
            document.body.classList.add("fullscreen-mode");
          });
          true;
        `}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0805",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : 0
  },
  webview: {
    flex: 1,
    backgroundColor: "#0b0805"
  }
});
