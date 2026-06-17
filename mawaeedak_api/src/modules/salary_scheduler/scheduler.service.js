/**
 * Salary & Support Scheduler Service
 * Handles salary and support payment schedule calculations
 */

const WEEKEND_DAYS = [5, 6]; // Friday = 5, Saturday = 6 (ISO standard)

/**
 * Get the next salary date based on rules
 */
function getNextSalaryDate(options = {}) {
  const {
    type = 'government',
    dayOfMonth = 27,
    adjustment = 'previous',
    hijri = false
  } = options;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  let targetDate;
  let targetMonth = currentMonth;
  let targetYear = currentYear;
  
  if (hijri) {
    targetDate = calculateHijriApprox(dayOfMonth, targetMonth, targetYear);
  } else {
    targetDate = new Date(targetYear, targetMonth, dayOfMonth);
  }
  
  if (targetDate <= today) {
    targetMonth++;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear++;
    }
    if (hijri) {
      targetDate = calculateHijriApprox(dayOfMonth, targetMonth, targetYear);
    } else {
      targetDate = new Date(targetYear, targetMonth, dayOfMonth);
    }
  }
  
  const adjustedDate = adjustForWeekend(targetDate, adjustment);
  const daysRemaining = Math.ceil((adjustedDate - today) / (1000 * 60 * 60 * 24));
  
  return {
    originalDate: targetDate.toISOString().split('T')[0],
    paymentDate: adjustedDate.toISOString().split('T')[0],
    paymentDateFormatted: formatDate(adjustedDate),
    hijriDate: hijri ? getApproximateHijriDate(adjustedDate) : null,
    daysRemaining: daysRemaining,
    isWeekendAdjusted: adjustedDate.getTime() !== targetDate.getTime(),
    adjustment: adjustment,
    type: type
  };
}

function getApproximateHijriDate(gregorianDate) {
  const startOfHijri = new Date(622, 6, 19);
  const daysDiff = Math.floor((gregorianDate - startOfHijri) / (1000 * 60 * 60 * 24));
  const hijriDays = Math.floor(daysDiff / 0.970224);
  const hijriYear = Math.floor(hijriDays / 354.36667) + 1;
  const daysInYear = hijriDays % 354;
  const hijriMonth = Math.floor(daysInYear / 29.5);
  const hijriDay = Math.floor(daysInYear % 29.5) + 1;
  return `${hijriDay}/${hijriMonth + 1}/${hijriYear}`;
}

function calculateHijriApprox(day, month, year) {
  return new Date(year, month, day);
}

function adjustForWeekend(date, adjustment = 'previous') {
  const dayOfWeek = date.getDay();
  const adjusted = new Date(date);
  
  if (WEEKEND_DAYS.includes(dayOfWeek)) {
    if (adjustment === 'previous') {
      adjusted.setDate(adjusted.getDate() - (dayOfWeek === 6 ? 2 : 1));
    } else {
      adjusted.setDate(adjusted.getDate() + (dayOfWeek === 5 ? 2 : 1));
    }
  }
  
  return adjusted;
}

function formatDate(date) {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return `${days[date.getDay()]}، ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getUpcomingSalaries(count = 6, options = {}) {
  const salaries = [];
  const today = new Date();
  let currentDate = new Date(today);
  
  for (let i = 0; i < count; i++) {
    const salary = getNextSalaryDate({ ...options });
    salaries.push({
      ...salary,
      month: currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return salaries.filter(s => s.daysRemaining > 0).slice(0, count);
}

const SUPPORT_SCHEDULES = {
  'housing': { name: 'الدعم السكني', description: 'دعم وزارة الإسكان', typicalDay: 15, adjustment: 'previous', frequency: 'quarterly' },
  'citizen_account': { name: 'حساب المواطن', description: 'دعم حساب المواطن الشهري', typicalDay: 10, adjustment: 'next', frequency: 'monthly' },
  'utility': { name: 'دعم المرافق', description: 'دعم فواتير الكهرباء والمياه', typicalDay: 5, adjustment: 'next', frequency: 'monthly' },
  'social': { name: 'الدعم الاجتماعي', description: 'دعم برامج الحماية الاجتماعية', typicalDay: 20, adjustment: 'previous', frequency: 'monthly' }
};

function getNextSupportDate(supportType = 'citizen_account') {
  const schedule = SUPPORT_SCHEDULES[supportType];
  if (!schedule) {
    return { success: false, error: 'نوع الدعم غير معروف' };
  }
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  let targetDate = new Date(currentYear, currentMonth, schedule.typicalDay);
  
  if (targetDate <= today) {
    targetDate.setMonth(targetDate.getMonth() + 1);
  }
  
  const adjustedDate = adjustForWeekend(targetDate, schedule.adjustment);
  const daysRemaining = Math.ceil((adjustedDate - today) / (1000 * 60 * 60 * 24));
  
  return {
    success: true,
    data: {
      type: supportType,
      name: schedule.name,
      description: schedule.description,
      originalDate: targetDate.toISOString().split('T')[0],
      paymentDate: adjustedDate.toISOString().split('T')[0],
      paymentDateFormatted: formatDate(adjustedDate),
      daysRemaining: daysRemaining,
      frequency: schedule.frequency,
      status: daysRemaining <= 3 ? 'upcoming' : 'scheduled'
    }
  };
}

function getUpcomingSupports() {
  const supports = [];
  for (const type of Object.keys(SUPPORT_SCHEDULES)) {
    const result = getNextSupportDate(type);
    if (result.success) {
      supports.push(result.data);
    }
  }
  supports.sort((a, b) => a.daysRemaining - b.daysRemaining);
  return supports;
}

module.exports = {
  getNextSalaryDate,
  getUpcomingSalaries,
  getNextSupportDate,
  getUpcomingSupports,
  SUPPORT_SCHEDULES,
  adjustForWeekend,
  formatDate
};
