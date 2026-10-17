# 🚀 06_IOS_BUILD_AND_APPSTORE.md — Bộ Công Cụ PWA Offline, App Store Assets & Cloud Mac Build

> **Cách yêu cầu hỗ trợ sau này:** Nhắn *"Dựa vào file `06_IOS_BUILD_AND_APPSTORE.md`, hãy giúp tôi [nội dung cần hỗ trợ]..."*

---

## 1. Danh Sách Các File Đã Hoàn Thành Ở Bước 1, 2, 3

| Hạng mục | File đã tạo sẵn | Chức năng |
| :--- | :--- | :--- |
| **Bước 1: PWA Offline iPhone** | [`APP/www/manifest.json`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/www/manifest.json) & [`APP/www/sw.js`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/www/sw.js) | Cấu hình cài trực tiếp lên màn hình chính iPhone (Safari -> Add to Home Screen), tự động bật Fullscreen và lưu toàn bộ 371 Lời Chúa chạy Offline 100%. |
| **Bước 2: Bộ Ảnh App Store** | [`Sacred_Vessels_AppStore_Kit_Generator.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/Sacred_Vessels_AppStore_Kit_Generator.html) *(Ngoài Desktop)* & [`APP/www/appstore-kit.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/www/appstore-kit.html) | Studio tự động vẽ và cho phép tải về chỉ bằng 1 cú nhấp chuột: **1 App Icon `1024×1024 px`** (chuẩn Apple không nền trong suốt) + **5 Poster Quảng Cáo App Store `1290×2796 px`** (chuẩn iPhone 6.7"/6.9" Pro Max). |
| **Bước 3: Cloud Mac Build (Từ Windows)** | [`APP/codemagic.yaml`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/codemagic.yaml) & [`APP/.github/workflows/ios-release.yml`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/.github/workflows/ios-release.yml) | Tự động thuê máy chủ Mac M2 trên đám mây (Codemagic / GitHub Actions) để biên dịch Xcode, đóng gói file `.ipa` và đẩy thẳng lên **TestFlight / App Store Connect** ngay từ máy Windows. |

---

## 2. Hướng Dẫn 3 Cách Sử Dụng Thực Tế Ngay Hôm Nay

### 📱 Cách 1: Cài App lên màn hình chính iPhone thật của bạn trong 30 giây (Miễn phí 100%)
1. Mở trình duyệt vào trang: **[https://app.netlify.com/drop](https://app.netlify.com/drop)** (hoặc tạo tài khoản miễn phí trên Netlify/Vercel).
2. Mở thư mục `c:\Users\HOANGGIAP.MKT\OneDrive\Desktop\APP` trên máy tính của bạn, **kéo thả thư mục `www`** vào ô trình duyệt của Netlify Drop.
3. Netlify sẽ cấp ngay cho bạn 1 đường link dạng `https://ten-app-cua-ban.netlify.app`.
4. Dùng **Safari trên chiếc iPhone của bạn** mở đường link đó $\rightarrow$ bấm nút **Chia sẻ (Share ở giữa đáy màn hình)** $\rightarrow$ chọn **Thêm vào MH chính (Add to Home Screen)**.
5. Quay ra màn hình chính iPhone: Biểu tượng **⚱️ Sacred Vessels** màu vàng thánh đường sẽ xuất hiện! Khi bấm vào, App tự động mở Fullscreen (không có thanh địa chỉ trình duyệt) và chạy Offline 100% ngay cả khi tắt Wi-Fi/4G!

---

### 🎨 Cách 2: Tải trọn bộ 6 tấm ảnh nộp lên App Store Connect
1. Mở file **[`Sacred_Vessels_AppStore_Kit_Generator.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/Sacred_Vessels_AppStore_Kit_Generator.html)** ngoài Desktop.
2. Bấm nút màu vàng ở góc trên bên phải: **`⬇️ Download All 6 PNG Files (Icon + 5 Posters)`**.
3. Trình duyệt sẽ tải về máy bạn đủ 6 file PNG chuẩn kích thước Apple:
   - `AppIcon_1024x1024.png` (`1024 × 1024 px` — Dùng để nạp vào Xcode & App Store Connect).
   - `01_AppStore_Strike_12_Vessels_1290x2796.png` (`1290 × 2796 px`)
   - `02_AppStore_365_Words_Angel_1290x2796.png` (`1290 × 2796 px`)
   - `03_AppStore_Ask_Angel_Alarms_1290x2796.png` (`1290 × 2796 px`)
   - `04_AppStore_Candles_Relics_1290x2796.png` (`1290 × 2796 px`)
   - `05_AppStore_Sleep_Mode_1290x2796.png` (`1290 × 2796 px`)

---

### ☁️ Cách 3: Xuất file `.ipa` đẩy lên App Store từ máy Windows bằng Codemagic
Khi bạn đã đăng ký tài khoản **Apple Developer ($99/năm)**:
1. Đưa thư mục `Desktop/APP` lên một kho chứa (Repository) trên **GitHub.com** (chế độ Private).
2. Đăng nhập vào **[Codemagic.io](https://codemagic.io/)** bằng tài khoản GitHub của bạn (Codemagic tặng miễn phí 500 phút chạy máy Mac M2 mỗi tháng).
3. Kết nối kho chứa `APP` của bạn — Codemagic sẽ tự động nhận diện file [`codemagic.yaml`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/codemagic.yaml) đã cấu hình sẵn.
4. Nhập khóa API **App Store Connect** của bạn vào mục Integrations của Codemagic và bấm **Start New Build** $\rightarrow$ Sau khoảng 6 phút, bản cài đặt iOS chính thức sẽ xuất hiện trong ứng dụng **TestFlight** trên iPhone của bạn và sẵn sàng bấm **Submit for Review** lên App Store!
