import 'package:flutter/foundation.dart';

/// Supabase Configuration
/// Configure your Supabase project credentials here
class SupabaseConfig {
  // TODO: Replace with your actual Supabase project credentials
  // Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
  
  /// Project URL (found in Project Settings > API)
  static const String supabaseUrl = 'YOUR_SUPABASE_URL';
  
  /// Anonymous/Public key (found in Project Settings > API)
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
  
  /// Whether to enable Supabase (set to false for demo mode)
  static const bool isEnabled = false;
  
  /// Demo mode configuration
  static const bool isDemoMode = true;
  
  /// Check if Supabase is properly configured
  static bool get isConfigured => 
    supabaseUrl != 'YOUR_SUPABASE_URL' && 
    supabaseAnonKey != 'YOUR_SUPABASE_ANON_KEY';
  
  /// Debug logging
  static void log(String message) {
    if (kDebugMode) {
      print('[SupabaseConfig] $message');
    }
  }
}

/// API Configuration
class ApiConfig {
  /// Prayer Times API (Aladhan API - free tier)
  static const String prayerApiBaseUrl = 'https://api.aladhan.com/v1';
  
  /// Financial Events API (your backend or gateway)
  static const String financialApiBaseUrl = 'YOUR_FINANCIAL_API_URL';
  
  /// Default city for prayer times
  static const String defaultCity = 'Riyadh';
  
  /// Default country
  static const String defaultCountry = 'Saudi Arabia';
}