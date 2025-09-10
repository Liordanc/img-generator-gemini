# תוכנית פרויקט: Gemini Image ChatBot

## 1. מטרות (Goals)

*   פיתוח אפליקציית צ'אטבוט מבוססת ווב ליצירה ועריכה של תמונות באמצעות Gemini API.
*   ממשק משתמש אינטואיטיבי ורספונסיבי המאפשר למשתמשים לתאר את התמונה הרצויה בטקסט.
*   הקמת שכבת "Artifacts" לניהול, מעקב ושיפור של כל התוצרים (תמונות) שנוצרו.
*   מתן אפשרות למשתמש לבקש עריכות לתמונה שנוצרה בשיחה המשכית ולעקוב אחר היסטוריית השינויים.
*   בנייה על תשתית Next.js מודרנית (App Router) ו-TypeScript לקבלת קוד איכותי וקל לתחזוקה.

## 2. ארכיטקטורה (Architecture)

*   **Frontend:**
    *   Framework: Next.js 14+ (App Router)
    *   Language: TypeScript
    *   Styling: Tailwind CSS
    *   State Management: React Hooks (`useState`, `useContext`)
    *   Components: `ChatPanel`, `ArtifactsPanel`, `ModeEditor`, `HistoryTimeline`.
*   **Backend (API Routes):**
    *   API Routes ב-Next.js תחת `/app/api/`.
    *   `/api/images/generate` & `/api/images/edit`: טיפול ביצירה ועריכה של תמונות.
    *   `/api/artifacts`: ניהול תוצרים (CRUD).
    *   תקשורת מאובטחת עם Gemini API דרך השרת.
*   **Data & Storage:**
    *   Database: Prisma ORM (עם SQLite כברירת מחדל לפיתוח מקומי).
    *   File Storage: שמירת תמונות במערכת הקבצים המקומית תחת `/public/artifacts/`.
    *   Fallback: מנגנון In-memory עם שמירה ל-JSON במקרה של היעדר DB.
*   **Gemini API:**
    *   שימוש ב-`@google/genai` SDK דרך שכבת שירות מופשטת (`/lib/gemini.ts`).
    *   מודלים: `imagen-4.0-generate-001`, `gemini-2.5-flash-image-preview`.

## 3. משימות (Tasks)

1.  **שלב 1: הגדרת הפרויקט (Setup)**
    *   [x] יצירת פרויקט Next.js חדש עם TypeScript ו-Tailwind CSS.
    *   [x] התקנת `@google/genai` SDK.
    *   [x] הגדרת משתני סביבה (`.env.local`).
    *   [x] יצירת מבנה תיקיות בסיסי.

2.  **שלב 2: בניית ממשק המשתמש הראשוני (UI)**
    *   [x] בניית קומפוננטת קלט (Input) לשליחת הודעות טקסט.
    *   [x] בניית קומפוננטה להצגת היסטוריית השיחה.
    *   [x] בניית קומפוננטה להצגת התמונה שנוצרה.
    *   [x] עיצוב כללי של האפליקציה, כולל מצבי טעינה ושגיאה.

3.  **שלב 3: אינטגרציה ראשונית עם Gemini API (Backend)**
    *   [x] יצירת Route Handler ב-Next.js לקבלת prompt מה-Frontend.
    *   [x] מימוש לוגיקה לקריאה ל-Gemini API ליצירת תמונה ראשונית.
    *   [x] מימוש לוגיקה לקריאה ל-Gemini API לעריכת תמונה קיימת.
    *   [x] חיבור Frontend ל-Backend.

4.  **שלב 4: הקמת שכבת Artifacts (DB, API, UI)**
    *   [x] הגדרת סכמת DB עם Prisma (`schema.prisma`).
    *   [x] יצירת שירותי DB (`/lib/db.ts`) ו-Storage (`/lib/storage.ts`).
    *   [x] יצירת שירותי Orchestration (`/lib/gemini.ts`, `/lib/prompts.ts`, `/lib/validators.ts`).
    *   [x] בניית API Routes חדשים: `/api/images/generate`, `/api/images/edit`, `/api/artifacts`.
    *   [x] בניית שלד לקומפוננטות UI: `ChatPanel`, `ArtifactsPanel`, `ModeEditor`, `HistoryTimeline`.
    *   [x] יצירת קבצי Smoke tests (ללא הרצה).

5.  **שלב 5: פיתוח מתקדם וחיבור מלא**
    *   [x] חיבור מלא של `ChatPanel` ל-API החדש של `generate/edit`.
    *   [x] מימוש מלא של פעולות ב-`ArtifactsPanel` (Refine, Duplicate, Compare, Revert) מול ה-API.
    *   [x] פיתוח `ModeEditor` לניהול תבניות פרומפטים, כולל יצירת תבניות מותאמות אישית.
    *   [x] פיתוח `HistoryTimeline` להצגת גרסאות.
    *   [x] שיפור חווית משתמש וטיפול מתקדם בשגיאות.
        *   [x] התאמת ממשק משתמש ל-RTL ותרגום לעברית.
        *   [x] הוספת אנימציות ושיפור משוב ויזואלי.

## 4. תוכנית בדיקות (Test Plan)

*   **בדיקות יחידה (Unit Tests):** שימוש ב-Jest/Vitest ו-React Testing Library לבדיקת קומפוננטות UI ולוגיקה עסקית.
*   **בדיקות אינטגרציה (Integration Tests):** בדיקת האינטראקציה בין קומפוננטות ה-UI וה-API Routes.
*   **בדיקות Smoke (ידניות):** הרצת קבצי test פשוטים מול ה-API routes לוודא תקינות בסיסית.
*   **בדיקות קצה-לקצה (E2E Tests):** שימוש ב-Cypress או Playwright לסימולציה של תרחישי שימוש מלאים.