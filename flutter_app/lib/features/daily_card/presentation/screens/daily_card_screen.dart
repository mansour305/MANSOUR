import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../data/models/models.dart';
import '../../../home/providers/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class DailyCardScreen extends ConsumerWidget {
  const DailyCardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prayerTimes = ref.watch(prayerTimesProvider);
    final financialEvents = ref.watch(financialEventsProvider);
    final dailyMessage = ref.watch(dailyMessageProvider);

    final now = DateTime.now();
    final greeting = now.hour < 12 ? 'صباح الخير' : 'مساء الخير';
    final dayName = AppConstants.arabicDays[now.weekday % 7];
    final monthName = AppConstants.arabicMonths[now.month - 1];
    final hijriMonth = AppConstants.hijriMonths[now.month - 1];

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.only(top: 40),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.cream,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.arrow_forward, color: AppColors.ink),
                    ),
                  ),
                  const Text(
                    'البطاقة اليومية',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: AppColors.ink,
                    ),
                  ),
                  GestureDetector(
                    onTap: () => _shareCard(context),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.cream,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.share, color: AppColors.brown),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Premium Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.cream,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: AppColors.borderGold),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.brown.withOpacity(0.15),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Card Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.gold.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'بطاقة اليوم',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.gold,
                          ),
                        ),
                      ),
                      const Text('🕌', style: TextStyle(fontSize: 36)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  // Greeting
                  Text(
                    greeting,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: AppColors.ink,
                    ),
                  ),
                  Text(
                    '$dayName، ${now.day} $monthName ${now.year}',
                    style: const TextStyle(
                      fontSize: 15,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  Text(
                    '${now.day} $hijriMonth 1447 هـ',
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.gold,
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Next Prayer
                  const Text(
                    'الصلاة القادمة',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AppColors.gold.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppColors.borderGold),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text('☀️', style: TextStyle(fontSize: 32)),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'العصر',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.ink,
                                  ),
                                ),
                                Text(
                                  prayerTimes.asr,
                                  style: const TextStyle(
                                    fontSize: 15,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: const [
                            Text(
                              'متبقي',
                              style: TextStyle(
                                fontSize: 11,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            Text(
                              '2 ساعة و 30 دقيقة',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppColors.gold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Daily Message
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('❝', style: TextStyle(fontSize: 24)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          dailyMessage,
                          style: const TextStyle(
                            fontSize: 16,
                            color: AppColors.ink,
                            height: 1.6,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Prayer Times
                  const Text(
                    'مواقيت الصلاة',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _buildPrayerGrid(prayerTimes),
                  const SizedBox(height: 24),
                  // Financial Countdown
                  const Text(
                    'المواعيد المالية',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...financialEvents.take(2).map((event) => _buildFinancialItem(event)),
                  const SizedBox(height: 16),
                  // Footer
                  Center(
                    child: Column(
                      children: const [
                        Text(
                          'كل مواعيدك في مكان واحد',
                          style: TextStyle(
                            fontSize: 13,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        Text(
                          'مواعيدك',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.gold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Action Buttons
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    onPressed: () => _saveCard(context),
                    icon: const Icon(Icons.download),
                    label: const Text('حفظ البطاقة'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _shareCard(context),
                    icon: const Icon(Icons.share),
                    label: const Text('مشاركة'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPrayerGrid(PrayerTimes times) {
    final prayers = [
      {'label': 'الفجر', 'time': times.fajr, 'icon': '🌙'},
      {'label': 'الشروق', 'time': times.sunrise, 'icon': '🌅'},
      {'label': 'الظهر', 'time': times.dhuhr, 'icon': '☀️'},
      {'label': 'العصر', 'time': times.asr, 'icon': '☀️'},
      {'label': 'المغرب', 'time': times.maghrib, 'icon': '🌅'},
      {'label': 'العشاء', 'time': times.isha, 'icon': '🌙'},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 1,
      ),
      itemCount: prayers.length,
      itemBuilder: (context, index) {
        final prayer = prayers[index];
        final isNext = prayer['label'] == 'العصر';
        return Container(
          decoration: BoxDecoration(
            color: AppColors.paper,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isNext ? AppColors.gold : AppColors.border,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                prayer['icon'] as String,
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 4),
              Text(
                prayer['label'] as String,
                style: TextStyle(
                  fontSize: 11,
                  color: isNext ? AppColors.gold : AppColors.textSecondary,
                  fontWeight: isNext ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                prayer['time'] as String,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: isNext ? AppColors.gold : AppColors.ink,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFinancialItem(FinancialEvent event) {
    final daysText = event.daysRemaining == 0
        ? 'اليوم'
        : event.daysRemaining == 1
            ? 'غداً'
            : '${event.daysRemaining} يوم';
    final daysColor = event.daysRemaining <= 2 ? AppColors.error : AppColors.gold;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.paper,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          const Icon(Icons.attach_money, color: AppColors.gold, size: 18),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              event.name,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.ink,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${event.amount} ر.س',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.ink,
                ),
              ),
              Text(
                daysText,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: daysColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _saveCard(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('تم حفظ البطاقة')),
    );
  }

  void _shareCard(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('جاري مشاركة البطاقة...')),
    );
  }
}