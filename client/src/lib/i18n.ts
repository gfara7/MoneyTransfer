import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // Auth Page
          "welcome": "Welcome to MoneyTransfer",
          "login": "Login",
          "register": "Register",
          "username": "Username",
          "password": "Password",
          "createAccount": "Create account",
          "loggingIn": "Logging in...",
          "creatingAccount": "Creating account...",
          "secureTransfers": "Secure Money Transfers",
          "transferDescription": "Send money to friends and family securely and instantly. Create an account or login to get started with digital transfers today.",

          // Home Page
          "welcome_user": "Welcome, {{username}}",
          "logout": "Logout",
          "loggingOut": "Logging out...",
          
          // Account Card
          "yourAccount": "Your Account",
          "currentBalance": "Current Balance",
          "accountNumber": "Account Number",

          // Transfer Form
          "sendMoney": "Send Money",
          "recipientUsername": "Recipient Username",
          "amount": "Amount",
          "currency": "Currency",
          "description": "Description (Optional)",
          "sending": "Sending...",
          "send": "Send Money",
          "exchangeRate": "Exchange Rate",
          "loadingRate": "Loading exchange rate...",

          // Transactions List
          "recentTransactions": "Recent Transactions",
          "date": "Date",
          "noTransactions": "No transactions yet",
        }
      },
      ar: {
        translation: {
          // Auth Page
          "welcome": "مرحباً بك في تحويل الأموال",
          "login": "تسجيل الدخول",
          "register": "إنشاء حساب",
          "username": "اسم المستخدم",
          "password": "كلمة المرور",
          "createAccount": "إنشاء حساب",
          "loggingIn": "جاري تسجيل الدخول...",
          "creatingAccount": "جاري إنشاء الحساب...",
          "secureTransfers": "تحويلات مالية آمنة",
          "transferDescription": "أرسل الأموال إلى الأصدقاء والعائلة بشكل آمن وفوري. قم بإنشاء حساب أو تسجيل الدخول للبدء في التحويلات الرقمية اليوم.",

          // Home Page
          "welcome_user": "مرحباً، {{username}}",
          "logout": "تسجيل الخروج",
          "loggingOut": "جاري تسجيل الخروج...",

          // Account Card
          "yourAccount": "حسابك",
          "currentBalance": "الرصيد الحالي",
          "accountNumber": "رقم الحساب",

          // Transfer Form
          "sendMoney": "إرسال الأموال",
          "recipientUsername": "اسم المستخدم المستلم",
          "amount": "المبلغ",
          "currency": "العملة",
          "description": "الوصف (اختياري)",
          "sending": "جاري الإرسال...",
          "send": "إرسال الأموال",
          "exchangeRate": "سعر الصرف",
          "loadingRate": "جاري تحميل سعر الصرف...",

          // Transactions List
          "recentTransactions": "المعاملات الأخيرة",
          "date": "التاريخ",
          "noTransactions": "لا توجد معاملات حتى الآن",
        }
      }
    }
  });

export default i18n;
