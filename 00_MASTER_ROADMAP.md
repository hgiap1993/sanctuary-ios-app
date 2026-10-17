# 🗺️ 00_MASTER_ROADMAP.md — Bản Đồ Tổng Thể Dự Án "The Twelve Sacred Vessels"

> **Hướng dẫn sử dụng:** Khi bạn muốn nâng cấp, chỉnh sửa hoặc triển khai bất kỳ phần nào của App trong tương lai, bạn chỉ cần nhắn cho AI:
> - *"Mở file `01_UI_UX_AND_VESSELS.md` và giúp tôi sửa giao diện chiếc bình..."*
> - *"Thực hiện tiếp theo file `06_IOS_BUILD_AND_APPSTORE.md`..."*

---

## 📂 1. Danh Sách Các File Code Chính Của Ứng Dụng

| Tên File & Đường Dẫn | Vai Trò Chính |
| :--- | :--- |
| [`Sacred_Vessels_Jesus_Words.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/Sacred_Vessels_Jesus_Words.html) | **Bản App chạy trực tiếp ngoài Desktop** (Full 12 Bình + Cốc Vàng 13 + 371 Lời Chúa + Nhắc hẹn + Nến + Sleep Mode + Paywall VIP). |
| [`Sacred_Vessels_Landing_Privacy_EULA.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/Sacred_Vessels_Landing_Privacy_EULA.html) | **Trang Web Giới Thiệu App (Landing Page) + Chính Sách Bảo Mật (Privacy Policy) + Điều Khoản (Apple EULA)** ngoài Desktop. |
| [`APP/www/index.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/www/index.html) | Bản đóng gói chính thức của App nằm trong thư mục dự án iOS Capacitor. |
| [`APP/www/privacy-terms.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/www/privacy-terms.html) | Bản đóng gói trang Landing Page + Privacy Policy + EULA để đưa lên web miễn phí (Netlify/GitHub Pages). |
| [`APP/ios-storekit-bridge.js`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/ios-storekit-bridge.js) | Cầu nối thanh toán **Apple StoreKit 2 / RevenueCat** & Rung phản hồi **Haptics** trên iPhone. |
| [`APP/capacitor.config.json`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/capacitor.config.json) | Cấu hình Bundle ID (`com.sacredvessels.jesuswords`), tên App và thông báo cho Xcode iOS. |
| [`APP/package.json`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/package.json) | Khai báo thư viện Capacitor iOS & các lệnh build (`npm run ios:sync`, `npm run ios:open`). |

---

## 📑 2. Danh Mục 6 File Tài Liệu Chuyên Môn (`.md`) Để Tra Cứu & Nâng Cấp Sau Này

Khi cần cải thiện phần nào, bạn chỉ cần **nhắn đúng tên file `.md` tương ứng dưới đây**:

1. **[`01_UI_UX_AND_VESSELS.md`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/01_UI_UX_AND_VESSELS.md)**
   - **Nội dung:** Giao diện khung iPhone, màu sắc Thánh Đường, 12 Chiếc Bình Cổ (SVG), Chiếc Cốc Vàng thứ 13, Búa Thánh, hiệu ứng nứt vàng Kintsugi, mảnh vỡ bay ra, Thiên Thần hiện ra, Thư viện 12 Bảo vật Thánh Tích (Relics) và Xuất ảnh Thiệp Phước Lành HD (`1080x1620`).
   - **Khi nào nhắn file này:** Khi muốn đổi kiểu dáng bình, đổi hình Thiên Thần, thêm hiệu ứng ánh sáng, hoặc đổi mẫu Thiệp ảnh xuất ra.

