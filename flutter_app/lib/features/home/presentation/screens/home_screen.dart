import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../data/models/models.dart';
import '../../providers/providers.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  Timer? _countdownTimer;
  String _countdown = "--:--:--";
  String _nextPrayerLabel = "—";
  
  @override
  void initState() {
    super.initState();
    _startCountdownTimer();
  }
  
  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }
  
  void _startCountdownTimer() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateCountdown();
    });
    _updateCountdown();
  }
  
  void _updateCountdown() {
    final prayerTimes = ref.read(prayerTimesProvider);
    final prayers = [
      {'key': 'fajr', 'label': 'الفجر', 'time': prayerTimes.fajr},
      {'key': 'sunrise', 'label': 'الشروق', 'time': prayerTimes.sunrise},
      {'key': 'dhuhr', 'label': 'الظهر', 'time': prayerTimes.dhuhr},
      {'key': 'asr', 'label': 'العصر', 'time': prayerTimes.asr},
      {'key': 'maghrib', 'label': 'المغرب', 'time': prayerTimes.maghrib},
      {'key': 'isha', 'label': 'العشاء', 'time': prayerTimes.isha},
    ];
    
    final now = DateTime.now();
    String? nextPrayerKey;
    String? nextPrayerLabel;
    DateTime? nextPrayerTime;
    
    for (final prayer in prayers) {
      final timeParts = prayer['time'].toString().split(':');
      if (timeParts.length >= 2) {
        final prayerDate = DateTime(
          now.year, now.month, now.day,
          int.parse(timeParts[0]), int.parse(timeParts[1]),
        );
        if (prayerDate.isAfter(now)) {
          nextPrayerKey = prayer['key'] as String;
          nextPrayerLabel = prayer['label'] as String;
          nextPrayerTime = prayerDate;
          break;
        }
      }
    }
    
    if (nextPrayerTime == null) {
      final fajrParts = prayerTimes.fajr.split(':');
      final tomorrowFajr = DateTime(
        now.year, now.month, now.day + 1,
        int.parse(fajrParts[0]), int.parse(fajrParts[1]),
      );
      nextPrayerKey = 'fajr';
      nextPrayerLabel = 'الفجر';
      nextPrayerTime = tomorrowFajr;
    }
    
    final diff = nextPrayerTime!.difference(now);
    final hours = diff.inHours.toString().padLeft(2, '0');
    final minutes = (diff.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (diff.inSeconds % 60).toString().padLeft(2, '0');
    
    if (mounted) {
      setState(() {
        _nextPrayerLabel = nextPrayerLabel ?? "—";
        _countdown = "$hours:$minutes:$seconds";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final prayerTimes = ref.watch(prayerTimesProvider);
    final financialEvents = ref.watch(financialEventsProvider);
    final dailyMessage = ref.watch(dailyMessageProvider);

    return Scaffold(
      backgroundColor: AppColors.paper,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFFAF7F2),
              Color(0xFFF3E8D6),
            ],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                // Day header with dates
                _buildDayHeader(),
                const SizedBox(height: 20),
                // Hero card with desert background
                _buildHeroCard(),
                const SizedBox(height: 20),
                // Prayer times section
                _buildPrayerSection(prayerTimes),
                const SizedBox(height: 20),
                // Financial events section
                _buildFinancialSection(financialEvents),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDayHeader() {
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

  Widget _buildHeroCard() {
    final now = DateTime.now();
    final greeting = now.hour < 12 ? 'صباح الخير' : 'مساء الخير';
    final dailyMessage = ref.watch(dailyMessageProvider);

    return Container(
      height: 250,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppColors.borderGold),
        boxShadow: [
          BoxShadow(
            color: AppColors.brown.withOpacity(0.18),
            blurRadius: 45,
            offset: const Offset(0, 18),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: Stack(
          children: [
            // Background image
            Positioned.fill(
              child: Image.asset(
                'assets/images/desert-hero.png',
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(color: AppColors.cream);
                },
              ),
            ),
            // Gradient overlay
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                    colors: [
                      const Color(0xFFFAF7F2).withOpacity(0.95),
                      const Color(0xFFFAF7F2).withOpacity(0.72),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
            // Content
            Positioned(
              top: 0,
              bottom: 0,
              right: 16,
              width: MediaQuery.of(context).size.width * 0.55,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    greeting,
                    style: GoogleFonts.cairo(
                      fontSize: 30,
                      fontWeight: FontWeight.w800,
                      color: AppColors.ink,
                      height: 1.2,
                    ),
                    textAlign: TextAlign.right,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    dailyMessage,
                    style: GoogleFonts.cairo(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF5D554A),
                      height: 1.8,
                    ),
                    textAlign: TextAlign.right,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 16),
                  Text('♥', style: TextStyle(fontSize: 24, color: AppColors.gold)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPrayerSection(PrayerTimes times) {
    final prayers = [
      {'key': 'fajr', 'label': 'الفجر', 'time': times.fajr, 'icon': Icons.nightlight_round},
      {'key': 'sunrise', 'label': 'الشروق', 'time': times.sunrise, 'icon': Icons.wb_sunny},
      {'key': 'dhuhr', 'label': 'الظهر', 'time': times.dhuhr, 'icon': Icons.wb_sunny},
      {'key': 'asr', 'label': 'العصر', 'time': times.asr, 'icon': Icons.wb_sunny},
      {'key': 'maghrib', 'label': 'المغرب', 'time': times.maghrib, 'icon': Icons.wb_twilight},
      {'key': 'isha', 'label': 'العشاء', 'time': times.isha, 'icon': Icons.nightlight_round},
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.72),
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: AppColors.borderGold),
        boxShadow: [
          BoxShadow(
            color: AppColors.brown.withOpacity(0.10),
            blurRadius: 30,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 1,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.transparent, AppColors.gold, Colors.transparent],
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'مواقيت الصلاة',
                  style: GoogleFonts.cairo(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppColors.brown,
                  ),
                ),
              ),
              Icon(Icons.calendar_today, color: AppColors.gold, size: 24),
            ],
          ),
          const SizedBox(height: 12),
          // Prayer times grid
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: prayers.map((prayer) {
                final isNext = _nextPrayerLabel == prayer['label'];
                return Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: isNext ? const Color(0xFFF3E8D6) : Colors.white.withOpacity(0.62),
                      border: Border(
                        left: BorderSide(color: AppColors.border),
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          prayer['icon'] as IconData,
                          color: AppColors.gold,
                          size: 24,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          prayer['label'] as String,
                          style: GoogleFonts.cairo(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: isNext ? AppColors.brown : AppColors.ink,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          prayer['time'] as String,
                          style: GoogleFonts.cairo(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.ink,
                          ),
                          textDirection: TextDirection.ltr,
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 12),
          // Inspirational message
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.paper,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Icon(Icons.calendar_today, color: AppColors.gold, size: 40),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'الصلاة نور وراحة للقلب، فحافظ عليها في وقتها',
                    style: GoogleFonts.cairo(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.brown,
                      height: 1.8,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          // Next prayer countdown
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.borderGold),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.access_time, color: AppColors.gold, size: 16),
                const SizedBox(width: 8),
                Text(
                  'الصلاة القادمة: $_nextPrayerLabel • متبقي $_countdown',
                  style: GoogleFonts.cairo(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFinancialSection(List<FinancialEvent> events) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.72),
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: AppColors.borderGold),
        boxShadow: [
          BoxShadow(
            color: AppColors.brown.withOpacity(0.10),
            blurRadius: 30,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.calendar_today, color: AppColors.gold, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    'مواعيد مهمة قريبة',
                    style: GoogleFonts.cairo(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppColors.ink,
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: () => context.goNamed('salary'),
                child: Text(
                  'عرض الكل',
                  style: GoogleFonts.cairo(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.brown,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (events.isEmpty)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFFFFFCF7),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: AppColors.borderGold),
              ),
              child: Column(
                children: [
                  Icon(Icons.account_balance_wallet, color: AppColors.gold, size: 28),
                  const SizedBox(height: 12),
                  Text(
                    'لا توجد مواعيد مالية مؤكدة',
                    style: GoogleFonts.cairo(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.ink,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'اربط قاعدة البيانات لعرض المواعيد المالية',
                    style: GoogleFonts.cairo(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            )
          else
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.9,
              ),
              itemCount: events.length > 4 ? 4 : events.length,
              itemBuilder: (context, index) {
                final event = events[index];
                return _buildFinancialCard(event);
              },
            ),
        ],
      ),
    );
  }

  Widget _buildFinancialCard(FinancialEvent event) {
    final icon = AppConstants.financialTypes[event.type]?['icon'] ?? '💵';
    final isHousing = event.name.contains('سكن');
    
    return GestureDetector(
      onTap: () => context.goNamed('salary'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFFFFCF7),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.borderGold),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(icon, style: GoogleFonts.cairo(fontSize: 24)),
            const SizedBox(height: 8),
            Text(
              event.name,
              style: GoogleFonts.cairo(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              event.nextDate ?? '',
              style: GoogleFonts.cairo(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '${event.daysRemaining}',
              style: GoogleFonts.cairo(
                fontSize: 38,
                fontWeight: FontWeight.w800,
                color: AppColors.brown,
              ),
            ),
            Text(
              'يوماً متبقياً',
              style: GoogleFonts.cairo(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
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