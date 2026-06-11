import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/models/prayer_time_model.dart';
import '../../../../data/services/prayer_service.dart';

/// Prayer Times Widget - displays all 6 prayers with countdown
class PrayerTimesWidget extends StatefulWidget {
  final PrayerService? prayerService;
  final double? latitude;
  final double? longitude;

  const PrayerTimesWidget({
    super.key,
    this.prayerService,
    this.latitude,
    this.longitude,
  });

  @override
  State<PrayerTimesWidget> createState() => _PrayerTimesWidgetState();
}

class _PrayerTimesWidgetState extends State<PrayerTimesWidget> {
  Timer? _countdownTimer;
  PrayerTimeModel? _prayerTimes;
  bool _isLoading = true;
  String _nextPrayerLabel = '—';
  String _countdown = '--:--:--';

  @override
  void initState() {
    super.initState();
    _loadPrayerTimes();
    _startCountdownTimer();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadPrayerTimes() async {
    try {
      final service = widget.prayerService ?? PrayerService();
      
      // Try to get location-based prayer times
      if (widget.latitude != null && widget.longitude != null) {
        final times = await service.getPrayerTimesByLocation(
          latitude: widget.latitude!,
          longitude: widget.longitude!,
        );
        if (times != null) {
          _prayerTimes = PrayerTimeModel(
            fajr: times.fajr,
            sunrise: times.sunrise,
            dhuhr: times.dhuhr,
            asr: times.asr,
            maghrib: times.maghrib,
            isha: times.isha,
            date: DateTime.now(),
            latitude: widget.latitude,
            longitude: widget.longitude,
          );
        }
      }

      // Fallback to cached or mock data
      _prayerTimes ??= await service.getCachedPrayerTimes().then((cached) {
        if (cached != null) {
          return PrayerTimeModel(
            fajr: cached.fajr,
            sunrise: cached.sunrise,
            dhuhr: cached.dhuhr,
            asr: cached.asr,
            maghrib: cached.maghrib,
            isha: cached.isha,
            date: DateTime.now(),
          );
        }
        return PrayerTimeModel.mock;
      });

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _prayerTimes = PrayerTimeModel.mock;
        });
      }
    }
  }

  void _startCountdownTimer() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateCountdown();
    });
    _updateCountdown();
  }

  void _updateCountdown() {
    if (_prayerTimes == null) return;

    final now = DateTime.now();
    final prayers = _prayerTimes!.allPrayers;
    
    Map<String, String>? nextPrayer;
    for (final prayer in prayers) {
      final timeParts = prayer['time']!.split(':');
      final prayerTime = DateTime(
        now.year, now.month, now.day,
        int.parse(timeParts[0]), int.parse(timeParts[1]),
      );
      if (prayerTime.isAfter(now)) {
        nextPrayer = prayer;
        break;
      }
    }

    // If no prayer found today, return tomorrow's fajr
    nextPrayer ??= prayers.first;

    final timeParts = nextPrayer['time']!.split(':');
    DateTime nextTime = DateTime(
      now.year, now.month, now.day,
      int.parse(timeParts[0]), int.parse(timeParts[1]),
    );
    
    if (nextTime.isBefore(now)) {
      nextTime = nextTime.add(const Duration(days: 1));
    }

    final diff = nextTime.difference(now);
    final hours = diff.inHours.toString().padLeft(2, '0');
    final minutes = (diff.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (diff.inSeconds % 60).toString().padLeft(2, '0');

    if (mounted) {
      setState(() {
        _nextPrayerLabel = nextPrayer!['label'] ?? '—';
        _countdown = '$hours:$minutes:$seconds';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return _buildLoadingState();
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.85),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.borderGold),
        boxShadow: [
          BoxShadow(
            color: AppColors.brown.withOpacity(0.12),
            blurRadius: 25,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          _buildHeader(),
          _buildCountdownBar(),
          _buildPrayerList(),
        ],
      ),
    );
  }

  Widget _buildLoadingState() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.85),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.borderGold),
      ),
      child: const Center(
        child: CircularProgressIndicator(color: AppColors.gold),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.borderGold, width: 1)),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(child: Text('🕌', style: TextStyle(fontSize: 24))),
          ),
          const SizedBox(width: 12),
          Text(
            'مواقيت الصلاة',
            style: GoogleFonts.cairo(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: AppColors.ink,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCountdownBar() {
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.gold.withOpacity(0.15), AppColors.cream],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.gold.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.access_time, color: AppColors.brown, size: 20),
          const SizedBox(width: 10),
          Text(
            '$_nextPrayerLabel',
            style: GoogleFonts.cairo(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: AppColors.brown,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '•',
            style: GoogleFonts.cairo(fontSize: 16, color: AppColors.textSecondary),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.brown,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              _countdown,
              style: GoogleFonts.cairo(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrayerList() {
    if (_prayerTimes == null) return const SizedBox();

    final prayers = _prayerTimes!.allPrayers;
    final now = DateTime.now();
    
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: prayers.map((prayer) {
          final timeParts = prayer['time']!.split(':');
          final prayerTime = DateTime(
            now.year, now.month, now.day,
            int.parse(timeParts[0]), int.parse(timeParts[1]),
          );
          final isNext = prayerTime.isAfter(now) && 
              (prayers.indexOf(prayer) == 0 || 
               prayers.take(prayers.indexOf(prayer)).any((p) {
                 final tp = p['time']!.split(':');
                 final pt = DateTime(now.year, now.month, now.day, int.parse(tp[0]), int.parse(tp[1]));
                 return pt.isBefore(now);
               }));

          return _buildPrayerItem(
            prayer['label']!,
            prayer['icon']!,
            PrayerTimeModel.to12HourFormat(prayer['time']!),
            isNext,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildPrayerItem(String label, String icon, String time, bool isNext) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        color: isNext ? AppColors.gold.withOpacity(0.15) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        border: isNext ? Border.all(color: AppColors.gold.withOpacity(0.5)) : null,
      ),
      child: Column(
        children: [
          Text(icon, style: const TextStyle(fontSize: 18)),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.cairo(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: isNext ? AppColors.brown : AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            time,
            style: GoogleFonts.cairo(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              color: isNext ? AppColors.brown : AppColors.ink,
            ),
          ),
        ],
      ),
    );
  }
}