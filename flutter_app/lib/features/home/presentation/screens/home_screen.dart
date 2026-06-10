import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../data/models/models.dart';
import '../../providers/providers.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prayerTimes = ref.watch(prayerTimesProvider);
    final financialEvents = ref.watch(financialEventsProvider);
    final dailyMessage = ref.watch(dailyMessageProvider);

    return Scaffold(
      backgroundColor: AppColors.paper,
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              // Header
              _buildHeader(),
              const SizedBox(height: 24),
              // Daily Message Card
              _buildDailyMessageCard(dailyMessage),
              const SizedBox(height: 28),
              // Prayer Times Section
              _buildSectionHeader('مواقيت الصلاة', 'الرياض'),
              const SizedBox(height: 14),
              _buildPrayerGrid(prayerTimes),
              const SizedBox(height: 28),
              // Financial Events Section
              _buildSectionHeader('المواعيد المالية', null),
              const SizedBox(height: 14),
              _buildFinancialList(financialEvents),
              const SizedBox(height: 28),
              // Quick Actions
              _buildSectionHeader('إجراءات سريعة', null),
              const SizedBox(height: 14),
              _buildQuickActions(context),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    final now = DateTime.now();
    final greeting = now.hour < 12 ? 'صباح الخير' : 'مساء الخير';
    final dayName = AppConstants.arabicDays[now.weekday % 7];
    final monthName = AppConstants.arabicMonths[now.month - 1];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              greeting,
              style: GoogleFonts.cairo(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              '$dayName، ${now.day} $monthName ${now.year}',
              style: GoogleFonts.cairo(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: AppColors.cream,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(color: AppColors.border),
          ),
          child: Center(
            child: Text('🕌', style: GoogleFonts.cairo(fontSize: 32)),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title, String? subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.cairo(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
            height: 1.3,
          ),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: GoogleFonts.cairo(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildDailyMessageCard(String message) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.soft,
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.15),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: const Icon(
              Icons.chat_bubble_outline_rounded,
              color: AppColors.gold,
              size: 22,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              message,
              style: GoogleFonts.cairo(
                fontSize: 15,
                color: AppColors.ink,
                height: 1.6,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrayerGrid(PrayerTimes times) {
    final prayers = [
      {'key': 'fajr', 'label': 'الفجر', 'time': times.fajr, 'icon': '🌙'},
      {'key': 'sunrise', 'label': 'الشروق', 'time': times.sunrise, 'icon': '🌅'},
      {'key': 'dhuhr', 'label': 'الظهر', 'time': times.dhuhr, 'icon': '☀️'},
      {'key': 'asr', 'label': 'العصر', 'time': times.asr, 'icon': '☀️'},
      {'key': 'maghrib', 'label': 'المغرب', 'time': times.maghrib, 'icon': '🌅'},
      {'key': 'isha', 'label': 'العشاء', 'time': times.isha, 'icon': '🌙'},
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 0.95,
        ),
        itemCount: prayers.length,
        itemBuilder: (context, index) {
          final prayer = prayers[index];
          return Container(
            decoration: BoxDecoration(
              color: AppColors.paper,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  prayer['icon'] as String,
                  style: GoogleFonts.cairo(fontSize: 22),
                ),
                const SizedBox(height: 6),
                Text(
                  prayer['label'] as String,
                  style: GoogleFonts.cairo(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  prayer['time'] as String,
                  style: GoogleFonts.cairo(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFinancialList(List<FinancialEvent> events) {
    return Column(
      children: events.map((event) => _buildFinancialItem(event)).toList(),
    );
  }

  Widget _buildFinancialItem(FinancialEvent event) {
    final icon = AppConstants.financialTypes[event.type]?['icon'] ?? '💵';
    final color = event.daysRemaining <= 2
        ? AppColors.error
        : event.daysRemaining <= 5
            ? AppColors.gold
            : AppColors.success;
    final daysText = event.daysRemaining == 0
        ? 'اليوم'
        : event.daysRemaining == 1
            ? 'غداً'
            : '${event.daysRemaining} يوم';

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.paper,
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Center(
              child: Text(icon, style: GoogleFonts.cairo(fontSize: 24)),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  event.name,
                  style: GoogleFonts.cairo(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
                if (event.amount != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    '${event.amount} ر.س',
                    style: GoogleFonts.cairo(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Text(
              daysText,
              style: GoogleFonts.cairo(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _QuickActionButton(
            icon: '🎴',
            label: 'البطاقة اليومية',
            color: AppColors.gold.withOpacity(0.15),
            onTap: () => context.pushNamed('daily-card'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _QuickActionButton(
            icon: '📅',
            label: 'المواعيد',
            color: AppColors.brown.withOpacity(0.15),
            onTap: () => context.goNamed('calendar'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _QuickActionButton(
            icon: '🏢',
            label: 'الخدمات',
            color: AppColors.olive.withOpacity(0.15),
            onTap: () => context.goNamed('services'),
          ),
        ),
      ],
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  final String icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(AppRadius.xl),
          border: Border.all(color: AppColors.border),
          boxShadow: AppShadows.soft,
        ),
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(AppRadius.lg),
              ),
              child: Center(
                child: Text(icon, style: GoogleFonts.cairo(fontSize: 26)),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              label,
              style: GoogleFonts.cairo(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.ink,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}