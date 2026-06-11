/// Prayer Time Model - Enhanced with location and countdown support
class PrayerTimeModel {
  final String fajr;
  final String sunrise;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;
  final DateTime date;
  final double? latitude;
  final double? longitude;
  final String? city;

  const PrayerTimeModel({
    required this.fajr,
    required this.sunrise,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
    required this.date,
    this.latitude,
    this.longitude,
    this.city,
  });

  factory PrayerTimeModel.fromMap(Map<String, dynamic> map) {
    return PrayerTimeModel(
      fajr: map['fajr'] ?? '04:30',
      sunrise: map['sunrise'] ?? '05:45',
      dhuhr: map['dhuhr'] ?? '11:45',
      asr: map['asr'] ?? '15:15',
      maghrib: map['maghrib'] ?? '18:45',
      isha: map['isha'] ?? '20:00',
      date: map['date'] != null 
          ? DateTime.parse(map['date']) 
          : DateTime.now(),
      latitude: map['latitude']?.toDouble(),
      longitude: map['longitude']?.toDouble(),
      city: map['city'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'fajr': fajr,
      'sunrise': sunrise,
      'dhuhr': dhuhr,
      'asr': asr,
      'maghrib': maghrib,
      'isha': isha,
      'date': date.toIso8601String(),
      'latitude': latitude,
      'longitude': longitude,
      'city': city,
    };
  }

  /// Get all prayers as a list
  List<Map<String, String>> get allPrayers {
    return [
      {'key': 'fajr', 'label': 'الفجر', 'time': fajr, 'icon': '🌙'},
      {'key': 'sunrise', 'label': 'الشروق', 'time': sunrise, 'icon': '🌅'},
      {'key': 'dhuhr', 'label': 'الظهر', 'time': dhuhr, 'icon': '☀️'},
      {'key': 'asr', 'label': 'العصر', 'time': asr, 'icon': '🌤️'},
      {'key': 'maghrib', 'label': 'المغرب', 'time': maghrib, 'icon': '🌇'},
      {'key': 'isha', 'label': 'العشاء', 'time': isha, 'icon': '🌙'},
    ];
  }

  /// Convert 24h time to 12h format
  static String to12HourFormat(String time24) {
    final parts = time24.split(':');
    if (parts.length < 2) return time24;
    
    int hour = int.parse(parts[0]);
    final minute = parts[1];
    final period = hour >= 12 ? 'م' : 'ص';
    
    if (hour > 12) hour -= 12;
    if (hour == 0) hour = 12;
    
    return '$hour:$minute $period';
  }

  /// Get current prayer time as DateTime
  DateTime getPrayerTimeAsDateTime(String prayerTime) {
    final now = DateTime.now();
    final parts = prayerTime.split(':');
    return DateTime(
      now.year, now.month, now.day,
      int.parse(parts[0]), int.parse(parts[1]),
    );
  }

  /// Find next prayer
  Map<String, String>? getNextPrayer() {
    final now = DateTime.now();
    final prayers = allPrayers;
    
    for (final prayer in prayers) {
      final prayerTime = getPrayerTimeAsDateTime(prayer['time']!);
      if (prayerTime.isAfter(now)) {
        return prayer;
      }
    }
    
    // Return fajr of tomorrow
    return prayers.first;
  }

  /// Get remaining time for next prayer
  Duration getRemainingTime() {
    final next = getNextPrayer();
    if (next == null) return Duration.zero;
    
    final now = DateTime.now();
    DateTime nextTime = getPrayerTimeAsDateTime(next['time']!);
    
    // If next prayer is after midnight (next day fajr)
    if (nextTime.isBefore(now)) {
      nextTime = nextTime.add(const Duration(days: 1));
    }
    
    return nextTime.difference(now);
  }

  /// Get countdown string
  String get countdownString {
    final remaining = getRemainingTime();
    final hours = remaining.inHours;
    final minutes = remaining.inMinutes % 60;
    final seconds = remaining.inSeconds % 60;
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  static PrayerTimeModel get mock {
    return PrayerTimeModel(
      fajr: '04:30',
      sunrise: '05:45',
      dhuhr: '11:45',
      asr: '15:15',
      maghrib: '18:45',
      isha: '20:00',
      date: DateTime.now(),
    );
  }

  PrayerTimeModel copyWith({
    String? fajr,
    String? sunrise,
    String? dhuhr,
    String? asr,
    String? maghrib,
    String? isha,
    DateTime? date,
    double? latitude,
    double? longitude,
    String? city,
  }) {
    return PrayerTimeModel(
      fajr: fajr ?? this.fajr,
      sunrise: sunrise ?? this.sunrise,
      dhuhr: dhuhr ?? this.dhuhr,
      asr: asr ?? this.asr,
      maghrib: maghrib ?? this.maghrib,
      isha: isha ?? this.isha,
      date: date ?? this.date,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      city: city ?? this.city,
    );
  }
}