2. **[`02_BIBLE_365_DATABASE.md`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/02_BIBLE_365_DATABASE.md)**
   - **Nội dung:** Kho dữ liệu **371 Lời Chúa Giêsu (365+ Red-Letter Gospel Teachings)**, tính năng Lời Chúa Theo Ngày Trong Năm (`📅 Day X/365`), 6 Chủ đề Tâm trạng (Moods), Lời cầu nguyện mẫu, Trò chơi Ghi nhớ Kinh Thánh (`🧠 Seal Word +25 Grace`), và tính năng Tâm sự cùng Thiên Thần (`👼 Ask the Angel`).
   - **Khi nào nhắn file này:** Khi muốn thêm/sửa câu Kinh Thánh, nâng cấp AI trả lời trong mục *Ask the Angel*, hoặc thêm chủ đề cầu nguyện mới.

3. **[`03_AUDIO_VOICE_AND_SLEEP.md`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/03_AUDIO_VOICE_AND_SLEEP.md)**
   - **Nội dung:** Giọng đọc Thiên Thần tiếng Anh (Web Speech API / ElevenLabs / OpenAI TTS), tiếng vỡ bình & dàn hợp xướng (Web Audio API), Nhạc nền Đàn Harp Thánh Đường (`🎵 Harp`), và Chế độ Ngủ Bình An (`🌙 Sleep Mode` với tiếng mưa rơi ban đêm & hẹn giờ 15/30/60 phút).
   - **Khi nào nhắn file này:** Khi muốn tích hợp giọng đọc AI siêu thực (như ElevenLabs), thêm nhạc Gregorian Chant, hoặc thêm âm thanh thiên nhiên mới.

4. **[`04_REMINDERS_CANDLES_JOURNAL.md`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/04_REMINDERS_CANDLES_JOURNAL.md)**
   - **Nội dung:** Hệ thống Nhắc hẹn Đập Bình & Cầu nguyện mỗi ngày (`🔔 Reminders`), đếm ngược thời gian, thông báo iOS Push Banner, tiếng chuông Nhà thờ, xuất file Lịch báo thức iPhone (`.ics`), Bàn thờ Thắp Nến Nguyện Ước 24h (`🕯️ Candles`), Nhật ký cầu nguyện & Chuỗi ngày liên tiếp (`🔥 Streak` & `Grace Points`).
   - **Khi nào nhắn file này:** Khi muốn nâng cấp hệ thống thông báo đẩy (Push Notifications), thêm mẫu nến mới, hoặc đồng bộ nhật ký cầu nguyện lên iCloud.

5. **[`05_MONETIZATION_AND_STOREKIT.md`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/05_MONETIZATION_AND_STOREKIT.md)**
   - **Nội dung:** Mô hình kiếm tiền trên App Store: Giới hạn **Free Tier** (3 bình/ngày, 108 câu đầu) vs. Gói VIP **Sanctuary Pass** (`$2.99/tháng` hoặc `$19.99/năm` kèm 7 ngày dùng thử miễn phí), màn hình Paywall, mô phỏng Apple Pay/Face ID, và cách gắn API Key của **RevenueCat / Apple StoreKit 2**.
   - **Khi nào nhắn file này:** Khi muốn đổi giá bán, đổi số lượt đập bình miễn phí, thêm gói Mua Trọn Đời (Lifetime Pass), hoặc gắn mã RevenueCat thật.

6. **[`06_IOS_BUILD_AND_APPSTORE.md`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/APP/06_IOS_BUILD_AND_APPSTORE.md)**
   - **Nội dung:** Lộ trình tiếp theo để đưa App lên iPhone thật & nộp lên Apple App Store từ máy Windows: Cài đặt PWA Offline lên màn hình chính iPhone, tạo App Icon `1024x1024` & 5 tấm Poster Screenshots `1290x2796`, dùng Cloud Mac Build (`Codemagic` / `GitHub Actions`) để xuất file `.ipa` trên Windows không cần máy Mac, và checklist duyệt App Store.
   - **Khi nào nhắn file này:** Khi bạn sẵn sàng tạo bộ ảnh App Store, đưa web lên mạng lấy link Privacy Policy, hoặc bắt đầu đẩy App lên App Store Connect.
