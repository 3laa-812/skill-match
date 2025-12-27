# دليل تشغيل مشروع Skill‑Match (بالعربي)

هذا الدليل يشرح الهدف من المشروع، المتطلبات، وطريقة تشغيل الواجهة الأمامية (Frontend) والخلفية (Backend) على جهازك، بالإضافة إلى روابط التوثيق التفاعلية (Swagger وReDoc).

## الهدف من المشروع
- منصة بسيطة لربط مهارات المستخدمين بالوظائف المناسبة.
- المستخدم يضيف مهاراته، والنظام يعرض وظائف متوافقة ويحسب نسبة التطابق.
- يوفر توثيقًا تفاعليًا للـ API ليسهّل التجربة والتكامل.

## المتطلبات
- Node.js 18+ (يفضل آخر نسخة مستقرة)
- MongoDB محليًا (أو Atlas)
- متصفح حديث

## هيكل المشروع
- `backend/` خدمة REST Express متصلة بـ MongoDB
- `frontend/` تطبيق Vite React مع React Query وواجهة حديثة

## التشغيل السريع

### 1) تشغيل الـ Backend
1. افتح تيرمينال داخل مجلد `backend`:
   ```
   cd backend
   npm install
   ```
2. تأكّد أن MongoDB يعمل (تشغيل الخدمة، أو فتح Compass والاتصال بـ `127.0.0.1:27017`).
3. شغّل السيرفر:
   ```
   node server.js
   ```
4. إذا تم التشغيل بنجاح سترى:
   - `Server running on port 5000`
   - `MongoDB Connected...`
5. قاعدة عنوان الـ API:
   - `http://localhost:5000`
6. التوثيق:
   - Swagger: `http://localhost:5000/api-docs`
   - ReDoc: `http://localhost:5000/redoc`

ملاحظات الإعداد:
- الاتصال بقاعدة البيانات مضبوط عبر `backend/config/default.json` إلى:
  ```
  mongodb://127.0.0.1:27017/skill_match_db
  ```
- تظهر قاعدة البيانات في Compass عند أول عملية كتابة (تسجيل مستخدم/إضافة مهارة/وظيفة).

مشاكل شائعة وحلولها:
- منفذ 5000 مشغول: أغلق أي خدمة أخرى أو غيّر المنفذ مؤقتًا.
- MongoDB غير شغال: شغّل خدمة MongoDB من Services أو افتح Compass وتأكد من الاتصال.
- خطأ 401 في الـ API: تأكد من إرسال هيدر `Authorization: Bearer <token>` في الطلبات المحمية.

### 2) تشغيل الـ Frontend
1. افتح تيرمينال جديد داخل مجلد `frontend`:
   ```
   cd frontend
   npm install
   ```
2. شغّل واجهة التطوير:
   ```
   npm run dev
   ```
3. افتح الرابط الذي يظهر في التيرمينال (عادةً عنوان محلي). تأكّد أن الـ Backend يعمل كي تعمل الصفحات المحمية ومطابقة الوظائف.

نصائح استخدام:
- بعد تسجيل الدخول، يتم حفظ التوكن محليًا. عند انتهاء الصلاحية، يتم إعادة التوجيه لـ `/login`.
- صفحة المطابقة تعتمد على مهارات المستخدم؛ أضف مهاراتك في صفحة `Skills` لرؤية نتائج.

## التوثيق (API Documentation)
- Swagger UI (تفاعلي): `http://localhost:5000/api-docs`
- ReDoc (قراءة مريحة): `http://localhost:5000/redoc`
- ملف الـ OpenAPI (JSON): `http://localhost:5000/openapi.json`

## نقاط نهاية أساسية
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Users:
  - `GET  /api/users/me`
  - `PUT  /api/users/skills`
- Skills:
  - `GET  /api/skills`
  - `POST /api/skills`
- Jobs:
  - `GET  /api/jobs`
  - `POST /api/jobs`
- Matching:
  - `GET  /api/matching`

## اختبار سريع (اختياري)
يمكنك تجربة إضافة مهارة ووظيفة ثم طلب المطابقة:
- أنشئ مستخدمًا وسجّل الدخول لتأخذ `token`.
- `POST /api/skills` لإضافة مهارة (بحاجة `Authorization`).
- `PUT /api/users/skills` لإسناد المهارة للمستخدم.
- `POST /api/jobs` لإنشاء وظيفة تحتوي نفس اسم المهارة.
- `GET /api/matching` للتحقق من عدد الوظائف المطابقة ونسبة التطابق.

## ملاحظات تصميم
- واجهة الـ Navbar تحتوي روابط مباشرة لـ Swagger وReDoc.
- صفحات الواجهة تستخدم React Query وتحميل كسول مع Skeletons لتحسين تجربة المستخدم.

بالتوفيق! إذا رغبت في نشر المشروع أو تشغيله بدون إنترنت تمامًا، يمكننا إضافة تكامل محلي كامل لصفحات التوثيق بدون الاعتماد على CDN. 
