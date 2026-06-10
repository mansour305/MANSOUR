import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class CostCalculatorScreen extends StatefulWidget {
  const CostCalculatorScreen({super.key});

  @override
  State<CostCalculatorScreen> createState() => _CostCalculatorScreenState();
}

class _CostCalculatorScreenState extends State<CostCalculatorScreen> {
  final List<Project> _projects = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              _buildHeader(),
              const SizedBox(height: 24),
              // Add Project Button
              _buildAddProjectButton(),
              const SizedBox(height: 24),
              // Projects List
              _buildProjectsList(),
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
          'حساب التكاليف',
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

  Widget _buildAddProjectButton() {
    return GestureDetector(
      onTap: _showAddProjectDialog,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.gold.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderGold),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.add_circle, color: AppColors.gold, size: 28),
            SizedBox(width: 12),
            Text(
              'مشروع جديد',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.gold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectsList() {
    if (_projects.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Center(
          child: Column(
            children: [
              Text('📊', style: TextStyle(fontSize: 48)),
              SizedBox(height: 16),
              Text(
                'لم تضف أي مشاريع بعد',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'أضف مشروعاً لتتبع تكاليفه',
                style: TextStyle(
                  fontSize: 14,
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
          'مشاريعك (${_projects.length})',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
          ),
        ),
        const SizedBox(height: 12),
        ..._projects.map((project) => _buildProjectCard(project)),
      ],
    );
  }

  Widget _buildProjectCard(Project project) {
    final total = project.items.fold<double>(0, (sum, item) => sum + item.amount);
    final paid = project.items.fold<double>(0, (sum, item) {
      if (item.isPaid) return sum + item.amount;
      return sum;
    });
    final remaining = total - paid;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          // Project Header
          InkWell(
            onTap: () => _showProjectDetails(project),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          project.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: AppColors.ink,
                          ),
                        ),
                      ),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: project.statusColor.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              project.statusText,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: project.statusColor,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          PopupMenuButton<String>(
                            icon: const Icon(Icons.more_vert, color: AppColors.textSecondary),
                            onSelected: (value) {
                              if (value == 'edit') {
                                _editProject(project);
                              } else if (value == 'delete') {
                                _deleteProject(project);
                              }
                            },
                            itemBuilder: (context) => [
                              const PopupMenuItem(
                                value: 'edit',
                                child: Row(
                                  children: [
                                    Icon(Icons.edit, size: 20),
                                    SizedBox(width: 8),
                                    Text('تعديل'),
                                  ],
                                ),
                              ),
                              const PopupMenuItem(
                                value: 'delete',
                                child: Row(
                                  children: [
                                    Icon(Icons.delete, size: 20, color: AppColors.error),
                                    SizedBox(width: 8),
                                    Text('حذف', style: TextStyle(color: AppColors.error)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Summary
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildStatItem('الإجمالي', '${total.toStringAsFixed(0)} ر.س'),
                      _buildStatItem('المدفوع', '${paid.toStringAsFixed(0)} ر.س', color: AppColors.success),
                      _buildStatItem('المتبقي', '${remaining.toStringAsFixed(0)} ر.س', color: AppColors.error),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${project.items.length} بند',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, {Color? color}) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: color ?? AppColors.ink,
          ),
        ),
      ],
    );
  }

  void _showAddProjectDialog() {
    final nameController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('مشروع جديد'),
        content: TextField(
          controller: nameController,
          decoration: const InputDecoration(
            labelText: 'اسم المشروع',
            hintText: 'مثال: تجديد المنزل',
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              if (nameController.text.isNotEmpty) {
                setState(() {
                  _projects.add(Project(
                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                    name: nameController.text,
                    items: [],
                  ));
                });
                Navigator.pop(context);
              }
            },
            child: const Text('إضافة'),
          ),
        ],
      ),
    );
  }

