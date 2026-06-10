import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Mawaeedak Theme - Luxury Saudi Design System
class AppColors {
  // Primary Colors - Official Brand Colors
  static const Color gold = Color(0xFFC9A063);
  static const Color brown = Color(0xFF8A6B3D);
  static const Color ink = Color(0xFF2F2B25);
  
  // Backgrounds - Warm Saudi Palette
  static const Color paper = Color(0xFFFAF7F2);
  static const Color cream = Color(0xFFF5EFE4);
  static const Color surface = Color(0xFFFFFFFF);
  
  // Text Colors
  static const Color textPrimary = Color(0xFF2F2B25);
  static const Color textSecondary = Color(0xFF6F6557);
  
  // Semantic Colors
  static const Color error = Color(0xFFB45A4D);
  static const Color success = Color(0xFF7A9A74);
  static const Color info = Color(0xFF4A7FB5);
  
  // Extended Palette
  static const Color olive = Color(0xFF6F7C5B);
  static const Color mistBlue = Color(0xFF8FA1B3);
  static const Color softGray = Color(0xFFDCD7CF);
  static const Color dustRose = Color(0xFFE9D7C8);
  
  // Borders
  static const Color border = Color(0x1AC9A063);
  static const Color borderGold = Color(0x4DC9A063);
  
  // Shadows
  static const Color shadowLight = Color(0x14000000);
  static const Color shadowMedium = Color(0x20000000);
}

class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;
}

class AppRadius {
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 28;
  static const double full = 999;
}

class AppShadows {
  static List<BoxShadow> get soft => [
    BoxShadow(
      color: AppColors.shadowLight,
      blurRadius: 12,
      offset: const Offset(0, 4),
    ),
  ];
  
  static List<BoxShadow> get medium => [
    BoxShadow(
      color: AppColors.shadowMedium,
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
  ];
  
  static List<BoxShadow> get gold => [
    BoxShadow(
      color: AppColors.gold.withOpacity(0.15),
      blurRadius: 24,
      offset: const Offset(0, 8),
    ),
  ];
}

/// Cairo Font Family
String get _cairoFontFamily => GoogleFonts.cairo().fontFamily!;

/// Get text theme with Cairo font
TextTheme _buildTextTheme() {
  return TextTheme(
    displayLarge: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 32,
      fontWeight: FontWeight.w800,
      color: AppColors.ink,
      height: 1.3,
    ),
    displayMedium: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 28,
      fontWeight: FontWeight.w800,
      color: AppColors.ink,
      height: 1.3,
    ),
    displaySmall: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 24,
      fontWeight: FontWeight.w700,
      color: AppColors.ink,
      height: 1.3,
    ),
    headlineLarge: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 22,
      fontWeight: FontWeight.w700,
      color: AppColors.ink,
      height: 1.3,
    ),
    headlineMedium: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 20,
      fontWeight: FontWeight.w700,
      color: AppColors.ink,
      height: 1.3,
    ),
    headlineSmall: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 18,
      fontWeight: FontWeight.w600,
      color: AppColors.ink,
      height: 1.4,
    ),
    titleLarge: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 18,
      fontWeight: FontWeight.w700,
      color: AppColors.ink,
      height: 1.4,
    ),
    titleMedium: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 16,
      fontWeight: FontWeight.w600,
      color: AppColors.ink,
      height: 1.4,
    ),
    titleSmall: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.w600,
      color: AppColors.ink,
      height: 1.4,
    ),
    bodyLarge: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 16,
      fontWeight: FontWeight.w500,
      color: AppColors.textPrimary,
      height: 1.5,
    ),
    bodyMedium: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: AppColors.textSecondary,
      height: 1.5,
    ),
    bodySmall: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 12,
      fontWeight: FontWeight.w500,
      color: AppColors.textSecondary,
      height: 1.5,
    ),
    labelLarge: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.w600,
      color: AppColors.textPrimary,
      height: 1.4,
    ),
    labelMedium: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 13,
      fontWeight: FontWeight.w600,
      color: AppColors.textPrimary,
      height: 1.4,
    ),
    labelSmall: TextStyle(
      fontFamily: _cairoFontFamily,
      fontSize: 11,
      fontWeight: FontWeight.w600,
      color: AppColors.textSecondary,
      height: 1.4,
    ),
  );
}

class AppTheme {
  static ThemeData get lightTheme {
    final textTheme = _buildTextTheme();
    
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: AppColors.gold,
        secondary: AppColors.brown,
        surface: AppColors.surface,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textPrimary,
      ),
      scaffoldBackgroundColor: AppColors.paper,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.paper,
        foregroundColor: AppColors.ink,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.cairo(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: AppColors.ink,
        ),
        iconTheme: const IconThemeData(color: AppColors.ink),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.gold,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
          textStyle: GoogleFonts.cairo(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          elevation: 0,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.gold,
          side: const BorderSide(color: AppColors.gold, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
          textStyle: GoogleFonts.cairo(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.gold,
          textStyle: GoogleFonts.cairo(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.cream,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.gold, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: GoogleFonts.cairo(
          fontSize: 14,
          color: AppColors.textSecondary,
        ),
        labelStyle: GoogleFonts.cairo(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: AppColors.textSecondary,
        ),
      ),
      cardTheme: CardTheme(
        color: AppColors.cream,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.lg),
          side: const BorderSide(color: AppColors.border),
        ),
        margin: EdgeInsets.zero,
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
        space: 1,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.paper,
        selectedItemColor: AppColors.gold,
        unselectedItemColor: AppColors.brown,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: GoogleFonts.cairo(
          fontSize: 10,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: GoogleFonts.cairo(
          fontSize: 10,
          fontWeight: FontWeight.w500,
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.gold;
          }
          return AppColors.textSecondary;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.gold.withOpacity(0.3);
          }
          return AppColors.border;
        }),
      ),
      dialogTheme: DialogTheme(
        backgroundColor: AppColors.paper,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        titleTextStyle: GoogleFonts.cairo(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: AppColors.ink,
        ),
        contentTextStyle: GoogleFonts.cairo(
          fontSize: 14,
          color: AppColors.textSecondary,
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.paper,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(AppRadius.xl),
            topRight: Radius.circular(AppRadius.xl),
          ),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.ink,
        contentTextStyle: GoogleFonts.cairo(
          fontSize: 14,
          color: Colors.white,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}