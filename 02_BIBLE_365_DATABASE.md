# 📜 02_BIBLE_365_DATABASE.md — Kho 365+ Lời Chúa, Cầu Nguyện & Tư Vấn Thiên Thần

> **Cách yêu cầu hỗ trợ sau này:** Nhắn *"Dựa vào file `02_BIBLE_365_DATABASE.md`, hãy giúp tôi [nội dung cần sửa]..."*

---

## 1. Cấu Trúc Kho Dữ Liệu 371 Lời Chúa Giêsu (`JESUS_TEACHINGS`)
Nằm tại **Section 2** trong [`Sacred_Vessels_Jesus_Words.html`](file:///c:/Users/HOANGGIAP.MKT/OneDrive/Desktop/Sacred_Vessels_Jesus_Words.html):
- Tổng số câu hiện tại: **371 câu Lời Chúa Giêsu truyền dạy trực tiếp (Red-Letter Edition)** bằng Tiếng Anh từ 4 sách Phúc Âm (*Matthew, Mark, Luke, John*), *Acts* và *Revelation*.
- **Phân tầng Free vs. VIP:**
  - **Câu `#1 – #108`:** Kho câu gốc dành cho **Free Tier** (mở khóa sẵn).
  - **Câu `#109 – #371`:** Kho mở rộng trọn năm dành cho gói **Sanctuary Pass VIP**.
- Cấu trúc mỗi phần tử:
  ```javascript
  {
    mood: "peace", // 1 trong 6 chủ đề: peace, strength, love, guidance, faith, comfort
    theme: "Divine Peace",
    text: "Peace I leave with you; my peace I give to you...",
    ref: "JOHN 14:27"
  }
  ```

---

## 2. Tính Năng "Lời Chúa Của Ngày Hôm Nay" (`📅 Day X of 365`)
- Hàm `getDayOfYearNumber()`: Tự động tính ngày hiện tại trong năm (từ ngày `1` đến ngày `365`).
- Hàm `openDailyWordOfYear()`: Khi bấm nút `📅 Day X` trên thanh công cụ hoặc nút `📅 Today's Word` trong Thư viện `📜 365`, Thiên Thần sẽ hiện ra và đọc đúng câu Lời Chúa ứng với ngày hôm đó trong năm.

---

## 3. Hệ Thống 6 Tâm Trạng (Moods) & Lời Cầu Nguyện Mẫu (`MOOD_PRAYERS`)
Trước khi đập bình, người dùng có thể chọn tâm trạng của mình để nhận đúng Lời Chúa phù hợp:
1. `peace` (🕊️ Peace & Anxiety): Bình an & vượt qua lo âu.
2. `strength` (💪 Strength & Courage): Sức mạnh & lòng can đảm.
3. `love` (❤️ Love & Forgiveness): Tình yêu thương & sự tha thứ.
4. `guidance` (🧭 Guidance & Truth): Sự dẫn dắt & chân lý.
5. `faith` (🙏 Faith & Miracles): Đức tin & phép lạ.
6. `comfort` (🌿 Comfort & Rest): Sự an ủi & nghỉ ngơi tâm hồn.

---

## 4. Tính Năng "Tâm Sự Cùng Thiên Thần" (`👼 Ask the Angel` — Section 13)
- Nằm tại `#askAngelDrawer` và hàm `submitAskAngel()`.
- Khi người dùng nhập nỗi niềm bằng tiếng Anh (ví dụ: *"I feel anxious about my job"*, *"Help me forgive someone"*), thuật toán đối sánh từ khóa cảm xúc sẽ tìm câu Lời Chúa Giêsu phù hợp nhất, tạo lời khuyên tâm linh của Thiên Thần và đọc to lên bằng giọng nói.

---

## 5. Trò Chơi Ghi Nhớ Lời Chúa (`🧠 Seal Word +25 Grace` — Section 15)
- Hàm `startMemoryQuiz()` và `checkQuizAnswer(selected, correct)`:
  - Ẩn đi 1 từ khóa quan trọng trong câu Lời Chúa vừa mở và đưa ra 3 đáp án trắc nghiệm.
  - Khi chọn đúng, ngân vang tiếng chuông nhà thờ và thưởng **+25 Grace Points**.

---

## 6. Các Hướng Cải Thiện Có Thể Yêu Cầu Sau Này
- [ ] Kết nối trực tiếp **Gemini API (`gemini-2.5-flash`)** vào mục `👼 Ask the Angel` để Thiên Thần trò chuyện và giải đáp tâm linh sâu sắc theo đúng ngữ cảnh cá nhân của từng người dùng.
- [ ] Thêm chế độ song ngữ tùy chọn (Ví dụ: Tiếng Anh kèm giải nghĩa lịch sử bối cảnh câu Kinh Thánh đó được Chúa Giêsu nói tại đâu).
- [ ] Thêm Lộ trình đọc Kinh Thánh 7 ngày / 21 ngày / 40 ngày (*40-Day Lenten Journey*).
