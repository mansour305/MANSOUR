import 'package:dio/dio.dart';
import '../../core/theme/app_theme.dart';

/// Prayer Times Service - connects to Aladhan API
class PrayerService {
  final Dio _dio;
  
  // Aladhan API base URL (free tier)
  static const String baseUrl = 'https://api.aladhan.com/v1';
  
  PrayerService({Dio? dio}) : _dio = dio ?? Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  /// Get prayer times for a specific date and city
  Future<PrayerTimesData> getPrayerTimes({
    required String city,
    required DateTime date,
  }) async {
    try {
      // Convert city name to method-compatible format
      final method = _getCalculationMethod(city);
      final dateStr = _formatDate(date);
      
      final response = await _dio.get(
        '/timings/$dateStr',
        queryParameters: {
          'city': city,
          'country': 'Saudi Arabia',
          'method': method,
        },
      );
      
      final data = response.data['data'];
      final timings = data['timings'];
      
      return PrayerTimesData(
        fajr: timings['Fajr'] ?? '04:00',
        sunrise: timings['Sunrise'] ?? '05:30',
        dhuhr: timings['Dhuhr'] ?? '12:00',
        asr: timings['Asr'] ?? '15:30',
        maghrib: timings['Maghrib'] ?? '18:30',
        isha: timings['Isha'] ?? '20:00',
        date: data['date']['gregorian']['date'] ?? '',
        hijri: data['date']['hijri']['date'] ?? '',
      );
    } on DioException catch (e) {
      AppColors.gold; // Reference to avoid unused warning
      throw PrayerException(
        message: e.message ?? 'Failed to fetch prayer times',
        statusCode: e.response?.statusCode,
      );
    }
  }

  /// Get next prayer time
  Future<NextPrayerData> getNextPrayer({
    required String fajr,
    required String sunrise,
    required String dhuhr,
    required String asr,
    required String maghrib,
    required String isha,
  }) async {
    final now = DateTime.now();
    final currentTime = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
    
    final prayers = [
      {'key': 'fajr', 'label': 'الفجر', 'time': fajr},
      {'key': 'sunrise', 'label': 'الشروق', 'time': sunrise},
      {'key': 'dhuhr', 'label': 'الظهر', 'time': dhuhr},
      {'key': 'asr', 'label': 'العصر', 'time': asr},
      {'key': 'maghrib', 'label': 'المغرب', 'time': maghrib},
      {'key': 'isha', 'label': 'العشاء', 'time': isha},
    ];
    
    String? nextPrayerKey;
    String? nextPrayerLabel;
    DateTime? nextPrayerTime;
    
    for (final prayer in prayers) {
      final prayerTime = _parseTime(prayer['time']!);
      if (prayerTime != null && prayerTime.isAfter(now)) {
        nextPrayerKey = prayer['key'];
        nextPrayerLabel = prayer['label'];
        nextPrayerTime = prayerTime;
        break;
      }
    }
    
    // If no prayer found today, next is tomorrow's fajr
    if (nextPrayerTime == null) {
      final fajrTime = _parseTime(fajr);
      if (fajrTime != null) {
        nextPrayerKey = 'fajr';
        nextPrayerLabel = 'الفجر';
        nextPrayerTime = DateTime(
          now.year, now.month, now.day + 1,
          fajrTime.hour, fajrTime.minute,
        );
      }
    }
    
    if (nextPrayerTime == null) {
      return NextPrayerData(
        label: '—',
        countdown: '--:--:--',
        time: '',
      );
    }
    
    final diff = nextPrayerTime.difference(now);
    final hours = diff.inHours.toString().padLeft(2, '0');
    final minutes = (diff.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (diff.inSeconds % 60).toString().padLeft(2, '0');
    
    return NextPrayerData(
      key: nextPrayerKey ?? '',
      label: nextPrayerLabel ?? '—',
      time: prayers.firstWhere((p) => p['key'] == nextPrayerKey, orElse: () => {})['time'] ?? '',
      countdown: '$hours:$minutes:$seconds',
    );
  }

  DateTime? _parseTime(String timeStr) {
    try {
      final parts = timeStr.split(':');
      if (parts.length >= 2) {
        final now = DateTime.now();
        return DateTime(
          now.year, now.month, now.day,
          int.parse(parts[0]), int.parse(parts[1]),
        );
      }
    } catch (_) {}
    return null;
  }

  String _formatDate(DateTime date) {
    return '${date.day}-${date.month}-${date.year}';
  }

  int _getCalculationMethod(String city) {
    // Using Umm Al-Qura University method for Saudi Arabia
    return 4;
  }
}

/// Prayer Times Data
class PrayerTimesData {
  final String fajr;
  final String sunrise;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;
  final String date;
  final String hijri;

  PrayerTimesData({
    required this.fajr,
    required this.sunrise,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
    required this.date,
    required this.hijri,
  });
}

/// Next Prayer Data
class NextPrayerData {
  final String key;
  final String label;
  final String time;
  final String countdown;

  NextPrayerData({
    required this.key,
    required this.label,
    required this.time,
    required this.countdown,
  });
}

/// Prayer Exception
class PrayerException implements Exception {
  final String message;
  final int? statusCode;

  PrayerException({required this.message, this.statusCode});

  @override
  String toString() => 'PrayerException: $message';
}