import 'package:flutter/foundation.dart';
import '../../core/supabase_config.dart';

/// Authentication Service
/// Handles user authentication and session management
class AuthService {
  static AuthService? _instance;
  
  AuthService._();
  
  static AuthService get instance {
    _instance ??= AuthService._();
    return _instance!;
  }
  
  /// Current user state
  UserAuthState _state = UserAuthState.initial();
  
  /// Get current user state
  UserAuthState get state => _state;
  
  /// Check if user is authenticated
  bool get isAuthenticated => _state.isAuthenticated;
  
  /// Initialize auth service
  Future<void> initialize() async {
    SupabaseConfig.log('AuthService: Initializing...');
    
    if (SupabaseConfig.isDemoMode) {
      // Demo mode - use mock user
      _state = UserAuthState.demo();
      return;
    }
    
    if (!SupabaseConfig.isConfigured) {
      _state = UserAuthState.initial();
      return;
    }
    
    // TODO: Initialize actual Supabase auth listener
    // supabase.auth.onAuthStateChange.listen((event) {
    //   _handleAuthStateChange(event);
    // });
  }
  
  /// Sign in with email and password
  Future<AuthResult> signIn({
    required String email,
    required String password,
  }) async {
    SupabaseConfig.log('AuthService: signIn called for $email');
    
    if (SupabaseConfig.isDemoMode) {
      // Demo mode - simulate successful login
      await Future.delayed(const Duration(milliseconds: 500));
      _state = UserAuthState.demo(email: email);
      return AuthResult(success: true, message: 'تم تسجيل الدخول بنجاح');
    }
    
    // TODO: Implement actual Supabase sign in
    // try {
    //   final response = await supabase.auth.signInWithPassword(
    //     email: email,
    //     password: password,
    //   );
    //   _state = UserAuthState.authenticated(response.user);
    //   return AuthResult(success: true, user: response.user);
    // } catch (e) {
    //   return AuthResult(success: false, message: e.toString());
    // }
    
    return AuthResult(success: false, message: 'Supabase not configured');
  }
  
  /// Sign up with email and password
  Future<AuthResult> signUp({
    required String email,
    required String password,
    required String name,
  }) async {
    SupabaseConfig.log('AuthService: signUp called for $email');
    
    if (SupabaseConfig.isDemoMode) {
      await Future.delayed(const Duration(milliseconds: 500));
      _state = UserAuthState.demo(email: email, name: name);
      return AuthResult(success: true, message: 'تم إنشاء الحساب بنجاح');
    }
    
    // TODO: Implement actual Supabase sign up
    return AuthResult(success: false, message: 'Supabase not configured');
  }
  
  /// Sign out
  Future<void> signOut() async {
    SupabaseConfig.log('AuthService: signOut called');
    
    if (SupabaseConfig.isDemoMode) {
      _state = UserAuthState.initial();
      return;
    }
    
    // TODO: Implement actual Supabase sign out
    // await supabase.auth.signOut();
    _state = UserAuthState.initial();
  }
  
  /// Reset password
  Future<AuthResult> resetPassword(String email) async {
    SupabaseConfig.log('AuthService: resetPassword called for $email');
    
    if (SupabaseConfig.isDemoMode) {
      await Future.delayed(const Duration(milliseconds: 500));
      return AuthResult(success: true, message: 'تم إرسال رابط استعادة كلمة المرور');
    }
    
    // TODO: Implement actual Supabase password reset
    return AuthResult(success: false, message: 'Supabase not configured');
  }
  
  /// Update user profile
  Future<AuthResult> updateProfile({
    required String name,
    String? city,
    String? phone,
  }) async {
    SupabaseConfig.log('AuthService: updateProfile called');
    
    if (!isAuthenticated) {
      return AuthResult(success: false, message: 'غير مسجل الدخول');
    }
    
    if (SupabaseConfig.isDemoMode) {
      _state = _state.copyWith(
        name: name,
        city: city ?? _state.city,
      );
      return AuthResult(success: true, message: 'تم تحديث الملف الشخصي');
    }
    
    // TODO: Implement actual profile update
    return AuthResult(success: false, message: 'Supabase not configured');
  }
}

/// User Auth State
class UserAuthState {
  final bool isAuthenticated;
  final String? id;
  final String? email;
  final String? name;
  final String? city;
  final String? avatarUrl;
  final String? role;
  
  UserAuthState({
    required this.isAuthenticated,
    this.id,
    this.email,
    this.name,
    this.city,
    this.avatarUrl,
    this.role,
  });
  
  factory UserAuthState.initial() => UserAuthState(isAuthenticated: false);
  
  factory UserAuthState.demo({String? email, String? name}) => UserAuthState(
    isAuthenticated: true,
    id: 'demo-user-id',
    email: email ?? 'demo@mawaeedak.app',
    name: name ?? 'مستخدم تجريبي',
    city: 'الرياض',
    role: 'user',
  );
  
  factory UserAuthState.authenticated(dynamic user) => UserAuthState(
    isAuthenticated: true,
    id: user.id,
    email: user.email,
    name: user.userMetadata?['name'],
    city: user.userMetadata?['city'],
    avatarUrl: user.userMetadata?['avatar_url'],
    role: user.userMetadata?['role'] ?? 'user',
  );
  
  UserAuthState copyWith({
    bool? isAuthenticated,
    String? id,
    String? email,
    String? name,
    String? city,
    String? avatarUrl,
    String? role,
  }) {
    return UserAuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      city: city ?? this.city,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      role: role ?? this.role,
    );
  }
}

/// Auth Result
class AuthResult {
  final bool success;
  final String message;
  final dynamic user;
  
  AuthResult({
    required this.success,
    required this.message,
    this.user,
  });
}