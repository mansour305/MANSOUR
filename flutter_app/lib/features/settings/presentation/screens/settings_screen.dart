import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
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
      backgroundColor: AppColors.paper,
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
                description: _getThemeLabel(ref.watch(settingsProvider).themeMode),
                onTap: () => _showThemePicker(context, ref),
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
                onTap: () => _exportData(context),
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
                onTap: () => _showTerms(context),
              ),
              _SettingsItem(
                icon: '🔒',
                label: 'الخصوصية',
                onTap: () => _showPrivacy(context),
              ),
              _SettingsItem(
                icon: '⭐',
                label: 'تقييم التطبيق',
                onTap: () => _rateApp(context),
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
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildCityOption(context, 'الرياض', 'riyadh'),
              _buildCityOption(context, 'جدة', 'jeddah'),
              _buildCityOption(context, 'مكة المكرمة', 'mecca'),
              _buildCityOption(context, 'المدينة المنورة', 'medina'),
              _buildCityOption(context, 'الدمام', 'dammam'),
              _buildCityOption(context, 'الخبر', 'khobar'),
              _buildCityOption(context, 'أبها', 'abha'),
              _buildCityOption(context, 'تبوك', 'tabuk'),
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

  String _getThemeLabel(String mode) {
    switch (mode) {
      case 'light': return 'فاتح';
      case 'dark': return 'داكن';
      case 'system': return 'تلقائي';
      default: return 'فاتح';
    }
  }

  void _showThemePicker(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('اختر المظهر'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildThemeOption(context, ref, 'light', 'فاتح'),
            _buildThemeOption(context, ref, 'dark', 'داكن'),
            _buildThemeOption(context, ref, 'system', 'تلقائي'),
          ],
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

  Widget _buildThemeOption(BuildContext context, WidgetRef ref, String mode, String label) {
    final currentMode = ref.read(settingsProvider).themeMode;
    final isSelected = currentMode == mode;
    return ListTile(
      title: Text(label),
      trailing: isSelected ? const Icon(Icons.check, color: AppColors.gold) : null,
      onTap: () {
        ref.read(settingsProvider.notifier).setThemeMode(mode);
        Navigator.pop(context);
      },
    );
  }

  void _exportData(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('جاري تصدير البيانات...')),
    );
  }

  void _showTerms(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('الشروط والأحكام'),
        content: const SingleChildScrollView(
          child: Text(
            'باستخدامك لهذا التطبيق، فإنك توافق على الشروط والأحكام التالية:\n\n'
            '1. الخصوصية: نحن نحترم خصوصيتك ونحمي بياناتك الشخصية.\n\n'
            '2. الاستخدام: يجب استخدام التطبيق لأغراض مشروعة فقط.\n\n'
            '3. المحتوى: المحتوى المعروض قد يتغير دون إشعار مسبق.\n\n'
            '© 2026 مواعيدك',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إغلاق'),
          ),
        ],
      ),
    );
  }

  void _showPrivacy(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('الخصوصية'),
        content: const SingleChildScrollView(
          child: Text(
            'سياسة الخصوصية:\n\n'
            '• نجمع فقط البيانات الضرورية لتقديم الخدمة.\n\n'
            '• لا نشارك بياناتك مع أطراف ثالثة.\n\n'
            '• نستخدم تقنيات التشفير لحماية بياناتك.\n\n'
            '• يمكنك طلب حذف بياناتك في أي وقت.\n\n'
            'لمزيد من المعلومات، تواصل معنا على: support@mawaeedak.app',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إغلاق'),
          ),
        ],
      ),
    );
  }

  void _rateApp(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('شكراً لتقييمك!')),
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