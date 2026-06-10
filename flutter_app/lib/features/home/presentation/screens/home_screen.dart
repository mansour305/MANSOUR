import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
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
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              // Header
              _buildHeader(),
              const SizedBox(height: 20),
              // Daily Message
              _buildDailyMessageCard(dailyMessage),
              const SizedBox(height: 24),
              // Prayer Times Section
              _buildSectionTitle('مواقيت الصلاة'),
              _buildSectionSubtitle('الرياض'),
              const SizedBox(height: 12),
              _buildPrayerGrid(prayerTimes),
              const SizedBox(height: 24),
              // Financial Events Section
              _buildSectionTitle('المواعيد المالية'),
              const SizedBox(height: 12),
              _buildFinancialList(financialEvents),
              const SizedBox(height: 24),
              // Quick Actions
              _buildSectionTitle('إجراءات سريعة'),
              const SizedBox(height: 12),
              _buildQuickActions(context),
              const SizedBox(height: 100), // Bottom padding for nav bar
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
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              greeting,
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '$dayName، ${now.day} $monthName ${now.year}',
              style: const TextStyle(
                fontSize: 14,
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
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Center(
            child: Text('🕌', style: TextStyle(fontSize: 32)),
          ),
        ),
      ],
    );
  }

  Widget _buildDailyMessageCard(String message) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(
              Icons.chat_bubble_outline,
              color: AppColors.gold,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                fontSize: 15,
                color: AppColors.ink,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: AppColors.ink,
      ),
    );
  }

  Widget _buildSectionSubtitle(String subtitle) {
    return Text(
      subtitle,
      style: const TextStyle(
        fontSize: 14,
        color: AppColors.textSecondary,
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

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
        childAspectRatio: 1,
      ),
      itemCount: prayers.length,
      itemBuilder: (context, index) {
        final prayer = prayers[index];
        return Container(
          decoration: BoxDecoration(
            color: AppColors.cream,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                prayer['icon'] as String,
                style: const TextStyle(fontSize: 20),
              ),
              const SizedBox(height: 4),
              Text(
                prayer['label'] as String,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                prayer['time'] as String,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.ink,
                ),
              ),
            ],
          ),
        );
      },
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
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.paper,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(icon, style: const TextStyle(fontSize: 24)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  event.name,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
                if (event.amount != null)
                  Text(
                    '${event.amount} ر.س',
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              daysText,
              style: TextStyle(
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
            color: AppColors.gold.withOpacity(0.2),
            onTap: () => context.pushNamed('daily-card'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _QuickActionButton(
            icon: '📅',
            label: 'المواعيد',
            color: AppColors.brown.withOpacity(0.2),
            onTap: () => context.goNamed('calendar'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _QuickActionButton(
            icon: '🏢',
            label: 'الخدمات',
            color: AppColors.success.withOpacity(0.2),
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
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Center(
                child: Text(icon, style: const TextStyle(fontSize: 24)),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.ink,
              ),
            ),
          ],
        ),
      ),
    );
  }
}