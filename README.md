# to_do_firebase

A to-do app with accounts, shared groups, tags, and subtasks, backed by Firebase.

**What it is**

A learning project for getting comfortable with Next.js and the Firebase Realtime Database. It supports email and Google sign-in, personal and shared task groups, tags, nested subtasks, and per-group member requests. The point was to wire a React frontend directly to Firebase auth and a live database, so most of the logic lives in `pages/index.tsx` and the `components/` tree rather than a separate backend.

Live: https://to-do-firebase-seven.vercel.app

**Run it**

```bash
npm install
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Firebase config is hardcoded in `firebase_setup.js`, so no `.env` is needed to run it locally.

**Stack**

Next.js 13, TypeScript, React 18, Firebase 9 (Realtime Database + Auth), React-Bootstrap.
