import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class ReminderScreen extends StatefulWidget {
  const ReminderScreen({super.key});
  @override
  State<ReminderScreen> createState() => _ReminderScreenState();
}

class _ReminderScreenState extends State<ReminderScreen> {
  final List<Reminder> _reminders = [];

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
              _buildRemindersList(),
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
        const Text('ذكرني', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.ink)),
        const SizedBox(width: 44),
      ],
    );
  }

  Widget _buildAddButton() {
    return GestureDetector(
      onTap: _showAddDialog,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.gold.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderGold),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.add_alarm, color: AppColors.gold),
            SizedBox(width: 8),
            Text('إضافة تذكير', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.gold)),
          ],
        ),
      ),
    );
  }

  Widget _buildRemindersList() {
    if (_reminders.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(16)),
        child: const Center(
          child: Column(
            children: [
              Text('🔔', style: TextStyle(fontSize: 48)),
              SizedBox(height: 16),
              Text('لم تضف أي تذكيرات بعد', style: TextStyle(fontSize: 16, color: AppColors.textSecondary)),
            ],
          ),
        ),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('تذكيراتك (${_reminders.length})', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.ink)),
        const SizedBox(height: 12),
        ..._reminders.map((reminder) => _buildReminderCard(reminder)),
      ],
    );
  }

  Widget _buildReminderCard(Reminder reminder) {
    final dt = DateTime(reminder.date.year, reminder.date.month, reminder.date.day, reminder.time.hour, reminder.time.minute);
    final isPast = dt.isBefore(DateTime.now());
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isPast ? AppColors.cream.withOpacity(0.5) : AppColors.cream,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isPast ? AppColors.textSecondary.withOpacity(0.3) : AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(child: Text(reminder.title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: isPast ? AppColors.textSecondary : AppColors.ink))),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert, color: AppColors.textSecondary),
                onSelected: (value) {
                  if (value == 'edit') _editReminder(reminder);
                  if (value == 'delete') _deleteReminder(reminder);
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(value: 'edit', child: Text('تعديل')),
                  const PopupMenuItem(value: 'delete', child: Text('حذف', style: TextStyle(color: AppColors.error))),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(children: [
            const Icon(Icons.calendar_today, size: 16, color: AppColors.textSecondary),
            const SizedBox(width: 4),
            Text('${reminder.date.day}/${reminder.date.month}/${reminder.date.year}', style: const TextStyle(color: AppColors.textSecondary)),
            const SizedBox(width: 16),
            const Icon(Icons.access_time, size: 16, color: AppColors.textSecondary),
            const SizedBox(width: 4),
            Text('${reminder.time.hour.toString().padLeft(2, '0')}:${reminder.time.minute.toString().padLeft(2, '0')}', style: const TextStyle(color: AppColors.textSecondary)),
            const SizedBox(width: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(color: AppColors.gold.withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
              child: Text('${reminder.minutesBefore} دقيقة قبل', style: const TextStyle(fontSize: 12, color: AppColors.gold, fontWeight: FontWeight.w600)),
            ),
          ]),
          if (reminder.note.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(reminder.note, style: const TextStyle(fontSize: 14, color: AppColors.textSecondary), maxLines: 2, overflow: TextOverflow.ellipsis),
          ],
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: isPast ? AppColors.textSecondary.withOpacity(0.2) : AppColors.gold.withOpacity(0.2), borderRadius: BorderRadius.circular(8)),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(isPast ? Icons.history : Icons.bookmark, size: 14, color: isPast ? AppColors.textSecondary : AppColors.gold),
              const SizedBox(width: 4),
              Text(isPast ? 'انتهى' : 'محفوظ', style: TextStyle(fontSize: 12, color: isPast ? AppColors.textSecondary : AppColors.gold, fontWeight: FontWeight.w600)),
            ]),
          ),
          const SizedBox(height: 8),
          Text('تذكير قبل ${reminder.minutesBefore} دقيقة (محفوظ في التطبيق)', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontStyle: FontStyle.italic)),
        ],
      ),
    );
  }

  void _showAddDialog() {
    final titleCtrl = TextEditingController();
    final noteCtrl = TextEditingController();
    DateTime selDate = DateTime.now();
    TimeOfDay selTime = const TimeOfDay(hour: 9, minute: 0);
    int minsBefore = 15;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setMS) => Container(
          decoration: const BoxDecoration(color: AppColors.paper, borderRadius: BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24))),
          padding: EdgeInsets.only(left: 20, right: 20, top: 20, bottom: MediaQuery.of(context).viewInsets.bottom + 40),
          child: SingleChildScrollView(
            child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('إضافة تذكير', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.ink)),
                IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
              ]),
              const SizedBox(height: 20),
              TextField(controller: titleCtrl, decoration: const InputDecoration(labelText: 'العنوان', hintText: 'مثال: اجتماع عمل')),
              const SizedBox(height: 16),
              Row(children: [
                const Icon(Icons.calendar_today, color: AppColors.gold),
                const SizedBox(width: 12),
                const Text('التاريخ: '),
                TextButton(
                  onPressed: () async {
                    final d = await showDatePicker(context: context, initialDate: selDate, firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                    if (d != null) setMS(() => selDate = d);
                  },
                  child: Text('${selDate.day}/${selDate.month}/${selDate.year}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.gold)),
                ),
              ]),
              const SizedBox(height: 12),
              Row(children: [
                const Icon(Icons.access_time, color: AppColors.gold),
                const SizedBox(width: 12),
                const Text('الوقت: '),
                TextButton(
                  onPressed: () async {
                    final t = await showTimePicker(context: context, initialTime: selTime);
                    if (t != null) setMS(() => selTime = t);
                  },
                  child: Text('${selTime.hour.toString().padLeft(2, '0')}:${selTime.minute.toString().padLeft(2, '0')}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.gold)),
                ),
              ]),
              const SizedBox(height: 12),
              Row(children: [
                const Icon(Icons.notifications, color: AppColors.gold),
                const SizedBox(width: 12),
                const Text('تذكير قبل: '),
                DropdownButton<int>(value: minsBefore, items: const [
                  DropdownMenuItem(value: 5, child: Text('5 دقائق')),
                  DropdownMenuItem(value: 10, child: Text('10 دقائق')),
                  DropdownMenuItem(value: 15, child: Text('15 دقيقة')),
                  DropdownMenuItem(value: 30, child: Text('30 دقيقة')),
                  DropdownMenuItem(value: 60, child: Text('ساعة')),
                ], onChanged: (v) { if (v != null) setMS(() => minsBefore = v); }),
              ]),
              const SizedBox(height: 16),
              TextField(controller: noteCtrl, maxLines: 3, decoration: const InputDecoration(labelText: 'ملاحظة (اختياري)', hintText: 'أضف ملاحظة...')),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (titleCtrl.text.isNotEmpty) {
                      setState(() => _reminders.add(Reminder(id: DateTime.now().millisecondsSinceEpoch.toString(), title: titleCtrl.text, date: selDate, time: selTime, minutesBefore: minsBefore, note: noteCtrl.text)));
                      Navigator.pop(context);
                    }
                  },
                  child: const Text('حفظ التذكير'),
                ),
              ),
            ]),
          ),
        ),
      ),
    );
  }

  void _editReminder(Reminder reminder) {
    final titleCtrl = TextEditingController(text: reminder.title);
    final noteCtrl = TextEditingController(text: reminder.note);
    DateTime selDate = reminder.date;
    TimeOfDay selTime = reminder.time;
    int minsBefore = reminder.minutesBefore;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setMS) => Container(
          decoration: const BoxDecoration(color: AppColors.paper, borderRadius: BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24))),
          padding: EdgeInsets.only(left: 20, right: 20, top: 20, bottom: MediaQuery.of(context).viewInsets.bottom + 40),
          child: SingleChildScrollView(
            child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('تعديل التذكير', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.ink)),
                IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
              ]),
              const SizedBox(height: 20),
              TextField(controller: titleCtrl, decoration: const InputDecoration(labelText: 'العنوان')),
              const SizedBox(height: 16),
              Row(children: [
                const Text('التاريخ: '),
                TextButton(
                  onPressed: () async {
                    final d = await showDatePicker(context: context, initialDate: selDate, firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                    if (d != null) setMS(() => selDate = d);
                  },
                  child: Text('${selDate.day}/${selDate.month}/${selDate.year}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.gold)),
                ),
              ]),
              const SizedBox(height: 12),
              Row(children: [
                const Text('الوقت: '),
                TextButton(
                  onPressed: () async {
                    final t = await showTimePicker(context: context, initialTime: selTime);
                    if (t != null) setMS(() => selTime = t);
                  },
                  child: Text('${selTime.hour.toString().padLeft(2, '0')}:${selTime.minute.toString().padLeft(2, '0')}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.gold)),
                ),
              ]),
              const SizedBox(height: 12),
              Row(children: [
                const Text('تذكير قبل: '),
                DropdownButton<int>(value: minsBefore, items: const [
                  DropdownMenuItem(value: 5, child: Text('5 دقائق')),
                  DropdownMenuItem(value: 10, child: Text('10 دقائق')),
                  DropdownMenuItem(value: 15, child: Text('15 دقيقة')),
                  DropdownMenuItem(value: 30, child: Text('30 دقيقة')),
                  DropdownMenuItem(value: 60, child: Text('ساعة')),
                ], onChanged: (v) { if (v != null) setMS(() => minsBefore = v); }),
              ]),
              const SizedBox(height: 16),
              TextField(controller: noteCtrl, maxLines: 3, decoration: const InputDecoration(labelText: 'ملاحظة (اختياري)')),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      final idx = _reminders.indexWhere((r) => r.id == reminder.id);
                      if (idx != -1) _reminders[idx] = Reminder(id: reminder.id, title: titleCtrl.text, date: selDate, time: selTime, minutesBefore: minsBefore, note: noteCtrl.text);
                    });
                    Navigator.pop(context);
                  },
                  child: const Text('حفظ التعديلات'),
                ),
              ),
            ]),
          ),
        ),
      ),
    );
  }

  void _deleteReminder(Reminder reminder) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف التذكير'),
        content: Text('هل أنت متأكد من حذف "${reminder.title}"؟'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('إلغاء')),
          ElevatedButton(
            onPressed: () {
              setState(() => _reminders.removeWhere((r) => r.id == reminder.id));
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

class Reminder {
  final String id;
  final String title;
  final DateTime date;
  final TimeOfDay time;
  final int minutesBefore;
  final String note;
  Reminder({required this.id, required this.title, required this.date, required this.time, required this.minutesBefore, required this.note});
}