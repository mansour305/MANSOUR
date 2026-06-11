import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/models/salary_support_model.dart';
import '../../../../core/services/salary_support_service.dart';

/// Salary/Support Widget - displays upcoming payments with countdown
class SalarySupportWidget extends StatefulWidget {
  final SalarySupportService? service;
  final bool showAll;

  const SalarySupportWidget({
    super.key,
    this.service,
    this.showAll = false,
  });

  @override
  State<SalarySupportWidget> createState() => _SalarySupportWidgetState();
}

class _SalarySupportWidgetState extends State<SalarySupportWidget> {
  Timer? _refreshTimer;
  List<SalarySupportModel> _items = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadItems();
    _startRefreshTimer();
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadItems() async {
    try {
      final service = widget.service ?? SalarySupportService();
      final items = widget.showAll 
          ? await service.getAllItems()
          : await service.getUpcomingItems();

      if (mounted) {
        setState(() {
          _items = items;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _startRefreshTimer() {
    _refreshTimer = Timer.periodic(const Duration(minutes: 1), (_) {
      _loadItems(); // Reload to update countdown
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return _buildLoadingState();
    }

    if (_items.isEmpty) {
      return _buildEmptyState();
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
          if (!widget.showAll && _items.isNotEmpty) _buildNextItem(_items.first),
          _buildItemsList(),
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

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.85),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.borderGold),
      ),
      child: Column(
        children: [
          Icon(Icons.account_balance_wallet, color: AppColors.gold, size: 40),
          const SizedBox(height: 12),
          Text(
            'لا توجد مواعيد مالية قادمة',
            style: GoogleFonts.cairo(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
        ],
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
            child: const Center(child: Text('💰', style: TextStyle(fontSize: 24))),
          ),
          const SizedBox(width: 12),
          Text(
            widget.showAll ? 'الرواتب والدعوم' : 'المواعيد المالية',
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

  Widget _buildNextItem(SalarySupportModel item) {
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.gold.withOpacity(0.2), AppColors.cream],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.gold),
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.brown,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                item.icon ?? '💰',
                style: const TextStyle(fontSize: 26),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.nameAr,
                  style: GoogleFonts.cairo(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  item.adjustedDateString,
                  style: GoogleFonts.cairo(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.brown,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                Text(
                  item.daysRemaining.toString(),
                  style: GoogleFonts.cairo(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'يوم',
                  style: GoogleFonts.cairo(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItemsList() {
    final displayItems = widget.showAll ? _items : _items.skip(1).toList();
    if (displayItems.isEmpty) return const SizedBox();

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
      child: Column(
        children: displayItems.map((item) => _buildItemCard(item)).toList(),
      ),
    );
  }

  Widget _buildItemCard(SalarySupportModel item) {
    final statusColor = switch (item.status) {
      SalarySupportStatus.today => AppColors.gold,
      SalarySupportStatus.paid => Colors.green,
      SalarySupportStatus.upcoming => AppColors.textSecondary,
    };

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFCF7),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderGold.withOpacity(0.5)),
      ),
      child: Row(
        children: [
          Text(item.icon ?? '💰', style: const TextStyle(fontSize: 22)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.nameAr,
                  style: GoogleFonts.cairo(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
                Text(
                  item.adjustedDateString,
                  style: GoogleFonts.cairo(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                item.countdownString,
                style: GoogleFonts.cairo(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: statusColor,
                ),
              ),
              if (item.amount != null)
                Text(
                  '${item.amount} ر.س',
                  style: GoogleFonts.cairo(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}