import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              // Header
              _buildHeader(context),
              const SizedBox(height: 20),
              // Salary Card
              _buildSalaryCard(),
              const SizedBox(height: 16),
              // Support Card
              if (salaryEvents.isNotEmpty) ...[
                _buildSupportCard(salaryEvents.first),
                const SizedBox(height: 24),
              ],
              // Bills Section
              _buildSectionTitle('الفواتير'),
              const SizedBox(height: 12),
              _buildBillsList(billEvents),
              const SizedBox(height: 24),
              // Summary
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
        const Text(
          'المواعيد المالية',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w800,
            color: AppColors.ink,
          ),
        ),
        ElevatedButton.icon(
          onPressed: () => _showAddBillDialog(context),
          icon: const Icon(Icons.add, size: 20),
          label: const Text('إضافة'),
        ),
      ],
    );
  }

  Widget _buildSalaryCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderGold),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Center(
                  child: Text('💰', style: TextStyle(fontSize: 32)),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'الراتب القادم',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const Text(
                      '12,000 ر.س',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w800,
                        color: AppColors.ink,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(),
          const SizedBox(height: 16),
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
          style: const TextStyle(
            fontSize: 12,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Center(
              child: Text(icon, style: const TextStyle(fontSize: 28)),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      amount,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      date,
                      style: const TextStyle(
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
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: daysColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              daysText,
              style: TextStyle(
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
          style: const TextStyle(
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
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.paper,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(
              Icons.description_outlined,
              color: AppColors.brown,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  bill.name,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
                Text(
                  'تاريخ الاستحقاق: ${bill.date}',
                  style: const TextStyle(
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
                style: const TextStyle(
                  fontSize: 16,
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

  Widget _buildSummary(List<FinancialEvent> bills) {
    final total = bills.fold<double>(0, (sum, bill) {
      final amount = double.tryParse(bill.amount?.replaceAll(',', '') ?? '0') ?? 0;
      return sum + amount;
    });

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'ملخص الشهر',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'إجمالي المستحق',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                '${(total + 14000).toStringAsFixed(0)} ر.س',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.ink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'المتبقي حتى الراتب',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              const Text(
                '16 يوم',
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
      decoration: const BoxDecoration(
        color: AppColors.paper,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 40,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'إضافة فاتورة',
                style: TextStyle(
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
          const SizedBox(height: 20),
          const Text(
            'الاسم',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(
              hintText: 'أدخل اسم الفاتورة',
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'المبلغ',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              hintText: 'أدخل المبلغ',
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('إلغاء'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: _addBill,
                  child: const Text('إضافة'),
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
        const SnackBar(content: Text('يرجى ملء جميع الحقول')),
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