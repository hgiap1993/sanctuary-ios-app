import React, { useRef, useCallback } from "react";
import { StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar, Vibration } from "react-native";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import { SANCTUARY_HTML } from "./sanctuaryHtml";

/**
 * Optional Native RevenueCat SDK (react-native-purchases):
 * When building a custom native client or EAS production build with `react-native-purchases` installed,
 * this bridge automatically routes `INIT_STOREKIT`, `PURCHASE_PLAN`, and `RESTORE_PURCHASES`
 * from the WebView (`ios-storekit-bridge.js`) to StoreKit 2 / Google Play Billing.
 */
let Purchases = null;
try {
  // Dynamically require so Expo Go / standard WebView builds never crash if native module isn't linked yet
  Purchases = require("react-native-purchases").default;
} catch (e) {
  Purchases = null;
}

export default function App() {
  const webViewRef = useRef(null);

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

      if (type === "INIT_STOREKIT") {
        if (Purchases && payload?.apiKey && !payload.apiKey.includes("REPLACE_WITH_YOUR")) {
          await Purchases.configure({ apiKey: payload.apiKey });
          const customerInfo = await Purchases.getCustomerInfo();
          const entitlementId = payload.entitlementId || "sanctuary_vip";
          const isVIP = Boolean(customerInfo?.entitlements?.active?.[entitlementId]);
          sendResponseToWebView({ requestId, handled: true, isVIP });
        } else {
          sendResponseToWebView({ requestId, handled: false, isVIP: false });
        }
        return;
      }

      if (type === "PURCHASE_PLAN") {
        if (!Purchases) {
          // Fall back to interactive StoreKit 2 sheet inside the WebView
          sendResponseToWebView({ requestId, handled: false });
          return;
        }
        try {
          const offerings = await Purchases.getOfferings();
          const current = offerings?.current;
          if (!current) {
            sendResponseToWebView({ requestId, handled: false });
            return;
          }
          const planType = payload?.planType || "annual";
          const productId = payload?.productId;
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

          if (!pkg) {
            sendResponseToWebView({ requestId, handled: false });
            return;
          }

          const { customerInfo } = await Purchases.purchasePackage(pkg);
          const unlocked = Boolean(customerInfo?.entitlements?.active?.[entitlementId]);
          sendResponseToWebView({
            requestId,
            handled: true,
            success: unlocked,
            isVIP: unlocked,
            plan: planType
          });
        } catch (err) {
          sendResponseToWebView({ requestId, handled: true, success: false, cancelled: true });
        }
        return;
      }

      if (type === "RESTORE_PURCHASES") {
        if (!Purchases) {
          sendResponseToWebView({ requestId, handled: false });
          return;
        }
        try {
          const customerInfo = await Purchases.restorePurchases();
          const entitlementId = payload?.entitlementId || "sanctuary_vip";
          const unlocked = Boolean(customerInfo?.entitlements?.active?.[entitlementId]);
          sendResponseToWebView({ requestId, handled: true, success: unlocked, isVIP: unlocked });
        } catch (err) {
          sendResponseToWebView({ requestId, handled: true, success: false });
        }
      }
    } catch (e) {}
  }, [sendResponseToWebView]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0b0805" />
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: SANCTUARY_HTML, baseUrl: "https://sanctuaryprayer.cloud/" }}
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
