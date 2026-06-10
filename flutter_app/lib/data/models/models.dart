/// Prayer Times Model
class PrayerTimes {
  final String fajr;
  final String sunrise;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;

  const PrayerTimes({
    required this.fajr,
    required this.sunrise,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
  });

  factory PrayerTimes.fromMap(Map<String, dynamic> map) {
    return PrayerTimes(
      fajr: map['fajr'] ?? '04:30',
      sunrise: map['sunrise'] ?? '05:45',
      dhuhr: map['dhuhr'] ?? '11:45',
      asr: map['asr'] ?? '15:15',
      maghrib: map['maghrib'] ?? '18:45',
      isha: map['isha'] ?? '20:00',
    );
  }

  Map<String, String> toMap() => {
    'fajr': fajr,
    'sunrise': sunrise,
    'dhuhr': dhuhr,
    'asr': asr,
    'maghrib': maghrib,
    'isha': isha,
  };

  static const PrayerTimes mock = PrayerTimes(
    fajr: '04:30',
    sunrise: '05:45',
    dhuhr: '11:45',
    asr: '15:15',
    maghrib: '18:45',
    isha: '20:00',
  );
}

/// Prayer Item for display
class PrayerItem {
  final String key;
  final String label;
  final String time;
  final String icon;

  const PrayerItem({
    required this.key,
    required this.label,
    required this.time,
    required this.icon,
  });
}

/// Financial Event Model
class FinancialEvent {
  final String id;
  final String name;
  final String nameAr;
  final String date;
  final String? amount;
  final String type;
  final int daysRemaining;

  const FinancialEvent({
    required this.id,
    required this.name,
    this.nameAr = '',
    required this.date,
    this.amount,
    required this.type,
    required this.daysRemaining,
  });

  factory FinancialEvent.fromMap(Map<String, dynamic> map) {
    return FinancialEvent(
      id: map['id']?.toString() ?? '',
      name: map['name'] ?? '',
      nameAr: map['name_ar'] ?? map['name'] ?? '',
      date: map['date'] ?? '',
      amount: map['amount']?.toString(),
      type: map['type'] ?? 'salary',
      daysRemaining: map['days_remaining'] ?? 0,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'name_ar': nameAr,
    'date': date,
    'amount': amount,
    'type': type,
    'days_remaining': daysRemaining,
  };
}

/// Appointment Model
class Appointment {
  final String id;
  final String title;
  final String date;
  final String time;
  final String type;
  final String? notes;

  const Appointment({
    required this.id,
    required this.title,
    required this.date,
    required this.time,
    required this.type,
    this.notes,
  });

  factory Appointment.fromMap(Map<String, dynamic> map) {
    return Appointment(
      id: map['id']?.toString() ?? '',
      title: map['title'] ?? '',
      date: map['date'] ?? '',
      time: map['time'] ?? '',
      type: map['type'] ?? 'personal',
      notes: map['notes'],
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'title': title,
    'date': date,
    'time': time,
    'type': type,
    'notes': notes,
  };
}

/// Service Center Model
class ServiceCenter {
  final int id;
  final String name;
  final String icon;
  final List<String> services;

  const ServiceCenter({
    required this.id,
    required this.name,
    required this.icon,
    required this.services,
  });
}

/// User Model
class User {
  final String id;
  final String name;
  final String email;
  final String city;
  final String cityKey;
  final String timezone;
  final String role;
  final bool onboardingComplete;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.city,
    required this.cityKey,
    required this.timezone,
    required this.role,
    required this.onboardingComplete,
  });

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      city: map['city'] ?? 'الرياض',
      cityKey: map['cityKey'] ?? 'riyadh',
      timezone: map['timezone'] ?? 'Asia/Riyadh',
      role: map['role'] ?? 'user',
      onboardingComplete: map['onboardingComplete'] ?? false,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'email': email,
    'city': city,
    'cityKey': cityKey,
    'timezone': timezone,
    'role': role,
    'onboardingComplete': onboardingComplete,
  };

  static const User empty = User(
    id: '',
    name: '',
    email: '',
    city: 'الرياض',
    cityKey: 'riyadh',
    timezone: 'Asia/Riyadh',
    role: 'user',
    onboardingComplete: false,
  );
}

/// Daily Message Model
class DailyMessage {
  final int id;
  final String message;
  final String? displayDate;
  final bool isActive;

  const DailyMessage({
    required this.id,
    required this.message,
    this.displayDate,
    required this.isActive,
  });

  factory DailyMessage.fromMap(Map<String, dynamic> map) {
    return DailyMessage(
      id: map['id'] ?? 0,
      message: map['message'] ?? '',
      displayDate: map['display_date'],
      isActive: map['is_active'] ?? true,
    );
  }
}

/// Notification Model
class AppNotification {
  final String id;
  final String title;
  final String body;
  final String type;
  final bool read;
  final DateTime createdAt;

  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.read,
    required this.createdAt,
  });

  factory AppNotification.fromMap(Map<String, dynamic> map) {
    return AppNotification(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      body: map['body'] ?? '',
      type: map['type'] ?? 'general',
      read: map['read'] ?? false,
      createdAt: DateTime.tryParse(map['created_at'] ?? '') ?? DateTime.now(),
    );
  }
}