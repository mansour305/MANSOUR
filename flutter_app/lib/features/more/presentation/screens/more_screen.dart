import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              const Text(
                'المزيد',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.ink,
                ),
              ),
              const SizedBox(height: 24),
              // Daily Card Section
              _buildDailyCardRow(context),
              const SizedBox(height: 24),
              // Account Section
              _buildSectionTitle('الحساب'),
              _buildMenuList([
                _MenuItem(
                  icon: '👤',
                  label: 'حسابي',
                  description: 'الملف الشخصي والإعدادات',
                  onTap: () => context.pushNamed('account'),
                ),
                _MenuItem(
                  icon: '🔔',
                  label: 'الإشعارات',
                  description: 'إدارة التنبيهات',
                  onTap: () => context.pushNamed('settings'),
                ),
              ]),
              const SizedBox(height: 24),
              // Settings Section
              _buildSectionTitle('الإعدادات'),
              _buildMenuList([
                _MenuItem(
                  icon: '⚙️',
                  label: 'إعدادات التطبيق',
                  description: 'المظهر والإشعارات',
                  onTap: () => context.pushNamed('settings'),
                ),
                _MenuItem(
                  icon: '🌍',
                  label: 'المدينة',
                  description: 'الرياض',
                  onTap: () => _showCityDialog(context),
                ),
              ]),
              const SizedBox(height: 24),
              // Support Section
              _buildSectionTitle('الدعم'),
              _buildMenuList([
                _MenuItem(
                  icon: '💬',
                  label: 'تواصل معنا',
                  description: 'مساعدة واستفسارات',
                  onTap: () => _showSupportDialog(context),
                ),
                _MenuItem(
                  icon: 'ℹ️',
                  label: 'عن التطبيق',
                  onTap: () => _showAboutDialog(context),
                ),
              ]),
              const SizedBox(height: 24),
              // Actions Section
              _buildMenuList([
                _MenuItem(
                  icon: '📤',
                  label: 'مشاركة التطبيق',
                  onTap: () => _shareApp(context),
                ),
                _MenuItem(
                  icon: '🚪',
                  label: 'تسجيل الخروج',
                  isDanger: true,
                  onTap: () => _showLogoutDialog(context),
                ),
              ]),
              const SizedBox(height: 24),
              // Footer
              Center(
                child: Column(
                  children: [
                    const Text(
                      'مواعيدك v1.0.0',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.ink,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'كل مواعيدك في مكان واحد',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: AppColors.textSecondary,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildDailyCardRow(BuildContext context) {
    return GestureDetector(
      onTap: () => context.pushNamed('daily-card'),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.borderGold),
          boxShadow: [
            BoxShadow(
              color: AppColors.brown.withOpacity(0.08),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.gold.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Center(
                child: Text('🎴', style: TextStyle(fontSize: 28)),
              ),
            ),
            const SizedBox(width: 14),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'البطاقة اليومية',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.ink,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'شارك يومك مع الآخرين',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_left,
              color: AppColors.brown,
              size: 22,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuList(List<_MenuItem> items) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: items.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;
          return Column(
            children: [
              _buildMenuRow(item),
              if (index < items.length - 1)
                const Divider(height: 1, indent: 70),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildMenuRow(_MenuItem item) {
    return InkWell(
      onTap: item.onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: item.isDanger
                    ? AppColors.error.withOpacity(0.1)
                    : AppColors.paper,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(
                  item.icon,
                  style: const TextStyle(fontSize: 22),
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.label,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: item.isDanger ? AppColors.error : AppColors.ink,
                    ),
                  ),
                  if (item.description != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      item.description!,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Icon(
              Icons.chevron_left,
              color: item.isDanger ? AppColors.error : AppColors.textSecondary,
            ),
          ],
        ),
      ),
    );
  }

  void _showCityDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('اختر المدينة'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildCityOption(context, 'الرياض', 'riyadh'),
              _buildCityOption(context, 'جدة', 'jeddah'),
              _buildCityOption(context, 'مكة المكرمة', 'mecca'),
              _buildCityOption(context, 'المدينة المنورة', 'medina'),
              _buildCityOption(context, 'الدمام', 'dammam'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
        ],
      ),
    );
  }

  Widget _buildCityOption(BuildContext context, String name, String key) {
    return ListTile(
      title: Text(name),
      trailing: name == 'الرياض' ? const Icon(Icons.check, color: AppColors.gold) : null,
      onTap: () {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('تم تغيير المدينة إلى $name')),
        );
      },
    );
  }

  void _showSupportDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تواصل معنا'),
        content: const Text('support@mawaeedak.app'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('حسناً'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('عن التطبيق'),
        content: const Text(
          'مواعيدك v1.0.0\n\nكل مواعيدك في مكان واحد\n\n© 2026 مواعيدك',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('حسناً'),
          ),
        ],
      ),
    );
  }

  void _shareApp(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('جاري مشاركة التطبيق...')),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تسجيل الخروج'),
        content: const Text('هل أنت متأكد من تسجيل الخروج؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('تم تسجيل الخروج بنجاح')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('تسجيل الخروج'),
          ),
        ],
      ),
    );
  }
}

class _MenuItem {
  final String icon;
  final String label;
  final String? description;
  final VoidCallback onTap;
  final bool isDanger;

  const _MenuItem({
    required this.icon,
    required this.label,
    this.description,
    required this.onTap,
    this.isDanger = false,
  });
}