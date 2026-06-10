/// Mawaeedak Constants - Shared data for Saudi app
class AppConstants {
  // App Info
  static const String appName = 'مواعيدك';
  static const String appTagline = 'كل مواعيدك في مكان واحد';
  static const String appVersion = '1.0.0';
  
  // Default City
  static const String defaultCity = 'الرياض';
  static const String defaultCityKey = 'riyadh';
  static const String defaultTimezone = 'Asia/Riyadh';
  
  // Default Daily Message
  static const String defaultDailyMessage = 'ابدأ يومك بنية طيبة، وتوكل على الله في كل خطوة.';
  
  // Saudi Cities
  static const List<Map<String, String>> saudiCities = [
    {'name': 'الرياض', 'key': 'riyadh'},
    {'name': 'جدة', 'key': 'jeddah'},
    {'name': 'مكة المكرمة', 'key': 'mecca'},
    {'name': 'المدينة المنورة', 'key': 'medina'},
    {'name': 'الدمام', 'key': 'dammam'},
    {'name': 'الخبر', 'key': 'khobar'},
    {'name': 'أبها', 'key': 'abha'},
    {'name': 'تبوك', 'key': 'tabuk'},
    {'name': 'القصيم', 'key': 'qassim'},
    {'name': 'حائل', 'key': 'hail'},
    {'name': 'جازان', 'key': 'jazan'},
    {'name': 'نجران', 'key': 'najran'},
    {'name': 'الباحة', 'key': 'baha'},
    {'name': 'الجوف', 'key': 'jawf'},
    {'name': 'عسير', 'key': 'asir'},
  ];
  
  // Prayer Names (Arabic)
  static const Map<String, String> prayerNames = {
    'fajr': 'الفجر',
    'sunrise': 'الشروق',
    'dhuhr': 'الظهر',
    'asr': 'العصر',
    'maghrib': 'المغرب',
    'isha': 'العشاء',
  };
  
  // Prayer Icons
  static const Map<String, String> prayerIcons = {
    'fajr': '🌙',
    'sunrise': '🌅',
    'dhuhr': '☀️',
    'asr': '☀️',
    'maghrib': '🌅',
    'isha': '🌙',
  };
  
  // Financial Event Types
  static const Map<String, Map<String, String>> financialTypes = {
    'salary': {'label': 'راتب', 'icon': '💰'},
    'support': {'label': 'دعم', 'icon': '🏠'},
    'bill': {'label': 'فاتورة', 'icon': '📄'},
    'investment': {'label': 'استثمار', 'icon': '📈'},
  };
  
  // Service Centers (8 centers)
  static const List<Map<String, dynamic>> serviceCenters = [
    {
      'id': 1,
      'name': 'الأحوال المدنية',
      'icon': '🪪',
      'services': ['تجديد الهوية', 'تعديل البيانات', 'تصريح سفر', 'إثبات وتصديق'],
    },
    {
      'id': 2,
      'name': 'الجوازات',
      'icon': '📋',
      'services': ['تأشيرات', 'تمديد إقامة', 'نقل كفالة', 'تعديل مهنة'],
    },
    {
      'id': 3,
      'name': 'المرور',
      'icon': '🚗',
      'services': ['رخصة قيادة', 'تجديد تسجيل', 'استمارة السيارة', 'نقل ملكية'],
    },
    {
      'id': 4,
      'name': 'البريد',
      'icon': '📮',
      'services': ['طرود', 'حوالات', 'صندوق بريد', 'تأمينات'],
    },
    {
      'id': 5,
      'name': 'التأمينات الاجتماعية',
      'icon': '🏥',
      'services': ['تأمين صحي', 'تعديل بيانات', 'معاش', 'إعادة صرف'],
    },
    {
      'id': 6,
      'name': 'الزكاة والدخل',
      'icon': '💵',
      'services': ['زكاة', 'صدقات', 'ضريبة القيمة المضافة', 'تعديل بيانات'],
    },
    {
      'id': 7,
      'name': 'التعليم',
      'icon': '📚',
      'services': ['سجلات', 'شهادات', 'نقل طالب', 'التسجيل'],
    },
    {
      'id': 8,
      'name': 'الخدمات العامة',
      'icon': '🏢',
      'services': ['رخص', 'تصاريح', 'بلاغات', 'استعلامات'],
    },
  ];
  
  // Appointment Types
  static const Map<String, Map<String, dynamic>> appointmentTypes = {
    'medical': {'label': 'طبي', 'icon': '🏥', 'color': 0xFF4A7FB5},
    'official': {'label': 'رسمية', 'icon': '📋', 'color': 0xFFC9A063},
    'personal': {'label': 'شخصي', 'icon': '📅', 'color': 0xFF7A9A74},
  };
  
  // Arabic Days
  static const List<String> arabicDays = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ];
  
  // Arabic Months
  static const List<String> arabicMonths = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
  
  // Hijri Months
  static const List<String> hijriMonths = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الثاني',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ];
}

/// Tab configuration
class TabConfig {
  static const List<Map<String, String>> tabs = [
    {'name': 'home', 'label': 'الرئيسية', 'icon': 'home'},
    {'name': 'salary', 'label': 'الرواتب', 'icon': 'attach_money'},
    {'name': 'services', 'label': 'الخدمات', 'icon': 'grid_view'},
    {'name': 'calendar', 'label': 'التقويم', 'icon': 'calendar_today'},
    {'name': 'more', 'label': 'المزيد', 'icon': 'more_horiz'},
  ];
}