  void _showProjectDetails(Project project) {
    final nameController = TextEditingController(text: project.name);
    final itemNameController = TextEditingController();
    final itemAmountController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
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
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'تفاصيل المشروع',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.ink,
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Project Name
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'اسم المشروع'),
                ),
                const SizedBox(height: 16),
                // Add Item
                const Text(
                  'إضافة بند',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextField(
                        controller: itemNameController,
                        decoration: const InputDecoration(
                          hintText: 'اسم البند',
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: itemAmountController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          hintText: 'المبلغ',
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      onPressed: () {
                        if (itemNameController.text.isNotEmpty && 
                            itemAmountController.text.isNotEmpty) {
                          setModalState(() {
                            final index = _projects.indexWhere((p) => p.id == project.id);
                            if (index != -1) {
                              _projects[index].items.add(CostItem(
                                id: DateTime.now().millisecondsSinceEpoch.toString(),
                                name: itemNameController.text,
                                amount: double.tryParse(itemAmountController.text) ?? 0,
                                isPaid: false,
                              ));
                            }
                          });
                          itemNameController.clear();
                          itemAmountController.clear();
                        }
                      },
                      icon: const Icon(Icons.add_circle, color: AppColors.gold),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Items List
                const Text(
                  'البنود',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 8),
                ...project.items.map((item) => _buildItemTile(item, project)),
                const SizedBox(height: 16),
                // Summary
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.cream,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('الإجمالي'),
                          Text('${project.items.fold<double>(0, (s, i) => s + i.amount).toStringAsFixed(0)} ر.س'),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('المدفوع'),
                          Text(
                            '${project.items.fold<double>(0, (s, i) => i.isPaid ? s + i.amount : s).toStringAsFixed(0)} ر.س',
                            style: const TextStyle(color: AppColors.success),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('المتبقي'),
                          Text(
                            '${project.items.fold<double>(0, (s, i) => i.isPaid ? s : s + i.amount).toStringAsFixed(0)} ر.س',
                            style: const TextStyle(color: AppColors.error),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Save Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        final index = _projects.indexWhere((p) => p.id == project.id);
                        if (index != -1) {
                          _projects[index] = Project(
                            id: project.id,
                            name: nameController.text,
                            items: project.items,
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

  Widget _buildItemTile(CostItem item, Project project) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Checkbox(
            value: item.isPaid,
            onChanged: (value) {
              setState(() {
                final pIndex = _projects.indexWhere((p) => p.id == project.id);
                if (pIndex != -1) {
                  final iIndex = _projects[pIndex].items.indexWhere((i) => i.id == item.id);
                  if (iIndex != -1) {
                    _projects[pIndex].items[iIndex] = CostItem(
                      id: item.id,
                      name: item.name,
                      amount: item.amount,
                      isPaid: value ?? false,
                    );
                  }
                }
              });
            },
            activeColor: AppColors.gold,
          ),
          Expanded(
            child: Text(
              item.name,
              style: TextStyle(
                decoration: item.isPaid ? TextDecoration.lineThrough : null,
                color: item.isPaid ? AppColors.textSecondary : AppColors.ink,
              ),
            ),
          ),
          Text(
            '${item.amount.toStringAsFixed(0)} ر.س',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          IconButton(
            icon: const Icon(Icons.delete, size: 18, color: AppColors.error),
            onPressed: () {
              setState(() {
                final pIndex = _projects.indexWhere((p) => p.id == project.id);
                if (pIndex != -1) {
                  _projects[pIndex].items.removeWhere((i) => i.id == item.id);
                }
              });
            },
          ),
        ],
      ),
    );
  }

  void _editProject(Project project) {
    final nameController = TextEditingController(text: project.name);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تعديل المشروع'),
        content: TextField(
          controller: nameController,
          decoration: const InputDecoration(labelText: 'اسم المشروع'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                final index = _projects.indexWhere((p) => p.id == project.id);
                if (index != -1) {
                  _projects[index] = Project(
                    id: project.id,
                    name: nameController.text,
                    items: project.items,
                  );
                }
              });
              Navigator.pop(context);
            },
            child: const Text('حفظ'),
          ),
        ],
      ),
    );
  }

  void _deleteProject(Project project) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف المشروع'),
        content: Text('هل أنت متأكد من حذف مشروع "${project.name}"؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _projects.removeWhere((p) => p.id == project.id);
              });
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

class Project {
  final String id;
  final String name;
  final List<CostItem> items;

  Project({
    required this.id,
    required this.name,
    required this.items,
  });

  String get statusText {
    if (items.isEmpty) return 'بدون بنود';
    final allPaid = items.every((item) => item.isPaid);
    if (allPaid) return 'مكتمل';
    final anyPaid = items.any((item) => item.isPaid);
    if (anyPaid) return 'قيد التنفيذ';
    return 'لم يبدأ';
  }

  Color get statusColor {
    if (items.isEmpty) return AppColors.textSecondary;
    final allPaid = items.every((item) => item.isPaid);
    if (allPaid) return AppColors.success;
    final anyPaid = items.any((item) => item.isPaid);
    if (anyPaid) return AppColors.gold;
    return AppColors.textSecondary;
  }
}

class CostItem {
  final String id;
  final String name;
  final double amount;
  final bool isPaid;

  CostItem({
    required this.id,
    required this.name,
    required this.amount,
    required this.isPaid,
  });
}