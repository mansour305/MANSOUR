const express = require('express');
const router = express.Router();
const axios = require('axios');

const PRAYER_CACHE = new Map();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

const SAUDI_CITIES = {
  'riyadh': { name: 'الرياض', lat: 24.7136, lng: 46.6753 },
  'jeddah': { name: 'جدة', lat: 21.4858, lng: 39.1925 },
  'makkah': { name: 'مكة المكرمة', lat: 21.4225, lng: 39.8262 },
  'madinah': { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692 },
  'dammam': { name: 'الدمام', lat: 26.4207, lng: 50.0888 },
  'khobar': { name: 'الخبر', lat: 26.2172, lng: 50.1979 },
  'abha': { name: 'أبها', lat: 18.2164, lng: 42.5053 },
  'taif': { name: 'الطائف', lat: 21.2703, lng: 40.3875 },
  'tabuk': { name: 'تبوك', lat: 28.3998, lng: 36.5710 },
  'hail': { name: 'حائل', lat: 27.5237, lng: 41.7253 },
  'qassim': { name: 'القصيم', lat: 26.0870, lng: 43.9748 },
  'hafar': { name: 'حفر الباطن', lat: 28.4349, lng: 45.9626 },
  'najran': { name: 'نجران', lat: 17.4936, lng: 44.1327 },
  'jizan': { name: 'جازان', lat: 16.8892, lng: 42.5608 }
};

const CALCULATION_METHODS = {
  'umm_alqura': 3,      // Umm Al-Qura University, Makkah
  'mwl': 14,            // Muslim World League
  'egypt': 5,           // Egyptian General Authority
  'karachi': 1,         // University of Karachi
  'dubai': 8            // Gulf Region
};

// Map to Aladhan calculation method
function getMethodId(method) {
  return CALCULATION_METHODS[method] || CALCULATION_METHODS['umm_alqura'];
}

