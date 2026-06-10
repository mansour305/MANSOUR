import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../home/providers/providers.dart';

class DailyCardScreen extends ConsumerWidget {
  const DailyCardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dailyMessage = ref.watch(dailyMessageProvider);

    final now = DateTime.now();
    final greeting = now.hour < 12 ? 'صباح الخير' : 'مساء الخير';
    final dayName = AppConstants.arabicDays[now.weekday % 7];
    final monthName = AppConstants.arabicMonths[now.month - 1];

    return Scaffold(
      backgroundColor: const Color(0xFFFDF9F3),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFFDF9F3), Color(0xFFF3E8D6)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    GestureDetector(
                      onTap: () => context.pop(),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.borderGold),
                        ),
                        child: Icon(Icons.arrow_forward, color: AppColors.brown, size: 22),
                      ),
                    ),
                    Text(
                      'البطاقة اليومية',
                      style: GoogleFonts.cairo(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.ink),
                    ),
                    GestureDetector(
                      onTap: () => _shareCard(context),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.borderGold),
                        ),
                        child: Icon(Icons.share, color: AppColors.gold, size: 22),
                      ),
                    ),
                  ],
                ),
              ),
              // Card with background image
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      // Premium Card with daily-card.png background
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(color: AppColors.borderGold),
                          boxShadow: [BoxShadow(color: AppColors.brown.withOpacity(0.15), blurRadius: 24, offset: const Offset(0, 8))],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(28),
                          child: Stack(
                            children: [
                              // Background image
                              Positioned.fill(
                                child: Image.asset(
                                  'assets/images/daily-card.png',
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Container(color: AppColors.cream),
                                ),
                              ),
                              // Gradient overlay
                              Positioned.fill(
                                child: Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [Colors.white.withOpacity(0.9), Colors.white.withOpacity(0.85), Colors.white.withOpacity(0.95)],
                                    ),
                                  ),
                                ),
                              ),
                              // Content
                              Padding(
                                padding: const EdgeInsets.all(24),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Logo
                                    Row(
                                      children: [
                                        Container(
                                          width: 48,
                                          height: 48,
                                          decoration: BoxDecoration(
                                            color: Colors.white.withOpacity(0.8),
                                            borderRadius: BorderRadius.circular(14),
                                            border: Border.all(color: AppColors.borderGold),
                                          ),
                                          child: Center(
                                            child: Text('م', style: GoogleFonts.cairo(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.gold)),
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Text('مواعيدك', style: GoogleFonts.cairo(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.brown)),
                                      ],
                                    ),
                                    const SizedBox(height: 20),
                                    // Greeting
                                    Text(greeting, style: GoogleFonts.cairo(fontSize: 30, fontWeight: FontWeight.w800, color: AppColors.ink, height: 1.3)),
                                    const SizedBox(height: 8),
                                    Text('$dayName، ${now.day} $monthName ${now.year}', style: GoogleFonts.cairo(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                                    const SizedBox(height: 28),
                                    // Daily Message
                                    Container(
                                      padding: const EdgeInsets.all(20),
                                      decoration: BoxDecoration(
                                        color: AppColors.gold.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(color: AppColors.borderGold.withOpacity(0.3)),
                                      ),
                                      child: Text(dailyMessage, style: GoogleFonts.cairo(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.ink, height: 1.8), textAlign: TextAlign.center),
                                    ),
                                    const SizedBox(height: 24),
                                    // Footer
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text('✦', style: TextStyle(color: AppColors.gold, fontSize: 16)),
                                        const SizedBox(width: 8),
                                        Text('واذكروا الله ذكراً كثيراً', style: GoogleFonts.cairo(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.brown)),
                                        const SizedBox(width: 8),
                                        Text('✦', style: TextStyle(color: AppColors.gold, fontSize: 16)),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Action Buttons
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () => _copyCard(context, dailyMessage),
                              icon: const Icon(Icons.copy, size: 20),
                              label: Text('نسخ', style: GoogleFonts.cairo(fontSize: 16)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.gold,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => _shareCard(context),
                              icon: const Icon(Icons.share, size: 20),
                              label: Text('مشاركة', style: GoogleFonts.cairo(fontSize: 16)),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.brown,
                                side: BorderSide(color: AppColors.gold.withOpacity(0.4)),
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _copyCard(BuildContext context, String message) {
    final text = '✦ مواعيدك ✦\n$message\n\nواذكروا الله ذكراً كثيراً\n\nمواعيدك — منصة تجمع وقتك وراتبك ودعمك وأهم مواعيدك';
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('تم نسخ البطاقة', style: GoogleFonts.cairo()), backgroundColor: AppColors.gold),
    );
  }

  void _shareCard(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('مشاركة البطاقة', style: GoogleFonts.cairo()), backgroundColor: AppColors.brown),
    );
  }
}