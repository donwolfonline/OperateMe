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
        pendingApproval: "Your account is pending approval. You'll be able to create orders once approved.",
        exportSuccess: "Data exported successfully"
      },
      landing: {
        title: "Road Lightning Transport",
        subtitle: "Professional Transportation Services",
        loginButton: "Driver Login",
        adminButton: "Admin Login",
        features: {
          reliability: "Reliable Service",
          reliabilityDesc: "Dependable transportation solutions you can count on, every time",
          coverage: "Wide Coverage",
          coverageDesc: "Extensive network covering all major cities and airports",
          speed: "Fast Delivery",
          speedDesc: "Efficient and timely transportation services",
          safety: "Safety First",
          safetyDesc: "Your safety is our top priority with professional drivers"
        }
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
        licenseNumber: "License Number",
        uniqueId: "Unique Identifier"
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
        plateNumberPlaceholder: "Enter plate number",
        manufacturer: "Vehicle Manufacturer",
        selectManufacturer: "Select Vehicle Manufacturer",
        selectModel: "Select Vehicle Model",
        photoRequired: "Please upload vehicle photos",
        registrationSuccess: "Vehicle registered successfully",
        registrationError: "Error registering vehicle",
        uploading: "Uploading photos...",
        photoSizeError: "Photo size exceeds maximum limit",
        photoTypeError: "Invalid photo format. Please use JPG, PNG or WEBP"
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
        generatingPdf: "Generating PDF document...",
        documentReady: "Document Ready",
        downloadPdf: "Download PDF",
        download: "Download",
        route: "Route",
        driver: "Driver",
        passengerCount: "Passenger Count",
        issuedBy: "Issued By"
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
        noDocuments: "No documents found",
        exportData: "Export Data",
        exportError: "Export Failed",
        exportErrorMessage: "Failed to export data. Please try again.",
        addDriver: "Add Driver",
        removeDriver: "Remove Driver",
        removeConfirm: "Are you sure you want to remove this driver?",
        addDriverSuccess: "Driver added successfully",
        removeDriverSuccess: "Driver removed successfully",
        formTitle: "Add New Driver",
        required: "Required field"
      },
      common: {
        logout: "Logout",
        saving: "Saving...",
        error: "Error",
        cancel: "Cancel"
      },
      search: {
        placeholder: "Search...",
      },
      filter: {
        registrationDate: "Registration Date",
        today: "Today",
        thisWeek: "This Week",
        thisMonth: "This Month",
        status: "Status",
        active: "Active",
        completed: "Completed",
        cancelled: "Cancelled",
        selectDate: "Select date",
        documentType: "Document Type",
        idDocument: "ID Document",
        licenseDocument: "License Document",
        registrationDocument: "Registration Document",
        clearAll: "Clear all filters",
        selectDriver: "Select Driver"
      },
      cities: {
        jeddahAirport: "Jeddah Airport",
        taifAirport: "Taif Airport",
        medinaAirport: "Medina Airport",
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
        pendingApproval: "حسابك قيد الموافقة. ستتمكن من إنشاء الطلبات بمجرد الموافقة عليه.",
        exportSuccess: "تم تصدير البيانات بنجاح"
      },
      landing: {
        title: "صاعقة الطريق للنقل",
        subtitle: "خدمات نقل احترافية",
        loginButton: "تسجيل دخول السائق",
        adminButton: "دخول المشرف",
        features: {
          reliability: "خدمة موثوقة",
          reliabilityDesc: "حلول نقل يمكنك الاعتماد عليها في كل مرة",
          coverage: "تغطية واسعة",
          coverageDesc: "شبكة واسعة تغطي جميع المدن والمطارات الرئيسية",
          speed: "توصيل سريع",
          speedDesc: "خدمات نقل فعالة وفي الوقت المناسب",
          safety: "السلامة أولاً",
          safetyDesc: "سلامتك هي أولويتنا القصوى مع سائقين محترفين"
        }
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
        licenseNumber: "رقم الرخصة",
        uniqueId: "المعرف الفريد"
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
        plateNumberPlaceholder: "أدخل رقم اللوحة",
        manufacturer: "نوع المركبة",
        selectManufacturer: "اختر نوع المركبة",
        selectModel: "اختر موديل المركبة",
        photoRequired: "الرجاء تحميل صور المركبة",
        registrationSuccess: "تم تسجيل المركبة بنجاح",
        registrationError: "خطأ في تسجيل المركبة",
        uploading: "جاري تحميل الصور...",
        photoSizeError: "حجم الصورة يتجاوز الحد الأقصى",
        photoTypeError: "صيغة الصورة غير صالحة. الرجاء استخدام JPG أو PNG أو WEBP"
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
        generatingPdf: "جاري إنشاء ملف PDF...",
        documentReady: "المستند جاهز",
        downloadPdf: "تحميل PDF",
        download: "تحميل",
        route: "المسار",
        driver: "السائق",
        passengerCount: "عدد الركاب",
        issuedBy: "صادر من قبل"
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
        noDocuments: "لا توجد مستندات",
        exportData: "تصدير البيانات",
        exportError: "فشل التصدير",
        exportErrorMessage: "فشل تصدير البيانات. يرجى المحاولة مرة أخرى.",
        addDriver: "إضافة سائق",
        removeDriver: "إزالة السائق",
        removeConfirm: "هل أنت متأكد أنك تريد إزالة هذا السائق؟",
        addDriverSuccess: "تمت إضافة السائق بنجاح",
        removeDriverSuccess: "تمت إزالة السائق بنجاح",
        formTitle: "إضافة سائق جديد",
        required: "حقل مطلوب"
      },
      common: {
        logout: "تسجيل الخروج",
        saving: "جاري الحفظ...",
        error: "خطأ",
        cancel: "إلغاء"
      },
      search: {
        placeholder: "بحث...",
      },
      filter: {
        registrationDate: "تاريخ التسجيل",
        today: "اليوم",
        thisWeek: "هذا الأسبوع",
        thisMonth: "هذا الشهر",
        status: "الحالة",
        active: "نشط",
        completed: "مكتمل",
        cancelled: "ملغي",
        selectDate: "اختر التاريخ",
        documentType: "نوع المستند",
        idDocument: "وثيقة الهوية",
        licenseDocument: "وثيقة الرخصة",
        registrationDocument: "وثيقة التسجيل",
        clearAll: "مسح جميع عوامل التصفية",
        selectDriver: "اختر السائق"
      },
      cities: {
        jeddahAirport: "مطار جدة",
        taifAirport: "مطار الطائف",
        medinaAirport: "مطار المدينة المنورة",
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
        pendingApproval: "آپ کا اکاؤنٹ منظوری کے انتظار میں ہے۔ منظوری کے بعد آپ آرڈر بنا سکیں گے۔",
        exportSuccess: "ڈیٹا کامیابی سے برآمد ہو گیا"
      },
      landing: {
        title: "روڈ لائٹننگ ٹرانسپورٹ",
        subtitle: "پیشہ ورانہ ٹرانسپورٹ سروسز",
        loginButton: "ڈرائیور لاگ ان",
        adminButton: "ایڈمن لاگ ان",
        features: {
          reliability: "قابل اعتماد خدمت",
          reliabilityDesc: "قابل بھروسہ ٹرانسپورٹ حل جن پر آپ ہر بار اعتماد کر سکتے ہیں",
          coverage: "وسیع کوریج",
          coverageDesc: "تمام بڑے شہروں اور ہوائی اڈوں کو کور کرنے والا وسیع نیٹ ورک",
          speed: "تیز ترسیل",
          speedDesc: "موثر اور بروقت ٹرانسپورٹ خدمات",
          safety: "سلامتی پہلے",
          safetyDesc: "پیشہ ور ڈرائیوروں کے ساتھ آپ کی حفاظت ہماری اولین ترجیح ہے"
        }
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
        licenseNumber: "لائسنس نمبر",
        uniqueId: "منفرد شناخت"
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
        uploadProfileImage: "پروفائل تصویر اپ لوڈ کریں",
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
        plateNumberPlaceholder: "پلیٹ نمبر درج کریں",
        manufacturer: "گاڑی کی کمپنی",
        selectManufacturer: "گاڑی کی کمپنی منتخب کریں",
        selectModel: "گاڑی کا ماڈل منتخب کریں",
        photoRequired: "براہ کرم گاڑی کی تصاویر اپ لوڈ کریں",
        registrationSuccess: "گاڑی کامیابی سے رجسٹر ہو گئی",
        registrationError: "گاڑی کی رجسٹریشن میں خطا",
        uploading: "تصاویر اپ لوڈ کی جا رہی ہیں...",
        photoSizeError: "تصویر کا سائز زیادہ ہے",
        photoTypeError: "غلط تصویر فارمیٹ۔ براہ کرم JPG، PNG یا WEBP استعمال کریں"
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
        generatingPdf: "PDF دستاویز تیار کی جا رہی ہے...",
        documentReady: "دستاویز تیار ہے",
        downloadPdf: "PDF ڈاؤن لوڈ کریں",
        download: "ڈاؤن لوڈ کریں",
        route: "روٹ",
        driver: "ڈرائیور",
        passengerCount: "مسافروں کی تعداد",
        issuedBy: "جاری کردہ از"
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
        noDocuments: "کوئی دستاویز نہیں ملی",
        exportData: "ڈیٹا برآمد کریں",
        exportError: "برآمد ناکام",
        exportErrorMessage: "ڈیٹا برآمد کرنے میں ناکام۔ دوبارہ کوشش کریں۔",
        addDriver: "ڈرائیور شامل کریں",
        removeDriver: "ڈرائیور کو ہٹائیں",
        removeConfirm: "کیا آپ واقعی اس ڈرائیور کو ہٹانا چاہتے ہیں؟",
        addDriverSuccess: "ڈرائیور کامیابی سے شامل کر دیا گیا",
        removeDriverSuccess: "ڈرائیور کامیابی سے ہٹا دیا گیا",
        formTitle: "نیا ڈرائیور شامل کریں",
        required: "مطلوب فیلڈ"
      },
      common: {
        logout: "لاگ آؤٹ",
        saving: "محفوظ کیا جا رہا ہے...",
        error: "خطا",
        cancel: "منسوخ کریں"
      },
      search: {
        placeholder: "تلاش...",
      },
      filter: {
        registrationDate: "رجسٹریشن کی تاریخ",
        today: "آج",
        thisWeek: "اس ہفتے",
        thisMonth: "اس مہینے",
        status: "حالت",
        active: "فعال",
        completed: "مکمل",
        cancelled: "منسوخ",
        selectDate: "تاریخ منتخب کریں",
        documentType: "دستاویز کی قسم",
        idDocument: "شناختی دستاویز",
        licenseDocument: "لائسنس دستاویز",
        registrationDocument: "رجسٹریشن دستاویز",
        clearAll: "تمام فلٹرز صاف کریں",
        selectDriver: "ڈرائیور منتخب کریں"
      },
      cities: {
        jeddahAirport: "جدہ ائرپورٹ",
        taifAirport: "طائف ائرپورٹ",
        medinaAirport: "مدینہ ائرپورٹ",
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
    }
  });

export default i18n;