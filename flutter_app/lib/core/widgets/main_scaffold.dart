import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';

/// Main Scaffold with Bottom Navigation Bar
class MainScaffold extends StatelessWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      extendBody: true,
      bottomNavigationBar: const _CustomBottomNavBar(),
    );
  }
}

class _CustomBottomNavBar extends StatelessWidget {
  const _CustomBottomNavBar();

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final currentIndex = _getIndexFromLocation(location);

    return Container(
      decoration: BoxDecoration(
        color: AppColors.paper,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
        border: Border.all(color: AppColors.borderGold),
        boxShadow: [
          BoxShadow(
            color: AppColors.brown.withOpacity(0.12),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: TabConfig.tabs.map((tab) {
              final isSelected = currentIndex == TabConfig.tabs.indexOf(tab);
              return _TabItem(
                icon: _getIconData(tab['icon']!),
                label: tab['label']!,
                isSelected: isSelected,
                onTap: () => _navigateToTab(context, tab['name']!),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  int _getIndexFromLocation(String location) {
    for (int i = 0; i < TabConfig.tabs.length; i++) {
      if (location.startsWith('/${TabConfig.tabs[i]['name']}')) {
        return i;
      }
    }
    return 0;
  }

  void _navigateToTab(BuildContext context, String tabName) {
    context.goNamed(tabName);
  }

  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'home':
        return Icons.home_outlined;
      case 'attach_money':
        return Icons.attach_money;
      case 'grid_view':
        return Icons.grid_view_outlined;
      case 'calendar_today':
        return Icons.calendar_today_outlined;
      case 'more_horiz':
        return Icons.more_horiz;
      default:
        return Icons.circle_outlined;
    }
  }
}

class _TabItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _TabItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.cream : Colors.transparent,
          borderRadius: BorderRadius.circular(22),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 24,
              color: isSelected ? AppColors.gold : AppColors.brown,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: isSelected ? AppColors.gold : AppColors.brown,
              ),
            ),
            if (isSelected) ...[
              const SizedBox(height: 3),
              Container(
                width: 18,
                height: 2.5,
                decoration: BoxDecoration(
                  color: AppColors.gold,
                  borderRadius: BorderRadius.circular(1.25),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}