# ⚱️ 01_UI_UX_AND_VESSELS.md — Giao Diện, 12 Chiếc Bình Cổ, Cốc Vàng 13 & Hiệu Ứng

> **Cách yêu cầu hỗ trợ sau này:** Nhắn *"Dựa vào file `01_UI_UX_AND_VESSELS.md`, hãy giúp tôi [nội dung cần sửa]..."*

---

## 1. Kiến Trúc Giao Diện (UI/UX) Hiện Tại
- **Ngôn ngữ hiển thị trong App:** 100% Tiếng Anh trang trọng (Sacred & Biblical English).
- **Khung hiển thị:** Khung giả lập **iPhone 16 Pro (`396 x 848 px`)** kèm Dynamic Island, thanh trạng thái iOS (Đồng hồ thời gian thực, 5G, Pin), thanh điều hướng **Bottom Sanctuary Dock (5 tab)** và nút chuyển đổi **📱 Fullscreen**.
- **Bảng màu chủ đạo (CSS Variables trong `<style>`):**
  - `--bg-deep: #0b0805` (Đen trầm hương cổ điển)
  - `--gold-primary: #d4af37` & `--gold-bright: #ffd97d` (Vàng thánh đường)
  - Phông chữ: `'Cinzel'` (Tiêu đề La Mã cổ điển), `'Cormorant Garamond'` (Lời Chúa Giêsu in nghiêng), `'Plus Jakarta Sans'` (Giao diện điều khiển iOS).

---

## 2. Danh Sách 12 Chiếc Bình Thánh & 12 Bảo Vật Kinh Thánh (`TWELVE_VESSELS`)
Nằm tại **Section 1** trong `<script>` của file [`Sacred_Vessels_Jesus_Words.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/Sacred_Vessels_Jesus_Words.html):
1. **Vessel I — Vessel of Cana:** 🏺 *Stone Jar of Cana* (John 2:1–11 — Phép lạ hóa nước thành rượu).
2. **Vessel II — Alabaster Jar:** ⚱️ *Alabaster Flask of Nard* (Mark 14:3 — Bình bạch ngọc dầu thơm).
3. **Vessel III — Chalice of Grace:** 🏆 *Cup of the New Covenant* (Luke 22:20 — Chén Giao Ước Mới).
4. **Vessel IV — Urn of Galilee:** 🧺 *Twelve Baskets of Plenty* (Matthew 14:19–20 — 12 giỏ bánh hóa nhiều).
5. **Vessel V — Golden Pitcher:** 🕯️ *Golden Lamp of the Sanctuary* (Matthew 5:14–16 — Ánh sáng thế gian).
6. **Vessel VI — Vessel of Zion:** 🕊️ *Celestial Dove of Jordan* (Luke 3:22 — Chim bồ câu Thánh Linh).
7. **Vessel VII — Sacred Hydria:** 💧 *Wellspring of Samaria* (John 4:14 — Mạch Nước Hằng Sống).
8. **Vessel VIII — Jar of Bethany:** 🌿 *Olive Branch of Olivet* (Luke 22:42 — Nhành ô-liu vườn Ghết-sê-ma-nê).
9. **Vessel IX — Covenant Cup:** 🌾 *Golden Mustard Seed* (Matthew 17:20 — Đức tin bằng hạt cải).
10. **Vessel X — Olivet Vessel:** 🦯 *Staff of the Good Shepherd* (John 10:11 — Cây gậy Người Chăn Nhân Lành).
11. **Vessel XI — Temple Amphora:** 🦪 *Pearl of Great Price* (Matthew 13:46 — Viên ngọc quý Nước Trời).
12. **Vessel XII — Vessel of Light:** 👑 *Crown of Morning Star* (Revelation 22:16 — Sao Mai Sáng Chói).

### 👑 Chiếc Cốc Vàng Phép Lạ Thứ 13 (`#goldenVesselDrawer`)
- Tự động triệu hồi khi người dùng đập vỡ đủ cả 12 chiếc bình gốm (hoặc bấm vào tab `👑 13th Jar` ở thanh Dock dưới đáy).
- Khi đập vào Cốc Vàng thứ 13 (`strikeGoldenMiracleVessel(event)`), người dùng nhận ngay **+100 Grace Points** và Đại Phước Lành.

---

## 3. Các Hàm Code Quan Trọng Liên Quan Đến Giao Diện & Đập Bình
- `renderVesselsGrid()`: Vẽ 12 chiếc bình SVG lên lưới 3x4.
- `handleVesselStrike(vessel, slotEl, event)`: Kiểm tra giới hạn Free Tier (3 bình/ngày), xoay Búa Thánh (`#sacred-hammer`), tạo vết nứt vàng Kintsugi (`.cracking`), bắn 20 hạt mảnh vỡ (`spawnShatterParticles`), lóe sáng hào quang (`#divineFlash`) và mở Modal Thiên Thần (`#angelModal`).
- `saveBlessingCardPNG()`: Xuất ảnh Thiệp Phước Lành chất lượng cao `1080 x 1620 px` bằng HTML5 Canvas để chia sẻ lên Instagram / Facebook / iMessage.

---

## 4. Các Hướng Cải Thiện Có Thể Yêu Cầu Sau Này
- [ ] Thêm bộ sưu tập giao diện bình mới theo mùa Phụng Vụ (Mùa Giáng Sinh - *Advent Vessels*, Mùa Phục Sinh - *Easter Golden Vessels*).
- [ ] Thêm nhiều mẫu khung viền (Template) khi xuất ảnh Thiệp Phước Lành (`saveBlessingCardPNG()`).
- [ ] Cho phép người dùng chọn kiểu Búa Thánh (Búa Đồng Cổ, Búa Vàng Giê-ru-sa-lem, Quyền Trượng Ánh Sáng).
