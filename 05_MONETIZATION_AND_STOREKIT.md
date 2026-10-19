# 💎 05_MONETIZATION_AND_STOREKIT.md — Mô Hình Doanh Thu, Paywall VIP & StoreKit 2 / RevenueCat

> **Cách yêu cầu hỗ trợ sau này:** Nhắn *"Dựa vào file `05_MONETIZATION_AND_STOREKIT.md`, hãy giúp tôi [nội dung cần sửa]..."*

---

## 1. Cấu Trúc Mô Hình Kiếm Tiền Đã Nâng Cấp (Section 16 & Section 17)
Đã được lập trình hoàn chỉnh trong [`index.html`](file:///C:/Users/giap2/OneDrive/Desktop/APP/index.html), [`www/index.html`](file:///C:/Users/giap2/OneDrive/Desktop/APP/www/index.html), [`ios-storekit-bridge.js`](file:///C:/Users/giap2/OneDrive/Desktop/APP/ios-storekit-bridge.js) và [`expo-store-app/App.js`](file:///C:/Users/giap2/OneDrive/Desktop/APP/expo-store-app/App.js):

| Hạng mục | Gói Miễn Phí (Free Tier) | Gói "Sanctuary Pass VIP" (`$2.99/tháng`, `$19.99/năm` hoặc `$49.99 Trọn Đời`) |
| :--- | :--- | :--- |
| **Số lượt Đập Bình / ngày** | Tối đa **3 chiếc bình / ngày** (`freeDailyVesselsUsed < 3`) | **Không giới hạn cả 12 chiếc bình + Cốc Vàng thứ 13** |
| **Kho Lời Chúa Giêsu** | **108 câu gốc** (`#1 – #108`) | **Trọn bộ 371 câu (365+ ngày trong năm `#1 – #371`)** |
| **Âm thanh & Giọng đọc** | Giọng đọc cơ bản | **Mở khóa trọn bộ Nhạc Harp, Gregorian Chant, Sleep Mode Mưa Đêm & Tư vấn Thiên Thần** |
| **Thiệp Phước Lành HD** | Cơ bản | **Xuất ảnh `1080x1620` không giới hạn** |
| **Điểm thưởng Ân Điển** | `+50 Grace` khi vào App | **`+50 Grace` (Gói Tháng/Năm) hoặc `+250 Grace Bonus` (Gói Lifetime Forever)** |

---

## 2. Mã Sản Phẩm (Product IDs) Chuẩn App Store Connect & Google Play
Trong file [`ios-storekit-bridge.js`](file:///C:/Users/giap2/OneDrive/Desktop/APP/ios-storekit-bridge.js):
- **Entitlement ID trên RevenueCat:** `sanctuary_vip`
- **1. Gói Năm (Annual Pass - Mặc định - Best Value):**
  - Product ID: `com.sacredvessels.pass.yearly`
  - Loại: *Auto-Renewable Subscription*
  - Giá: **$19.99 / năm** (Kèm **7-Day Free Trial** — `$0.00` hôm nay).
- **2. Gói Trọn Đời (Founder's Eternal Lifetime Pass):**
  - Product ID: `com.sacredvessels.pass.lifetime`
  - Loại: *Non-Consumable In-App Purchase (Mua 1 lần dùng vĩnh viễn)*
  - Giá: **$49.99 / trọn đời** (Tặng ngay **+250 Grace Points** & huy hiệu `👑 LIFETIME VIP`).
- **3. Gói Tháng (Monthly Pass):**
  - Product ID: `com.sacredvessels.pass.monthly`
  - Loại: *Auto-Renewable Subscription*
  - Giá: **$2.99 / tháng**.
- **4. Thẻ Quà Tặng 1 Năm (Gift a Sanctuary Pass):**
  - Product ID: `com.sacredvessels.pass.gift1yr`
  - Giá: **$19.99** — Cho phép nhập tên người nhận (ví dụ: *Mom, David*) và tạo đường link quà tặng `?gift_pass=1&recipient=...` tự động kích hoạt VIP cho người thân khi mở link.

---

## 3. Màn Hình 3-Step Onboarding & Soft Trial Paywall (`#onboardingOverlay`)
Khi người dùng mở App lần đầu (hoặc bấm nút `✨ Intro`):
- **Bước 1 (`1 • Heart & Voice`):** Chọn tâm trạng cần Lời Chúa hôm nay & chọn giọng đọc Thiên Thần (*Seraphina, Gabriel, Nocturne*).
- **Bước 2 (`2 • Daily Bells`):** Bật/tắt nhanh 3 khung giờ Chuông Nhà Thờ nhắc cầu nguyện (`07:00 AM`, `12:30 PM`, `09:00 PM`).
- **Bước 3 (`3 • Sanctuary Pass`):** Hiển thị lộ trình minh bạch 7 ngày dùng thử miễn phí (*Today: $0.00 -> Day 5: Reminder -> Day 7: $19.99/yr*) hoặc chọn gói *Lifetime $49.99*, kèm nút tôn trọng người dùng: *"Continue with Free Tier (3 Vessels/Day) & Strike First Vessel →"* (tuân thủ tuyệt đối Apple Guideline 3.1.2).

---

## 4. Cầu Nối Đa Nền Tảng (Capacitor + Expo React Native + Web Simulator)
Hệ thống [`ios-storekit-bridge.js`](file:///C:/Users/giap2/OneDrive/Desktop/APP/ios-storekit-bridge.js) tự động nhận diện cả 3 môi trường:
1. **Capacitor iOS/Android (`window.Capacitor.Plugins.Purchases`):** Gọi trực tiếp SDK `@revenuecat/purchases-capacitor`.
2. **Expo React Native (`window.ReactNativeWebView.postMessage` + [`expo-store-app/App.js`](file:///C:/Users/giap2/OneDrive/Desktop/APP/expo-store-app/App.js)):** Giao tiếp 2 chiều giữa WebView và `react-native-purchases` + `Vibration` gốc.
3. **Web / Desktop Simulator:** Hiển thị bảng ** App Store • StoreKit 2** mô phỏng Face ID / Apple Pay.

---

## 5. Cách Gắn Mã RevenueCat Thật (2 Cách)
- **Cách 1 (Ngay trên giao diện App không cần sửa code):**
  1. Mở bảng **💎 Sanctuary Pass VIP**.
  2. Chạm **5 lần liên tiếp** vào dòng tiêu đề `💎 Sanctuary Pass VIP`.
  3. Khung **🛠️ STOREKIT 2 & REVENUECAT LIVE KEY CONFIG** sẽ hiện ra -> Dán mã `appl_...` (iOS) hoặc `goog_...` (Android) vào và bấm **Save Key**.
- **Cách 2 (Cố định trong code trước khi xuất file `.ipa`/`.aab`):**
  Mở file [`ios-storekit-bridge.js`](file:///C:/Users/giap2/OneDrive/Desktop/APP/ios-storekit-bridge.js) ở dòng 18–19 và thay thế `DEFAULT_REVENUECAT_IOS_KEY` / `DEFAULT_REVENUECAT_ANDROID_KEY`.
