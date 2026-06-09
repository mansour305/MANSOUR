/**
 * Daily Card Screen — Share your daily card
 * 
 * Premium design matching web DailyCardPreview exactly:
 * - Ivory gradient background with gold accents
 * - Background pattern with daily-card.png
 * - Golden corner decorations
 * - All cards with ivory/white with gold borders
 * - Next prayer highlighted with gold background
 * - RTL aligned
 */

import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Share, Image, useWindowDimensions } from 'react-native';
import { I18nManager } from 'react-native';

// Theme colors - exact match with web
const GOLD = '#C9A063';
const BROWN = '#8A6B3D';
const INK = '#2F2B25';
const CREAM = '#FAF7F2';
const SURFACE = '#FFFFFF';
const LIGHT_GOLD = 'rgba(201,160,99,0.12)';
const BORDER_GOLD = 'rgba(201,160,99,0.25)';

// Saudi-based daily messages pool
const DAILY_MESSAGES = [
  "يبدأ يومك بنية طيبة، وتوكّل على الله في كل خطوة.",
  "حافظ على صلاتك في وقتها، فهي نور لك في الدنيا والآخرة.",
  "ابدأ يومك بالصلاة ثم الذهاب إلى عملك بنشاط.",
  "الورد والصباح الجميل يبدأان من القلب.",
  "لا تؤجل عمل اليوم إلى الغد، فكل يوم له فرصته.",
  "أحسن الظن بالله، وافعل ما بوسعك، وتوكّل على الله.",
  "مهما كانت التحديات، ثق أن الفرج قريب.",
  "اجعل لك هدفاً كل يوم، وحققه قبل منتصف النهار.",
  "التفاؤل يغير الحياة، فابدأ يومك بابتسامة.",
  "ذكر الله نعمة، فاحمده على نعمائه.",
  "العمل عبادة، فأتقن ما بيدك.",
  "لا تستعجل النتائج، فالأجور تأتي.",
  "كن باراً بوالديك، فالدعاء مستجاب.",
  "التوازن بين العمل والعبادة مفتاح السعادة.",
  "كل يوم جديد هو فرصة جديدة للتغيير.",
  "الصلاة على النبي حياة للقلب.",
  "العمل الصالح لا يضيع أبداً.",
  "توكل على الله في كل أمر، فهو خير معين.",
  "ازرع خيراً حيثما حللت، تحصد خيراً حيثما كنت.",
  "ابدأ يومك بالصلاة، واختم يومك بالاستغفار.",
  "الفرج قريب، فلا تيأس.",
  "ابدأ بالتوكل على الله تنجح.",
  "أحسن إلى الناس تستعبد قلوبهم.",
];

const PRAYER_ORDER = [
  { key: 'fajr', label: 'الفجر' },
  { key: 'sunrise', label: 'الشروق' },
  { key: 'dhuhr', label: 'الظهر' },
  { key: 'asr', label: 'العصر' },
  { key: 'maghrib', label: 'المغرب' },
  { key: 'isha', label: 'العشاء' },
];

const FINANCIAL_EVENTS = [
  { name: 'الراتب', days: 12, icon: '💰' },
  { name: 'حساب المواطن', days: 5, icon: '👤' },
  { name: 'الدعم السكني', days: 18, icon: '🏠' },
];

