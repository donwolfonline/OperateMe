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
        driverLogin: "Driver Login",
        adminLogin: "Admin Login",
        registerAsDriver: "Register as a Driver",
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
        newOrder: "New Operation Order",
        uploadId: "Upload ID Document",
        uploadLicense: "Upload License Document",
        uploadProfileImage: "Upload Profile Image"
      },
      vehicle: {
        type: "Vehicle Type",
        model: "Vehicle Model",
        year: "Manufacturing Year",
        plateNumber: "Plate Number",
        photos: "Vehicle Photos",
        save: "Save Vehicle"
      },
      order: {
        fromCity: "From City",
        toCity: "To City",
        departureTime: "Departure Time",
        create: "Create Order",
        selectCity: "Select City",
        passengers: "Passengers",
        addPassenger: "Add Passenger",
        removePassenger: "Remove Passenger",
        nationality: "Nationality",
        visaType: "Visa Type",
        tripNumber: "Trip Number",
        documentReady: "Document Ready",
        downloadPdf: "Download PDF"
      },
      admin: {
        dashboard: "Admin Dashboard",
        pendingDrivers: "Pending Drivers",
        activeDrivers: "Active Drivers",
        suspendedDrivers: "Suspended Drivers",
        approve: "Approve",
        suspend: "Suspend",
        activate: "Activate",
        noDrivers: "No pending drivers",
        noActiveDrivers: "No active drivers",
        noSuspendedDrivers: "No suspended drivers",
        allOrders: "All Orders",
        noOrders: "No orders found",
        orders: "Orders"
      },
      common: {
        logout: "Logout",
        saving: "Saving..."
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
        driverLogin: "تسجيل دخول السائق",
        adminLogin: "دخول المشرف",
        registerAsDriver: "تسجيل سائق جديد",
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
        newOrder: "أمر تشغيل جديد",
        uploadId: "رفع صورة الهوية",
        uploadLicense: "رفع صورة الرخصة",
        uploadProfileImage: "رفع صورة الملف الشخصي"
      },
      vehicle: {
        type: "نوع المركبة",
        model: "موديل المركبة",
        year: "سنة التصنيع",
        plateNumber: "رقم اللوحة",
        photos: "صور المركبة",
        save: "حفظ المركبة"
      },
      order: {
        fromCity: "مدينة الانطلاق",
        toCity: "مدينة الوصول",
        departureTime: "وقت المغادرة",
        create: "إنشاء الطلب",
        selectCity: "اختر المدينة",
        passengers: "الركاب",
        addPassenger: "إضافة راكب",
        removePassenger: "حذف الراكب",
        nationality: "الجنسية",
        visaType: "نوع التأشيرة",
        tripNumber: "رقم الرحلة",
        documentReady: "المستند جاهز",
        downloadPdf: "تحميل PDF"
      },
      admin: {
        dashboard: "لوحة تحكم المشرف",
        pendingDrivers: "السائقين المعلقين",
        activeDrivers: "السائقين النشطين",
        suspendedDrivers: "السائقين الموقوفين",
        approve: "موافقة",
        suspend: "إيقاف",
        activate: "تفعيل",
        noDrivers: "لا يوجد سائقين معلقين",
        noActiveDrivers: "لا يوجد سائقين نشطين",
        noSuspendedDrivers: "لا يوجد سائقين موقوفين",
        allOrders: "جميع الطلبات",
        noOrders: "لا يوجد طلبات",
        orders: "الطلبات"
      },
      common: {
        logout: "تسجيل الخروج",
        saving: "جاري الحفظ..."
      }
    }
  },
  ur: {
    translation: {
      landing: {
        title: "روڈ لائٹننگ ٹرانسپورٹ",
        subtitle: "پیشہ ورانہ ٹرانسپورٹ سروسز",
        loginButton: "ڈرائیور لاگ ان",
        adminButton: "ایڈمن لاگ ان"
      },
      auth: {
        driverLogin: "ڈرائیور لاگ ان",
        adminLogin: "ایڈمن لاگ ان",
        registerAsDriver: "بطور ڈرائیور رجسٹر کریں",
        login: "لاگ ان",
        register: "رجسٹر",
        username: "صارف نام",
        password: "پاس ورڈ",
        fullName: "پورا نام",
        idNumber: "شناختی نمبر",
        licenseNumber: "لائسنس نمبر"
      },
      driver: {
        profile: "ڈرائیور پروفائل",
        vehicles: "میری گاڑیاں",
        orders: "آپریشن آرڈرز",
        newOrder: "نیا آپریشن آرڈر",
        uploadId: "شناختی دستاویز اپلوڈ کریں",
        uploadLicense: "لائسنس دستاویز اپلوڈ کریں",
        uploadProfileImage: "پروفائل تصویر اپلوڈ کریں"
      },
      vehicle: {
        type: "گاڑی کی قسم",
        model: "گاڑی کا ماڈل",
        year: "تیاری کا سال",
        plateNumber: "پلیٹ نمبر",
        photos: "گاڑی کی تصاویر",
        save: "گاڑی محفوظ کریں"
      },
      order: {
        fromCity: "کس شہر سے",
        toCity: "کس شہر تک",
        departureTime: "روانگی کا وقت",
        create: "آرڈر بنائیں",
        selectCity: "شہر منتخب کریں",
        passengers: "مسافر",
        addPassenger: "مسافر شامل کریں",
        removePassenger: "مسافر ہٹائیں",
        nationality: "قومیت",
        visaType: "ویزا کی قسم",
        tripNumber: "سفر نمبر",
        documentReady: "دستاویز تیار ہے",
        downloadPdf: "PDF ڈاؤنلوڈ کریں"
      },
      admin: {
        dashboard: "ایڈمن ڈیش بورڈ",
        pendingDrivers: "زیر التواء ڈرائیور",
        activeDrivers: "فعال ڈرائیور",
        suspendedDrivers: "معطل ڈرائیور",
        approve: "منظور کریں",
        suspend: "معطل کریں",
        activate: "فعال کریں",
        noDrivers: "کوئی زیر التواء ڈرائیور نہیں",
        noActiveDrivers: "کوئی فعال ڈرائیور نہیں",
        noSuspendedDrivers: "کوئی معطل ڈرائیور نہیں",
        allOrders: "تمام آرڈرز",
        noOrders: "کوئی آرڈر نہیں ملا",
        orders: "آرڈرز"
      },
      common: {
        logout: "لاگ آؤٹ",
        saving: "محفوظ کیا جا رہا ہے..."
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