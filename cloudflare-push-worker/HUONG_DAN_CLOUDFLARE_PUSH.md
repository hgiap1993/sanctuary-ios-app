# ⚡ Hướng Dẫn Kích Hoạt Hệ Thống Thông Báo Đẩy Tự Động 100% Trên Cloudflare

Hệ thống **2 Lớp Nhắc Nhở (Omnichannel Push)** đã được tích hợp hoàn chỉnh vào mã nguồn của **Sanctuary: Jesus Daily Prayer**:

1. **Lớp 1 — Cloudflare Web Push (VAPID ES256 + Service Worker + Cron Trigger):**
   - Đã tạo sẵn cặp khóa bảo mật **ECDSA P-256 VAPID Key** riêng cho `https://sanctuaryprayer.cloud/`.
   - Hoạt động thông qua [`cloudflare-push-worker/worker.js`](../cloudflare-push-worker/worker.js), [`functions/api/push/[[route]].js`](../functions/api/push/[[route]].js) và [`sw.js`](../sw.js).
2. **Lớp 2 — Đồng bộ Chuông Lịch Gốc iPhone (`.ics`) & Google Calendar 1 chạm:**
   - Gắn trực tiếp link `https://sanctuaryprayer.cloud/` vào báo thức Lịch của iPhone/Android (đổ chuông đúng giờ + 5 phút báo trước, bấm vào nhảy thẳng về Web).

---

## 🚀 Cách Bật Tự Động Hóa 100% Khi Đẩy Lên Cloudflare (Chỉ mất 2 phút)

### Bước 1: Tạo kho lưu trữ người đăng ký (Cloudflare KV) — Miễn phí
1. Đăng nhập vào **Cloudflare Dashboard** -> Chọn menu **Storage & Databases** -> **KV**.
2. Bấm **Create a namespace** -> Đặt tên là:
   ```text
   SANCTUARY_PUSH_KV
   ```
3. Bấm **Add**.

### Bước 2: Gắn KV vào Cloudflare Pages (`sanctuaryprayer.cloud`)
Khi bạn upload thư mục `Sanctuary` lên **Cloudflare Pages**:
- Nhờ thư mục [`functions/api/push/[[route]].js`](../functions/api/push/[[route]].js) đã có sẵn trong code, Cloudflare Pages sẽ **tự động kích hoạt API `/api/push/*`** ngay trên tên miền `https://sanctuaryprayer.cloud/api/push/*`.
- Bạn chỉ cần vào dự án **Cloudflare Pages** -> **Settings** -> **Bindings** -> **Add** -> **KV Namespace**:
  - **Variable name:** `SANCTUARY_PUSH_KV`
  - **KV namespace:** Chọn `SANCTUARY_PUSH_KV` vừa tạo ở Bước 1 -> Bấm **Save**.

### Bước 3: Bật Cron Trigger Tự Động Bắn Mỗi Sáng (8:00 AM) & Tối (9:00 PM)
Để Cloudflare tự động thức dậy mỗi giờ và bắn thông báo theo đúng múi giờ của từng người dùng Mỹ:
1. Trong Cloudflare Dashboard, vào **Workers & Pages** -> **Create Worker** -> Đặt tên `sanctuary-cron-push`.
2. Copy toàn bộ nội dung file [`cloudflare-push-worker/worker.js`](./worker.js) dán vào Worker -> Bấm **Deploy**.
3. Vào tab **Settings** của Worker đó:
   - Mục **Bindings** -> Gắn KV `SANCTUARY_PUSH_KV` (giống Bước 2).
   - Mục **Trigger Events** -> **Add Cron Trigger** -> Nhập `0 * * * *` (Chạy mỗi đầu giờ) -> **Save**.

---

## 📣 Cách Bắn Thông Báo Đẩy Thủ Công Cho Toàn Bộ Người Dùng (Khi Có Khuyến Mãi VIP)
Bất cứ khi nào bạn muốn bắn 1 thông báo đặc biệt (ví dụ: *Chúc mừng Chúa Nhật* hoặc *Ưu đãi gói Lifetime $49.99*) tới toàn bộ người dùng đã đăng ký, chỉ cần chạy lệnh sau trong PowerShell:

```powershell
Invoke-RestMethod -Uri "https://sanctuaryprayer.cloud/api/push/broadcast" -Method POST -ContentType "application/json" -Body '{"adminKey":"sanctuary-admin-2026","title":"👑 Sunday Apostolic Blessing","body":"Tap here to break the 13th Golden Chalice & receive +100 Grace Points today!","url":"https://sanctuaryprayer.cloud/?from_push=sunday"}'
```
