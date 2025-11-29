# 🔑 Free AI API Keys Guide

This app supports **3 FREE AI providers** with automatic fallback. You only need **ONE** API key to get started!

## 🚀 Recommended: Groq (Fastest & Most Generous)

**Why Groq?**
- ✅ **70,000+ requests per day** (FREE)
- ✅ **Fastest response time** (under 1 second)
- ✅ **No credit card required**
- ✅ **Best for this app**

**Get Your FREE Groq API Key:**

1. Visit: https://console.groq.com/keys
2. Sign up with Google/GitHub (takes 30 seconds)
3. Click "Create API Key"
4. Copy the key
5. Paste it in `backend/.env`:
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_your_key_here
   ```

---

## 🔷 Alternative 1: Google Gemini

**Why Gemini?**
- ✅ **60 requests per minute** (FREE)
- ✅ **Good quality responses**
- ✅ **Google account required**

**Get Your FREE Gemini API Key:**

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key
5. Paste it in `backend/.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=AIzaSy_your_key_here
   ```

---

## 🔶 Alternative 2: Cohere

**Why Cohere?**
- ✅ **100 requests per minute** (FREE trial)
- ✅ **Good for text generation**
- ✅ **Easy signup**

**Get Your FREE Cohere API Key:**

1. Visit: https://dashboard.cohere.com/api-keys
2. Sign up (email required)
3. Copy your trial API key
4. Paste it in `backend/.env`:
   ```env
   AI_PROVIDER=cohere
   COHERE_API_KEY=your_key_here
   ```

---

## 🔄 Automatic Fallback

The app **automatically tries all available providers** if one fails:

```env
# Add multiple keys for automatic fallback
AI_PROVIDER=groq
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=AIzaSy_xxx
COHERE_API_KEY=cohere_xxx
```

If Groq fails → tries Gemini → tries Cohere

---

## ⚡ Quick Start (Under 2 Minutes)

1. **Get Groq Key** (fastest): https://console.groq.com/keys
2. **Update `.env`**:
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_your_key_here
   ```
3. **Restart backend**:
   ```bash
   npm run dev
   ```
4. **Done!** Generate unlimited mind maps 🎉

---

## 💡 Pro Tips

- **Groq** is recommended for speed and generous limits
- **Gemini** is great if you already have a Google account
- **Cohere** is good for backup
- Add all 3 keys for maximum reliability
- Keys are 100% FREE with no credit card needed

---

## 🆘 Troubleshooting

**Error: "No AI provider configured"**
- Add at least one API key to `.env`

**Error: "429 Too Many Requests"**
- Switch to a different provider in `.env`
- Or wait a minute and try again

**Error: "Invalid API key"**
- Generate a new key from the provider's dashboard
- Make sure you copied the entire key

---

## 📊 Rate Limits Comparison

| Provider | Free Tier Limit | Speed | Recommended |
|----------|----------------|-------|-------------|
| **Groq** | 70K+ req/day | ⚡⚡⚡ | ✅ **YES** |
| Gemini | 60 req/min | ⚡⚡ | Good |
| Cohere | 100 req/min | ⚡ | Backup |

Choose **Groq** for the best experience! 🚀
