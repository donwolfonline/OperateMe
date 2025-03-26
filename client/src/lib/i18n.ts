import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Get saved language preference from localStorage, default to 'ar'
const savedLanguage = localStorage.getItem('language') || 'ar';
const savedDirection = savedLanguage === 'ar' ? 'rtl' : 'ltr';

// Set initial document direction
document.dir = savedDirection;

const resources = {
  en: {
    translation: {
      notifications: {
        title: "Notifications",
        clearAll: "Clear all",
        noNotifications: "No notifications",
        connectionStatus: "Connection Status",
        connected: "Connected to notification service",
        error: "Connection Error",
        connectionError: "Failed to connect to notification service",
        new_driver: "New Driver",
        new_order: "New Order",
        new_pdf: "New Document",
        vehicle_registered: "Vehicle Registered",
        sessionExpired: "Session Expired",
        sessionExpiredMessage: "Your session has expired. Please log in again.",
        deletingDriver: "Removing driver...",
        pleaseWait: "Please wait...",
        driverDeleted: "Driver deleted successfully",
        invalidCredentials: "Account not found or invalid credentials",
        success: "Success"
      },
      admin: {
        removeDriverSuccess: "Driver has been successfully removed",
        removeDriverError: "Failed to remove driver",
        removeConfirm: "Are you sure you want to remove this driver?",
        addDriver: "Add Driver",
        addNewDriver: "Add New Driver",
        exportDrivers: "Export Drivers List",
        exportOrders: "Export Orders List",
        exportData: "Export Data",
        pendingDrivers: "Pending Drivers",
        activeDrivers: "Active Drivers",
        suspendedDrivers: "Suspended Drivers",
        allOrders: "All Orders",
        documents: "Documents",
        noDrivers: "No drivers found",
        noActiveDrivers: "No active drivers found",
        noSuspendedDrivers: "No suspended drivers found",
        noOrders: "No orders found",
        noDocuments: "No documents found",
        approve: "Approve",
        suspend: "Suspend",
        activate: "Activate",
        removeDriver: "Remove Driver"
      }
    }
  },
  ar: {
    translation: {
      notifications: {
        title: "الإشعارات",
        clearAll: "مسح الكل",
        noNotifications: "لا توجد إشعارات",
        connectionStatus: "حالة الاتصال",
        connected: "متصل بخدمة الإشعارات",
        error: "خطأ في الاتصال",
        connectionError: "فشل الاتصال بخدمة الإشعارات",
        new_driver: "سائق جديد",
        new_order: "طلب جديد",
        new_pdf: "مستند جديد",
        vehicle_registered: "تسجيل مركبة جديدة",
        sessionExpired: "انتهت الجلسة",
        sessionExpiredMessage: "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.",
        deletingDriver: "جاري حذف السائق...",
        pleaseWait: "يرجى الانتظار...",
        driverDeleted: "تم حذف السائق بنجاح",
        invalidCredentials: "الحساب غير موجود أو بيانات الاعتماد غير صحيحة",
        success: "نجاح"
      },
      admin: {
        removeDriverSuccess: "تم إزالة السائق بنجاح",
        removeDriverError: "فشل في إزالة السائق",
        removeConfirm: "هل أنت متأكد أنك تريد إزالة هذا السائق؟",
        addDriver: "إضافة سائق",
        addNewDriver: "إضافة سائق جديد",
        exportDrivers: "تصدير قائمة السائقين",
        exportOrders: "تصدير قائمة الطلبات",
        exportData: "تصدير البيانات",
        pendingDrivers: "السائقون المعلقون",
        activeDrivers: "السائقون النشطون",
        suspendedDrivers: "السائقون الموقوفون",
        allOrders: "جميع الطلبات",
        documents: "المستندات",
        noDrivers: "لم يتم العثور على سائقين",
        noActiveDrivers: "لا يوجد سائقين نشطين",
        noSuspendedDrivers: "لا يوجد سائقين موقوفين",
        noOrders: "لا توجد طلبات",
        noDocuments: "لا توجد مستندات",
        approve: "موافقة",
        suspend: "إيقاف",
        activate: "تفعيل",
        removeDriver: "إزالة السائق"
      }
    }
  },
  ur: {
    translation: {
      notifications: {
        title: "اطلاعات",
        clearAll: "سب صاف کریں",
        noNotifications: "کوئی اطلاع نہیں",
        connectionStatus: "کنکشن کی حالت",
        connected: "اطلاعات کی سروس سے منسلک",
        error: "کنکشن میں خرابی",
        connectionError: "اطلاعات کی سروس سے رابطہ ناکام",
        new_driver: "نیا ڈرائیور",
        new_order: "نیا آرڈر",
        new_pdf: "نیا دستاویز",
        vehicle_registered: "نئی گاڑی رجسٹرڈ",
        sessionExpired: "سیشن ختم ہو گیا",
        sessionExpiredMessage: "آپ کا سیشن ختم ہو گیا ہے۔ براہ کرم دوبارہ لاگ ان کریں۔",
        deletingDriver: "ڈرائیور کو حذف کیا جا رہا ہے...",
        pleaseWait: "براہ کرم انتظار کریں...",
        driverDeleted: "ڈرائیور کامیابی سے حذف کر دیا گیا",
        invalidCredentials: "اکاؤنٹ نہیں ملا یا غلط کریڈنشلز",
        success: "کامیابی"
      },
      admin: {
        removeDriverSuccess: "ڈرائیور کامیابی سے ہٹا دیا گیا",
        removeDriverError: "ڈرائیور کو ہٹانے میں ناکامی",
        removeConfirm: "کیا آپ واقعی اس ڈرائیور کو ہٹانا چاہتے ہیں؟",
        addDriver: "ڈرائیور شامل کریں",
        addNewDriver: "نیا ڈرائیور شامل کریں",
        exportDrivers: "ڈرائیورز کی فہرست برآمد کریں",
        exportOrders: "آرڈرز کی فہرست برآمد کریں",
        exportData: "ڈیٹا برآمد کریں",
        pendingDrivers: "زیر التواء ڈرائیورز",
        activeDrivers: "فعال ڈرائیورز",
        suspendedDrivers: "معطل ڈرائیورز",
        allOrders: "تمام آرڈرز",
        documents: "دستاویزات",
        noDrivers: "کوئی ڈرائیور نہیں ملا",
        noActiveDrivers: "کوئی فعال ڈرائیور نہیں ملا",
        noSuspendedDrivers: "کوئی معطل ڈرائیور نہیں ملا",
        noOrders: "کوئی آرڈر نہیں ملا",
        noDocuments: "کوئی دستاویز نہیں ملی",
        approve: "منظور کریں",
        suspend: "معطل کریں",
        activate: "فعال کریں",
        removeDriver: "ڈرائیور کو ہٹائیں"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
    }
  });

export default i18n;