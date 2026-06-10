import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/home/presentation/screens/home_screen.dart';
import '../features/salary/presentation/screens/salary_screen.dart';
import '../features/services/presentation/screens/services_screen.dart';
import '../features/calendar/presentation/screens/calendar_screen.dart';
import '../features/more/presentation/screens/more_screen.dart';
import '../features/daily_card/presentation/screens/daily_card_screen.dart';
import '../features/account/presentation/screens/account_screen.dart';
import '../features/settings/presentation/screens/settings_screen.dart';
import '../features/goal_calculator/presentation/screens/goal_calculator_screen.dart';
import '../features/cost_calculator/presentation/screens/cost_calculator_screen.dart';
import '../features/reminder/presentation/screens/reminder_screen.dart';
import '../features/travel/presentation/screens/travel_screen.dart';
import '../features/study/presentation/screens/study_screen.dart';
import '../features/jobs/presentation/screens/jobs_screen.dart';
import '../features/feedback/presentation/screens/feedback_screen.dart';
import '../core/widgets/main_scaffold.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/home',
  routes: [
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) {
        return MainScaffold(child: child);
      },
      routes: [
        GoRoute(
          path: '/home',
          name: 'home',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: HomeScreen(),
          ),
        ),
        GoRoute(
          path: '/salary',
          name: 'salary',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: SalaryScreen(),
          ),
        ),
        GoRoute(
          path: '/services',
          name: 'services',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: ServicesScreen(),
          ),
        ),
        GoRoute(
          path: '/calendar',
          name: 'calendar',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: CalendarScreen(),
          ),
        ),
        GoRoute(
          path: '/more',
          name: 'more',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: MoreScreen(),
          ),
        ),
      ],
    ),
    GoRoute(
      path: '/daily-card',
      name: 'daily-card',
      builder: (context, state) => const DailyCardScreen(),
    ),
    GoRoute(
      path: '/account',
      name: 'account',
      builder: (context, state) => const AccountScreen(),
    ),
    GoRoute(
      path: '/settings',
      name: 'settings',
      builder: (context, state) => const SettingsScreen(),
    ),
    GoRoute(
      path: '/goal-calculator',
      name: 'goal-calculator',
      builder: (context, state) => const GoalCalculatorScreen(),
    ),
    GoRoute(
      path: '/cost-calculator',
      name: 'cost-calculator',
      builder: (context, state) => const CostCalculatorScreen(),
    ),
    GoRoute(
      path: '/reminder',
      name: 'reminder',
      builder: (context, state) => const ReminderScreen(),
    ),
    GoRoute(
      path: '/travel',
      name: 'travel',
      builder: (context, state) => const TravelScreen(),
    ),
    GoRoute(
      path: '/study',
      name: 'study',
      builder: (context, state) => const StudyScreen(),
    ),
    GoRoute(
      path: '/jobs',
      name: 'jobs',
      builder: (context, state) => const JobsScreen(),
    ),
    GoRoute(
      path: '/feedback',
      name: 'feedback',
      builder: (context, state) => const FeedbackScreen(),
    ),
  ],
);

/// Route names for type-safe navigation
class AppRoutes {
  static const String home = 'home';
  static const String salary = 'salary';
  static const String services = 'services';
  static const String calendar = 'calendar';
  static const String more = 'more';
  static const String dailyCard = 'daily-card';
  static const String account = 'account';
  static const String settings = 'settings';
  static const String goalCalculator = 'goal-calculator';
  static const String costCalculator = 'cost-calculator';
  static const String reminder = 'reminder';
  static const String travel = 'travel';
  static const String study = 'study';
  static const String jobs = 'jobs';
  static const String feedback = 'feedback';
}