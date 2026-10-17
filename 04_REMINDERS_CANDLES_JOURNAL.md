# 🔔 04_REMINDERS_CANDLES_JOURNAL.md — Nhắc Hẹn Chuông, Nến Nguyện Ước 24h & Nhật Ký

> **Cách yêu cầu hỗ trợ sau này:** Nhắn *"Dựa vào file `04_REMINDERS_CANDLES_JOURNAL.md`, hãy giúp tôi [nội dung cần sửa]..."*

---

## 1. Hệ Thống Nhắc Hẹn Đập Bình & Cầu Nguyện (`#reminderDrawer` — Section 10)
Giúp giữ chân khách hàng quay lại App mỗi ngày (Daily Retention):
- **3 Khung giờ mặc định (`DEFAULT_REMINDERS`):**
  1. `07:00` — **🌅 Morning Grace Vessel** (*Strike your morning vessel & begin the day with Jesus's Word*).
  2. `12:30` — **☀️ Midday Peace Pause** (*Pause from work, breathe deeply, and receive midday strength*).
  3. `21:00` — **🌙 Evening Rest & Examen** (*Close your day in peace with the Angel's nightly blessing*).
- **Các chức năng đã tích hợp:**
  - `updateNextAlarmCountdown()`: Tự động đếm ngược còn bao nhiêu giờ và phút nữa sẽ đến giờ rung chuông tiếp theo.
  - `addCustomReminder()`: Cho phép người dùng thêm giờ báo thức tùy ý (ví dụ: `08:00 — Family Blessing`).
  - `triggerSanctuaryNotification(title, body)`: Đổ chuông nhà thờ (`playCathedralBellChime()`), trượt **iOS Push Notification Banner (`#iosPushBanner`)** từ đỉnh màn hình iPhone xuống và gửi Web Notification.
  - `exportToIOSCalendar()`: Xuất file lịch chuẩn Apple `.ics` (`Sacred_Vessels_Prayer_Reminders.ics`) chứa sự kiện lặp lại hàng ngày (`RRULE:FREQ=DAILY`) kèm báo thức trước 5 phút cho Lịch iPhone.

---

## 2. Bàn Thờ Thắp Nến Nguyện Ước 24 Giờ (`#candlesDrawer` — Section 11)
- Hàm `lightNewCandle()` và `renderCandlesAndJournal()`:
  - Người dùng nhập ý nguyện (ví dụ: *"Mother's health"*, *"Peace for my family"*) và bấm **🕯️ Light**.
  - Ngọn nến SVG với hiệu ứng lửa lung lay (`@keyframes candleFlicker`) sẽ cháy liên tục trong suốt **24 giờ (`86,400,000 ms`)** và hiển thị bộ đếm giờ còn lại (`23h left`).
  - Mỗi lần thắp nến thưởng **+15 Grace Points**.

---

## 3. Nhật Ký Cầu Nguyện & Lưu Câu Yêu Thích (`❤️ Save` & `Prayer Journal`)
- Khi đang xem một Lời Chúa, bấm nút `🤍 Save` (`toggleFavoriteCurrentVerse()`) sẽ chuyển thành `❤️ Saved` và lưu câu đó vào mục **Saved Favorite Verses & Personal Reflections** trong `#candlesDrawer`.
- Người dùng cũng có thể viết ghi chú tạ ơn cá nhân hàng ngày (`addJournalEntry()`).
- Tất cả dữ liệu được lưu bền vững trong `localStorage`:
  - `sacred_candles_v1`
  - `sacred_journal_v1`
  - `sacred_favorites_v1`

---

## 4. Chuỗi Ngày Liên Tiếp (`🔥 Streak`) & Cấp Bậc Đức Tin (`Grace Points` — Section 12)
- Hệ thống thăng cấp tự động theo điểm ân sủng (`gracePoints`):
  - `0 – 99 pts`: **✨ Rank: Seeker**
  - `100 – 299 pts`: **🕊️ Rank: Believer**
  - `300 – 599 pts`: **🕯️ Rank: Disciple**
  - `600 – 999 pts`: **🛡️ Rank: Apostle of Light**
  - `1000+ pts`: **👑 Rank: Guardian of the Sanctuary**

---

## 5. Các Hướng Cải Thiện Có Thể Yêu Cầu Sau Này
- [ ] Thêm tính năng **Bàn Thờ Nến Cộng Đồng Toàn Cầu (Global Prayer Wall)**: Hiển thị số lượng người dùng trên khắp thế giới đang cùng thắp nến cầu nguyện trong 24h qua (ví dụ: *"🕯️ 4,280 believers are praying right now"*).
- [ ] Xuất toàn bộ Nhật ký cầu nguyện (`Prayer Journal`) ra file PDF đẹp mắt để làm kỷ niệm cuối năm.
