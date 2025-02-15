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
          // New translations
          "deposit": "Deposit",
          "depositing": "Depositing...",
          "depositSuccess": "Deposit successful",
          "depositSuccessMessage": "Your money has been added to your account",
          "depositFailed": "Deposit failed",
          // New translations for deposit methods
          "cash": "Cash",
          "creditCard": "Credit Card",
          "bankTransfer": "Bank Transfer",
          "cardNumber": "Card Number",
          "expiryDate": "Expiry Date",
          "bankName": "Bank Name",
          "swiftCode": "SWIFT Code",
          "selectPaymentMethod": "Select Payment Method",

          // Pickup locations
          "pickupLocation": "Pickup Location",
          "selectPickupLocation": "Select Pickup Location",
          "pickupLocationDescription": "Select where the recipient can collect the money",
          "transferMethod": "Transfer Method",
          "selectTransferMethod": "Select Transfer Method",

          // Bank transfer
          "bankTransferInstructions": "Bank Transfer Instructions",
          "bankTransferDescription": "Please transfer the money to the following bank account",

          // Credit card
          "creditCardInstructions": "Credit Card Payment",
          "creditCardDescription": "Enter your credit card details to complete the deposit",

          // Success messages
          "transferSuccess": "Transfer Successful",
          "transferSuccessMessage": "Money has been transferred successfully. The recipient can collect it from the selected location.",
          "depositSuccess": "Deposit Successful",
          "depositSuccessMessage": "Your money has been added to your account",
          "depositFailed": "Deposit Failed",

          // Locations
          "Damascus": "Damascus",
          "Aleppo": "Aleppo",
          "Rif-Dimashk": "Rif-Dimashk",
          "Lattakia": "Lattakia",
          "Homs": "Homs"
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
          // New translations
          "deposit": "إيداع",
          "depositing": "جاري الإيداع...",
          "depositSuccess": "تم الإيداع بنجاح",
          "depositSuccessMessage": "تم إضافة المال إلى حسابك",
          "depositFailed": "فشل الإيداع",
          // New translations for deposit methods
          "cash": "نقداً",
          "creditCard": "بطاقة ائتمان",
          "bankTransfer": "حوالة مصرفية",
          "cardNumber": "رقم البطاقة",
          "expiryDate": "تاريخ الانتهاء",
          "bankName": "اسم البنك",
          "swiftCode": "رمز السويفت",
          "selectPaymentMethod": "اختر طريقة الدفع",

          // Pickup locations
          "pickupLocation": "موقع الاستلام",
          "selectPickupLocation": "اختر موقع الاستلام",
          "pickupLocationDescription": "اختر المكان الذي يمكن للمستلم استلام الأموال منه",
          "transferMethod": "طريقة التحويل",
          "selectTransferMethod": "اختر طريقة التحويل",

          // Bank transfer
          "bankTransferInstructions": "تعليمات التحويل المصرفي",
          "bankTransferDescription": "يرجى تحويل الأموال إلى الحساب المصرفي التالي",

          // Credit card
          "creditCardInstructions": "الدفع ببطاقة الائتمان",
          "creditCardDescription": "أدخل تفاصيل بطاقة الائتمان لإكمال الإيداع",

          // Success messages
          "transferSuccess": "تم التحويل بنجاح",
          "transferSuccessMessage": "تم تحويل الأموال بنجاح. يمكن للمستلم استلامها من الموقع المحدد.",
          "depositSuccess": "تم الإيداع بنجاح",
          "depositSuccessMessage": "تمت إضافة الأموال إلى حسابك",
          "depositFailed": "فشل الإيداع",

          // Locations
          "Damascus": "دمشق",
          "Aleppo": "حلب",
          "Rif-Dimashk": "ريف دمشق",
          "Lattakia": "اللاذقية",
          "Homs": "حمص"
        }
      }
    }
  });

export default i18n;