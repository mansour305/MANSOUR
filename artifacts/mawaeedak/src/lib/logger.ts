/**
 * Logger Service â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 *
 * ط®ط¯ظ…ط© طھط³ط¬ظٹظ„ ظ…ط±ظƒط²ظٹط© ظٹظ…ظƒظ† طھط¹ط·ظٹظ„ظ‡ط§ ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬
 * ظٹظ…ظ†ط¹ ظƒط´ظپ ط§ظ„ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„ط­ط³ط§ط³ط© ظپظٹ Console
 */

const isProduction = import.meta.env.PROD || import.meta.env.NODE_ENV === "production";

export const logger = {
  error: (message: string, ...data: unknown[]) => {
    if (!isProduction) {
      console.error(`[ظ…ظˆط§ط¹ظٹط¯ظƒ] ${message}`, ...data);
    }
    // In production: log to error tracking service if available
  },
  
  warn: (message: string, ...data: unknown[]) => {
    if (!isProduction) {
      console.warn(`[ظ…ظˆط§ط¹ظٹط¯ظƒ] ${message}`, ...data);
    }
  },
  
  info: (message: string, ...data: unknown[]) => {
    if (!isProduction) {
      console.info(`[ظ…ظˆط§ط¹ظٹط¯ظƒ] ${message}`, ...data);
    }
  },
  
  debug: (message: string, ...data: unknown[]) => {
    if (!isProduction) {
      console.debug(`[ظ…ظˆط§ط¹ظٹط¯ظƒ] ${message}`, ...data);
    }
  },
};

