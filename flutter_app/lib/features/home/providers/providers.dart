import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/models/models.dart';
import '../../../data/services/api_service.dart';
import '../../../core/constants/app_constants.dart';

/// API Service Provider
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

/// Prayer Times Provider - Real API with local fallback
final prayerTimesProvider = StateNotifierProvider<PrayerTimesNotifier, PrayerTimes>((ref) {
  return PrayerTimesNotifier(ref);
});

class PrayerTimesNotifier extends StateNotifier<PrayerTimes> {
  final Ref _ref;
  
  PrayerTimesNotifier(this._ref) : super(PrayerTimes.mock) {
    _loadPrayerTimes();
  }

  Future<void> _loadPrayerTimes() async {
    try {
      final api = _ref.read(apiServiceProvider);
      final times = await api.getPrayerTimes(
        city: AppConstants.defaultCityKey,
        date: DateTime.now().toIso8601String().split('T')[0],
      );
      state = times;
    } catch (e) {
      // Fallback to mock data if API fails
      state = PrayerTimes.mock;
    }
  }

  void updateTimes(PrayerTimes times) {
    state = times;
  }
}

/// Financial Events Provider - Real API with local fallback
final financialEventsProvider = StateNotifierProvider<FinancialEventsNotifier, List<FinancialEvent>>((ref) {
  return FinancialEventsNotifier(ref);
});

class FinancialEventsNotifier extends StateNotifier<List<FinancialEvent>> {
  final Ref _ref;
  
  FinancialEventsNotifier(this._ref) : super(_mockFinancialEvents) {
    _loadFinancialEvents();
  }

  Future<void> _loadFinancialEvents() async {
    try {
      final api = _ref.read(apiServiceProvider);
      final events = await api.getFinancialEvents();
      state = events;
    } catch (e) {
      // Keep mock data if API fails
    }
  }

  void addEvent(FinancialEvent event) {
    state = [...state, event];
    // Try to persist to API (fire and forget)
    _ref.read(apiServiceProvider).createFinancialEvent(event);
  }

  void removeEvent(String id) {
    state = state.where((e) => e.id != id).toList();
    // Try to delete from API (fire and forget)
    _ref.read(apiServiceProvider).deleteFinancialEvent(id);
  }
}

final _mockFinancialEvents = [
  const FinancialEvent(
    id: '1',
    name: 'راتب شهر ذو الحجة',
    date: '2026-06-25',
    amount: '12,000',
    type: 'salary',
    daysRemaining: 16,
  ),
  const FinancialEvent(
    id: '2',
    name: 'حساب المواطن',
    date: '2026-06-10',
    amount: '2,000',
    type: 'support',
    daysRemaining: 1,
  ),
  const FinancialEvent(
    id: '3',
    name: 'فاتورة كهرباء',
    date: '2026-06-12',
    amount: '350',
    type: 'bill',
    daysRemaining: 3,
  ),
];

/// Appointments Provider - Real API with local fallback
final appointmentsProvider = StateNotifierProvider<AppointmentsNotifier, List<Appointment>>((ref) {
  return AppointmentsNotifier(ref);
});

class AppointmentsNotifier extends StateNotifier<List<Appointment>> {
  final Ref _ref;
  
  AppointmentsNotifier(this._ref) : super(_mockAppointments) {
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    try {
      final api = _ref.read(apiServiceProvider);
      final appointments = await api.getAppointments();
      state = appointments;
    } catch (e) {
      // Keep mock data if API fails
    }
  }

  void addAppointment(Appointment appointment) {
    state = [...state, appointment];
    // Try to persist to API (fire and forget)
    _ref.read(apiServiceProvider).createAppointment(appointment);
  }

  void removeAppointment(String id) {
    state = state.where((a) => a.id != id).toList();
    // Try to delete from API (fire and forget)
    _ref.read(apiServiceProvider).deleteAppointment(id);
  }

  void updateAppointment(Appointment appointment) {
    state = state.map((a) => a.id == appointment.id ? appointment : a).toList();
  }
}

final _mockAppointments = [
  const Appointment(
    id: '1',
    title: 'زيارة الطبيب',
    date: '2026-06-12',
    time: '10:00',
    type: 'medical',
    notes: 'فحص دوري',
  ),
  const Appointment(
    id: '2',
    title: 'تجديد الإقامة',
    date: '2026-06-15',
    time: '14:00',
    type: 'official',
  ),
  const Appointment(
    id: '3',
    title: 'اجتماع عمل',
    date: '2026-06-18',
    time: '09:00',
    type: 'personal',
    notes: 'فندق الريتز',
  ),
];

/// Service Centers Provider - Real API with local fallback
final serviceCentersProvider = StateNotifierProvider<ServiceCentersNotifier, List<ServiceCenter>>((ref) {
  return ServiceCentersNotifier(ref);
});

class ServiceCentersNotifier extends StateNotifier<List<ServiceCenter>> {
  final Ref _ref;
  