function getTodayMessage(): string {
  const saudiDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Riyadh' });
  const today = new Date(saudiDate);
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length];
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'م' : 'ص';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function getHijriDate(): string {
  const options: Intl.DateTimeFormatOptions = { calendar: 'islamic', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date().toLocaleDateString('ar-SA', options);
}

function getGregorianDate(): string {
  const options: Intl.DateTimeFormatOptions = { calendar: 'gregory', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date().toLocaleDateString('ar-SA', options);
}

function getDayName(): string {
  return new Date().toLocaleDateString('ar-SA', { weekday: 'long' });
}

const PRAYER_TIMES: Record<string, string> = {
  fajr: '04:30',
  sunrise: '05:45',
  dhuhr: '11:45',
  asr: '15:15',
  maghrib: '18:30',
  isha: '20:00',
};

function getNextPrayer() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  for (const prayer of PRAYER_ORDER) {
    if (prayer.key === 'sunrise') continue;
    const [h, m] = PRAYER_TIMES[prayer.key].split(':').map(Number);
    if (h * 60 + m > currentMinutes) {
      return { ...prayer, time: PRAYER_TIMES[prayer.key] };
    }
  }
  return { ...PRAYER_ORDER[0], time: PRAYER_TIMES.fajr };
}

export default function DailyCardScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 32, 380);
  
  const message = useMemo(() => getTodayMessage(), []);
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'صباح الخير' : 'مساء الخير';
  }, []);
  const nextPrayer = useMemo(() => getNextPrayer(), []);

  const handleCopy = async () => {
    const text = `✦ مواعيدك ✦

${getDayName()}
${getHijriDate()} هـ
${getGregorianDate()} م

${greeting}
${message}

واذكروا الله ذكراً كثيراً

━━━━━━━━━━━━━━
مواعيدك — منصة تجمع وقتك، راتبك، دعمك، وأهم مواعيدك`;

    try {
      // @ts-ignore
      await navigator?.clipboard?.writeText(text);
      Alert.alert('تم', 'تم نسخ البطاقة بنجاح');
    } catch {
      Alert.alert('خطأ', 'فشل نسخ البطاقة');
    }
  };

  const handleShare = async () => {
    const text = `✦ مواعيدك ✦

${getDayName()}
${getHijriDate()} هـ
${getGregorianDate()} م

${greeting}
${message}

واذكروا الله ذكراً كثيراً

━━━━━━━━━━━━━━
مواعيدك`;

    try {
      await Share.share({
        message: text,
        title: 'بطاقة يومية - مواعيدك',
      });
    } catch {
      // User cancelled
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>البطاقة اليومية</Text>
      </View>

      {/* Main Card - exact match with web */}
      <View style={[styles.card, { width: cardWidth }]}>
        {/* Background pattern */}
        <Image 
          source={require('@/src/daily-card.png')}
          style={styles.backgroundPattern}
          resizeMode="cover"
        />
        
        {/* Golden corner decorations */}
        <View style={[styles.cornerTopLeft, styles.cornerDecoration]} />
        <View style={[styles.cornerBottomRight, styles.cornerDecoration]} />
        
        {/* Lantern top-left */}
        <View style={styles.lantern}>
          <Text style={styles.lanternText}>🏮</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* 1. Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✦ بطاقة يومية ✦</Text>
          </View>

          {/* 2. Logo */}
          <View style={styles.logoSection}>
            <Text style={styles.logoIcon}>✦</Text>
            <Text style={styles.logoTitle}>مواعيدك</Text>
            <Text style={styles.logoSubtitle}>كل مواعيدك.. في مكان واحد</Text>
            <View style={styles.divider} />
          </View>

          {/* 3. Message Banner with background image */}
          <View style={styles.messageBanner}>
            <Image 
              source={require('@/src/daily-card.png')}
              style={styles.bannerBackground}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <Text style={styles.quoteIcon}>❝</Text>
              <Text style={styles.messageGreeting}>{greeting}</Text>
              <Text style={styles.messageText}>{message}</Text>
              <Text style={styles.messageReminder}>واذكروا الله ذكراً كثيراً</Text>
            </View>
          </View>

          {/* 4. Date Card */}
          <View style={styles.dateCard}>
            <Text style={styles.iconText}>📅</Text>
            <Text style={styles.dateDay}>{getDayName()}</Text>
            <Text style={styles.dateText}>{getHijriDate()} هـ</Text>
            <Text style={styles.dateText}>{getGregorianDate()} م</Text>
          </View>

          {/* 5. Prayer Times Card */}
          <View style={styles.prayerCard}>
            <View style={styles.prayerHeader}>
              <Text style={styles.iconText}>🕌</Text>
              <Text style={styles.prayerTitle}>مواقيت الصلاة</Text>
            </View>
            
            <View style={styles.prayerGrid}>
              {PRAYER_ORDER.filter(p => p.key !== 'sunrise').map((prayer) => {
                const isNext = nextPrayer.key === prayer.key;
                return (
                  <View
                    key={prayer.key}
                    style={[
                      styles.prayerItem,
                      isNext && styles.prayerItemActive,
                    ]}
                  >
                    <View style={[styles.prayerDot, isNext && styles.prayerDotActive]} />
                    <Text style={[styles.prayerLabel, isNext && styles.prayerLabelActive]}>
                      {prayer.label}
                    </Text>
                    <Text style={[styles.prayerTime, isNext && styles.prayerTimeActive]}>
                      {formatTime(PRAYER_TIMES[prayer.key])}
                    </Text>
                  </View>
                );
              })}
            </View>
            
            {nextPrayer && (
              <View style={styles.nextPrayerBanner}>
                <Text style={styles.nextPrayerText}>
                  الصلاة القادمة: {nextPrayer.label} — {formatTime(nextPrayer.time)}
                </Text>
              </View>
            )}
          </View>

          {/* 6. Countdown Card */}
          <View style={styles.countdownCard}>
            <View style={styles.countdownHeader}>
              <Text style={styles.iconText}>⏰</Text>
              <Text style={styles.countdownTitle}>كم باقي على</Text>
            </View>
            
            <View style={styles.countdownGrid}>
              {FINANCIAL_EVENTS.map((event, index) => (
                <View key={index} style={styles.countdownItem}>
                  <Text style={styles.countdownIcon}>{event.icon}</Text>
                  <Text style={styles.countdownEventName}>{event.name}</Text>
                  <Text style={styles.countdownDays}>{event.days}</Text>
                  <Text style={styles.countdownLabel}>يوم</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 7. Footer Signature */}
          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerLogo}>✦ مواعيدك ✦</Text>
            <Text style={styles.footerTagline}>منصة تجمع وقتك، راتبك، دعمك، وأهم مواعيدك</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={handleCopy}>
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionText}>نسخ النص</Text>
        </Pressable>
        
        <Pressable style={[styles.actionButton, styles.actionButtonSecondary]} onPress={handleShare}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionTextSecondary}>مشاركة</Text>
        </Pressable>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: INK,
    textAlign: 'center',
  },
  
  // Main Card - exact match with web design
  card: {
    alignSelf: 'center',
    backgroundColor: SURFACE,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER_GOLD,
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.18,
    shadowRadius: 70,
    elevation: 15,
  },
  
  // Background pattern
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.08,
  },
  
  // Corner decorations
  cornerDecoration: {
    position: 'absolute',
    width: 80,
    height: 80,
    opacity: 0.1,
  },
  cornerTopLeft: {
    top: -40,
    left: -40,
    backgroundColor: GOLD,
    borderRadius: 40,
  },
  cornerBottomRight: {
    bottom: -40,
    right: -40,
    backgroundColor: GOLD,
    borderRadius: 40,
  },
  
  // Lantern
  lantern: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  lanternText: {
    fontSize: 28,
    opacity: 0.7,
  },
  
  // Content
  content: {
    padding: 20,
  },
  
  // Badge
  badge: {
    alignSelf: 'center',
    backgroundColor: LIGHT_GOLD,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_GOLD,
    marginBottom: 16,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: BROWN,
    letterSpacing: 1,
  },
  
  // Logo
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 28,
    color: GOLD,
    marginBottom: 4,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: 13,
    color: BROWN,
    marginTop: 4,
  },
  divider: {
    width: 100,
    height: 1.5,
    backgroundColor: GOLD,
    marginTop: 12,
    opacity: 0.5,
  },
  
  // Message Banner
  messageBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_GOLD,
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  bannerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,253,249,0.95)',
  },
  bannerContent: {
    padding: 16,
    alignItems: 'center',
  },
  quoteIcon: {
    fontSize: 28,
    color: GOLD,
  },
  messageGreeting: {
    fontSize: 15,
    fontWeight: 'bold',
    color: BROWN,
    marginTop: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 13,
    color: INK,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
  },
  messageReminder: {
    fontSize: 11,
    color: GOLD,
    fontWeight: '600',
  },
  iconText: {
    fontSize: 20,
    textAlign: 'center',
  },
  
  // Date Card
  dateCard: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_GOLD,
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: '800',
    color: BROWN,
    marginTop: 8,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: INK,
    marginBottom: 2,
  },
  
  // Prayer Card
  prayerCard: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_GOLD,
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 8,
  },
  prayerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BROWN,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  prayerItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 6,
    borderRadius: 12,
  },
  prayerItemActive: {
    backgroundColor: 'rgba(201,160,99,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(201,160,99,0.4)',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  prayerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: LIGHT_GOLD,
    marginBottom: 6,
  },
  prayerDotActive: {
    backgroundColor: GOLD,
  },
  prayerLabel: {
    fontSize: 11,
    color: INK,
    opacity: 0.7,
    marginBottom: 4,
  },
  prayerLabelActive: {
    color: BROWN,
    opacity: 1,
    fontWeight: '600',
  },
  prayerTime: {
    fontSize: 12,
    fontWeight: '600',
    color: BROWN,
  },
  prayerTimeActive: {
    color: GOLD,
    fontWeight: 'bold',
  },
  nextPrayerBanner: {
    backgroundColor: LIGHT_GOLD,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  nextPrayerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: GOLD,
  },
  
  // Countdown Card
  countdownCard: {
    backgroundColor: LIGHT_GOLD,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_GOLD,
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 8,
  },
  countdownTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: BROWN,
  },
  countdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  countdownItem: {
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 90,
    borderWidth: 1,
    borderColor: 'rgba(201,160,99,0.2)',
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  countdownIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  countdownEventName: {
    fontSize: 11,
    color: INK,
    marginBottom: 4,
  },
  countdownDays: {
    fontSize: 26,
    fontWeight: '800',
    color: GOLD,
  },
  countdownLabel: {
    fontSize: 10,
    color: INK,
    opacity: 0.6,
    marginTop: 2,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerDivider: {
    width: '100%',
    height: 1.5,
    backgroundColor: 'rgba(201,160,99,0.4)',
    marginBottom: 12,
  },
  footerLogo: {
    fontSize: 16,
    fontWeight: '800',
    color: GOLD,
    letterSpacing: 1,
  },
  footerTagline: {
    fontSize: 10,
    color: INK,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Actions
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: GOLD,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  actionButtonSecondary: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: 'rgba(201,160,99,0.3)',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  actionTextSecondary: {
    fontSize: 15,
    fontWeight: 'bold',
    color: INK,
  },
  
  bottomSpacing: {
    height: 100,
  },
});