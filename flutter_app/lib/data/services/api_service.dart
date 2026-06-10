import 'package:dio/dio.dart';
import '../models/models.dart';

/// API Service for Mawaeedak - connects to real backend
class ApiService {
  final Dio _dio;
  
  // Base URL - should be configured via environment
  static const String baseUrl = 'https://api.mawaeedak.app/api/v1';
  
  ApiService({Dio? dio}) : _dio = dio ?? Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  ));

  // Prayer Times API
  Future<PrayerTimes> getPrayerTimes({
    required String city,
    required String date,
  }) async {
    try {
      final response = await _dio.get(
        '/prayer-times',
        queryParameters: {
          'city': city,
          'date': date,
        },
      );
      return PrayerTimes.fromMap(response.data);
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to fetch prayer times',
        statusCode: e.response?.statusCode,
      );
    }
  }

  // Financial Events API
  Future<List<FinancialEvent>> getFinancialEvents() async {
    try {
      final response = await _dio.get('/financial-events');
      final List<dynamic> data = response.data;
      return data.map((json) => FinancialEvent.fromMap(json)).toList();
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to fetch financial events',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<FinancialEvent> createFinancialEvent(FinancialEvent event) async {
    try {
      final response = await _dio.post(
        '/financial-events',
        data: event.toMap(),
      );
      return FinancialEvent.fromMap(response.data);
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to create financial event',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<void> deleteFinancialEvent(String id) async {
    try {
      await _dio.delete('/financial-events/$id');
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to delete financial event',
        statusCode: e.response?.statusCode,
      );
    }
  }

  // Appointments API
  Future<List<Appointment>> getAppointments({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '/appointments',
        queryParameters: {
          if (startDate != null) 'start_date': startDate,
          if (endDate != null) 'end_date': endDate,
        },
      );
      final List<dynamic> data = response.data;
      return data.map((json) => Appointment.fromMap(json)).toList();
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to fetch appointments',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<Appointment> createAppointment(Appointment appointment) async {
    try {
      final response = await _dio.post(
        '/appointments',
        data: appointment.toMap(),
      );
      return Appointment.fromMap(response.data);
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to create appointment',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<void> deleteAppointment(String id) async {
    try {
      await _dio.delete('/appointments/$id');
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to delete appointment',
        statusCode: e.response?.statusCode,
      );
    }
  }

  // User API
  Future<User> getUserProfile() async {
    try {
      final response = await _dio.get('/user/profile');
      return User.fromMap(response.data);
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to fetch user profile',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<User> updateUserProfile(User user) async {
    try {
      final response = await _dio.put(
        '/user/profile',
        data: user.toMap(),
      );
      return User.fromMap(response.data);
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to update user profile',
        statusCode: e.response?.statusCode,
      );
    }
  }

  // Service Centers API
  Future<List<ServiceCenter>> getServiceCenters() async {
    try {
      final response = await _dio.get('/service-centers');
      final List<dynamic> data = response.data;
      return data.map((json) => ServiceCenter(
        id: json['id'],
        name: json['name'],
        icon: json['icon'] ?? '🏢',
        services: List<String>.from(json['services'] ?? []),
      )).toList();
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to fetch service centers',
        statusCode: e.response?.statusCode,
      );
    }
  }

  // Daily Message API
  Future<DailyMessage> getDailyMessage() async {
    try {
      final response = await _dio.get('/daily-message');
      return DailyMessage.fromMap(response.data);
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to fetch daily message',
        statusCode: e.response?.statusCode,
      );
    }
  }

  // Notifications API
  Future<List<AppNotification>> getNotifications() async {
    try {
      final response = await _dio.get('/notifications');
      final List<dynamic> data = response.data;
      return data.map((json) => AppNotification.fromMap(json)).toList();
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to fetch notifications',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<void> markNotificationRead(String id) async {
    try {
      await _dio.put('/notifications/$id/read');
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Failed to mark notification as read',
        statusCode: e.response?.statusCode,
      );
    }
  }
}

/// API Exception
class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException({required this.message, this.statusCode});

  @override
  String toString() => 'ApiException: $message (status: $statusCode)';
}