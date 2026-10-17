# 💎 05_MONETIZATION_AND_STOREKIT.md — Mô Hình Doanh Thu, Paywall VIP & StoreKit 2

> **Cách yêu cầu hỗ trợ sau này:** Nhắn *"Dựa vào file `05_MONETIZATION_AND_STOREKIT.md`, hãy giúp tôi [nội dung cần sửa]..."*

---

## 1. Cấu Trúc Mô Hình Kiếm Tiền Hiện Tại (Section 16)
Đã được lập trình hoàn chỉnh trong [`Sacred_Vessels_Jesus_Words.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/Sacred_Vessels_Jesus_Words.html) và [`APP/ios-storekit-bridge.js`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/ios-storekit-bridge.js):

| Hạng mục | Gói Miễn Phí (Free Tier) | Gói "Sanctuary Pass VIP" (`$2.99/tháng` hoặc `$19.99/năm`) |
| :--- | :--- | :--- |
| **Số lượt Đập Bình / ngày** | Tối đa **3 chiếc bình / ngày** (`freeDailyVesselsUsed < 3`) | **Không giới hạn cả 12 chiếc bình + Cốc Vàng thứ 13** |
| **Kho Lời Chúa Giêsu** | **108 câu gốc** (`#1 – #108`) | **Trọn bộ 371 câu (365+ ngày trong năm `#1 – #371`)** |
| **Âm thanh & Giọng đọc** | Giọng đọc cơ bản | **Mở khóa trọn bộ Nhạc Harp, Sleep Mode Mưa Đêm & Tư vấn Thiên Thần** |
| **Thiệp Phước Lành HD** | Cơ bản | **Xuất ảnh `1080x1620` không giới hạn** |

---

## 2. Mã Sản Phẩm (Product IDs) Chuẩn App Store Connect
Trong file [`APP/ios-storekit-bridge.js`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/ios-storekit-bridge.js):
- **Entitlement ID trên RevenueCat:** `sanctuary_vip`
- **Gói Năm (Mặc định - Best Value):**
  - Product ID: `com.sacredvessels.pass.yearly`
  - Giá: **$19.99 / năm** (Kèm **7-Day Free Trial** — 7 ngày dùng thử miễn phí).
- **Gói Tháng:**
  - Product ID: `com.sacredvessels.pass.monthly`
  - Giá: **$2.99 / tháng**.

---

## 3. Các Hàm Quản Lý Thuê Bao Trong Code (Section 16)
- `loadSubscriptionState()` & `saveSubscriptionState()`: Lưu trạng thái VIP và số bình đã đập trong ngày (`sacred_vessels_subscription_v1`). Tự động reset bộ đếm `3/3` vào 0h00 mỗi ngày mới.
- `openPaywallDrawer(reason)`: Bật màn hình nâng cấp VIP (`#paywallDrawer`) khi người dùng đập quá 3 bình miễn phí hoặc bấm vào câu Kinh Thánh VIP (`#109–#371`).
- `showApplePaySheet()` & `confirmApplePaySubscription()`: Hiển thị bảng thanh toán Apple StoreKit 2 / Face ID và mở khóa toàn bộ quyền lợi VIP (+50 Grace Points).
- `restoreIOSPurchases()`: Nút khôi phục giao dịch bắt buộc theo quy định của Apple.
- `toggleVIPStatusDirectly()`: Nút chuyển đổi nhanh giữa chế độ Free và VIP để bạn kiểm thử.

---

## 4. Cách Gắn Mã RevenueCat Thật Khi Đưa Lên App Store
Khi bạn đã tạo tài khoản miễn phí trên [RevenueCat.com](https://www.revenuecat.com/), bạn chỉ cần mở file [`APP/ios-storekit-bridge.js`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/ios-storekit-bridge.js) ở **dòng 16** và thay thế chuỗi:
```javascript
const REVENUECAT_IOS_PUBLIC_API_KEY = "appl_REPLACE_WITH_YOUR_REVENUECAT_IOS_KEY";
```
bằng Public API Key thật của bạn (bắt đầu bằng `appl_...`).

---

## 5. Các Hướng Cải Thiện Có Thể Yêu Cầu Sau Này
- [ ] Thêm gói **Lifetime Sanctuary Pass ($49.99 — Mua 1 lần dùng trọn đời)** bên cạnh gói Tháng và gói Năm để thu tiền mặt ngay lập tức từ những người dùng trung thành.
- [ ] Thêm màn hình **Onboarding Paywall** (Giới thiệu 3 bước khi khách hàng mở App lần đầu tiên và mời đăng ký dùng thử 7 ngày miễn phí).
- [ ] Thêm tính năng **"Tặng Thẻ Sanctuary Pass cho Người Thân" (Gift a Pass for Christmas / Easter)**.
