import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';

class PrayerTimesService {
  static const String _baseUrl = AppConstants.baseUrl;

  Future<PrayerTimes?> getPrayerTimes({
    String city = 'riyadh',
    String method = 'umm_alqura',
  }) async {
    try {
      final uri = Uri.parse('$_baseUrl/prayer/times').replace(
        queryParameters: {'city': city, 'method': method},
      );
      final response = await http.get(uri).timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return PrayerTimes.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Map<String, String> getCityNames() {
    return {
      'riyadh': 'الرياض',
      'jeddah': 'جدة',
      'makkah': 'مكة المكرمة',
      'madinah': 'المدينة المنورة',
      'dammam': 'الدمام',
      'abha': 'أبها',
    };
  }
}

class PrayerTimes {
  final String fajr;
  final String sunrise;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;
  final String nextPrayer;
  final String nextPrayerTime;
  final String date;
  final bool fromCache;

  PrayerTimes({
    required this.fajr,
    required this.sunrise,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
    required this.nextPrayer,
    required this.nextPrayerTime,
    required this.date,
    this.fromCache = false,
  });

  factory PrayerTimes.fromJson(Map<String, dynamic> json) {
    final timings = json['timings'] ?? {};
    return PrayerTimes(
      fajr: timings['fajr'] ?? '',
      sunrise: timings['sunrise'] ?? '',
      dhuhr: timings['dhuhr'] ?? '',
      asr: timings['asr'] ?? '',
      maghrib: timings['maghrib'] ?? '',
      isha: timings['isha'] ?? '',
      nextPrayer: json['nextPrayer'] ?? '',
      nextPrayerTime: json['nextPrayerTime'] ?? '',
      date: json['date'] ?? '',
      fromCache: json['fromCache'] ?? false,
    );
  }
}
