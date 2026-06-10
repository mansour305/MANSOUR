import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
              // Header
              Text(
                'المزيد',
                style: GoogleFonts.cairo(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.ink,
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 28),
              // User Profile Card
              _buildUserCard(context),
              const SizedBox(height: 24),
              // Daily Card Section
              _buildDailyCardRow(context),
              const SizedBox(height: 28),
              // Account Section
              _buildSectionTitle('الحساب'),
              const SizedBox(height: 12),
              _buildMenuList([
                _MenuItem(
                  icon: Icons.person_outline_rounded,
                  label: 'حسابي',
                  description: 'الملف الشخصي والإعدادات',
                  onTap: () => context.pushNamed('account'),
                ),
                _MenuItem(
                  icon: Icons.notifications_outlined,
                  label: 'الإشعارات',
                  description: 'إدارة التنبيهات',
                  onTap: () => context.pushNamed('settings'),
                ),
              ]),
              const SizedBox(height: 24),
              // Settings Section
              _buildSectionTitle('الإعدادات'),
              const SizedBox(height: 12),
              _buildMenuList([
                _MenuItem(
                  icon: Icons.settings_outlined,
                  label: 'إعدادات التطبيق',
                  description: 'المظهر والإشعارات',
                  onTap: () => context.pushNamed('settings'),
                ),
                _MenuItem(
                  icon: Icons.location_on_outlined,
                  label: 'المدينة',
                  description: 'الرياض',
                  onTap: () => _showCityDialog(context),
                ),
              ]),
              const SizedBox(height: 24),
              // Support Section
              _buildSectionTitle('الدعم'),
              const SizedBox(height: 12),
              _buildMenuList([
                _MenuItem(
                  icon: Icons.chat_bubble_outline_rounded,
                  label: 'تواصل معنا',
                  description: 'مساعدة واستفسارات',
                  onTap: () => _showSupportDialog(context),
                ),
                _MenuItem(
                  icon: Icons.info_outline_rounded,
                  label: 'عن التطبيق',
                  onTap: () => _showAboutDialog(context),
                ),
              ]),
              const SizedBox(height: 24),
              // Actions Section
              _buildMenuList([
                _MenuItem(
                  icon: Icons.share_outlined,
                  label: 'مشاركة التطبيق',
                  onTap: () => _shareApp(context),
                ),
                _MenuItem(
                  icon: Icons.logout_rounded,
                  label: 'تسجيل الخروج',
                  isDanger: true,
                  onTap: () => _showLogoutDialog(context),
                ),
              ]),
              const SizedBox(height: 32),
              // Footer
              Center(
                child: Column(
                  children: [
                    Text(
                      'مواعيدك v1.0.0',
                      style: GoogleFonts.cairo(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.ink,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'بارك الله في وقتك',
                      style: GoogleFonts.cairo(
                        fontSize: 12,
                        color: AppColors.gold,
                        fontWeight: FontWeight.w500,
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

  Widget _buildUserCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.borderGold),
        boxShadow: AppShadows.soft,
      ),
      child: Row(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.gold,
              borderRadius: BorderRadius.circular(AppRadius.lg),
            ),
            child: Center(
              child: Text(
                'أ',
                style: GoogleFonts.cairo(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'أحمد محمد',
                  style: GoogleFonts.cairo(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'ahmed@example.com',
                  style: GoogleFonts.cairo(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.15),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: const Icon(
              Icons.edit_outlined,
              color: AppColors.gold,
              size: 20,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title.toUpperCase(),
      style: GoogleFonts.cairo(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: AppColors.textSecondary,
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildDailyCardRow(BuildContext context) {
    return GestureDetector(
      onTap: () => context.pushNamed('daily-card'),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(AppRadius.xl),
          border: Border.all(color: AppColors.borderGold),
          boxShadow: AppShadows.soft,
        ),
        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: AppColors.gold.withOpacity(0.15),
                borderRadius: BorderRadius.circular(AppRadius.lg),
              ),
              child: const Center(
                child: Text('🎴', style: TextStyle(fontSize: 30)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'البطاقة اليومية',
                    style: GoogleFonts.cairo(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.ink,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'شارك يومك مع الآخرين',
                    style: GoogleFonts.cairo(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.gold.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: const Icon(
                Icons.arrow_forward_ios_rounded,
                color: AppColors.gold,
                size: 18,
              ),
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
        borderRadius: BorderRadius.circular(AppRadius.lg),
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
                const Divider(height: 1, indent: 72),
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
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: item.isDanger
                    ? AppColors.error.withOpacity(0.1)
                    : AppColors.paper,
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(
                item.icon,
                color: item.isDanger ? AppColors.error : AppColors.brown,
                size: 22,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.label,
                    style: GoogleFonts.cairo(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: item.isDanger ? AppColors.error : AppColors.ink,
                    ),
                  ),
                  if (item.description != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      item.description!,
                      style: GoogleFonts.cairo(
                        fontSize: 12,
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
              size: 22,
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
        title: Text(
          'اختر المدينة',
          style: GoogleFonts.cairo(fontWeight: FontWeight.w700),
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildCityOption(context, 'الرياض', true),
              _buildCityOption(context, 'جدة', false),
              _buildCityOption(context, 'مكة المكرمة', false),
              _buildCityOption(context, 'المدينة المنورة', false),
              _buildCityOption(context, 'الدمام', false),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('إلغاء', style: GoogleFonts.cairo()),
          ),
        ],
      ),
    );
  }

  Widget _buildCityOption(BuildContext context, String name, bool isSelected) {
    return ListTile(
      title: Text(name, style: GoogleFonts.cairo()),
      trailing: isSelected
          ? const Icon(Icons.check_circle, color: AppColors.gold)
          : null,
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
        title: Text('تواصل معنا', style: GoogleFonts.cairo(fontWeight: FontWeight.w700)),
        content: Text('support@mawaeedak.app', style: GoogleFonts.cairo()),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('حسناً', style: GoogleFonts.cairo()),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('عن التطبيق', style: GoogleFonts.cairo(fontWeight: FontWeight.w700)),
        content: Text(
          'مواعيدك v1.0.0\n\nكل مواعيدك في مكان واحد\n\n© 2026 مواعيدك',
          style: GoogleFonts.cairo(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('حسناً', style: GoogleFonts.cairo()),
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
        title: Text('تسجيل الخروج', style: GoogleFonts.cairo(fontWeight: FontWeight.w700)),
        content: Text('هل أنت متأكد من تسجيل الخروج؟', style: GoogleFonts.cairo()),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('إلغاء', style: GoogleFonts.cairo()),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('تم تسجيل الخروج بنجاح')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: Text('تسجيل الخروج', style: GoogleFonts.cairo()),
          ),
        ],
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
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