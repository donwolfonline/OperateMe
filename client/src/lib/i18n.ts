import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      notifications: {
        success: "Success",
        error: "Error",
        warning: "Warning",
        info: "Information",
        vehicleRegistered: "Vehicle registration successful",
        vehicleUpdated: "Vehicle updated successfully",
        noMoreVehicles: "No additional vehicles can be registered",
        orderCreated: "Operation order created successfully",
        orderSuccess: "Success",
        documentGenerated: "Document generated successfully",
        uploadSuccess: "File uploaded successfully",
        uploadError: "Error uploading file",
        invalidFile: "Invalid file type",
        maxFileSize: "File size exceeds limit",
        savingChanges: "Saving changes...",
        changesSaved: "Changes saved successfully",
        viewDocument: "View uploaded document",
        accountSuspended: "Account Suspended",
        suspensionMessage: "Your account has been suspended. Please contact administrator.",
        pendingApproval: "Your account is pending approval. You'll be able to create orders once approved."
      },
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
        history: "History",
        operationHistory: "Operation History",
        noOrders: "No orders found",
        newOrder: "New Operation Order",
        uploadId: "Upload ID Document",
        uploadLicense: "Upload License Document",
        uploadProfileImage: "Upload Profile Image",
        uniqueId: "Unique Identifier"
      },
      vehicle: {
        type: "Vehicle Type",
        model: "Vehicle Model",
        year: "Manufacturing Year",
        plateNumber: "Plate Number",
        photos: "Vehicle Photos",
        save: "Save Vehicle",
        saving: "Saving...",
        registered: "Vehicle Registration Successful",
        noAdditional: "No additional vehicles can be registered",
        selectType: "Select Vehicle Type",
        modelPlaceholder: "Enter vehicle model",
        plateNumberPlaceholder: "Enter plate number"
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
        passengerName: "Passenger Name",
        passengerIdNumber: "ID Number",
        documentReady: "Document Ready",
        downloadPdf: "Download PDF",
        viewDocument: "View Document",
        download: "Download",
        route: "Route",
        driver: "Driver",
        passengerCount: "Passenger Count"
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
        orders: "Orders",
        documents: "Document History",
        noDocuments: "No documents found"
      },
      common: {
        logout: "Logout",
        saving: "Saving...",
        error: "Error"
      }
    }
  },
  ar: {
    translation: {
      notifications: {
        success: "نجاح",
        error: "خطأ",
        warning: "تحذير",
        info: "معلومات",
        vehicleRegistered: "تم تسجيل المركبة بنجاح",
        vehicleUpdated: "تم تحديث المركبة بنجاح",
        noMoreVehicles: "لا يمكن تسجيل مركبات إضافية",
        orderCreated: "تم إنشاء أمر التشغيل بنجاح",
        orderSuccess: "تم بنجاح",
        documentGenerated: "تم إنشاء المستند بنجاح",
        uploadSuccess: "تم رفع الملف بنجاح",
        uploadError: "خطأ في رفع الملف",
        invalidFile: "نوع الملف غير صالح",
        maxFileSize: "حجم الملف يتجاوز الحد المسموح",
        savingChanges: "جاري حفظ التغييرات...",
        changesSaved: "تم حفظ التغييرات بنجاح",
        viewDocument: "عرض المستند المرفوع",
        accountSuspended: "الحساب معلق",
        suspensionMessage: "تم تعليق حسابك. يرجى الاتصال بالمسؤول.",
        pendingApproval: "حسابك قيد الموافقة. ستتمكن من إنشاء الطلبات بمجرد الموافقة عليه."
      },
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
        history: "السجل",
        operationHistory: "سجل العمليات",
        noOrders: "لا توجد طلبات",
        newOrder: "أمر تشغيل جديد",
        uploadId: "رفع صورة الهوية",
        uploadLicense: "رفع صورة الرخصة",
        uploadProfileImage: "رفع صورة الملف الشخصي",
        uniqueId: "المعرف الفريد"
      },
      vehicle: {
        type: "نوع المركبة",
        model: "موديل المركبة",
        year: "سنة التصنيع",
        plateNumber: "رقم اللوحة",
        photos: "صور المركبة",
        save: "حفظ المركبة",
        saving: "جاري الحفظ...",
        registered: "تم تسجيل المركبة بنجاح",
        noAdditional: "لا يمكن تسجيل مركبات إضافية",
        selectType: "اختر نوع المركبة",
        modelPlaceholder: "أدخل موديل المركبة",
        plateNumberPlaceholder: "أدخل رقم اللوحة"
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
        passengerName: "اسم الراكب",
        passengerIdNumber: "رقم الهوية",
        documentReady: "المستند جاهز",
        downloadPdf: "تحميل PDF",
        viewDocument: "عرض المستند",
        download: "تحميل",
        route: "المسار",
        driver: "السائق",
        passengerCount: "عدد الركاب"
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
        orders: "الطلبات",
        documents: "سجل المستندات",
        noDocuments: "لا توجد مستندات"
      },
      common: {
        logout: "تسجيل الخروج",
        saving: "جاري الحفظ...",
        error: "خطأ"
      }
    }
  },
  ur: {
    translation: {
      notifications: {
        success: "کامیابی",
        error: "خطا",
        warning: "انتباہ",
        info: "معلومات",
        vehicleRegistered: "گاڑی کی رجسٹریشن کامیاب ہو گئی",
        vehicleUpdated: "گاڑی کی معلومات کامیابی سے اپ ڈیٹ ہو گئیں",
        noMoreVehicles: "مزید گاڑیاں رجسٹر نہیں کی جا سکتیں",
        orderCreated: "آپریشن آرڈر کامیابی سے بنایا گیا",
        orderSuccess: "کامیابی",
        documentGenerated: "دستاویز کامیابی سے تیار ہو گئی",
        uploadSuccess: "فائل کامیابی سے اپ لوڈ ہو گئی",
        uploadError: "فائل اپ لوڈ کرنے میں خطا",
        invalidFile: "غلط فائل کی قسم",
        maxFileSize: "فائل کا سائز حد سے زیادہ ہے",
        savingChanges: "تبدیلیاں محفوظ کی جا رہی ہیں...",
        changesSaved: "تبدیلیاں کامیابی سے محفوظ ہو گئیں",
        viewDocument: "اپ لوڈ کردہ دستاویز دیکھیں",
        accountSuspended: "اکاؤنٹ معطل",
        suspensionMessage: "آپ کا اکاؤنٹ معطل کر دیا گیا ہے۔ براہ کرم منتظم سے رابطہ کریں۔",
        pendingApproval: "آپ کا اکاؤنٹ منظوری کے انتظار میں ہے۔ منظوری کے بعد آپ آرڈر بنا سکیں گے۔"
      },
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
        history: "تاریخ",
        operationHistory: "آپریشن کی تاریخ",
        noOrders: "کوئی آرڈر نہیں ملا",
        newOrder: "نیا آپریشن آرڈر",
        uploadId: "شناختی دستاویز اپلوڈ کریں",
        uploadLicense: "لائسنس دستاویز اپلوڈ کریں",
        uploadProfileImage: "پروفائل تصویر اپلوڈ کریں",
        uniqueId: "منفرد شناخت"
      },
      vehicle: {
        type: "گاڑی کی قسم",
        model: "گاڑی کا ماڈل",
        year: "تیاری کا سال",
        plateNumber: "پلیٹ نمبر",
        photos: "گاڑی کی تصاویر",
        save: "گاڑی محفوظ کریں",
        saving: "محفوظ کیا جا رہا ہے...",
        registered: "گاڑی کی رجسٹریشن کامیاب ہو گئی",
        noAdditional: "مزید گاڑیاں رجسٹر نہیں کی جا سکتیں",
        selectType: "گاڑی کی قسم منتخب کریں",
        modelPlaceholder: "گاڑی کا ماڈل درج کریں",
        plateNumberPlaceholder: "پلیٹ نمبر درج کریں"
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
        passengerName: "مسافر کا نام",
        passengerIdNumber: "شناختی نمبر",
        documentReady: "دستاویز تیار ہے",
        downloadPdf: "PDF ڈاؤنلوڈ کریں",
        viewDocument: "دستاویز دیکھیں",
        download: "ڈاؤنلوڈ کریں",
        route: "روٹ",
        driver: "ڈرائیور",
        passengerCount: "مسافروں کی تعداد"
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
        orders: "آرڈرز",
        documents: "دستاویزات کی تاریخ",
        noDocuments: "کوئی دستاویز نہیں ملی"
      },
      common: {
        logout: "لاگ آؤٹ",
        saving: "محفوظ کیا جا رہا ہے...",
        error: "خطا"
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