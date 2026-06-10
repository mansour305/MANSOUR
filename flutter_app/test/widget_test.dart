import 'package:flutter_test/flutter_test.dart';
import 'package:mawaeedak_flutter/data/models/models.dart';

void main() {
  group('Data Models', () {
    test('PrayerTimes.fromMap creates correct instance', () {
      final map = {
        'fajr': '04:30',
        'sunrise': '05:45',
        'dhuhr': '11:45',
        'asr': '15:15',
        'maghrib': '18:45',
        'isha': '20:00',
      };
      final times = PrayerTimes.fromMap(map);
      
      expect(times.fajr, '04:30');
      expect(times.sunrise, '05:45');
      expect(times.dhuhr, '11:45');
      expect(times.asr, '15:15');
      expect(times.maghrib, '18:45');
      expect(times.isha, '20:00');
    });

    test('FinancialEvent.fromMap creates correct instance', () {
      final map = {
        'id': '1',
        'name': 'راتب',
        'name_ar': 'راتب شهر',
        'date': '2026-06-25',
        'amount': '12000',
        'type': 'salary',
        'days_remaining': 16,
      };
      final event = FinancialEvent.fromMap(map);
      
      expect(event.id, '1');
      expect(event.name, 'راتب');
      expect(event.nameAr, 'راتب شهر');
      expect(event.amount, '12000');
      expect(event.type, 'salary');
      expect(event.daysRemaining, 16);
    });

    test('FinancialEvent.toMap creates correct map', () {
      const event = FinancialEvent(
        id: '1',
        name: 'راتب',
        nameAr: 'راتب شهر',
        date: '2026-06-25',
        amount: '12000',
        type: 'salary',
        daysRemaining: 16,
      );
      final map = event.toMap();
      
      expect(map['id'], '1');
      expect(map['name'], 'راتب');
      expect(map['name_ar'], 'راتب شهر');
      expect(map['type'], 'salary');
    });

    test('Appointment.fromMap creates correct instance', () {
      final map = {
        'id': '1',
        'title': 'زيارة طبيب',
        'date': '2026-06-12',
        'time': '10:00',
        'type': 'medical',
        'notes': 'فحص دوري',
      };
      final appointment = Appointment.fromMap(map);
      
      expect(appointment.id, '1');
      expect(appointment.title, 'زيارة طبيب');
      expect(appointment.type, 'medical');
    });

    test('User.fromMap creates correct instance', () {
      final map = {
        'id': '1',
        'name': 'أحمد',
        'email': 'ahmed@test.com',
        'city': 'الرياض',
        'cityKey': 'riyadh',
        'timezone': 'Asia/Riyadh',
        'role': 'user',
        'onboardingComplete': true,
      };
      final user = User.fromMap(map);
      
      expect(user.id, '1');
      expect(user.name, 'أحمد');
      expect(user.city, 'الرياض');
    });
  });
}