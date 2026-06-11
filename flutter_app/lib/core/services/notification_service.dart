import 'dart:io';
import 'dart:ui' show Color;
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz_data;

/// Notification Service - handles all app notifications
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();
  bool _isInitialized = false;

  /// Initialize the notification service
  Future<void> initialize() async {
    if (_isInitialized) return;

    // Initialize timezone
    tz_data.initializeTimeZones();

    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    // Create notification channels for Android
    if (Platform.isAndroid) {
      await _createNotificationChannels();
    }

    _isInitialized = true;
  }

  /// Request notification permissions
  Future<bool> requestPermissions() async {
    if (Platform.isAndroid) {
      final androidPlugin = _notifications.resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();
      return await androidPlugin?.requestNotificationsPermission() ?? false;
    } else if (Platform.isIOS) {
      final iosPlugin = _notifications.resolvePlatformSpecificImplementation<
          IOSFlutterLocalNotificationsPlugin>();
      return await iosPlugin?.requestPermissions(
        alert: true,
        badge: true,
        sound: true,
      ) ?? false;
    }
    return false;
  }

  /// Create notification channels for Android
  Future<void> _createNotificationChannels() async {
    final androidPlugin = _notifications.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    // Prayer times channel
    await androidPlugin?.createNotificationChannel(
      const AndroidNotificationChannel(
        'prayer_times',
        'مواقيت الصلاة',
        description: 'إشعارات مواقيت الصلاة والعد التنازلي',
        importance: Importance.high,
        playSound: true,
        enableVibration: true,
      ),
    );

    // Salary/Support channel
    await androidPlugin?.createNotificationChannel(
      const AndroidNotificationChannel(
        'salary_support',
        'الرواتب والدعوم',
        description: 'إشعارات المواعيد المالية والرواتب',
        importance: Importance.high,
        playSound: true,
        enableVibration: true,
      ),
    );

    // General channel
    await androidPlugin?.createNotificationChannel(
      const AndroidNotificationChannel(
        'general',
        'إشعارات عامة',
        description: 'إشعارات عامة من التطبيق',
        importance: Importance.defaultImportance,
      ),
    );
  }

  /// Handle notification tap
  void _onNotificationTapped(NotificationResponse response) {
    // Handle notification tap - navigate to relevant screen
    debugPrint('Notification tapped: ${response.payload}');
  }

  /// Show immediate notification
  Future<void> showNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
    NotificationChannel channel = NotificationChannel.general,
  }) async {
    final androidDetails = AndroidNotificationDetails(
      channel.id,
      channel.name,
      channelDescription: channel.description,
      importance: channel.importance,
      priority: channel.priority,
      icon: '@mipmap/ic_launcher',
      color: const Color(0xFFD4AF37), // Gold color
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    final details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.show(id, title, body, details, payload: payload);
  }

  /// Schedule prayer notification
  Future<void> schedulePrayerNotification({
    required int id,
    required String prayerName,
    required DateTime prayerTime,
    int minutesBefore = 10,
  }) async {
    final scheduledTime = prayerTime.subtract(Duration(minutes: minutesBefore));
    
    if (scheduledTime.isBefore(DateTime.now())) return;

    final androidDetails = AndroidNotificationDetails(
      'prayer_times',
      'مواقيت الصلاة',
      channelDescription: 'إشعارات مواقيت الصلاة والعد التنازلي',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: const Color(0xFFD4AF37),
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    final details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.zonedSchedule(
      id,
      'حان وقت الصلاة!',
      'تبقى $minutesBefore دقائق على صلاة $prayerName',
      tz.TZDateTime.from(scheduledTime, tz.local),
      details,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: 'prayer_$prayerName',
    );
  }

  /// Schedule salary/support notification
  Future<void> scheduleSalaryNotification({
    required int id,
    required String name,
    required DateTime paymentDate,
    int hoursBefore = 24,
  }) async {
    final scheduledTime = paymentDate.subtract(Duration(hours: hoursBefore));
    
    if (scheduledTime.isBefore(DateTime.now())) return;

    final androidDetails = AndroidNotificationDetails(
      'salary_support',
      'الرواتب والدعوم',
      channelDescription: 'إشعارات المواعيد المالية والرواتب',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: const Color(0xFFD4AF37),
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    final details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.zonedSchedule(
      id,
      'موعد قريب - $name',
      'يتبقى $hoursBefore ساعة على موعد $name',
      tz.TZDateTime.from(scheduledTime, tz.local),
      details,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: 'salary_$name',
    );
  }

  /// Cancel notification
  Future<void> cancelNotification(int id) async {
    await _notifications.cancel(id);
  }

  /// Cancel all notifications
  Future<void> cancelAllNotifications() async {
    await _notifications.cancelAll();
  }

  /// Get pending notifications
  Future<List<PendingNotificationRequest>> getPendingNotifications() async {
    return await _notifications.pendingNotificationRequests();
  }
}

/// Notification channel enum
enum NotificationChannel {
  prayerTimes('prayer_times', 'مواقيت الصلاة', 'إشعارات مواقيت الصلاة', Importance.high, Priority.high),
  salarySupport('salary_support', 'الرواتب والدعوم', 'إشعارات المواعيد المالية', Importance.high, Priority.high),
  general('general', 'إشعارات عامة', 'إشعارات عامة', Importance.defaultImportance, Priority.defaultPriority);

  final String id;
  final String name;
  final String description;
  final Importance importance;
  final Priority priority;

  const NotificationChannel(this.id, this.name, this.description, this.importance, this.priority);
}