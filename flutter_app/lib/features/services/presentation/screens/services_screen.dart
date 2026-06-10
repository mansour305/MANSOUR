import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../data/models/models.dart';
import '../../../home/providers/providers.dart';

class ServicesScreen extends ConsumerStatefulWidget {
  const ServicesScreen({super.key});

  @override
  ConsumerState<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends ConsumerState<ServicesScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';
  ServiceCenter? _selectedCenter;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final serviceCenters = ref.watch(serviceCentersProvider);
    final filteredCenters = _searchQuery.isEmpty
        ? serviceCenters
        : serviceCenters.where((center) {
            return center.name.contains(_searchQuery) ||
                center.services.any((s) => s.contains(_searchQuery));
          }).toList();

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
              _buildHeader(),
              const SizedBox(height: 20),
              // Search Bar
              _buildSearchBar(),
              const SizedBox(height: 20),
              // Content
              if (_selectedCenter != null)
                _buildCenterDetail(_selectedCenter!)
              else
                _buildCentersGrid(filteredCenters),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'مراكز الخدمات',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w800,
            color: AppColors.ink,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          '${ref.watch(serviceCentersProvider).length} مراكز متاحة',
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBar() {
    return TextField(
      controller: _searchController,
      onChanged: (value) => setState(() => _searchQuery = value),
      decoration: InputDecoration(
        hintText: 'ابحث عن خدمة أو مركز...',
        prefixIcon: const Icon(Icons.search, color: AppColors.textSecondary),
        suffixIcon: _searchQuery.isNotEmpty
            ? IconButton(
                icon: const Icon(Icons.close, color: AppColors.textSecondary),
                onPressed: () {
                  _searchController.clear();
                  setState(() => _searchQuery = '');
                },
              )
            : null,
      ),
    );
  }

  Widget _buildCentersGrid(List<ServiceCenter> centers) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.9,
      ),
      itemCount: centers.length,
      itemBuilder: (context, index) {
        final center = centers[index];
        return _CenterCard(
          center: center,
          onTap: () => setState(() => _selectedCenter = center),
        );
      },
    );
  }

  Widget _buildCenterDetail(ServiceCenter center) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Back button
        GestureDetector(
          onTap: () => setState(() => _selectedCenter = null),
          child: Row(
            children: const [
              Icon(Icons.arrow_forward, color: AppColors.ink),
              SizedBox(width: 8),
              Text(
                'رجوع',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.ink,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        // Center Header
        Center(
          child: Column(
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: AppColors.cream,
                  borderRadius: BorderRadius.circular(28),
                ),
                child: Center(
                  child: Text(center.icon, style: const TextStyle(fontSize: 48)),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                center.name,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: AppColors.ink,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${center.services.length} خدمات متاحة',
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        // Services List
        const Text(
          'الخدمات المتاحة',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
          ),
        ),
        const SizedBox(height: 16),
        ...center.services.map((service) => _buildServiceItem(service)),
      ],
    );
  }

  Widget _buildServiceItem(String service) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(14),
      ),
      child: ListTile(
        onTap: () => _showBookingDialog(service),
        title: Text(
          service,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.ink,
          ),
        ),
        trailing: const Icon(
          Icons.chevron_left,
          color: AppColors.brown,
        ),
      ),
    );
  }

  void _showBookingDialog(String service) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(service),
        content: const Text('هل تريد حجز موعد لهذه الخدمة؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('تم توجيهك لتطبيق المواعيد')),
              );
            },
            child: const Text('حجز موعد'),
          ),
        ],
      ),
    );
  }
}

class _CenterCard extends StatelessWidget {
  final ServiceCenter center;
  final VoidCallback onTap;

  const _CenterCard({required this.center, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: AppColors.paper,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Center(
                child: Text(center.icon, style: const TextStyle(fontSize: 32)),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              center.name,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.ink,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              '${center.services.length} خدمة',
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}