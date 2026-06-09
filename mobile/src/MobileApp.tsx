/**
 * MobileApp — Main Application Component for Mawaeedak Mobile
 * 
 * A functional mobile app with bottom navigation, RTL support,
 * and proper routing structure for the Saudi appointments app.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { I18nManager } from 'react-native';

// =============================================================================
// CONFIGURATION & SETUP
// =============================================================================

// Force RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// =============================================================================
// THEME COLORS (Saudi Identity)
const THEME = {
  primary: '#C9A063',      // Gold
  secondary: '#8A6B3D',    // Brown
  background: '#FAF7F2',   // Cream
  surface: '#FFFFFF',      // White
  text: '#2F2B25',         // Dark
  textSecondary: '#6F6557', // Brown gray
  border: '#DCD7CF',       // Soft gray
  error: '#B45A4D',       // Terracotta red
  success: '#7A9A74',     // Olive green
};

// =============================================================================
// NAVIGATION TYPES
// =============================================================================

type TabName = 'home' | 'calendar' | 'services' | 'more';

// =============================================================================
// SCREEN COMPONENTS (Basic Implementation for Startup)
// =============================================================================

const HomeScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.logo}>🕌 مواعيدك</Text>
    <Text style={styles.subtitle}>تطبيق إدارة المواعيد والمواعيد المالية</Text>
    
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📅 المواعيد القادمة</Text>
      <Text style={styles.cardEmpty}>لا توجد مواعيد قادمة</Text>
    </View>
    
    <View style={styles.card}>
      <Text style={styles.cardTitle}>💰 المواعيد المالية</Text>
      <Text style={styles.cardEmpty}>لا توجد تواريخ مالية</Text>
    </View>
    
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🕌 الصلاة القادمة</Text>
      <Text style={styles.prayerTime}>الفجر - 04:30</Text>
      <Text style={styles.countdown}>متبقي: 3 ساعات</Text>
    </View>
  </View>
);

const CalendarScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>التقويم</Text>
    <Text style={styles.cardEmpty}>اضغط على تاريخ لإضافة موعد</Text>
    
    <View style={styles.calendarGrid}>
      {[...Array(30)].map((_, i) => (
        <View key={i} style={styles.calendarDay}>
          <Text style={styles.calendarDayText}>{i + 1}</Text>
        </View>
      ))}
    </View>
  </View>
);

const ServicesScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>الخدمات</Text>
    
    <View style={styles.servicesGrid}>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>💼</Text>
        <Text style={styles.serviceName}>الأعمال</Text>
      </View>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>✈️</Text>
        <Text style={styles.serviceName}>السفر</Text>
      </View>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>📚</Text>
        <Text style={styles.serviceName}>الدراسة</Text>
      </View>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>📰</Text>
        <Text style={styles.serviceName}>الأخبار</Text>
      </View>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>💼</Text>
        <Text style={styles.serviceName}>الوظائف</Text>
      </View>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>🎉</Text>
        <Text style={styles.serviceName}>التهاني</Text>
      </View>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>📝</Text>
        <Text style={styles.serviceName}>الشكاوى</Text>
      </View>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>📞</Text>
        <Text style={styles.serviceName}>اتصل بنا</Text>
      </View>
    </View>
  </View>
);

const MoreScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.screenTitle}>المزيد</Text>
    
    <View style={styles.menuList}>
      <View style={styles.menuItem}>
        <Text style={styles.menuIcon}>👤</Text>
        <Text style={styles.menuText}>حسابي</Text>
      </View>
      <View style={styles.menuItem}>
        <Text style={styles.menuIcon}>🎨</Text>
        <Text style={styles.menuText}>الثيمات</Text>
      </View>
      <View style={styles.menuItem}>
        <Text style={styles.menuIcon}>🔔</Text>
        <Text style={styles.menuText}>الإشعارات</Text>
      </View>
      <View style={styles.menuItem}>
        <Text style={styles.menuIcon}>📤</Text>
        <Text style={styles.menuText}>مشاركة التطبيق</Text>
      </View>
      <View style={styles.menuItem}>
        <Text style={styles.menuIcon}>📜</Text>
        <Text style={styles.menuText}>سياسة الخصوصية</Text>
      </View>
      <View style={styles.menuItem}>
        <Text style={styles.menuIcon}>📋</Text>
        <Text style={styles.menuText}>الشروط والأحكام</Text>
      </View>
      <View style={styles.menuItem}>
        <Text style={styles.menuIcon}>💬</Text>
        <Text style={styles.menuText}>المساعدة والدعم</Text>
      </View>
      <View style={styles.menuItem}>
        <Text style={styles.menuIcon}>🚪</Text>
        <Text style={[styles.menuText, styles.menuTextDanger]}>تسجيل الخروج</Text>
      </View>
    </View>
    
    <Text style={styles.footer}>بسم الله توكلت</Text>
  </View>
);

// =============================================================================
// BOTTOM TAB BAR
// =============================================================================

interface BottomTabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  const tabs: { name: TabName; icon: string; label: string }[] = [
    { name: 'home', icon: '🏠', label: 'الرئيسية' },
    { name: 'calendar', icon: '📅', label: 'التقويم' },
    { name: 'services', icon: '🏢', label: 'الخدمات' },
    { name: 'more', icon: '☰', label: 'المزيد' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <View
          key={tab.name}
          style={[styles.tabItem, activeTab === tab.name && styles.tabItemActive]}
          onTouchEnd={() => onTabPress(tab.name)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[styles.tabLabel, activeTab === tab.name && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

// =============================================================================
// MAIN MOBILE APP COMPONENT
// =============================================================================

interface MobileAppProps {
  onReady?: () => void;
}

const MobileApp: React.FC<MobileAppProps> = ({ onReady }) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate startup initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      onReady?.();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [onReady]);

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>🕌</Text>
          <Text style={styles.loadingText}>جاري تحميل مواعيدك...</Text>
          <ActivityIndicator size="large" color={THEME.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Screen Content
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'more':
        return <MoreScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>🕌 مواعيدك</Text>
        <Text style={styles.headerDate}>التاريخ الهجري</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
  },
  loadingLogo: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: THEME.textSecondary,
    marginBottom: 20,
  },
  
  // Header
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  headerDate: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  
  // Content
  content: {
    flex: 1,
  },
  
  // Screen
  screen: {
    flex: 1,
    padding: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.text,
    textAlign: 'right',
    marginBottom: 20,
  },
  
  // Cards
  card: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 12,
  },
  cardEmpty: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  
  // Prayer
  prayerTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.primary,
    textAlign: 'center',
  },
  countdown: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Calendar
  calendarGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarDayText: {
    fontSize: 16,
    color: THEME.text,
  },
  
  // Services
  servicesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: '1%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    color: THEME.text,
    fontWeight: '600',
  },
  
  // Menu
  menuList: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  menuIcon: {
    fontSize: 20,
    marginLeft: 15,
  },
  menuText: {
    fontSize: 16,
    color: THEME.text,
  },
  menuTextDanger: {
    color: THEME.error,
  },
  
  // Footer
  footer: {
    textAlign: 'center',
    color: THEME.textSecondary,
    fontSize: 14,
    marginTop: 30,
    fontStyle: 'italic',
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row-reverse',
    backgroundColor: THEME.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabItemActive: {
    backgroundColor: THEME.background,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: THEME.textSecondary,
  },
  tabLabelActive: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
});

export default MobileApp;