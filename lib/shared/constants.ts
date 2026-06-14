/**
 * Mawaeedak Constants
 * Shared between Web and Mobile
 */

// Saudi Cities
export const SAUDI_CITIES = [
  { name: 'ط§ظ„ط±ظٹط§ط¶', key: 'riyadh', timezone: 'Asia/Riyadh' },
  { name: 'ط¬ط¯ط©', key: 'jeddah', timezone: 'Asia/Riyadh' },
  { name: 'ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©', key: 'mecca', timezone: 'Asia/Riyadh' },
  { name: 'ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©', key: 'medina', timezone: 'Asia/Riyadh' },
  { name: 'ط§ظ„ط¯ظ…ط§ظ…', key: 'dammam', timezone: 'Asia/Riyadh' },
  { name: 'ط§ظ„ط®ط¨ط±', key: 'khobar', timezone: 'Asia/Riyadh' },
  { name: 'ط£ط¨ظ‡ط§', key: 'abha', timezone: 'Asia/Riyadh' },
  { name: 'طھط¨ظˆظƒ', key: 'tabuk', timezone: 'Asia/Riyadh' },
  { name: 'ط§ظ„ظ‚طµظٹظ…', key: 'qassim', timezone: 'Asia/Riyadh' },
  { name: 'ط­ط§ط¦ظ„', key: 'hail', timezone: 'Asia/Riyadh' },
  { name: 'ط¬ط§ط²ط§ظ†', key: 'jazan', timezone: 'Asia/Riyadh' },
  { name: 'ظ†ط¬ط±ط§ظ†', key: 'najran', timezone: 'Asia/Riyadh' },
  { name: 'ط§ظ„ط¨ط§ط­ط©', key: 'baha', timezone: 'Asia/Riyadh' },
  { name: 'ط§ظ„ط¬ظˆظپ', key: 'jawf', timezone: 'Asia/Riyadh' },
  { name: 'ط¹ط³ظٹط±', key: 'asir', timezone: 'Asia/Riyadh' },
];

// Default City
export const DEFAULT_CITY = SAUDI_CITIES[0];

// Prayer Names (Arabic)
export const PRAYER_NAMES: Record<string, string> = {
  fajr: 'ط§ظ„ظپط¬ط±',
  sunrise: 'ط§ظ„ط´ط±ظˆظ‚',
  dhuhr: 'ط§ظ„ط¸ظ‡ط±',
  asr: 'ط§ظ„ط¹طµط±',
  maghrib: 'ط§ظ„ظ…ط؛ط±ط¨',
  isha: 'ط§ظ„ط¹ط´ط§ط،',
};

// Financial Event Types
export const FINANCIAL_TYPES = {
  salary: { label: 'ط±ط§طھط¨', icon: 'ًں’°' },
  support: { label: 'ط¯ط¹ظ…', icon: 'ًںڈ ' },
  bill: { label: 'ظپط§طھظˆط±ط©', icon: 'ًں“„' },
  investment: { label: 'ط§ط³طھط«ظ…ط§ط±', icon: 'ًں“ˆ' },
};

// Default Daily Message
export const DEFAULT_DAILY_MESSAGE = 'ط§ط¨ط¯ط£ ظٹظˆظ…ظƒ ط¨ظ†ظٹط© ط·ظٹط¨ط©طŒ ظˆطھظˆظƒظ„ ط¹ظ„ظ‰ ط§ظ„ظ„ظ‡ ظپظٹ ظƒظ„ ط®ط·ظˆط©.';

// App Info
export const APP_INFO = {
  name: 'ظ…ظˆط§ط¹ظٹط¯ظƒ',
  version: '1.0.0',
  tagline: 'ظƒظ„ ظ…ظˆط§ط¹ظٹط¯ظƒ ظپظٹ ظ…ظƒط§ظ† ظˆط§ط­ط¯',
};

// Service Centers (8 centers)
export const SERVICE_CENTERS = [
  { id: 1, name: 'ظ…ط±ظƒط² ط§ظ„ط£ط­ظˆط§ظ„ ط§ظ„ظ…ط¯ظ†ظٹط©', icon: 'ًںھھ', services: ['طھط¬ط¯ظٹط¯ ط§ظ„ظ‡ظˆظٹط©', 'طھط¹ط¯ظٹظ„ ط§ظ„ط¨ظٹط§ظ†ط§طھ'] },
  { id: 2, name: 'ظ…ط±ظƒط² ط§ظ„ط¬ظˆط§ط²ط§طھ', icon: 'ًں“‹', services: ['طھط£ط´ظٹط±ط§طھ', 'طھظ…ط¯ظٹط¯ ط¥ظ‚ط§ظ…ط©'] },
  { id: 3, name: 'ظ…ط±ظƒط² ط§ظ„ظ…ط±ظˆط±', icon: 'ًںڑ—', services: ['ط±ط®طµط© ظ‚ظٹط§ط¯ط©', 'طھط¬ط¯ظٹط¯ طھط³ط¬ظٹظ„'] },
  { id: 4, name: 'ظ…ط±ظƒط² ط§ظ„ط¨ط±ظٹط¯', icon: 'ًں“®', services: ['ط·ط±ظˆط¯', 'ط­ظˆط§ظ„ط§طھ'] },
  { id: 5, name: 'ظ…ط±ظƒط² ط§ظ„طھط£ظ…ظٹظ†ط§طھ', icon: 'ًںڈ¥', services: ['طھط£ظ…ظٹظ† طµط­ظٹ', 'طھط¹ط¯ظٹظ„ ط¨ظٹط§ظ†ط§طھ'] },
  { id: 6, name: 'ظ…ط±ظƒط² ط§ظ„ط²ظƒط§ط©', icon: 'ًں’µ', services: ['ط²ظƒط§ط©', 'طµط¯ظ‚ط§طھ'] },
  { id: 7, name: 'ظ…ط±ظƒط² ط§ظ„طھط¹ظ„ظٹظ…', icon: 'ًں“ڑ', services: ['ط³ط¬ظ„ط§طھ', 'ط´ظ‡ط§ط¯ط§طھ'] },
  { id: 8, name: 'ظ…ط±ظƒط² ط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ط¹ط§ظ…ط©', icon: 'ًںڈ¢', services: ['ط±ط®طµ', 'طھطµط§ط±ظٹط­'] },
];