  ServiceCentersNotifier(this._ref) : super([]) {
    _loadServiceCenters();
  }

  Future<void> _loadServiceCenters() async {
    // Load from constants as fallback
    final localCenters = AppConstants.serviceCenters.map((center) {
      return ServiceCenter(
        id: center['id'] as int,
        name: center['name'] as String,
        icon: center['icon'] as String,
        services: List<String>.from(center['services'] as List),
      );
    }).toList();
    
    state = localCenters;
    
    // Try to fetch from API
    try {
      final api = _ref.read(apiServiceProvider);
      final centers = await api.getServiceCenters();
      if (centers.isNotEmpty) {
        state = centers;
      }
    } catch (e) {
      // Keep local data if API fails
    }
  }
}

/// User Provider - Real API with local fallback
final userProvider = StateNotifierProvider<UserNotifier, User>((ref) {
  return UserNotifier(ref);
});

class UserNotifier extends StateNotifier<User> {
  final Ref _ref;
  
  UserNotifier(this._ref) : super(User.empty) {
    _loadUser();
  }

  Future<void> _loadUser() async {
    try {
      final api = _ref.read(apiServiceProvider);
      final user = await api.getUserProfile();
      state = user;
    } catch (e) {
      // Keep empty user if API fails
    }
  }

  void updateUser(User user) {
    state = user;
    // Try to persist to API (fire and forget)
    _ref.read(apiServiceProvider).updateUserProfile(user);
  }

  void updateName(String name) {
    final newUser = User(
      id: state.id,
      name: name,
      email: state.email,
      city: state.city,
      cityKey: state.cityKey,
      timezone: state.timezone,
      role: state.role,
      onboardingComplete: state.onboardingComplete,
    );
    state = newUser;
    _ref.read(apiServiceProvider).updateUserProfile(newUser);
  }

  void updateCity(String city, String cityKey) {
    final newUser = User(
      id: state.id,
      name: state.name,
      email: state.email,
      city: city,
      cityKey: cityKey,
      timezone: state.timezone,
      role: state.role,
      onboardingComplete: state.onboardingComplete,
    );
    state = newUser;
    _ref.read(apiServiceProvider).updateUserProfile(newUser);
  }
}

/// Settings Provider
class AppSettings {
  final bool prayerNotifications;
  final bool financialNotifications;
  final bool appointmentNotifications;
  final bool dailyCardNotifications;
  final bool hapticFeedback;
  final bool autoLocation;
  final String themeMode;

  const AppSettings({
    this.prayerNotifications = true,
    this.financialNotifications = true,
    this.appointmentNotifications = true,
    this.dailyCardNotifications = false,
    this.hapticFeedback = true,
    this.autoLocation = true,
    this.themeMode = 'light',
  });

  AppSettings copyWith({
    bool? prayerNotifications,
    bool? financialNotifications,
    bool? appointmentNotifications,
    bool? dailyCardNotifications,
    bool? hapticFeedback,
    bool? autoLocation,
    String? themeMode,
  }) {
    return AppSettings(
      prayerNotifications: prayerNotifications ?? this.prayerNotifications,
      financialNotifications: financialNotifications ?? this.financialNotifications,
      appointmentNotifications: appointmentNotifications ?? this.appointmentNotifications,
      dailyCardNotifications: dailyCardNotifications ?? this.dailyCardNotifications,
      hapticFeedback: hapticFeedback ?? this.hapticFeedback,
      autoLocation: autoLocation ?? this.autoLocation,
      themeMode: themeMode ?? this.themeMode,
    );
  }
}

final settingsProvider = StateNotifierProvider<SettingsNotifier, AppSettings>((ref) {
  return SettingsNotifier();
});

class SettingsNotifier extends StateNotifier<AppSettings> {
  SettingsNotifier() : super(const AppSettings());

  void togglePrayerNotifications() {
    state = state.copyWith(prayerNotifications: !state.prayerNotifications);
  }

  void toggleFinancialNotifications() {
    state = state.copyWith(financialNotifications: !state.financialNotifications);
  }

  void toggleAppointmentNotifications() {
    state = state.copyWith(appointmentNotifications: !state.appointmentNotifications);
  }

  void toggleDailyCardNotifications() {
    state = state.copyWith(dailyCardNotifications: !state.dailyCardNotifications);
  }

  void toggleHapticFeedback() {
    state = state.copyWith(hapticFeedback: !state.hapticFeedback);
  }

  void toggleAutoLocation() {
    state = state.copyWith(autoLocation: !state.autoLocation);
  }

  void setThemeMode(String mode) {
    state = state.copyWith(themeMode: mode);
  }
}

/// Selected Date Provider for Calendar
final selectedDateProvider = StateProvider<DateTime>((ref) {
  return DateTime.now();
});

/// Current Tab Index Provider
final currentTabIndexProvider = StateProvider<int>((ref) => 0);

/// Daily Message Provider
final dailyMessageProvider = Provider<String>((ref) {
  return AppConstants.defaultDailyMessage;
});