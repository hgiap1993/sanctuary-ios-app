/**
 * ============================================================================
 * SANCTUARY: JESUS DAILY PRAYER — 100% AUTOMATED CLOUDFLARE WEB PUSH WORKER
 * ============================================================================
 * Zero-dependency Cloudflare Worker + Cron Trigger (RFC 8292 VAPID ES256)
 *
 * Features:
 * 1. POST /api/push/subscribe   -> Saves user PushSubscription + timezone & bell hours in KV
 * 2. POST /api/push/unsubscribe -> Removes user PushSubscription from KV
 * 3. POST /api/push/test        -> Sends immediate real Web Push to the user's device
 * 4. POST /api/push/broadcast   -> Admin broadcast to all subscribers
 * 5. GET  /api/push/latest      -> Returns today's dynamic Red-Letter Word of Jesus & Prayer
 * 6. Cron Trigger (0 * * * *)   -> Runs every hour, matches each subscriber's local
 *                                  Morning (8 AM) & Night Sleep (9 PM) bell, and sends
 *                                  a real lock-screen push notification automatically!
 */

const DEFAULT_VAPID_PUBLIC_KEY =
  "BI2MjL6A4LjEFE2YxNE2bLp0_xMVvnoKZ_Pa_Bi-imPOE6h-YKIX9ke2VDMlvQIfMDJOcN0RCwxg3xQ65ykCTZA";

const DEFAULT_VAPID_JWK = {
  kty: "EC",
  crv: "P-256",
  x: "jYyMvoDguMQUTZjE0TZsunT_ExW-egpn89r8GL6KY84",
  y: "E6h-YKIX9ke2VDMlvQIfMDJOcN0RCwxg3xQ65ykCTZA",
  d: "CHdUrTALOVB9A0N3XlS9UyF0GiXLTkv-lXuwviM1di8",
  ext: true
};

const DAILY_BLESSINGS_ROTATION = [
  {
    theme: "Divine Peace",
    ref: "JOHN 14:27",
    verse: "Peace I leave with you; my peace I give to you. Let not your hearts be troubled, neither let them be afraid.",
    morningTitle: "⚱️ Morning Sanctuary Bell — John 14:27",
    eveningTitle: "🌙 Night Sleep Sanctuary — John 14:27"
  },
  {
    theme: "Rest for the Weary",
    ref: "MATTHEW 11:28",
    verse: "Come to me, all who labor and are heavy laden, and I will give you rest.",
    morningTitle: "⚱️ Jesus's Word for Your Heart — Matthew 11:28",
    eveningTitle: "🌙 Rest Your Weary Soul Tonight — Matthew 11:28"
  },
  {
    theme: "Unfailing Presence",
    ref: "MATTHEW 28:20",
    verse: "Behold, I am with you always, to the end of the age.",
    morningTitle: "⚱️ You Are Never Alone Today — Matthew 28:20",
    eveningTitle: "🌙 Sleep in Christ's Protection — Matthew 28:20"
  },
  {
    theme: "Light of the World",
    ref: "JOHN 8:12",
    verse: "I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life.",
    morningTitle: "⚱️ Walk in His Light Today — John 8:12",
    eveningTitle: "🌙 Night Rain & Jesus's Peace — John 8:12"
  },
  {
    theme: "Overcoming Anxiety",
    ref: "MATTHEW 6:34",
    verse: "Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself.",
    morningTitle: "⚱️ Release Every Worry Today — Matthew 6:34",
    eveningTitle: "🌙 Exhale Today's Worries & Sleep — Matthew 6:34"
  },
  {
    theme: "Miracle Faith",
    ref: "MARK 11:24",
    verse: "Whatever you ask in prayer, believe that you have received it, and it will be yours.",
    morningTitle: "⚱️ Break Your Morning Sacred Vessel — Mark 11:24",
    eveningTitle: "🌙 Night Prayer & Sanctuary Candle — Mark 11:24"
  },
  {
    theme: "Abiding Love",
    ref: "JOHN 15:9",
    verse: "As the Father has loved me, so have I loved you. Abide in my love.",
    morningTitle: "⚱️ Sunday Apostolic Blessing — John 15:9",
    eveningTitle: "🌙 Rest in the Father's Love — John 15:9"
  }
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key"
};

function base64UrlEncodeString(str) {
  const bytes = new TextEncoder().encode(str);
  return base64UrlEncodeBytes(bytes);
}

