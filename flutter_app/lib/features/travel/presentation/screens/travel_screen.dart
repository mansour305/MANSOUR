import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class TravelScreen extends StatefulWidget {
  const TravelScreen({super.key});

  @override
  State<TravelScreen> createState() => _TravelScreenState();
}

class _TravelScreenState extends State<TravelScreen> {
  final List<Travel> _travels = [];

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
              _buildTravelsList(),
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
          'السفر',
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
      onTap: _showAddTravelDialog,
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
              'إضافة رحلة',
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

  Widget _buildTravelsList() {
    if (_travels.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: AppColors.cream,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Center(
          child: Column(
            children: [
              Text('✈️', style: TextStyle(fontSize: 48)),
              SizedBox(height: 16),
              Text(
                'لم تضف أي رحلات بعد',
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
          'رحلاتك (${_travels.length})',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.ink,
          ),
        ),
        const SizedBox(height: 12),
        ..._travels.map((travel) => _buildTravelCard(travel)),
      ],
    );
  }

  Widget _buildTravelCard(Travel travel) {
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
                  travel.name,
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
                  if (value == 'edit') _editTravel(travel);
                  if (value == 'delete') _deleteTravel(travel);
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
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.location_on, size: 16, color: AppColors.gold),
              const SizedBox(width: 4),
              Text(travel.destination, style: const TextStyle(color: AppColors.textSecondary)),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.calendar_today, size: 16, color: AppColors.textSecondary),
              const SizedBox(width: 4),
              Text('من ${travel.departureDate}', style: const TextStyle(color: AppColors.textSecondary)),
              if (travel.returnDate.isNotEmpty) ...[
                const Text(' - ', style: TextStyle(color: AppColors.textSecondary)),
                Text('إلى ${travel.returnDate}', style: const TextStyle(color: AppColors.textSecondary)),
              ],
            ],
          ),
          if (travel.notes.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(travel.notes, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          ],
        ],
      ),
    );
  }

  void _showAddTravelDialog() {
    final nameController = TextEditingController();
    final destinationController = TextEditingController();
    final departureController = TextEditingController();
    final returnController = TextEditingController();
    final notesController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
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
                  const Text('إضافة رحلة', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                ],
              ),
              const SizedBox(height: 16),
              TextField(controller: nameController, decoration: const InputDecoration(labelText: 'اسم الرحلة')),
              const SizedBox(height: 12),
              TextField(controller: destinationController, decoration: const InputDecoration(labelText: 'الوجهة')),
              const SizedBox(height: 12),
              TextField(controller: departureController, decoration: const InputDecoration(labelText: 'تاريخ السفر (YYYY-MM-DD)')),
              const SizedBox(height: 12),
              TextField(controller: returnController, decoration: const InputDecoration(labelText: 'تاريخ العودة (YYYY-MM-DD) اختياري')),
              const SizedBox(height: 12),
              TextField(controller: notesController, maxLines: 2, decoration: const InputDecoration(labelText: 'ملاحظات')),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (nameController.text.isNotEmpty && destinationController.text.isNotEmpty) {
                      setState(() {
                        _travels.add(Travel(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          name: nameController.text,
                          destination: destinationController.text,
                          departureDate: departureController.text,
                          returnDate: returnController.text,
                          notes: notesController.text,
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
    );
  }

  void _editTravel(Travel travel) {
    final nameController = TextEditingController(text: travel.name);
    final destinationController = TextEditingController(text: travel.destination);
    final departureController = TextEditingController(text: travel.departureDate);
    final returnController = TextEditingController(text: travel.returnDate);
    final notesController = TextEditingController(text: travel.notes);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
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
                  const Text('تعديل الرحلة', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                ],
              ),
              const SizedBox(height: 16),
              TextField(controller: nameController, decoration: const InputDecoration(labelText: 'اسم الرحلة')),
              const SizedBox(height: 12),
              TextField(controller: destinationController, decoration: const InputDecoration(labelText: 'الوجهة')),
              const SizedBox(height: 12),
              TextField(controller: departureController, decoration: const InputDecoration(labelText: 'تاريخ السفر')),
              const SizedBox(height: 12),
              TextField(controller: returnController, decoration: const InputDecoration(labelText: 'تاريخ العودة')),
              const SizedBox(height: 12),
              TextField(controller: notesController, maxLines: 2, decoration: const InputDecoration(labelText: 'ملاحظات')),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      final index = _travels.indexWhere((t) => t.id == travel.id);
                      if (index != -1) {
                        _travels[index] = Travel(
                          id: travel.id,
                          name: nameController.text,
                          destination: destinationController.text,
                          departureDate: departureController.text,
                          returnDate: returnController.text,
                          notes: notesController.text,
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
    );
  }

  void _deleteTravel(Travel travel) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف الرحلة'),
        content: Text('هل أنت متأكد من حذف "${travel.name}"؟'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('إلغاء')),
          ElevatedButton(
            onPressed: () {
              setState(() => _travels.removeWhere((t) => t.id == travel.id));
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

class Travel {
  final String id;
  final String name;
  final String destination;
  final String departureDate;
  final String returnDate;
  final String notes;

  Travel({
    required this.id,
    required this.name,
    required this.destination,
    required this.departureDate,
    required this.returnDate,
    required this.notes,
  });
}