import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../data/models/models.dart';
import '../../../home/providers/providers.dart';

class SalaryScreen extends ConsumerStatefulWidget {
  const SalaryScreen({super.key});

  @override
  ConsumerState<SalaryScreen> createState() => _SalaryScreenState();
}

class _SalaryScreenState extends ConsumerState<SalaryScreen> {
  @override
  Widget build(BuildContext context) {
    final financialEvents = ref.watch(financialEventsProvider);
    final salaryEvents = financialEvents.where((e) => e.type == 'salary' || e.type == 'support').toList();
    final billEvents = financialEvents.where((e) => e.type == 'bill').toList();

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
              _buildHeader(context),
              const SizedBox(height: 24),
              _buildSalaryCard(),
              const SizedBox(height: 18),
              if (salaryEvents.isNotEmpty) ...[
                _buildSupportCard(salaryEvents.first),
                const SizedBox(height: 28),
              ],
              _buildSectionTitle('الفواتير'),
              const SizedBox(height: 14),
              _buildBillsList(billEvents),
              const SizedBox(height: 28),
              _buildSummary(billEvents),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'المواعيد المالية',
          style: GoogleFonts.cairo(
            fontSize: 28,
            fontWeight: FontWeight.w800,
            color: AppColors.ink,
            height: 1.3,
          ),
        ),
        ElevatedButton.icon(
          onPressed: () => _showAddBillDialog(context),
          icon: const Icon(Icons.add, size: 20),
          label: Text('إضافة', style: GoogleFonts.cairo()),
        ),
      ],
    );
  }

  Widget _buildSalaryCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.borderGold),
        boxShadow: AppShadows.gold,
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                ),
                child: const Center(
                  child: Text('💰', style: TextStyle(fontSize: 34)),
                ),
              ),
              const SizedBox(width: 18),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'الراتب القادم',
                      style: GoogleFonts.cairo(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '12,000 ر.س',
                      style: GoogleFonts.cairo(
                        fontSize: 34,
                        fontWeight: FontWeight.w800,
                        color: AppColors.ink,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildSalaryDetail('الشركة', 'شركة التقنية'),
              _buildSalaryDetail('يوم الدفع', 'يوم 25'),
              _buildSalaryDetail('المتبقي', '16 يوم', color: AppColors.gold),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSalaryDetail(String label, String value, {Color? color}) {
    return Column(
      children: [
        Text(
          label,
          style: GoogleFonts.cairo(
            fontSize: 12,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          value,
          style: GoogleFonts.cairo(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: color ?? AppColors.ink,
          ),
        ),
      ],
    );
  }

  Widget _buildSupportCard(FinancialEvent event) {
    return _buildFinancialCard(
      icon: '🏠',
      title: 'حساب المواطن',
      amount: '2,000 ر.س',
      date: '10 من كل شهر',
      daysRemaining: event.daysRemaining,
      color: AppColors.success,
    );
  }

  Widget _buildFinancialCard({
    required String icon,
    required String title,
    required String amount,
    required String date,
    required int daysRemaining,
    required Color color,
  }) {
    final daysText = daysRemaining == 0
        ? 'اليوم'
        : daysRemaining == 1
            ? 'غداً'
            : '$daysRemaining يوم';
    final daysColor = daysRemaining <= 2 ? AppColors.error : color;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.soft,
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(AppRadius.lg),
            ),
            child: Center(
              child: Text(icon, style: GoogleFonts.cairo(fontSize: 28)),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.cairo(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text(
                      amount,
                      style: GoogleFonts.cairo(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Text(
                      date,
                      style: GoogleFonts.cairo(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: daysColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Text(
              daysText,
              style: GoogleFonts.cairo(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: daysColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: GoogleFonts.cairo(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
          ),
        ),
        GestureDetector(
          onTap: () => _showAddBillDialog(context),
          child: const Icon(
            Icons.add_circle_outline,
            color: AppColors.gold,
            size: 24,
          ),
        ),
      ],
    );
  }

  Widget _buildBillsList(List<FinancialEvent> bills) {
    return Column(
      children: bills.map((bill) => _buildBillItem(bill)).toList(),
    );
  }

  Widget _buildBillItem(FinancialEvent bill) {
    final daysColor = bill.daysRemaining <= 2
        ? AppColors.error
        : bill.daysRemaining <= 5
            ? AppColors.gold
            : AppColors.textSecondary;
    final daysText = bill.daysRemaining == 0
        ? 'اليوم'
        : bill.daysRemaining == 1
            ? 'غداً'
            : '${bill.daysRemaining} يوم';

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.soft,
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.paper,
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: const Icon(
              Icons.description_outlined,
              color: AppColors.brown,
              size: 22,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  bill.name,
                  style: GoogleFonts.cairo(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'تاريخ الاستحقاق: ${bill.date}',
                  style: GoogleFonts.cairo(
                    fontSize: 12,
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
                '${bill.amount} ر.س',
                style: GoogleFonts.cairo(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.ink,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                daysText,
                style: GoogleFonts.cairo(
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

  Widget _buildSummary(List<FinancialEvent> bills) {
    final total = bills.fold<double>(0, (sum, bill) {
      final amount = double.tryParse(bill.amount?.replaceAll(',', '') ?? '0') ?? 0;
      return sum + amount;
    });

    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.soft,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'ملخص الشهر',
            style: GoogleFonts.cairo(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 18),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'إجمالي المستحق',
                style: GoogleFonts.cairo(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                '${(total + 14000).toStringAsFixed(0)} ر.س',
                style: GoogleFonts.cairo(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.ink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'المتبقي حتى الراتب',
                style: GoogleFonts.cairo(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                '16 يوم',
                style: GoogleFonts.cairo(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.gold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showAddBillDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const _AddBillBottomSheet(),
    );
  }
}

class _AddBillBottomSheet extends ConsumerStatefulWidget {
  const _AddBillBottomSheet();

  @override
  ConsumerState<_AddBillBottomSheet> createState() => _AddBillBottomSheetState();
}

class _AddBillBottomSheetState extends ConsumerState<_AddBillBottomSheet> {
  final _nameController = TextEditingController();
  final _amountController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.paper,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(AppRadius.xl),
          topRight: Radius.circular(AppRadius.xl),
        ),
      ),
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 40,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'إضافة فاتورة',
                style: GoogleFonts.cairo(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.ink,
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close, color: AppColors.ink),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            'الاسم',
            style: GoogleFonts.cairo(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _nameController,
            decoration: InputDecoration(
              hintText: 'أدخل اسم الفاتورة',
              hintStyle: GoogleFonts.cairo(color: AppColors.textSecondary),
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'المبلغ',
            style: GoogleFonts.cairo(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              hintText: 'أدخل المبلغ',
              hintStyle: GoogleFonts.cairo(color: AppColors.textSecondary),
            ),
          ),
          const SizedBox(height: 28),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text('إلغاء', style: GoogleFonts.cairo()),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: ElevatedButton(
                  onPressed: _addBill,
                  child: Text('إضافة', style: GoogleFonts.cairo()),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _addBill() {
    if (_nameController.text.isEmpty || _amountController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('يرجى ملء جميع الحقول', style: GoogleFonts.cairo())),
      );
      return;
    }

    final newBill = FinancialEvent(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: _nameController.text,
      date: DateTime.now().add(const Duration(days: 15)).toIso8601String().split('T')[0],
      amount: _amountController.text,
      type: 'bill',
      daysRemaining: 15,
    );

    ref.read(financialEventsProvider.notifier).addEvent(newBill);
    Navigator.pop(context);
  }
}