function base64UrlEncodeBytes(bytes) {
  let binary = "";
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < arr.byteLength; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function getDayOfYear(date = new Date()) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

function buildDailyPayload(type = "morning") {
  const dayNum = getDayOfYear();
  const item = DAILY_BLESSINGS_ROTATION[dayNum % DAILY_BLESSINGS_ROTATION.length];
  const isEvening = type === "evening";
  return {
    title: isEvening ? item.eveningTitle : item.morningTitle,
    body: `“${item.verse}” — Tap to break your Sacred Vessel & hear the Angel pray aloud.`,
    tag: `sanctuary-${type}-${dayNum}`,
    url: isEvening
      ? "https://sanctuaryprayer.cloud/?from_push=sleep"
      : `https://sanctuaryprayer.cloud/?verse=${(dayNum % 365) + 1}&from_push=morning`,
    icon: "https://sanctuaryprayer.cloud/icon-192.png",
    badge: "https://sanctuaryprayer.cloud/icon-192.png",
    theme: item.theme,
    ref: item.ref,
    timestamp: Date.now()
  };
}

async function createVapidJwt(endpointUrl, env) {
  const urlObj = new URL(endpointUrl);
  const audience = `${urlObj.protocol}//${urlObj.host}`;
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600;
  const sub = (env && env.VAPID_SUBJECT) || "mailto:support@sanctuaryprayer.cloud";

  const headerB64 = base64UrlEncodeString(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const payloadB64 = base64UrlEncodeString(JSON.stringify({ aud: audience, exp, sub }));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  const jwk = (env && env.VAPID_JWK_JSON) ? JSON.parse(env.VAPID_JWK_JSON) : DEFAULT_VAPID_JWK;
  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const sigB64 = base64UrlEncodeBytes(new Uint8Array(signatureBuffer));
  return `${unsignedToken}.${sigB64}`;
}

async function sendVapidWakePush(subscription, env) {
  if (!subscription || !subscription.endpoint) {
    return { ok: false, status: 400 };
  }
  const publicKey = (env && env.VAPID_PUBLIC_KEY) || DEFAULT_VAPID_PUBLIC_KEY;
  const jwt = await createVapidJwt(subscription.endpoint, env);

  const response = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      TTL: "86400",
      Urgency: "high",
      "Content-Length": "0",
      Authorization: `vapid t=${jwt}, k=${publicKey}`
    }
  });

  return {
    ok: response.ok || response.status === 201,
    status: response.status
  };
}

