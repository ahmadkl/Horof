<div align="center">

<img src="assets/icons/icon-192.png" width="96" alt="Letters Game icon">

# 🎈 لعبة الحروف — Letters Game

**تعلّم الحروف العربية والإنجليزية باللعب والنطق**
*Learn Arabic & English letters by playing and listening*

![preview](assets/social-preview.png)

</div>

---

## ✨ المميزات

- 🇸🇦 **28 حرفاً عربياً** و 🇬🇧 **26 حرفاً إنجليزياً**، لكل حرف كلمة وصورة تعبيرية.
- 📖 **وضع التعلّم:** تنقّل بين الحروف واستمع إلى نطق الحرف والكلمة.
- ✏️ **تدريبات ممتعة:** أسئلة لا تنتهي بأسلوب الاختيار من متعدد.
- 🏆 **اختبار من 10 أسئلة** مع نجوم ونتيجة نهائية.
- 🔊 نطق صوتي عبر Web Speech API ومؤثرات صوتية بسيطة.
- 📱 يعمل على الجوال والحاسوب، ويمكن تثبيته كتطبيق (PWA) ويعمل بدون إنترنت.
- بدون أي مكتبات خارجية: HTML + CSS + JavaScript فقط.

## 📁 هيكل المشروع

```
letters-game/
├── index.html          # الصفحة الرئيسية
├── style.css           # التصميم
├── script.js           # منطق اللعبة
├── manifest.json       # إعدادات التطبيق (PWA)
├── sw.js               # العمل بدون إنترنت
├── .nojekyll           # لتشغيل GitHub Pages مباشرة
├── LICENSE
└── assets/
    ├── social-preview.png   # صورة المعاينة (1200×630)
    └── icons/               # الأيقونات (SVG + PNG)
```

## 🚀 التشغيل محلياً

افتح `index.html` في المتصفح مباشرة، أو شغّل خادماً محلياً (مطلوب لتجربة PWA):

```bash
python3 -m http.server 8000
# ثم افتح http://localhost:8000
```

## 🌐 النشر على GitHub Pages

1. أنشئ مستودعاً جديداً على GitHub وارفع محتويات هذا المجلد إليه (`index.html` في الجذر).
2. من **Settings ← Pages** اختر **Deploy from a branch**، ثم الفرع `main` والمجلد `/ (root)`.
3. بعد دقيقة يصبح الرابط: `https://<USERNAME>.github.io/<REPO>/`

أو عبر سطر الأوامر:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

> ملاحظة: جودة النطق العربي تعتمد على أصوات النظام في جهازك. إن لم يُسمع النطق، ثبّت صوتاً عربياً من إعدادات الجهاز.

## 🛠️ التخصيص

- لإضافة أو تعديل الحروف والكلمات: عدّل المصفوفتين `AR_LETTERS` و `EN_LETTERS` في `script.js`.
- لتغيير عدد أسئلة الاختبار: غيّر `TOTAL_QUIZ_QUESTIONS`.
- عند تعديل الملفات بعد النشر، ارفع رقم `CACHE` في `sw.js` (مثلاً `letters-game-v2`) ليصل التحديث للمستخدمين.

## 📄 الرخصة

MIT — انظر ملف [LICENSE](LICENSE).
