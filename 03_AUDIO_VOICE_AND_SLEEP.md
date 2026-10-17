# 🎵 03_AUDIO_VOICE_AND_SLEEP.md — Âm Thanh, Nhạc Đàn Harp, Giọng Thiên Thần & Sleep Mode

> **Cách yêu cầu hỗ trợ sau này:** Nhắn *"Dựa vào file `03_AUDIO_VOICE_AND_SLEEP.md`, hãy giúp tôi [nội dung cần sửa]..."*

---

## 1. Hệ Thống Âm Thanh Vật Lý & Nhạc Nền Tự Động (Web Audio API)
Tất cả hiệu ứng âm thanh trong [`Sacred_Vessels_Jesus_Words.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/Sacred_Vessels_Jesus_Words.html) đều được tổng hợp trực tiếp bằng **Web Audio API** (không phụ thuộc file MP3 bên ngoài nên không bao giờ bị lỗi mất tiếng và dung lượng App siêu nhẹ):
1. **Tiếng đập vỡ bình & Hợp xướng Thiên Thần (`playShatterAndChoirSound()`):**
   - Kết hợp tần số cao (`1500Hz – 2900Hz`) mô phỏng tiếng gốm vỡ giòn tan + hợp âm trưởng F-Major/C-Major ngân vang như dàn hợp xướng Thánh Đường.
2. **Nhạc nền Đàn Harp Thánh Đường (`toggleAmbientHarp()` & `playHarpArpeggioNote()`):**
   - Chạy vòng lặp hợp âm ngũ cung (Pentatonic F-Major: `261.63Hz – 783.99Hz`) dịu êm mỗi 1.35 giây.
3. **Tiếng Chuông Nhà Thờ (`playCathedralBellChime()`):**
   - Ngân vang hợp âm chuông đồng khi đến giờ nhắc hẹn cầu nguyện, khi trả lời đúng câu đố Kinh Thánh hoặc khi kích hoạt gói VIP.

---

## 2. Giọng Đọc Thiên Thần Tiếng Anh (`speakTeachingAloud()`)
- Sử dụng `window.speechSynthesis` (`SpeechSynthesisUtterance`) với cấu hình:
  - Ngôn ngữ: `en-US`
  - Tốc độ đọc (`rate`): `0.88` (chậm rãi, trang nghiêm, truyền cảm).
  - Tự động đọc: **Lời Chúa Giêsu + Địa chỉ câu Kinh Thánh + Lời cầu nguyện mẫu**.
  - Kèm hiệu ứng sóng âm chuyển động (`#voiceWave.speaking`) bên cạnh biểu tượng Thiên Thần.

---

## 3. Chế Độ Ngủ Bình An (`🌙 Sleep & Meditate Mode` — Section 14)
Nằm tại `#sleepDrawer`:
- **Bộ tạo tiếng Mưa Đêm (`startGentleRainSound()` & `stopGentleRainSound()`):**
  - Dùng thuật toán *Filtered Pink/White Noise* với bộ lọc thông thấp (`lowpass filter 650Hz`) tạo tiếng mưa rào ban đêm cực kỳ êm dịu giúp dễ ngủ.
- **Đọc Lời Chúa liên tục (`toggleSleepAutoPlay()` & `readNextSleepVerse()`):**
  - Cứ mỗi 18 giây, Thiên Thần tự động chuyển sang một câu Lời Chúa về sự bình an và đọc thầm thì trên nền tiếng mưa rơi & đàn Harp.
- **Hẹn giờ tắt tự động (`setSleepTimer(mins)`):** 15 phút, 30 phút, 60 phút.

---

## 4. Các Hướng Cải Thiện Có Thể Yêu Cầu Sau Này
- [ ] Tích hợp giọng đọc AI cao cấp (**ElevenLabs API** hoặc **OpenAI TTS / Gemini Live Audio**) cho người dùng gói **Sanctuary Pass VIP** để có giọng Thiên Thần ấm áp như người thật 100%.
- [ ] Thêm lựa chọn âm thanh nền mới trong Sleep Mode: Tiếng suối chảy (*Jordan River Stream*), Tiếng lửa trại (*Galilee Campfire*), Nhạc Thánh Ca Gregorian (*Gregorian Chant*).
- [ ] Cho phép chỉnh âm lượng riêng biệt (Mixer) giữa: Giọng Thiên Thần / Tiếng Đàn Harp / Tiếng Mưa Đêm.