async function hashEndpointId(endpoint) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(endpoint));
  return "sub_" + base64UrlEncodeBytes(new Uint8Array(digest)).slice(0, 28);
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // 1. GET /api/push/status or /api/push/latest
    if (request.method === "GET" && (path.endsWith("/status") || path.endsWith("/latest"))) {
      let customLatest = null;
      if (env && env.SANCTUARY_PUSH_KV) {
        try {
          customLatest = await env.SANCTUARY_PUSH_KV.get("latest_broadcast_payload", "json");
        } catch (e) {}
      }
      const hourUtc = new Date().getUTCHours();
      const defaultPayload = buildDailyPayload(hourUtc >= 18 || hourUtc <= 3 ? "evening" : "morning");
      const activePayload = (customLatest && Date.now() - customLatest.timestamp < 3600 * 1000)
        ? customLatest
        : defaultPayload;

      return new Response(
        JSON.stringify({
          ok: true,
          vapidPublicKey: (env && env.VAPID_PUBLIC_KEY) || DEFAULT_VAPID_PUBLIC_KEY,
          notification: activePayload
        }),
        {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json", "Cache-Control": "no-store" }
        }
      );
    }

    // 2. POST /api/push/subscribe
    if (request.method === "POST" && path.endsWith("/subscribe")) {
      try {
        const body = await request.json();
        const subscription = body.subscription;
        if (!subscription || !subscription.endpoint) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid subscription" }), {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
          });
        }
        const subId = await hashEndpointId(subscription.endpoint);
        const record = {
          id: subId,
          subscription,
          tzOffsetMinutes: typeof body.tzOffsetMinutes === "number" ? body.tzOffsetMinutes : 0,
          morningHour: typeof body.morningHour === "number" ? body.morningHour : 8,
          eveningHour: typeof body.eveningHour === "number" ? body.eveningHour : 21,
          updatedAt: Date.now()
        };

        if (env && env.SANCTUARY_PUSH_KV) {
          await env.SANCTUARY_PUSH_KV.put(subId, JSON.stringify(record));
        }

        return new Response(
          JSON.stringify({
            ok: true,
            subId,
            message: "Subscribed to Automated Cloudflare Sanctuary Push"
          }),
          { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: String(err) }), {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      }
    }

    // 3. POST /api/push/unsubscribe
    if (request.method === "POST" && path.endsWith("/unsubscribe")) {
      try {
        const body = await request.json();
        if (body.endpoint && env && env.SANCTUARY_PUSH_KV) {
          const subId = await hashEndpointId(body.endpoint);
          await env.SANCTUARY_PUSH_KV.delete(subId);
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: String(err) }), {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      }
    }

    // 4. POST /api/push/test — Instant real Web Push test to the caller's subscription
    if (request.method === "POST" && path.endsWith("/test")) {
      try {
        const body = await request.json();
        const subscription = body.subscription;
        if (!subscription || !subscription.endpoint) {
          return new Response(JSON.stringify({ ok: false, error: "Missing subscription" }), {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
          });
        }
        const pushRes = await sendVapidWakePush(subscription, env);
        return new Response(
          JSON.stringify({
            ok: pushRes.ok,
            status: pushRes.status,
            notification: buildDailyPayload("morning")
          }),
          { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: String(err) }), {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      }
    }

    // 5. POST /api/push/broadcast — Admin custom push broadcast
    if (request.method === "POST" && path.endsWith("/broadcast")) {
      try {
        const body = await request.json();
        const adminKey = request.headers.get("X-Admin-Key") || body.adminKey;
        const expectedKey = (env && env.ADMIN_SECRET_KEY) || "sanctuary-admin-2026";
        if (adminKey !== expectedKey) {
          return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
            status: 401,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
          });
        }

        const customPayload = {
          title: body.title || "⚱️ Sanctuary: A Special Word from Jesus",
          body: body.body || "Tap here to break your Sacred Vessel and receive today's blessing.",
          tag: "sanctuary-broadcast-" + Date.now(),
          url: body.url || "https://sanctuaryprayer.cloud/?from_push=broadcast",
          icon: "https://sanctuaryprayer.cloud/icon-192.png",
          badge: "https://sanctuaryprayer.cloud/icon-192.png",
          timestamp: Date.now()
        };

        let sent = 0;
        let removed = 0;
        if (env && env.SANCTUARY_PUSH_KV) {
          await env.SANCTUARY_PUSH_KV.put("latest_broadcast_payload", JSON.stringify(customPayload));
          const list = await env.SANCTUARY_PUSH_KV.list({ prefix: "sub_" });
          for (const key of list.keys) {
            const rec = await env.SANCTUARY_PUSH_KV.get(key.name, "json");
            if (rec && rec.subscription) {
              const res = await sendVapidWakePush(rec.subscription, env);
              if (res.ok) sent++;
              else if (res.status === 404 || res.status === 410) {
                await env.SANCTUARY_PUSH_KV.delete(key.name);
                removed++;
              }
            }
          }
        }

        return new Response(JSON.stringify({ ok: true, sent, removed, payload: customPayload }), {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: String(err) }), {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      }
    }

    return new Response(
      JSON.stringify({
        service: "Sanctuary Cloudflare Automated Web Push Worker",
        status: "online",
        vapidPublicKey: (env && env.VAPID_PUBLIC_KEY) || DEFAULT_VAPID_PUBLIC_KEY
      }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  },

  // ============================================================================
  // AUTOMATED CRON TRIGGER (Runs hourly: `0 * * * *`)
  // Automatically checks each subscriber's local timezone and sends Morning (8 AM)
  // & Night Sleep (9 PM) lock-screen push notifications!
  // ============================================================================
  async scheduled(event, env, ctx) {
    if (!env || !env.SANCTUARY_PUSH_KV) return;
    const nowUtc = new Date();
    const utcMinutes = nowUtc.getUTCHours() * 60 + nowUtc.getUTCMinutes();

    const list = await env.SANCTUARY_PUSH_KV.list({ prefix: "sub_" });
    for (const key of list.keys) {
      try {
        const rec = await env.SANCTUARY_PUSH_KV.get(key.name, "json");
        if (!rec || !rec.subscription) continue;

        // Calculate subscriber's local hour
        const offsetMins = typeof rec.tzOffsetMinutes === "number" ? rec.tzOffsetMinutes : 0;
        const localTotalMins = (utcMinutes - offsetMins + 1440) % 1440;
        const localHour = Math.floor(localTotalMins / 60);

        const morningHour = typeof rec.morningHour === "number" ? rec.morningHour : 8;
        const eveningHour = typeof rec.eveningHour === "number" ? rec.eveningHour : 21;

        if (localHour === morningHour || localHour === eveningHour) {
          const res = await sendVapidWakePush(rec.subscription, env);
          if (res.status === 404 || res.status === 410) {
            await env.SANCTUARY_PUSH_KV.delete(key.name);
          }
        }
      } catch (e) {}
    }
  }
};
