import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class GoalCalculatorScreen extends StatefulWidget {
  const GoalCalculatorScreen({super.key});

  @override
  State<GoalCalculatorScreen> createState() => _GoalCalculatorScreenState();
}

class _GoalCalculatorScreenState extends State<GoalCalculatorScreen> {
  final List<Goal> _goals = [];
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _targetController = TextEditingController();
  final _savedController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _targetController.dispose();
    _savedController.dispose();
    super.dispose();
  }

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
              // Add Goal Form
              _buildAddGoalForm(),
              const SizedBox(height: 24),
              // Goals List
              _buildGoalsList(),
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
          'احسب هدفك',
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

  Widget _buildAddGoalForm() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'أضف هدفاً جديداً',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.ink,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'اسم الهدف',
                hintText: 'مثال: سيارة، بيت، سفر',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'يرجى إدخال اسم الهدف';
                }
                return null;
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _targetController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'المبلغ المستهدف',
                hintText: '100000',
                suffixText: 'ر.س',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'يرجى إدخال المبلغ المستهدف';
                }
                if (double.tryParse(value) == null) {
                  return 'يرجى إدخال رقم صحيح';
                }
                return null;
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _savedController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'المبلغ المدخر',
                hintText: '0',
                suffixText: 'ر.س',
              ),
              validator: (value) {
                if (value != null && value.isNotEmpty) {
                  if (double.tryParse(value) == null) {
                    return 'يرجى إدخال رقم صحيح';
                  }
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _addGoal,
                child: const Text('إضافة الهدف'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalsList() {
    if (_goals.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Center(
          child: Column(
            children: [
              Text('🎯', style: TextStyle(fontSize: 48)),
              SizedBox(height: 16),
              Text(
                'لم تضف أي أهداف بعد',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'أضف هدفاً لتبدأ بمتابعته',
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
          'أهدافك (${_goals.length})',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
          ),
        ),
        const SizedBox(height: 12),
        ..._goals.map((goal) => _buildGoalCard(goal)),
      ],
    );
  }

  Widget _buildGoalCard(Goal goal) {
    final progress = goal.target > 0 ? (goal.saved / goal.target) : 0.0;
    final remaining = goal.target - goal.saved;
    final percentage = (progress * 100).clamp(0, 100).toInt();

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
              Expanded(
                child: Text(
                  goal.name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
              ),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert, color: AppColors.textSecondary),
                onSelected: (value) {
                  if (value == 'edit') {
                    _editGoal(goal);
                  } else if (value == 'delete') {
                    _deleteGoal(goal);
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
          const SizedBox(height: 12),
          // Progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0),
              minHeight: 12,
              backgroundColor: AppColors.border,
              valueColor: AlwaysStoppedAnimation<Color>(
                progress >= 1 ? AppColors.success : AppColors.gold,
              ),
            ),
          ),
          const SizedBox(height: 12),
          // Stats
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildStatItem('المدخر', '${goal.saved.toStringAsFixed(0)} ر.س'),
              _buildStatItem('المستهدف', '${goal.target.toStringAsFixed(0)} ر.س'),
              _buildStatItem('المتبقي', '${remaining.toStringAsFixed(0)} ر.س'),
              _buildStatItem('النسبة', '$percentage%', color: AppColors.gold),
            ],
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

  void _addGoal() {
    if (_formKey.currentState!.validate()) {
      final target = double.parse(_targetController.text);
      final saved = double.tryParse(_savedController.text) ?? 0;

      setState(() {
        _goals.add(Goal(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          name: _nameController.text,
          target: target,
          saved: saved,
          createdAt: DateTime.now(),
        ));
      });

      _nameController.clear();
      _targetController.clear();
      _savedController.clear();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تم إضافة الهدف بنجاح')),
      );
    }
  }

  void _editGoal(Goal goal) {
    _nameController.text = goal.name;
    _targetController.text = goal.target.toString();
    _savedController.text = goal.saved.toString();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تعديل الهدف'),
        content: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'اسم الهدف'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _targetController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'المبلغ المستهدف'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _savedController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'المبلغ المدخر'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                final index = _goals.indexWhere((g) => g.id == goal.id);
                if (index != -1) {
                  _goals[index] = Goal(
                    id: goal.id,
                    name: _nameController.text,
                    target: double.parse(_targetController.text),
                    saved: double.tryParse(_savedController.text) ?? 0,
                    createdAt: goal.createdAt,
                  );
                }
              });
              _nameController.clear();
              _targetController.clear();
              _savedController.clear();
              Navigator.pop(context);
            },
            child: const Text('حفظ'),
          ),
        ],
      ),
    );
  }

  void _deleteGoal(Goal goal) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف الهدف'),
        content: Text('هل أنت متأكد من حذف هدف "${goal.name}"؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _goals.removeWhere((g) => g.id == goal.id);
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

class Goal {
  final String id;
  final String name;
  final double target;
  final double saved;
  final DateTime createdAt;

  Goal({
    required this.id,
    required this.name,
    required this.target,
    required this.saved,
    required this.createdAt,
  });
}