import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/salary_support_model.dart';

/// Service for managing salaries and support payments
class SalarySupportService {
  static const String _cacheKey = 'cached_salary_support';
  static const String _lastUpdateKey = 'salary_support_last_update';

  /// Get all salaries and support (with mock data for demo)
  Future<List<SalarySupportModel>> getAllItems() async {
    // Try to load from cache first
    final cached = await _loadFromCache();
    if (cached != null && cached.isNotEmpty) {
      return cached;
    }

    // Return mock data if no cached data
    return _getMockData();
  }

  /// Get upcoming items (next 30 days)
  Future<List<SalarySupportModel>> getUpcomingItems() async {
    final all = await getAllItems();
    final now = DateTime.now();
    final thirtyDaysLater = now.add(const Duration(days: 30));

    return all.where((item) {
      return item.isEnabled &&
             item.status != SalarySupportStatus.paid &&
             item.adjustedDate.isBefore(thirtyDaysLater);
    }).toList()
      ..sort((a, b) => a.adjustedDate.compareTo(b.adjustedDate));
  }

  /// Get next upcoming item
  Future<SalarySupportModel?> getNextItem() async {
    final upcoming = await getUpcomingItems();
    return upcoming.isNotEmpty ? upcoming.first : null;
  }

  /// Save items to cache
  Future<void> saveItems(List<SalarySupportModel> items) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = items.map((item) => item.toMap()).toList();
      await prefs.setString(_cacheKey, jsonEncode(data));
      await prefs.setString(_lastUpdateKey, DateTime.now().toIso8601String());
    } catch (_) {}
  }

  /// Load from cache
  Future<List<SalarySupportModel>?> _loadFromCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cached = prefs.getString(_cacheKey);
      if (cached != null) {
        final List<dynamic> data = jsonDecode(cached);
        return data.map((json) => SalarySupportModel.fromMap(json)).toList();
      }
    } catch (_) {}
    return null;
  }

  /// Clear cache
  Future<void> clearCache() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_cacheKey);
    await prefs.remove(_lastUpdateKey);
  }

  /// Mock data for demo
  List<SalarySupportModel> _getMockData() {
    final now = DateTime.now();
    
    // Calculate next month's salary date (typically 25th or 28th)
    int nextMonth = now.month + 1;
    int nextYear = now.year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    
    // Default salary date: 25th of each month
    DateTime salaryDate = DateTime(nextYear, nextMonth, 25);
    if (salaryDate.isBefore(now)) {
      salaryDate = salaryDate.add(const Duration(days: 30));
    }

    // Calculate support dates (typically 10th of each month)
    DateTime supportDate = DateTime(nextYear, nextMonth, 10);
    if (supportDate.isBefore(now)) {
      supportDate = supportDate.add(const Duration(days: 30));
    }

    return [
      SalarySupportModel(
        id: '1',
        name: 'Monthly Salary',
        nameAr: 'راتب الشهري',
        type: SalarySupportType.salary,
        originalDate: salaryDate,
        adjustedDate: _adjustDateStatic(salaryDate),
        amount: '12,000',
        status: _calculateStatusStatic(salaryDate),
        icon: '💰',
      ),
      SalarySupportModel(
        id: '2',
        name: 'Housing Support',
        nameAr: 'دعم سكن',
        type: SalarySupportType.support,
        originalDate: supportDate,
        adjustedDate: _adjustDateStatic(supportDate),
        amount: '2,000',
        status: _calculateStatusStatic(supportDate),
        icon: '🏠',
      ),
      SalarySupportModel(
        id: '3',
        name: 'Citizens Account',
        nameAr: 'حساب المواطن',
        type: SalarySupportType.support,
        originalDate: DateTime(nextYear, nextMonth, 15),
        adjustedDate: _adjustDateStatic(DateTime(nextYear, nextMonth, 15)),
        amount: '1,500',
        status: _calculateStatusStatic(DateTime(nextYear, nextMonth, 15)),
        icon: '🏛️',
      ),
    ];
  }

  static DateTime _adjustDateStatic(DateTime date) {
    int weekday = date.weekday;
    if (weekday == DateTime.friday) {
      return date.subtract(const Duration(days: 1));
    }
    if (weekday == DateTime.saturday) {
      return date.add(const Duration(days: 1));
    }
    return date;
  }

  static SalarySupportStatus _calculateStatusStatic(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final targetDate = DateTime(date.year, date.month, date.day);

    if (targetDate.isBefore(today)) {
      return SalarySupportStatus.paid;
    } else if (targetDate.isAtSameMomentAs(today)) {
      return SalarySupportStatus.today;
    } else {
      return SalarySupportStatus.upcoming;
    }
  }
}