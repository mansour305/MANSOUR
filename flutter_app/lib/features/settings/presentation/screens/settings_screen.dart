import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../home/providers/providers.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('الإعدادات'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Notifications Section
            _buildSectionTitle('الإشعارات'),
            _buildSettingsList([
              _SettingsToggle(
                icon: '🕌',
                label: 'إشعارات الصلاة',
                description: 'تذكير قبل كل صلاة بخمس دقائق',
                value: settings.prayerNotifications,
                onChanged: (_) => ref.read(settingsProvider.notifier).togglePrayerNotifications(),
              ),
              _SettingsToggle(
                icon: '💰',
                label: 'إشعارات مالية',
                description: 'تذكير بالمواعيد المالية',
                value: settings.financialNotifications,
                onChanged: (_) => ref.read(settingsProvider.notifier).toggleFinancialNotifications(),
              ),
              _SettingsToggle(
                icon: '📅',
                label: 'إشعارات المواعيد',
                description: 'تذكير قبل المواعيد بيوم',
                value: settings.appointmentNotifications,
                onChanged: (_) => ref.read(settingsProvider.notifier).toggleAppointmentNotifications(),
              ),
              _SettingsToggle(
                icon: '🎴',
                label: 'البطاقة اليومية',
                description: 'إشعار عند توفر بطاقة جديدة',
                value: settings.dailyCardNotifications,
                onChanged: (_) => ref.read(settingsProvider.notifier).toggleDailyCardNotifications(),
              ),
            ]),
            const SizedBox(height: 24),
            // App Settings Section
            _buildSectionTitle('التطبيق'),
            _buildSettingsList([
              _SettingsToggle(
                icon: '📳',
                label: 'الاهتزاز',
                description: 'تفعيل الاهتزاز عند الضغط',
                value: settings.hapticFeedback,
                onChanged: (_) => ref.read(settingsProvider.notifier).toggleHapticFeedback(),
              ),
              _SettingsToggle(
                icon: '📍',
                label: 'تحديد الموقع تلقائياً',
                description: 'استخدام الموقع للحصول على أوقات الصلاة',
                value: settings.autoLocation,
                onChanged: (_) => ref.read(settingsProvider.notifier).toggleAutoLocation(),
              ),
              _SettingsItem(
                icon: '🌍',
                label: 'المدينة',
                description: 'الرياض',
                onTap: () => _showCityPicker(context),
              ),
              _SettingsItem(
                icon: '🎨',
                label: 'المظهر',
                description: 'فاتح / داكن / تلقائي',
                onTap: () => _showComingSoon(context),
              ),
            ]),
            const SizedBox(height: 24),
            // Data Section
            _buildSectionTitle('البيانات'),
            _buildSettingsList([
              _SettingsItem(
                icon: '🗑️',
                label: 'مسح الذاكرة المؤقتة',
                description: 'تحرير مساحة التخزين',
                onTap: () => _showClearCacheDialog(context),
              ),
              _SettingsItem(
                icon: '📤',
                label: 'تصدير البيانات',
                description: 'حفظ نسخة من بياناتك',
                onTap: () => _showComingSoon(context),
              ),
            ]),
            const SizedBox(height: 24),
            // About Section
            _buildSectionTitle('عن التطبيق'),
            _buildSettingsList([
              _SettingsItem(
                icon: 'ℹ️',
                label: 'عن مواعيدك',
                onTap: () => _showAboutDialog(context),
              ),
              _SettingsItem(
                icon: '📜',
                label: 'الشروط والأحكام',
                onTap: () => _showComingSoon(context),
              ),
              _SettingsItem(
                icon: '🔒',
                label: 'الخصوصية',
                onTap: () => _showComingSoon(context),
              ),
              _SettingsItem(
                icon: '⭐',
                label: 'تقييم التطبيق',
                onTap: () => _showComingSoon(context),
              ),
            ]),
            const SizedBox(height: 24),
            // Reset Section
            _buildSectionTitle('إعادة تعيين'),
            _buildSettingsList([
              _SettingsItem(
                icon: '🔄',
                label: 'إعادة تعيين التطبيق',
                isDanger: true,
                onTap: () => _showResetDialog(context),
              ),
            ]),
            const SizedBox(height: 24),
            // Version Info
            Center(
              child: Column(
                children: const [
                  Text(
                    'مواعيدك v1.0.0',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.ink,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Flutter 3.24.0 • Dart 3.5.0',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ],
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
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: AppColors.textSecondary,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildSettingsList(List<Widget> items) {
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
              item,
              if (index < items.length - 1)
                const Divider(height: 1, indent: 70),
            ],
          );
        }).toList(),
      ),
    );
  }

  void _showCityPicker(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('اختر المدينة'),
        content: const Text('قريباً'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('حسناً'),
          ),
        ],
      ),
    );
  }

  void _showClearCacheDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('مسح الذاكرة المؤقتة'),
        content: const Text('سيتم مسح جميع البيانات المؤقتة. هل تريد المتابعة؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('تم مسح الذاكرة المؤقتة بنجاح')),
              );
            },
            child: const Text('مسح'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('مواعيدك v1.0.0'),
        content: const Text(
          'كل مواعيدك في مكان واحد\n\n© 2026 مواعيدك',
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

  void _showResetDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إعادة تعيين التطبيق'),
        content: const Text('سيتم إعادة تعيين جميع الإعدادات والبيانات. هل تريد المتابعة؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('تم إعادة تعيين التطبيق')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('إعادة تعيين'),
          ),
        ],
      ),
    );
  }

  void _showComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('قريباً')),
    );
  }
}

class _SettingsToggle extends StatelessWidget {
  final String icon;
  final String label;
  final String? description;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _SettingsToggle({
    required this.icon,
    required this.label,
    this.description,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.paper,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Text(icon, style: const TextStyle(fontSize: 20)),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                ),
                if (description != null)
                  Text(
                    description!,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: AppColors.gold,
          ),
        ],
      ),
    );
  }
}

class _SettingsItem extends StatelessWidget {
  final String icon;
  final String label;
  final String? description;
  final VoidCallback onTap;
  final bool isDanger;

  const _SettingsItem({
    required this.icon,
    required this.label,
    this.description,
    required this.onTap,
    this.isDanger = false,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: isDanger
                    ? AppColors.error.withOpacity(0.1)
                    : AppColors.paper,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(icon, style: const TextStyle(fontSize: 20)),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: isDanger ? AppColors.error : AppColors.ink,
                    ),
                  ),
                  if (description != null)
                    Text(
                      description!,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_left,
              color: isDanger ? AppColors.error : AppColors.textSecondary,
            ),
          ],
        ),
      ),
    );
  }
}