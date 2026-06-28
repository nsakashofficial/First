# Meetwoyou — Full Static Web App

A complete social-media web app (Feed, Reels, Stories, Messages with voice + reactions, Post Insights with viewer geography/age/gender, Notifications, Advanced Admin with Chart.js, Privacy/Terms pages, PWA installable, offline-ready).

Everything is plain **HTML + CSS + JS** so you can drop it into any static host — GitHub Pages, Netlify, Cloudflare Pages, Vercel, or your own server. The backend is your existing **Firebase** project + **Cloudinary** for media. No build step.

## Files
| File | What it does |
|---|---|
| `index.html` | Splash + sign in / sign up / forgot password |
| `dashboard.html` | Main app — feed, reels, stories, messages, profile, notifications, settings, post insights |
| `messenger.html` | Standalone, downloadable messenger app (voice, reactions, typing, read receipts) |
| `admin.html` | Admin panel — users / posts / reports / broadcast / bugs / activity logs / Chart.js analytics |
| `privacy.html` · `terms.html` · `about.html` | Legal & info pages |
| `sw.js` | Service worker (network-first HTML, stale-while-revalidate for assets) |
| `manifest.json` · `site.webmanifest` | PWA install manifests |
| Icons (`favicon-*.png`, `apple-touch-icon.png`, `web-app-manifest-*.png`, `favicon.svg`) | App icons used everywhere |

## Deploy to GitHub Pages
1. Create a new GitHub repo (e.g. `meetwoyou-app`).
2. Upload **every file from this folder** to the repo root.
3. Repo → Settings → Pages → Build from: `main` branch, `/ (root)`.
4. Visit `https://<your-user>.github.io/<repo>/`.
5. Add the published URL to **Firebase Console → Authentication → Settings → Authorized domains** so Google sign-in works.

> Tip: the existing `meetwoyou.github.io` repo is your live host. Just commit the new files there to replace the old version.

## Firestore — quick rules suggestion
Open Firebase Console → Firestore → Rules and paste something like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }
    match /posts/{id} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null;
      match /analytics/{viewer} {
        allow read: if request.auth != null;
        allow write: if request.auth.uid == viewer;
      }
    }
    match /stories/{id} { allow read, write: if request.auth != null; }
    match /messages/{id} { allow read, write: if request.auth != null; }
    match /typing/{id} { allow read, write: if request.auth != null; }
    match /notifications/{id} { allow read, write: if request.auth != null; }
    match /reports/{id} { allow read, write: if request.auth != null; }
    match /bugs/{id} { allow read, write: if request.auth != null; }
    match /logs/{id} { allow read, write: if request.auth.token.email == "admin@meetwoyou.com"; }
  }
}
```

## What's new vs. the previous version
- **Reels** — vertical short-video tab with snap scrolling
- **Notifications** — in-app bell, push-style list, mark all read
- **Post Insights** — per-post viewer country, city, age bucket, gender, recent viewers list (uses `ipapi.co`)
- **Video views counter** — auto-incremented when a video enters the viewport
- **Advanced Messenger** — voice notes (hold mic), reactions ❤️😂😮😢👍🔥, typing indicator, read receipts, separate downloadable `messenger.html` shortcut from the PWA
- **Verification badges** — Blue, Gold, Silver tiers (admin can switch tier per user)
- **Advanced Admin** — Chart.js growth / posts / countries / engagement charts, **Broadcast** to all or verified-only, **Bug reports**, CSV export, active-now stats, badge-tier control
- **Settings revamp** — granular privacy toggles, notifications toggles, theme, language, download my data, clear cache, blocked users, links to privacy/terms/about
- **Performance** — preconnect to every third-party origin, modulepreload Firebase SDK, deferred Font-Awesome, network-first SW for HTML so updates land instantly, app-shell splash
- **PWA shortcuts** — long-press the home icon to jump straight to Messages or Reels
- All the previous features (auth, Google sign-in, posts, stories, comments, likes, follow, chat, profile edit, V-badge link, admin boost) are kept intact.

## Credentials reminder
The Firebase config in the source is the existing **meetwoyou-436a2** project. The admin panel only opens for the email `admin@meetwoyou.com`.

— Founder & CEO: **Sabbir Hosen Akash**
