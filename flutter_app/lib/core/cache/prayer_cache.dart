import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/prayer_time_model.dart';

/// Cache for prayer times - works offline
class PrayerCache {
  static const String _prayerTimesKey = 'cached_prayer_times';
  static const String _lastLocationKey = 'cached_location';
  static const String _lastUpdateKey = 'last_cache_update';

  /// Save prayer times to cache
  static Future<void> savePrayerTimes(PrayerTimeModel times) async {
    final prefs = await SharedPreferences.getInstance();
    final data = jsonEncode(times.toMap());
    await prefs.setString(_prayerTimesKey, data);
    await prefs.setString(_lastUpdateKey, DateTime.now().toIso8601String());
  }

  /// Load prayer times from cache
  static Future<PrayerTimeModel?> loadPrayerTimes() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString(_prayerTimesKey);
      if (data != null) {
        final map = jsonDecode(data) as Map<String, dynamic>;
        return PrayerTimeModel.fromMap(map);
      }
    } catch (e) {
      // Return null if cache is corrupted
    }
    return null;
  }

  /// Save last known location
  static Future<void> saveLocation(double latitude, double longitude) async {
    final prefs = await SharedPreferences.getInstance();
    final data = jsonEncode({
      'latitude': latitude,
      'longitude': longitude,
      'timestamp': DateTime.now().toIso8601String(),
    });
    await prefs.setString(_lastLocationKey, data);
  }

  /// Load last known location
  static Future<Map<String, double>?> loadLocation() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString(_lastLocationKey);
      if (data != null) {
        final map = jsonDecode(data) as Map<String, dynamic>;
        return {
          'latitude': map['latitude'] as double,
          'longitude': map['longitude'] as double,
        };
      }
    } catch (e) {
      // Return null if cache is corrupted
    }
    return null;
  }

  /// Check if cache is stale (older than 1 hour)
  static Future<bool> isCacheStale() async {
    final prefs = await SharedPreferences.getInstance();
    final lastUpdate = prefs.getString(_lastUpdateKey);
    if (lastUpdate == null) return true;
    
    final lastDate = DateTime.tryParse(lastUpdate);
    if (lastDate == null) return true;
    
    return DateTime.now().difference(lastDate).inHours >= 1;
  }

  /// Clear all cached data
  static Future<void> clearCache() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prayerTimesKey);
    await prefs.remove(_lastLocationKey);
    await prefs.remove(_lastUpdateKey);
  }
}