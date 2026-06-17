/**
 * Mawaeedak Theme Tokens - Islamic Design System
 * متوافق مع الصورة المرجعية
 */

// ============================================
// الألوان الأساسية - مطابقة للصورة المرجعية
// ============================================

// ألوان التمييز الرئيسية
export const GOLD = '#C9A063';
export const GOLD_LIGHT = '#D4B07A';
export const GOLD_DARK = '#A78042';
export const GOLD_PALE = '#F3E8D6';
export const GOLD_SHIMMER = 'linear-gradient(135deg, #C9A063, #D4B07A, #C9A063)';

// لون النص الأساسي
export const BROWN = '#8A6B3D';
export const BROWN_LIGHT = '#A88B5A';
export const BROWN_DARK = '#6B5230';

// لون الحبر للنصوص
export const INK = '#2F2B25';
export const INK_LIGHT = '#5D554A';
export const INK_MUTED = '#8A8175';

// ============================================
// الخلفيات
// ============================================

// خلفية كريمية دافئة - مطابقة للصورة
export const PAPER = '#FAF7F2';
export const PAPER_LIGHT = '#FFFCF7';
export const PAPER_WARM = '#FFF8EE';
export const PAPER_GRADIENT = 'linear-gradient(145deg, #FFFCF7 0%, #FFF8EE 100%)';

// خلفية كريمية ثانوية
export const CREAM = '#F5EFE4';
export const CREAM_LIGHT = '#FAF6ED';
export const CREAM_DARK = '#EBE3D5';

// خلفية بيضاء
export const SURFACE = '#FFFFFF';
export const SURFACE_TINTED = 'rgba(255,255,255,0.72)';

// ============================================
// ألوان النصوص
// ============================================

export const TEXT_PRIMARY = '#2F2B25';
export const TEXT_SECONDARY = '#6F6557';
export const TEXT_MUTED = '#8A8175';
export const TEXT_ON_GOLD = '#FFFFFF';

// ============================================
// الألوان الدلالية
// ============================================

export const ERROR = '#B9483F';
export const ERROR_LIGHT = '#E8B5B0';
export const SUCCESS = '#7A9A74';
export const SUCCESS_LIGHT = '#D4E8D1';
export const INFO = '#4A7FB5';
export const INFO_LIGHT = '#C5DBF0';
export const WARNING = '#D4A03A';

// ============================================
// الحدود
// ============================================

export const BORDER_GOLD = 'rgba(201,160,99,0.16)';
export const BORDER_GOLD_MEDIUM = 'rgba(201,160,99,0.24)';
export const BORDER_GOLD_STRONG = 'rgba(201,160,99,0.30)';
export const BORDER_SUBTLE = 'rgba(201,160,99,0.12)';

// ============================================
// الظلال - أنماط إسلامية
// ============================================

export const SHADOWS = {
  sm: '0 2px 8px rgba(138,107,61,0.08)',
  md: '0 4px 12px rgba(138,107,61,0.12)',
  lg: '0 8px 24px rgba(138,107,61,0.16)',
  xl: '0 12px 36px rgba(138,107,61,0.18)',
  gold: '0 6px 20px rgba(167,128,66,0.30)',
  card: '0 12px 30px rgba(138,107,61,0.10)',
  elevated: '0 18px 45px rgba(138,107,61,0.18)',
};

// ============================================
// المسافات
// ============================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ============================================
// الزوايا المستديرة
// ============================================

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  card: 26,
  button: 18,
  pill: 9999,
};

// ============================================
// الخطوط
// ============================================

export const FONT = {
  family: {
    arabic: "'Cairo', 'Noto Sans Arabic', system-ui, sans-serif",
    fallback: "system-ui, -apple-system, sans-serif",
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 21,
    xxl: 28,
    xxxl: 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

// ============================================
// الحركات
// ============================================

export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// ============================================
// زخارف إسلامية (SVG patterns)
// ============================================

export const ISLAMIC_PATTERNS = {
  // نمط هندسي إسلامي بسيط
  geometric: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A063' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  
  // نمط الأقواس الإسلامية
  arch: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A063' stroke-opacity='0.08' stroke-width='1'%3E%3Cpath d='M0 80 L40 0 L80 80'/%3E%3Cpath d='M10 80 L40 20 L70 80'/%3E%3Cpath d='M20 80 L40 40 L60 80'/%3E%3C/g%3E%3C/svg%3E")`,
  
  // نمط النجوم
  star: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A063' fill-opacity='0.06'%3E%3Cpath d='M10 10 .155 0 0 10.67 0 26h10.67z'/%3E%3Cpath d='M24 6.2 18.155 0 0 13.4 0 26h16.26z'/%3E%3Cpath d='M52 6.2 46.155 0 28 13.4 28 26h16.26z'/%3E%3Cpath d='M38 6.2 32.155 0 14 13.4 14 26h16.26z'/%3E%3Cpath d='M52 0L36 0l-9 10.4 9 15.6h16z'/%3E%3Cpath d='M36 0L20 0l-9 10.4 9 15.6h16z'/%3E%3Cpath d='M20 0L4 0l-9 10.4 9 15.6h16z'/%3E%3Cpath d='M4 0L0 0l9 10.4-9 15.6h8z'/%3E%3Cpath d='M20 0l-4 0 9 10.4-9 15.6h8z'/%3E%3Cpath d='M36 0l-4 0 9 10.4-9 15.6h8z'/%3E%3Cpath d='M52 0l-4 0 9 10.4-9 15.6h8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

// ============================================
// التصدير الكامل للثيم
// ============================================

export const theme = {
  colors: {
    // Primary
    primary: GOLD,
    primaryLight: GOLD_LIGHT,
    primaryDark: GOLD_DARK,
    primaryPale: GOLD_PALE,
    
    // Secondary
    secondary: BROWN,
    secondaryLight: BROWN_LIGHT,
    secondaryDark: BROWN_DARK,
    
    // Ink
    ink: INK,
    inkLight: INK_LIGHT,
    inkMuted: INK_MUTED,
    
    // Backgrounds
    background: PAPER,
    backgroundLight: PAPER_LIGHT,
    backgroundWarm: PAPER_WARM,
    cream: CREAM,
    creamLight: CREAM_LIGHT,
    surface: SURFACE,
    surfaceTinted: SURFACE_TINTED,
    
    // Text
    text: TEXT_PRIMARY,
    textSecondary: TEXT_SECONDARY,
    textMuted: TEXT_MUTED,
    textOnGold: TEXT_ON_GOLD,
    
    // Semantic
    error: ERROR,
    errorLight: ERROR_LIGHT,
    success: SUCCESS,
    successLight: SUCCESS_LIGHT,
    info: INFO,
    infoLight: INFO_LIGHT,
    warning: WARNING,
    
    // Borders
    border: BORDER_GOLD,
    borderMedium: BORDER_GOLD_MEDIUM,
    borderStrong: BORDER_GOLD_STRONG,
    borderSubtle: BORDER_SUBTLE,
    
    // Gradients
    gradient: {
      gold: GOLD_SHIMMER,
      paper: PAPER_GRADIENT,
      card: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
    },
  },
  
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  font: FONT,
  animation: ANIMATION,
  patterns: ISLAMIC_PATTERNS,
};

export default theme;
