import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class StudyScreen extends StatefulWidget {
  const StudyScreen({super.key});

  @override
  State<StudyScreen> createState() => _StudyScreenState();
}

class _StudyScreenState extends State<StudyScreen> {
  final List<StudyItem> _items = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              _buildAddButton(),
              const SizedBox(height: 24),
              _buildItemsList(),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
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
          'الدراسة والإجازات',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: AppColors.ink,
          ),
        ),
        const SizedBox(width: 44),
      ],
    );
  }

  Widget _buildAddButton() {
    return GestureDetector(
      onTap: _showAddDialog,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.gold.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderGold),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.add, color: AppColors.gold),
            SizedBox(width: 8),
            Text(
              'إضافة موعد دراسي',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.gold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildItemsList() {
    if (_items.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Center(
          child: Column(
            children: [
              Text('📚', style: TextStyle(fontSize: 48)),
              SizedBox(height: 16),
              Text(
                'لم تضف أي مواعيد دراسية بعد',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'مواعيدك الدراسية (${_items.length})',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
          ),
        ),
        const SizedBox(height: 12),
        ..._items.map((item) => _buildItemCard(item)),
      ],
    );
  }

  Widget _buildItemCard(StudyItem item) {
    final typeIcon = item.type == 'exam' ? '📝' : '🏖️';
    final typeLabel = item.type == 'exam' ? 'اختبار' : 'إجازة';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(typeIcon, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: item.type == 'exam' ? AppColors.error.withOpacity(0.2) : AppColors.success.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      typeLabel,
                      style: TextStyle(
                        fontSize: 12,
                        color: item.type == 'exam' ? AppColors.error : AppColors.success,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert, color: AppColors.textSecondary),
                onSelected: (value) {
                  if (value == 'edit') _editItem(item);
                  if (value == 'delete') _deleteItem(item);
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(value: 'edit', child: Text('تعديل')),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Text('حذف', style: TextStyle(color: AppColors.error)),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            item.title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.calendar_today, size: 16, color: AppColors.textSecondary),
              const SizedBox(width: 4),
              Text(item.date, style: const TextStyle(color: AppColors.textSecondary)),
            ],
          ),
          if (item.note.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(item.note, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          ],
        ],
      ),
    );
  }

  void _showAddDialog() {
    String selectedType = 'exam';
    final titleController = TextEditingController();
    final dateController = TextEditingController();
    final noteController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: const BoxDecoration(
            color: AppColors.paper,
            borderRadius: BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
          ),
          padding: EdgeInsets.only(left: 20, right: 20, top: 20, bottom: MediaQuery.of(context).viewInsets.bottom + 40),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('إضافة موعد دراسي', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                  ],
                ),
                const SizedBox(height: 16),
                const Text('النوع'),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildTypeChip('exam', '📝 اختبار', selectedType, (v) => setModalState(() => selectedType = v)),
                    const SizedBox(width: 8),
                    _buildTypeChip('vacation', '🏖️ إجازة', selectedType, (v) => setModalState(() => selectedType = v)),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(controller: titleController, decoration: const InputDecoration(labelText: 'العنوان')),
                const SizedBox(height: 12),
                TextField(controller: dateController, decoration: const InputDecoration(labelText: 'التاريخ (YYYY-MM-DD)')),
                const SizedBox(height: 12),
                TextField(controller: noteController, maxLines: 2, decoration: const InputDecoration(labelText: 'ملاحظة')),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (titleController.text.isNotEmpty && dateController.text.isNotEmpty) {
                        setState(() {
                          _items.add(StudyItem(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            type: selectedType,
                            title: titleController.text,
                            date: dateController.text,
                            note: noteController.text,
                          ));
                        });
                        Navigator.pop(context);
                      }
                    },
                    child: const Text('حفظ'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTypeChip(String value, String label, String selected, Function(String) onTap) {
    final isSelected = selected == value;
    return GestureDetector(
      onTap: () => onTap(value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.gold.withOpacity(0.2) : AppColors.cream,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? AppColors.gold : AppColors.border),
        ),
        child: Text(label, style: TextStyle(color: isSelected ? AppColors.gold : AppColors.ink)),
      ),
    );
  }

  void _editItem(StudyItem item) {
    String selectedType = item.type;
    final titleController = TextEditingController(text: item.title);
    final dateController = TextEditingController(text: item.date);
    final noteController = TextEditingController(text: item.note);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: const BoxDecoration(
            color: AppColors.paper,
            borderRadius: BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
          ),
          padding: EdgeInsets.only(left: 20, right: 20, top: 20, bottom: MediaQuery.of(context).viewInsets.bottom + 40),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('تعديل الموعد', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _buildTypeChip('exam', '📝 اختبار', selectedType, (v) => setModalState(() => selectedType = v)),
                    const SizedBox(width: 8),
                    _buildTypeChip('vacation', '🏖️ إجازة', selectedType, (v) => setModalState(() => selectedType = v)),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(controller: titleController, decoration: const InputDecoration(labelText: 'العنوان')),
                const SizedBox(height: 12),
                TextField(controller: dateController, decoration: const InputDecoration(labelText: 'التاريخ')),
                const SizedBox(height: 12),
                TextField(controller: noteController, maxLines: 2, decoration: const InputDecoration(labelText: 'ملاحظة')),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        final index = _items.indexWhere((i) => i.id == item.id);
                        if (index != -1) {
                          _items[index] = StudyItem(
                            id: item.id,
                            type: selectedType,
                            title: titleController.text,
                            date: dateController.text,
                            note: noteController.text,
                          );
                        }
                      });
                      Navigator.pop(context);
                    },
                    child: const Text('حفظ'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _deleteItem(StudyItem item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف الموعد'),
        content: Text('هل أنت متأكد من حذف "${item.title}"؟'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('إلغاء')),
          ElevatedButton(
            onPressed: () {
              setState(() => _items.removeWhere((i) => i.id == item.id));
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('حذف'),
          ),
        ],
      ),
    );
  }
}

class StudyItem {
  final String id;
  final String type;
  final String title;
  final String date;
  final String note;

  StudyItem({
    required this.id,
    required this.type,
    required this.title,
    required this.date,
    required this.note,
  });
}