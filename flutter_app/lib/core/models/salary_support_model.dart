/// Salary/Support Model with scheduling and adjustment support
class SalarySupportModel {
  final String id;
  final String name;
  final String nameAr;
  final SalarySupportType type;
  final DateTime originalDate;
  final DateTime adjustedDate;
  final String? amount;
  final SalarySupportStatus status;
  final bool isEnabled;
  final bool showOnHome;
  final String? icon;

  const SalarySupportModel({
    required this.id,
    required this.name,
    required this.nameAr,
    required this.type,
    required this.originalDate,
    required this.adjustedDate,
    this.amount,
    required this.status,
    this.isEnabled = true,
    this.showOnHome = true,
    this.icon,
  });

  factory SalarySupportModel.fromMap(Map<String, dynamic> map) {
    final originalDate = DateTime.parse(map['original_date'] ?? map['date'] ?? DateTime.now().toIso8601String());
    return SalarySupportModel(
      id: map['id']?.toString() ?? '',
      name: map['name'] ?? '',
      nameAr: map['name_ar'] ?? map['name'] ?? '',
      type: _parseType(map['type'] ?? 'salary'),
      originalDate: originalDate,
      adjustedDate: _adjustDate(originalDate),
      amount: map['amount']?.toString(),
      status: _calculateStatus(originalDate),
      isEnabled: map['is_enabled'] ?? true,
      showOnHome: map['show_on_home'] ?? true,
      icon: map['icon'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'name_ar': nameAr,
      'type': type.name,
      'original_date': originalDate.toIso8601String().split('T')[0],
      'adjusted_date': adjustedDate.toIso8601String().split('T')[0],
      'amount': amount,
      'status': status.name,
      'is_enabled': isEnabled,
      'show_on_home': showOnHome,
      'icon': icon,
    };
  }

  static SalarySupportType _parseType(String type) {
    switch (type.toLowerCase()) {
      case 'support':
      case 'دعم':
        return SalarySupportType.support;
      case 'salary':
      case 'راتب':
      default:
        return SalarySupportType.salary;
    }
  }

  /// Adjust date if it falls on Friday (move to Thursday) or Saturday (move to Sunday)
  static DateTime _adjustDate(DateTime date) {
    int weekday = date.weekday;
    
    // Friday (7) -> move to Thursday (4)
    if (weekday == DateTime.friday) {
      return date.subtract(const Duration(days: 1));
    }
    
    // Saturday (7) -> move to Sunday (1)
    if (weekday == DateTime.saturday) {
      return date.add(const Duration(days: 1));
    }
    
    return date;
  }

  /// Calculate status based on date
  static SalarySupportStatus _calculateStatus(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final targetDate = DateTime(date.year, date.month, date.day);
    
    if (targetDate.isBefore(today)) {
      return SalarySupportStatus.paid;
    } else if (targetDate.isAtSameMomentAs(today)) {
      return SalarySupportStatus.today;
    } else {
      return SalarySupportStatus.upcoming;
    }
  }

  /// Get days remaining until payment
  int get daysRemaining {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final targetDate = DateTime(adjustedDate.year, adjustedDate.month, adjustedDate.day);
    
    return targetDate.difference(today).inDays;
  }

  /// Get countdown string
  String get countdownString {
    final days = daysRemaining;
    if (days == 0) return 'اليوم';
    if (days == 1) return 'غداً';
    return '$days يوم';
  }

  /// Get adjusted date as string
  String get adjustedDateString {
    final months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return '${adjustedDate.day} ${months[adjustedDate.month - 1]}';
  }

  /// Copy with modifications
  SalarySupportModel copyWith({
    String? id,
    String? name,
    String? nameAr,
    SalarySupportType? type,
    DateTime? originalDate,
    DateTime? adjustedDate,
    String? amount,
    SalarySupportStatus? status,
    bool? isEnabled,
    bool? showOnHome,
    String? icon,
  }) {
    return SalarySupportModel(
      id: id ?? this.id,
      name: name ?? this.name,
      nameAr: nameAr ?? this.nameAr,
      type: type ?? this.type,
      originalDate: originalDate ?? this.originalDate,
      adjustedDate: adjustedDate ?? this.adjustedDate,
      amount: amount ?? this.amount,
      status: status ?? this.status,
      isEnabled: isEnabled ?? this.isEnabled,
      showOnHome: showOnHome ?? this.showOnHome,
      icon: icon ?? this.icon,
    );
  }
}

/// Type enum
enum SalarySupportType {
  salary,
  support,
}

/// Status enum
enum SalarySupportStatus {
  upcoming,
  today,
  paid,
}

/// Extension for display names
extension SalarySupportTypeExtension on SalarySupportType {
  String get displayName {
    switch (this) {
      case SalarySupportType.salary:
        return 'راتب';
      case SalarySupportType.support:
        return 'دعم';
    }
  }

  String get icon {
    switch (this) {
      case SalarySupportType.salary:
        return '💰';
      case SalarySupportType.support:
        return '🏛️';
    }
  }
}

extension SalarySupportStatusExtension on SalarySupportStatus {
  String get displayName {
    switch (this) {
      case SalarySupportStatus.upcoming:
        return 'قادم';
      case SalarySupportStatus.today:
        return 'اليوم';
      case SalarySupportStatus.paid:
        return 'تم الصرف';
    }
  }
}