const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withFixRNIapAndroid(config) {
  return withDangerousMod(config, [
    "android",
    async (cfg) => {
      const rniapAndroidDir = path.join(
        cfg.modRequest.projectRoot,
        "node_modules",
        "react-native-iap",
        "android"
      );

      // 1. Upgrade Play Billing Library to 8.0.0 in gradle.properties & build.gradle
      const gradlePropsFile = path.join(rniapAndroidDir, "gradle.properties");
      if (fs.existsSync(gradlePropsFile)) {
        let props = fs.readFileSync(gradlePropsFile, "utf8");
        props = props.replace(
          /RNIap_playBillingSdkVersion\s*=\s*[0-9.]+/,
          "RNIap_playBillingSdkVersion=8.0.0"
        );
        fs.writeFileSync(gradlePropsFile, props, "utf8");
      }

      const buildGradleFile = path.join(rniapAndroidDir, "build.gradle");
      if (fs.existsSync(buildGradleFile)) {
        let bg = fs.readFileSync(buildGradleFile, "utf8");
        bg = bg.replace(
          'def playBillingSdkVersion = getExtOrDefault("playBillingSdkVersion")',
          'def playBillingSdkVersion = "8.0.0"'
        );
        fs.writeFileSync(buildGradleFile, bg, "utf8");
      }

      // 2. Patch RNIapModule.kt for Play Billing 8.0.0 & React Native 0.81+
      const rniapFile = path.join(
        rniapAndroidDir,
        "src",
        "play",
        "java",
        "com",
        "dooboolab",
        "rniap",
        "RNIapModule.kt"
      );
      if (fs.existsSync(rniapFile)) {
        let content = fs.readFileSync(rniapFile, "utf8");

        // Replace removed imports with Play Billing 8.0.0 imports
        content = content.replace(
          "import com.android.billingclient.api.PurchaseHistoryRecord",
          "import com.android.billingclient.api.PendingPurchasesParams"
        );
        content = content.replace(
          "import com.android.billingclient.api.QueryPurchaseHistoryParams",
          "import com.android.billingclient.api.QueryProductDetailsResult"
        );

        // Update enablePendingPurchases() -> enablePendingPurchases(PendingPurchasesParams...)
        content = content.replace(
          "BillingClient.newBuilder(reactContext).enablePendingPurchases()",
          "BillingClient.newBuilder(reactContext).enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())"
        );

        // Update queryProductDetailsAsync listener for Play Billing 8.0.0 (QueryProductDetailsResult)
        content = content.replace(
          /billingClient\.queryProductDetailsAsync\(params\)\s*\{\s*billingResult,\s*skuDetailsList\s*->\s*if\s*\(!isValidResult\(billingResult,\s*promise\)\)\s*return@queryProductDetailsAsync/,
          "billingClient.queryProductDetailsAsync(params) { billingResult: BillingResult, productDetailsResult: QueryProductDetailsResult ->\n                if (!isValidResult(billingResult, promise)) return@queryProductDetailsAsync\n                val skuDetailsList = productDetailsResult.productDetailsList"
        );

        // Update getPurchaseHistoryByType to use queryPurchasesAsync (queryPurchaseHistoryAsync removed in Billing 8.0.0)
        content = content.replace(
          /billingClient\.queryPurchaseHistoryAsync\(\s*QueryPurchaseHistoryParams\s*\.newBuilder\(\)\s*\.setProductType\(\s*if\s*\(type == "subs"\)\s*BillingClient\.ProductType\.SUBS\s*else\s*BillingClient\.ProductType\.INAPP,\s*\)\.build\(\),\s*\)\s*\{\s*billingResult:\s*BillingResult,\s*purchaseHistoryRecordList:\s*MutableList<PurchaseHistoryRecord>\?\s*->\s*if\s*\(!isValidResult\(billingResult,\s*promise\)\)\s*return@queryPurchaseHistoryAsync/,
          'billingClient.queryPurchasesAsync(\n                QueryPurchasesParams\n                    .newBuilder()\n                    .setProductType(\n                        if (type == "subs") BillingClient.ProductType.SUBS else BillingClient.ProductType.INAPP,\n                    ).build(),\n            ) { billingResult: BillingResult, purchaseHistoryRecordList: List<Purchase>? ->\n                if (!isValidResult(billingResult, promise)) return@queryPurchasesAsync'
        );

        // React Native 0.81 currentActivity fix
        content = content.replace(
          "val activity = currentActivity",
          "val activity = reactContext.currentActivity"
        );

        fs.writeFileSync(rniapFile, content, "utf8");
      }

      // 3. Enable R8 DEX Code Optimization & Obfuscation (>25% threshold for Google Play)
      const rootGradleProps = path.join(
        cfg.modRequest.projectRoot,
        "android",
        "gradle.properties"
      );
      if (fs.existsSync(rootGradleProps)) {
        let gProps = fs.readFileSync(rootGradleProps, "utf8");
        if (!gProps.includes("android.enableMinifyInReleaseBuilds")) {
          gProps += "\nandroid.enableMinifyInReleaseBuilds=true\n";
        } else {
          gProps = gProps.replace(
            /android\.enableMinifyInReleaseBuilds\s*=\s*false/g,
            "android.enableMinifyInReleaseBuilds=true"
          );
        }
        if (!gProps.includes("android.enableShrinkResourcesInReleaseBuilds")) {
          gProps += "android.enableShrinkResourcesInReleaseBuilds=true\n";
        }
        fs.writeFileSync(rootGradleProps, gProps, "utf8");
      }
      return cfg;
    },
  ]);
};