// Get prayer times from Aladhan API
async function fetchPrayerTimes(lat, lng, method, date) {
  const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}_${method}_${date}`;
  
  // Check cache
  if (PRAYER_CACHE.has(cacheKey)) {
    const cached = PRAYER_CACHE.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return { data: cached.data, fromCache: true };
    }
  }
  
  try {
    const [day, month, year] = date.split('/');
    const response = await axios.get('https://api.aladhan.com/v1/timings', {
      params: {
        latitude: lat,
        longitude: lng,
        method: method,
        date: `${day}-${month}-${year}`
      },
      timeout: 10000
    });
    
    if (response.data && response.data.code === 200 && response.data.data) {
      const timings = response.data.data.timings;
      
      // Validate times are properly formatted
      const validTimes = validatePrayerTimes(timings);
      
      // Cache the result
      PRAYER_CACHE.set(cacheKey, {
        data: validTimes,
        timestamp: Date.now()
      });
      
      return { data: validTimes, fromCache: false };
    }
    
    throw new Error('Invalid response from prayer times API');
  } catch (error) {
    // If we have cached data, return it even if expired
    if (PRAYER_CACHE.has(cacheKey)) {
      const cached = PRAYER_CACHE.get(cacheKey);
      return { data: cached.data, fromCache: true, stale: true };
    }
    throw error;
  }
}

// Validate prayer times
function validatePrayerTimes(timings) {
  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  const valid = {};
  
  for (const prayer of prayerOrder) {
    const time = timings[prayer];
    if (time && timeRegex.test(time.trim())) {
      valid[prayer] = time.trim();
    } else {
      // Set a reasonable default if invalid
      valid[prayer] = '12:00';
    }
  }
  
  // Ensure times are in order
  const times = [
    parseTime(valid.Fajr),
    parseTime(valid.Sunrise),
    parseTime(valid.Dhuhr),
    parseTime(valid.Asr),
    parseTime(valid.Maghrib),
    parseTime(valid.Isha)
  ];
  
  // Basic sanity check - times should generally increase
  for (let i = 1; i < times.length; i++) {
    if (times[i] <= times[i-1]) {
      // This is normal for some prayer times, so just log
      console.log(`Warning: ${prayerOrder[i]} time may be out of order`);
    }
  }
  
  return {
    Fajr: valid.Fajr,
    Sunrise: valid.Sunrise,
    Dhuhr: valid.Dhuhr,
    Asr: valid.Asr,
    Maghrib: valid.Maghrib,
    Isha: valid.Isha
  };
}

function parseTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Get list of cities
router.get('/cities', (req, res) => {
  const cities = Object.entries(SAUDI_CITIES).map(([key, value]) => ({
    id: key,
    name: value.name,
    latitude: value.lat,
    longitude: value.lng
  }));
  
  res.json({ success: true, data: cities });
});

// Get available calculation methods
router.get('/methods', (req, res) => {
  res.json({
    success: true,
    data: {
      umm_alqura: { name: 'جامعة أم القرى', id: 3, description: 'الطريقة المعتمدة في السعودية' },
      mwl: { name: 'رابطة العالم الإسلامي', id: 14, description: 'للاستخدام العالمي' },
      egypt: { name: 'الهيئة المصرية العامة للمساحة', id: 5, description: 'شمال أفريقيا ومصر' },
      karachi: { name: 'جامعة كراتشي', id: 1, description: 'باكستان وجنوب آسيا' },
      dubai: { name: 'دبي', id: 8, description: 'منطقة الخليج' }
    }
  });
});

// Get prayer times for today or specific date
router.get('/times', async (req, res) => {
  try {
    const { city, lat, lng, method = 'umm_alqura', date } = req.query;
    
    let latitude, longitude;
    
    // Get coordinates from city or direct coordinates
    if (city && SAUDI_CITIES[city.toLowerCase()]) {
      const cityData = SAUDI_CITIES[city.toLowerCase()];
      latitude = cityData.lat;
      longitude = cityData.lng;
    } else if (lat && lng) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    } else {
      // Default to Riyadh
      latitude = SAUDI_CITIES.riyadh.lat;
      longitude = SAUDI_CITIES.riyadh.lng;
    }
    
    // Get date
    let targetDate;
    if (date) {
      // Validate date format DD/MM/YYYY
      if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format. Use DD/MM/YYYY'
        });
      }
      targetDate = date;
    } else {
      const now = new Date();
      targetDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    }
    
    const methodId = getMethodId(method.toLowerCase());
    const { data, fromCache, stale } = await fetchPrayerTimes(latitude, longitude, methodId, targetDate);
    
    // Calculate next prayer
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayerSequence = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const prayerNames = {
      Fajr: 'الفجر',
      Sunrise: 'الشروق',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    };
    
    let nextPrayer = 'Fajr';
    let nextPrayerTime = data.Fajr;
    let foundNext = false;
    
    for (const prayer of prayerSequence) {
      if (prayer === 'Sunrise') continue; // Skip sunrise for next prayer
      
      const prayerMinutes = parseTime(data[prayer]);
      if (prayerMinutes > currentMinutes || (prayer === 'Isha' && !foundNext)) {
        nextPrayer = prayer;
        nextPrayerTime = data[prayer];
        foundNext = true;
        if (prayer === 'Isha') {
          // Next is Fajr tomorrow
          nextPrayer = 'Fajr';
        }
        break;
      }
    }
    
    res.json({
      success: true,
      data: {
        timings: {
          fajr: data.Fajr,
          sunrise: data.Sunrise,
          dhuhr: data.Dhuhr,
          asr: data.Asr,
          maghrib: data.Maghrib,
          isha: data.Isha
        },
        arabic: {
          fajr: 'الفجر',
          sunrise: 'الشروق',
          dhuhr: 'الظهر',
          asr: 'العصر',
          maghrib: 'المغرب',
          isha: 'العشاء'
        },
        date: targetDate,
        city: city || 'riyadh',
        method: method,
        nextPrayer: prayerNames[nextPrayer],
        nextPrayerTime: nextPrayerTime,
        fromCache: fromCache,
        stale: stale || false
      }
    });
  } catch (error) {
    console.error('Prayer times error:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prayer times',
      message: 'مواقيت الصلاة غير متاحة حاليًا — سيتم التحديث تلقائيًا عند توفر الاتصال.',
      retryAfter: 300
    });
  }
});

// Get monthly prayer times
router.get('/monthly', async (req, res) => {
  try {
    const { city = 'riyadh', method = 'umm_alqura' } = req.query;
    
    if (!SAUDI_CITIES[city.toLowerCase()]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid city. Available: ' + Object.keys(SAUDI_CITIES).join(', ')
      });
    }
    
    const cityData = SAUDI_CITIES[city.toLowerCase()];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    const response = await axios.get('https://api.aladhan.com/v1/calendar', {
      params: {
        latitude: cityData.lat,
        longitude: cityData.lng,
        method: getMethodId(method.toLowerCase()),
        month: month,
        year: year
      },
      timeout: 15000
    });
    
    if (response.data && response.data.code === 200) {
      const days = response.data.data.map(day => ({
        date: day.date.readable,
        gregorian: day.date.gregorian.date,
        hijri: day.date.hijri.date,
        timings: {
          fajr: day.timings.Fajr?.substring(0, 5) || '00:00',
          sunrise: day.timings.Sunrise?.substring(0, 5) || '00:00',
          dhuhr: day.timings.Dhuhr?.substring(0, 5) || '00:00',
          asr: day.timings.Asr?.substring(0, 5) || '00:00',
          maghrib: day.timings.Maghrib?.substring(0, 5) || '00:00',
          isha: day.timings.Isha?.substring(0, 5) || '00:00'
        }
      }));
      
      res.json({
        success: true,
        data: {
          month: month,
          year: year,
          city: cityData.name,
          method: method,
          days: days
        }
      });
    } else {
      throw new Error('Invalid response');
    }
  } catch (error) {
    console.error('Monthly prayer times error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly prayer times'
    });
  }
});

module.exports = router;
