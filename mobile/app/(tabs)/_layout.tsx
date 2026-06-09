/**
 * Tab Layout — Bottom Tab Navigation for Mawaeedak Mobile
 * 
 * Luxury design matching Mawaeedak identity:
 * - RTL order: الرئيسية, الرواتب, الخدمات, التقويم, المزيد
 * - Active: capsule with cream background + gold icon + gold text + gold underline
 * - Inactive: no background + brown/gray icon + brown/gray text
 * - Ivory/cream background with gold border
 * - Soft shadow, large border-radius
 * - Support safe-area-bottom
 */

import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { I18nManager, useWindowDimensions } from 'react-native';

// Theme colors - Mawaeedak luxury identity
const GOLD = '#C9A063';
const BROWN = '#8A6B3D';
const INK = '#2F2B25';
const CREAM = '#FAF7F2';
const SURFACE = '#FFFFFF';
const LIGHT_CREAM = '#F5EFE4';

// Tab data with icons (text-based for simplicity)
const TABS = [
  { name: 'home', label: 'الرئيسية', icon: '🏠' },
  { name: 'salary', label: 'الرواتب', icon: '💰' },
  { name: 'services', label: 'الخدمات', icon: '🏢' },
  { name: 'calendar', label: 'التقويم', icon: '📅' },
  { name: 'more', label: 'المزيد', icon: '☰' },
];

// Tab item component
function TabItem({ label, icon, isActive, onPress }: { label: string; icon: string; isActive: boolean; onPress: () => void }) {
  return (
    <Pressable 
      onPress={onPress} 
      style={[styles.tabItem, isActive && styles.tabItemActive]}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={isActive ? { selected: true } : undefined}
    >
      <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
        <Text style={[styles.icon, isActive && styles.iconActive]}>{icon}</Text>
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
      {isActive && <View style={styles.underline} />}
    </Pressable>
  );
}

// Custom tab bar
function CustomTabBar({ state, descriptors, navigation }: any) {
  const { width } = useWindowDimensions();
  const tabBarWidth = Math.min(width - 32, 400);
  
  return (
    <View style={styles.tabBarContainer}>
      <View style={[styles.tabBar, { width: tabBarWidth }]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tab = TABS[index];
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          
          return (
            <TabItem
              key={route.key}
              label={tab?.label || route.name}
              icon={tab?.icon || '●'}
              isActive={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20, // safe-area-bottom
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: CREAM,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(201,160,99,0.25)',
    shadowColor: '#8A6B3D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  tabItemActive: {
    backgroundColor: LIGHT_CREAM,
  },
  iconContainer: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconContainerActive: {
    // Active icon styling if needed
  },
  icon: {
    fontSize: 20,
    color: BROWN,
  },
  iconActive: {
    color: GOLD,
  },
  label: {
    fontSize: 10,
    color: BROWN,
    fontWeight: '500',
    marginTop: 2,
  },
  labelActive: {
    color: GOLD,
    fontWeight: '600',
  },
  underline: {
    width: 16,
    height: 2,
    backgroundColor: GOLD,
    borderRadius: 1,
    marginTop: 4,
  },
});