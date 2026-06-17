const express = require('express');
const router = express.Router();
const scheduler = require('./scheduler.service');

// Get next salary date
router.get('/next-salary', (req, res) => {
  try {
    const { type, dayOfMonth, adjustment, hijri } = req.query;
    
    const result = scheduler.getNextSalaryDate({
      type: type || 'government',
      dayOfMonth: parseInt(dayOfMonth) || 27,
      adjustment: adjustment || 'previous',
      hijri: hijri === 'true'
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get upcoming salaries
router.get('/upcoming-salaries', (req, res) => {
  try {
    const { count, type, dayOfMonth, adjustment, hijri } = req.query;
    
    const result = scheduler.getUpcomingSalaries(
      parseInt(count) || 6,
      {
        type: type || 'government',
        dayOfMonth: parseInt(dayOfMonth) || 27,
        adjustment: adjustment || 'previous',
        hijri: hijri === 'true'
      }
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get next support date
router.get('/next-support', (req, res) => {
  try {
    const { type } = req.query;
    
    const result = scheduler.getNextSupportDate(type || 'citizen_account');
    
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all upcoming supports
router.get('/upcoming-supports', (req, res) => {
  try {
    const result = scheduler.getUpcomingSupports();
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get available support types
router.get('/support-types', (req, res) => {
  const types = Object.entries(scheduler.SUPPORT_SCHEDULES).map(([key, value]) => ({
    type: key,
    name: value.name,
    description: value.description,
    frequency: value.frequency
  }));
  
  res.json({
    success: true,
    data: types
  });
});

// Combined dashboard data
router.get('/dashboard', (req, res) => {
  try {
    const { city } = req.query;
    
    // Get next salary
    const nextSalary = scheduler.getNextSalaryDate({
      type: 'government',
      dayOfMonth: 27,
      adjustment: 'previous'
    });
    
    // Get upcoming supports
    const upcomingSupports = scheduler.getUpcomingSupports();
    const nextSupport = upcomingSupports[0] || null;
    
    res.json({
      success: true,
      data: {
        nextSalary: nextSalary,
        nextSupport: nextSupport,
        upcomingSupports: upcomingSupports.slice(0, 5),
        today: new Date().toISOString().split('T')[0]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
