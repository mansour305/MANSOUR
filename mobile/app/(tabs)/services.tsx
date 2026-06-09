/**
 * Services Screen — Service Centers and Quick Links
 * 
 * Features:
 * - 8 Service centers grid
 * - Quick links section
 * - Service categories
 */

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { I18nManager } from 'react-native';

// Theme colors
const THEME = {
  primary: '#C9A063',
  secondary: '#8A6B3D',
  background: '#FAF7F2',
  surface: '#FFFFFF',
  text: '#2F2B25',
  textSecondary: '#6F6557',
  border: '#DCD7CF',
  error: '#B45A4D',
  success: '#7A9A74',
};

// Service centers data
const SERVICE_CENTERS = [
  { id: 1, name: 'الأحوال المدنية', icon: '🪪', color: '#4A90A4' },
  { id: 2, name: 'الجوازات', icon: '✈️', color: '#7B68A6' },
  { id: 3, name: 'مكتب العمل', icon: '💼', color: '#5D8A5D' },
  { id: 4, name: 'التأمينات الاجتماعية', icon: '🏛️', color: '#A67C52' },
  { id: 5, name: 'المرور', icon: '🚗', color: '#C75B5B' },
  { id: 6, name: 'العدل', icon: '⚖️', color: '#6B8E9B' },
  { id: 7, name: 'الضرائب والزكاة', icon: '📊', color: '#8B7355' },
  { id: 8, name: 'البيئة والمياه', icon: '💧', color: '#5B8C85' },
];

// Quick links data
const QUICK_LINKS = [
  { id: 1, title: 'الأخبار', icon: '📰', description: 'آخر الأخبار المحلية', color: '#4A90A4' },
  { id: 2, title: 'الوظائف', icon: '💼', description: 'فرص عمل جديدة', color: '#5D8A5D' },
  { id: 3, title: 'التهاني', icon: '🎉', description: 'شارك المناسبات', color: '#A67C52' },
  { id: 4, title: 'الشكاوى', icon: '📝', description: 'قدم شكوى', color: '#C75B5B' },
];

// Categories
const CATEGORIES = [
  { id: 1, name: 'حكومي', icon: '🏛️' },
  { id: 2, name: 'خاص', icon: '🏢' },
  { id: 3, name: 'صحة', icon: '🏥' },
  { id: 4, name: 'تعليم', icon: '🎓' },
];

export default function ServicesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الخدمات</Text>
        <Text style={styles.headerSubtitle}>مراكز الخدمات الحكومية والخاصة</Text>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>التصنيفات</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((category) => (
            <Pressable key={category.id} style={styles.categoryChip}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Service Centers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>مراكز الخدمات</Text>
          <Pressable>
            <Text style={styles.seeAll}>عرض الكل</Text>
          </Pressable>
        </View>
        
        <View style={styles.servicesGrid}>
          {SERVICE_CENTERS.map((center) => (
            <Pressable key={center.id} style={styles.serviceCard}>
              <View style={[styles.serviceIconContainer, { backgroundColor: center.color + '20' }]}>
                <Text style={styles.serviceIcon}>{center.icon}</Text>
              </View>
              <Text style={styles.serviceName}>{center.name}</Text>
              <Text style={styles.serviceArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>روابط سريعة</Text>
        <View style={styles.quickLinks}>
          {QUICK_LINKS.map((link) => (
            <Pressable key={link.id} style={styles.quickLinkCard}>
              <View style={[styles.quickLinkIcon, { backgroundColor: link.color + '20' }]}>
                <Text style={styles.quickLinkIconText}>{link.icon}</Text>
              </View>
              <View style={styles.quickLinkContent}>
                <Text style={styles.quickLinkTitle}>{link.title}</Text>
                <Text style={styles.quickLinkDescription}>{link.description}</Text>
              </View>
              <Text style={styles.quickLinkArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Contact Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تواصل معنا</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📞</Text>
            <View>
              <Text style={styles.contactLabel}>اتصل بنا</Text>
              <Text style={styles.contactValue}>920012345</Text>
            </View>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>💬</Text>
            <View>
              <Text style={styles.contactLabel}>واتساب</Text>
              <Text style={styles.contactValue}>+966501234567</Text>
            </View>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>✉️</Text>
            <View>
              <Text style={styles.contactLabel}>البريد الإلكتروني</Text>
              <Text style={styles.contactValue}>support@mawaeedak.sa</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer spacing */}
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 120,
    backgroundColor: THEME.background,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '600',
  },

  // Categories
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  categoryIcon: {
    fontSize: 16,
    marginLeft: 6,
  },
  categoryName: {
    fontSize: 14,
    color: THEME.text,
    fontWeight: '500',
  },

  // Service Centers Grid
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  serviceCard: {
    width: '50%',
    padding: 4,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceIcon: {
    fontSize: 28,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
    textAlign: 'center',
  },
  serviceArrow: {
    fontSize: 18,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // Quick Links
  quickLinks: {
    gap: 8,
  },
  quickLinkCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  quickLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  quickLinkIconText: {
    fontSize: 24,
  },
  quickLinkContent: {
    flex: 1,
    paddingBottom: 120,
  },
  quickLinkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 2,
  },
  quickLinkDescription: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  quickLinkArrow: {
    fontSize: 24,
    color: THEME.textSecondary,
  },

  // Contact Card
  contactCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  contactIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text,
  },

  footer: {
    height: 100,
  },
});