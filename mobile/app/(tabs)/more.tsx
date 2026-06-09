/**
 * More Screen — Daily Card & Story Today
 * 
 * Features:
 * - ستوري اليوم (Story Today)
 * - بطاقة اليوم (Daily Card)
 * - Both with premium card design matching web
 */

import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { I18nManager } from 'react-native';
import { useRouter } from 'expo-router';

// Theme colors - exact match with web
const GOLD = '#C9A063';
const BROWN = '#8A6B3D';
const INK = '#2F2B25';
const CREAM = '#FAF7F2';
const SURFACE = '#FFFFFF';
const LIGHT_GOLD = 'rgba(201,160,99,0.12)';
const BORDER_GOLD = 'rgba(201,160,99,0.25)';

export default function MoreScreen() {
  const router = useRouter();

  const handleCardPress = (screen: string) => {
    router.replace('/daily-card' as any);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المزيد</Text>
      </View>

      {/* Card 1: ستوري اليوم */}
      <Pressable style={styles.card} onPress={() => handleCardPress('story')}>
        <View style={styles.cardIconContainer}>
          <Text style={styles.cardIcon}>📱</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>ستوري اليوم</Text>
          <Text style={styles.cardSubtitle}>شارك لحظاتك اليومية</Text>
        </View>
        <Text style={styles.cardArrow}>›</Text>
      </Pressable>

      {/* Card 2: بطاقة اليوم */}
      <Pressable style={styles.card} onPress={() => handleCardPress('daily-card')}>
        <View style={styles.cardIconContainer}>
          <Text style={styles.cardIcon}>🎴</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>البطاقة اليومية</Text>
          <Text style={styles.cardSubtitle}>شارك يومك مع الآخرين</Text>
        </View>
        <Text style={styles.cardArrow}>›</Text>
      </Pressable>

      {/* Branding */}
      <View style={styles.branding}>
        <Text style={styles.brandingLogo}>✦ مواعيدك ✦</Text>
        <Text style={styles.brandingTagline}>بسم الله توكلت</Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 120,
    backgroundColor: CREAM,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: INK,
  },

  // Premium Cards - matching web design
  card: {
    backgroundColor: SURFACE,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_GOLD,
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: LIGHT_GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
    paddingBottom: 120,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: INK,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: BROWN,
  },
  cardArrow: {
    fontSize: 28,
    color: GOLD,
    fontWeight: '300',
  },

  // Branding
  branding: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  brandingLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GOLD,
    marginBottom: 8,
  },
  brandingTagline: {
    fontSize: 14,
    color: BROWN,
    fontStyle: 'italic',
  },

  bottomSpacing: {
    height: 100,
  },
});