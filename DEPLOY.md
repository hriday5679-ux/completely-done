# AICTE FDR360 — Deployment & Firebase Setup Guide

This guide covers deploying AICTE FDR360 (SIH26265) to Firebase Hosting, configuring Firestore/Storage security rules, and enabling Google Sign-In and Email/Password providers.

---

## 1. Firebase Project Details
- **Project ID**: `endless-booking-cv4kj`
- **Auth Domain**: `endless-booking-cv4kj.firebaseapp.com`
- **Firestore Database ID**: `ai-studio-remixlastwork-f035445e-47ae-4b1a-a1a1-6952a95f7158`
- **Storage Bucket**: `endless-booking-cv4kj.firebasestorage.app`

---

## 2. Deploy to Firebase Hosting & Rules

### Step A: Build the Application
Run the standard build command:
```bash
npm run build
```
This compiles the SPA assets into the `dist/` directory.

### Step B: Deploy Hosting and Security Rules
Deploy using the Firebase CLI:
```bash
# Deploy Hosting (single-page rewrite enabled in firebase.json)
npx firebase-tools deploy --only hosting --project endless-booking-cv4kj

# Deploy Firestore Security Rules & Storage Rules
npx firebase-tools deploy --only firestore:rules,storage --project endless-booking-cv4kj
```
Once deployed, Firebase provides live URLs:
- `https://endless-booking-cv4kj.web.app`
- `https://endless-booking-cv4kj.firebaseapp.com`

---

## 3. Configure Firebase Authentication Settings (CRITICAL)

### Step A: Add Authorized Domains (Fixes `auth/unauthorized-domain`)
Firebase Authentication requires all domains that perform `signInWithPopup` or `signInWithRedirect` to be explicitly allowlisted in the Firebase Console.

1. Open **Firebase Console → Authentication → Settings**:
   👉 [https://console.firebase.google.com/project/endless-booking-cv4kj/authentication/settings](https://console.firebase.google.com/project/endless-booking-cv4kj/authentication/settings)
2. Scroll down to the **Authorized domains** card.
3. Click **Add domain** and add:
   - `endless-booking-cv4kj.web.app`
   - `endless-booking-cv4kj.firebaseapp.com`
   - `ais-pre-is4cihaguwa4jx2oc5d4do-864815853312.asia-southeast1.run.app`
   - `ais-dev-is4cihaguwa4jx2oc5d4do-864815853312.asia-southeast1.run.app`
   - Any custom domain linked to your institution
4. Click **Save**.

### Step B: Enable Google Sign-In Provider (Fixes `auth/operation-not-allowed`)
1. Open **Firebase Console → Authentication → Sign-in method**:
   👉 [https://console.firebase.google.com/project/endless-booking-cv4kj/authentication/providers](https://console.firebase.google.com/project/endless-booking-cv4kj/authentication/providers)
2. Under **Sign-in providers**, click **Google**.
3. Toggle the switch to **Enable**.
4. Select your **Project support email** from the dropdown menu.
5. Click **Save**.

### Step C: Enable Email/Password Provider
1. On the same **Sign-in method** page, click **Email/Password**.
2. Toggle **Enable** to ON (leave "Email link" OFF).
3. Click **Save**.

---

## 4. Google Sign-In Behavior & iframe Testing
- **Embedded Preview Frames**: In AI Studio's embedded preview iframe, third-party cookie restrictions in Chrome/Safari block OAuth popups. The portal automatically displays an informational banner with an **Open in new tab** button.
- **Standalone Tab / Deployed App**: When opened in a dedicated browser tab or at `https://endless-booking-cv4kj.web.app`, click **Sign in with Google**.
- **Role Assignment**: First-time Google users seamlessly transition to the `/select-type` onboarding screen to choose their AICTE or Institutional credentials, and return to their requested page.
