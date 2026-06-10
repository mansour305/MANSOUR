import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

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
              // Header
              const Text(
                'خدماتك',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.ink,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'اختر الخدمة التي تحتاجها',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              // Services Grid
              _buildServicesGrid(context),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildServicesGrid(BuildContext context) {
    final services = [
      {
        'icon': '🎯',
        'name': 'احسب هدفك',
        'description': 'حدد أهدافك واحسب تقدمك',
        'route': 'goal-calculator',
        'color': AppColors.gold,
      },
      {
        'icon': '📊',
        'name': 'حساب التكاليف',
        'description': 'تتبع مشاريعك وتكاليفك',
        'route': 'cost-calculator',
        'color': AppColors.info,
      },
      {
        'icon': '🔔',
        'name': 'ذكرني',
        'description': 'تذكيرات ذكية لمواعيدك',
        'route': 'reminder',
        'color': AppColors.success,
      },
      {
        'icon': '✈️',
        'name': 'السفر',
        'description': 'رحلاتك وتأشيراتك',
        'route': 'travel',
        'color': const Color(0xFF4A7FB5),
      },
      {
        'icon': '📚',
        'name': 'الدراسة والإجازات',
        'description': 'اختبارات وإجازات دراسية',
        'route': 'study',
        'color': const Color(0xFF9B59B6),
      },
      {
        'icon': '💼',
        'name': 'الوظائف والأخبار',
        'description': 'وظائف وأخبار جديدة',
        'route': 'jobs',
        'color': const Color(0xFFE67E22),
      },
      {
        'icon': '🎴',
        'name': 'بطاقة اليوم',
        'description': 'شارك يومك مع الآخرين',
        'route': 'daily-card',
        'color': AppColors.brown,
      },
      {
        'icon': '💬',
        'name': 'صوتك مسموع',
        'description': 'شاركنا رأيك واقتراحاتك',
        'route': 'feedback',
        'color': const Color(0xFF1ABC9C),
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.9,
      ),
      itemCount: services.length,
      itemBuilder: (context, index) {
        final service = services[index];
        return _ServiceCard(
          icon: service['icon']!,
          name: service['name']!,
          description: service['description']!,
          color: service['color'] as Color,
          onTap: () => _navigateToService(context, service['route']!),
        );
      },
    );
  }

  void _navigateToService(BuildContext context, String route) {
    switch (route) {
      case 'goal-calculator':
        context.push('/goal-calculator');
        break;
      case 'cost-calculator':
        context.push('/cost-calculator');
        break;
      case 'reminder':
        context.push('/reminder');
        break;
      case 'travel':
        context.push('/travel');
        break;
      case 'study':
        context.push('/study');
        break;
      case 'jobs':
        context.push('/jobs');
        break;
      case 'daily-card':
        context.pushNamed('daily-card');
        break;
      case 'feedback':
        context.push('/feedback');
        break;
    }
  }
}

class _ServiceCard extends StatelessWidget {
  final String icon;
  final String name;
  final String description;
  final Color color;
  final VoidCallback onTap;

  const _ServiceCard({
    required this.icon,
    required this.name,
    required this.description,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Center(
                child: Text(icon, style: const TextStyle(fontSize: 28)),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              name,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.ink,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              description,
              style: const TextStyle(
                fontSize: 11,
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}