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
        uploadLicense: "Upload License Document"
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
        passengerName: "Passenger Name",
        passengerPhone: "Passenger Phone",
        fromCity: "From City",
        toCity: "To City",
        departureTime: "Departure Time",
        create: "Create Order"
      },
      admin: {
        dashboard: "Admin Dashboard",
        pendingDrivers: "Pending Drivers",
        activeDrivers: "Active Drivers",
        suspendedDrivers: "Suspended Drivers",
        tripRequests: "Trip Requests",
        approve: "Approve",
        suspend: "Suspend",
        activate: "Activate",
        noDrivers: "No pending drivers",
        noActiveDrivers: "No active drivers",
        noSuspendedDrivers: "No suspended drivers",
        noTripRequests: "No pending trip requests",
        approveTrip: "Approve Trip",
        rejectTrip: "Reject Trip"
      },
      trips: {
        from: "From",
        to: "To",
        status: "Status",
        date: "Date"
      },
      common: {
        logout: "Logout"
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
      vehicle: {
        type: "نوع المركبة",
        model: "موديل المركبة",
        year: "سنة التصنيع",
        plateNumber: "رقم اللوحة",
        photos: "صور المركبة",
        save: "حفظ المركبة"
      },
      order: {
        passengerName: "اسم الراكب",
        passengerPhone: "رقم هاتف الراكب",
        fromCity: "مدينة الانطلاق",
        toCity: "مدينة الوصول",
        departureTime: "وقت المغادرة",
        create: "إنشاء الطلب"
      },
      driver: {
        profile: "ملف السائق",
        vehicles: "مركباتي",
        orders: "أوامر التشغيل",
        newOrder: "أمر تشغيل جديد",
        uploadId: "رفع صورة الهوية",
        uploadLicense: "رفع صورة الرخصة"
      },
      admin: {
        dashboard: "لوحة تحكم المشرف",
        pendingDrivers: "السائقين المعلقين",
        activeDrivers: "السائقين النشطين",
        suspendedDrivers: "السائقين الموقوفين",
        tripRequests: "طلبات الرحلات",
        approve: "موافقة",
        suspend: "إيقاف",
        activate: "تفعيل",
        noDrivers: "لا يوجد سائقين معلقين",
        noActiveDrivers: "لا يوجد سائقين نشطين",
        noSuspendedDrivers: "لا يوجد سائقين موقوفين",
        noTripRequests: "لا يوجد طلبات رحلات معلقة",
        approveTrip: "الموافقة على الرحلة",
        rejectTrip: "رفض الرحلة"
      },
      trips: {
        from: "من",
        to: "إلى",
        status: "الحالة",
        date: "التاريخ"
      },
      common: {
        logout: "تسجيل الخروج"
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