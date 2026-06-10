import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class JobsScreen extends StatefulWidget {
  const JobsScreen({super.key});

  @override
  State<JobsScreen> createState() => _JobsScreenState();
}

class _JobsScreenState extends State<JobsScreen> {
  final List<JobItem> _items = [];

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
          'الوظائف والأخبار',
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
              'إضافة عنصر',
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
              Text('💼', style: TextStyle(fontSize: 48)),
              SizedBox(height: 16),
              Text(
                'لم تضف أي عناصر بعد',
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
          'العناصر (${_items.length})',
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

  Widget _buildItemCard(JobItem item) {
    final isJob = item.type == 'job';
    final typeIcon = isJob ? '💼' : '📰';
    final typeLabel = isJob ? 'وظيفة' : 'خبر';

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
                      color: isJob ? AppColors.info.withOpacity(0.2) : AppColors.gold.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      typeLabel,
                      style: TextStyle(
                        fontSize: 12,
                        color: isJob ? AppColors.info : AppColors.gold,
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
          if (item.company.isNotEmpty) ...[
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.business, size: 16, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(item.company, style: const TextStyle(color: AppColors.textSecondary)),
              ],
            ),
          ],
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.calendar_today, size: 16, color: AppColors.textSecondary),
              const SizedBox(width: 4),
              Text(item.date, style: const TextStyle(color: AppColors.textSecondary)),
            ],
          ),
          if (item.url.isNotEmpty) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.link, size: 16, color: AppColors.gold),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    item.url,
                    style: const TextStyle(fontSize: 13, color: AppColors.gold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  void _showAddDialog() {
    String selectedType = 'job';
    final titleController = TextEditingController();
    final companyController = TextEditingController();
    final dateController = TextEditingController();
    final urlController = TextEditingController();

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
                    const Text('إضافة عنصر', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                  ],
                ),
                const SizedBox(height: 16),
                const Text('النوع'),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildTypeChip('job', '💼 وظيفة', selectedType, (v) => setModalState(() => selectedType = v)),
                    const SizedBox(width: 8),
                    _buildTypeChip('news', '📰 خبر', selectedType, (v) => setModalState(() => selectedType = v)),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(controller: titleController, decoration: const InputDecoration(labelText: 'العنوان')),
                const SizedBox(height: 12),
                TextField(controller: companyController, decoration: const InputDecoration(labelText: 'الجهة (اختياري)')),
                const SizedBox(height: 12),
                TextField(controller: dateController, decoration: const InputDecoration(labelText: 'التاريخ (YYYY-MM-DD)')),
                const SizedBox(height: 12),
                TextField(controller: urlController, decoration: const InputDecoration(labelText: 'الرابط (اختياري)')),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (titleController.text.isNotEmpty) {
                        setState(() {
                          _items.add(JobItem(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            type: selectedType,
                            title: titleController.text,
                            company: companyController.text,
                            date: dateController.text,
                            url: urlController.text,
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

  void _editItem(JobItem item) {
    String selectedType = item.type;
    final titleController = TextEditingController(text: item.title);
    final companyController = TextEditingController(text: item.company);
    final dateController = TextEditingController(text: item.date);
    final urlController = TextEditingController(text: item.url);

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
                    const Text('تعديل العنصر', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _buildTypeChip('job', '💼 وظيفة', selectedType, (v) => setModalState(() => selectedType = v)),
                    const SizedBox(width: 8),
                    _buildTypeChip('news', '📰 خبر', selectedType, (v) => setModalState(() => selectedType = v)),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(controller: titleController, decoration: const InputDecoration(labelText: 'العنوان')),
                const SizedBox(height: 12),
                TextField(controller: companyController, decoration: const InputDecoration(labelText: 'الجهة')),
                const SizedBox(height: 12),
                TextField(controller: dateController, decoration: const InputDecoration(labelText: 'التاريخ')),
                const SizedBox(height: 12),
                TextField(controller: urlController, decoration: const InputDecoration(labelText: 'الرابط')),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        final index = _items.indexWhere((i) => i.id == item.id);
                        if (index != -1) {
                          _items[index] = JobItem(
                            id: item.id,
                            type: selectedType,
                            title: titleController.text,
                            company: companyController.text,
                            date: dateController.text,
                            url: urlController.text,
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

  void _deleteItem(JobItem item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف العنصر'),
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

class JobItem {
  final String id;
  final String type;
  final String title;
  final String company;
  final String date;
  final String url;

  JobItem({
    required this.id,
    required this.type,
    required this.title,
    required this.company,
    required this.date,
    required this.url,
  });
}