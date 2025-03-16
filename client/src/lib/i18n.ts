import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      landing: {
        title: "Road Lightning Transport",
        subtitle: "Professional Transportation Services",
        loginButton: "Driver Login",
        adminButton: "Admin Login"
      },
      auth: {
        login: "Login",
        register: "Register",
        username: "Username",
        password: "Password",
        fullName: "Full Name",
        idNumber: "ID Number",
        licenseNumber: "License Number"
      },
      driver: {
        profile: "Driver Profile",
        vehicles: "My Vehicles",
        orders: "Operation Orders",
        newOrder: "New Operation Order"
      }
    }
  },
  ar: {
    translation: {
      landing: {
        title: "صاعقة الطريق للنقل",
        subtitle: "خدمات نقل احترافية",
        loginButton: "تسجيل دخول السائق",
        adminButton: "دخول المشرف"
      },
      auth: {
        login: "تسجيل الدخول",
        register: "تسجيل جديد",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        fullName: "الاسم الكامل",
        idNumber: "رقم الهوية",
        licenseNumber: "رقم الرخصة"
      },
      driver: {
        profile: "ملف السائق",
        vehicles: "مركباتي",
        orders: "أوامر التشغيل",
        newOrder: "أمر تشغيل جديد"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
