# ⚱️ Sanctuary: Jesus Daily Prayer — Hồ Sơ ASO & Lệnh Đóng Gói Lên Apple App Store (iOS)

Tài liệu này tổng hợp toàn bộ **Bộ Từ Khóa ASO Đã Chốt (Phương Án 4)**, **Mô Tả App Store (Description)** và **Lệnh chạy (Commands)** để bạn copy-paste trực tiếp lên **Apple App Store Connect**.

---

## 1. Bộ Tên & Từ Khóa Chuẩn SEO App Store (ASO — Phương Án 4)

Copy chính xác từng dòng dưới đây vào mục **App Information** và **Version Information** trên App Store Connect:

- **App Name (29/30 ký tự):**
  ```text
  Sanctuary: Jesus Daily Prayer
  ```
- **Subtitle (30/30 ký tự):**
  ```text
  12 Sacred Vessels & Sleep Word
  ```
- **Home Screen Display Name (9/12 ký tự — Hiển thị dưới Icon iPhone):**
  ```text
  Sanctuary
  ```
- **Keywords (96/100 ký tự — Không khoảng trắng sau dấu phẩy):**
  ```text
  christ,gospel,red,letter,bible,verse,devotional,catholic,god,angel,audio,calm,anxiety,faith,amen
  ```
- **Bundle ID:** `com.sanctuary.sacredvessels`
- **Primary Category:** `Lifestyle` (hoặc `Reference`) • **Secondary Category:** `Health & Fitness` (ngách Sleep & Meditation)
- **Age Rating:** `4+`
- **Marketing & Support URL:** `https://sanctuaryprayer.cloud/privacy-terms.html`
- **Privacy Policy URL:** `https://sanctuaryprayer.cloud/privacy-terms.html#privacy`

---

## 2. Nội Dung Quảng Cáo & Mô Tả Ứng Dụng (Promotional Text & Description)

### Promotional Text (168/170 ký tự):
```text
Strike the 12 Ancient Sacred Vessels with the Sacred Hammer. Hear the Angel speak 365+ Red-Letter Words of Jesus Christ, light a 24h candle & drift to sleep in peace.
```

### Description (Copy vào ô Description trên App Store Connect):
```text
Welcome to Sanctuary: Jesus Daily Prayer — where ancient sacred tradition meets peaceful daily devotion and restful sleep.

Step into a quiet candlelit Sanctuary on your iPhone. Before you stand 12 Ancient Sacred Vessels—each crafted after a vessel from the Gospels (the Stone Jar of Cana, the Alabaster Flask of Bethany, the Cup of the New Covenant).

🔨 STRIKE THE 12 SACRED VESSELS
Select your heart's need—Peace & Anxiety, Strength, Love & Forgiveness, Guidance, Faith, or Comfort—and strike any vessel with the Sacred Hammer. Watch golden Kintsugi cracks illuminate the clay before the Celestial Angel appears to read a living Red-Letter Word of Jesus Christ aloud over your heart.

📜 365+ RED-LETTER WORDS OF JESUS CHRIST
• Daily Word of the Year (Day 1 to Day 365) plus 6 heart-intent filters.
• Spoken aloud in calming English with a personal Angelic Prayer & daily action step.
• Gospel Memory Challenge: Seal Christ's Word in your heart and earn Grace Points.

🌙 SLEEP IN CHRIST'S ETERNAL PEACE
• Drift to sleep with continuous comforting Words of Jesus spoken over gentle night rain and F-Major Pentatonic Sanctuary Harp music.
• Built-in 15, 30, and 60-minute sleep timers.

👼 ASK THE ANGEL & 24-HOUR SANCTUARY CANDLES
• Confide what is weighing on your heart in English and receive Jesus's exact Scripture and comforting prayer.
• Light a flickering 24-hour Sanctuary Candle for loved ones and save your favorite verses in your private on-device Prayer Journal.
• Set Morning, Midday, and Evening Cathedral Bell reminders synced directly to your iPhone Calendar.

💎 SANCTUARY PASS VIP (SUBSCRIPTIONS & LIFETIME PASS)
• Free Tier includes 3 Sacred Vessel strikes per day and 108 core Gospel teachings.
• Upgrade to Sanctuary Pass VIP ($2.99/month, $19.99/year with a 7-Day Free Trial, or $49.99 One-Time Lifetime Eternal Pass) to unlock Unlimited 12 Sacred Vessels + the 13th Golden Miracle Chalice, all 365+ Daily Teachings, Night Rain Sleep Mode, and Unlimited 1080p HD Blessing Card exports.

Privacy Policy & Terms of Use (EULA):
• Privacy Policy: https://sanctuaryprayer.cloud/privacy-terms.html#privacy
• Terms of Use (EULA): https://sanctuaryprayer.cloud/privacy-terms.html#eula
• Standard Apple EULA: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
```

---

## 3. Cấu Hình Các Gói Thanh Toán (In-App Purchases & Subscriptions)
- **Entitlement Identifier (RevenueCat):** `sanctuary_vip`
- **Subscription Group Name:** `Sanctuary Pass VIP`
  1. **Gói Năm (Annual Pass - Mặc định & Khuyên dùng):**
     - **Product ID:** `com.sacredvessels.pass.yearly`
     - **Type:** Auto-Renewable Subscription
     - **Price:** `$19.99 / year` (Kèm **7-Day Free Trial**)
  2. **Gói Tháng (Monthly Pass):**
     - **Product ID:** `com.sacredvessels.pass.monthly`
     - **Type:** Auto-Renewable Subscription
     - **Price:** `$2.99 / month`
- **In-App Purchases (Non-Consumable / One-Time):**
  3. **Gói Trọn Đời (Founder's Lifetime Sanctuary Pass):**
     - **Product ID:** `com.sacredvessels.pass.lifetime`
     - **Type:** Non-Consumable (Mua 1 lần dùng vĩnh viễn)
     - **Price:** `$49.99`
  4. **Thẻ Quà Tặng 1 Năm (1-Year Sanctuary Gift Pass):**
     - **Product ID:** `com.sacredvessels.pass.gift1yr`
     - **Type:** Non-Renewing Subscription / Consumable Gift
     - **Price:** `$19.99`
