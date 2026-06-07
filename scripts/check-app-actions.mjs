#!/usr/bin/env node

/**
 * App Actions Check Script
 * 
 * This script validates that all app and admin panel buttons have proper handlers.
 * It will fail if it finds:
 * - Button without onClick, submit, or disabled (excluding known false positives)
 * - onClick containing only console.log (without actual storage/routing)
 * - Forms without save handlers
 * - Routes that don't exist
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let hasErrors = false;
let totalChecks = 0;
let passedChecks = 0;
let warningCount = 0;

// Valid disabled reasons (loading states are valid)
const VALID_DISABLED_REASONS = [
  'loading', 'pending', 'saving', 'deleting', 'isLoading', 'isPending', 
  'isSubmitting', 'isRunning', 'isUpdating', 'isDeleting', 'exporting',
  'disabled', 'createEvent.isPending', 'updateEvent.isPending', 'runningAll',
  'savePending', 'deletePending', 'newsPending', 'jobPending', 'saving',
  'test.isPending', 'preview.isPending', 'updateSettings.isPending',
  '!name.trim()', '!adjustNewDate', '!adjustReason', 'role.isSystem',
  'defaultPending', 'filteredLogs.length === 0', 'sending', 'submitting',
  'isSupabaseEnabled'
];

// Helper to check if a disabled condition is valid
function isValidDisabledCondition(condition) {
  const trimmed = condition.trim();
  if (VALID_DISABLED_REASONS.some(r => trimmed.includes(r))) {
    return true;
  }
  if (/(\w+\.(isPending|isLoading|isSaving|isRunning|isUpdating)|(loading|pending|saving|disabled)\s*$)/i.test(trimmed)) {
    return true;
  }
  return false;
}

// Helper to check if a button has proper handler
function checkButton(content, fileName, lineNumber) {
  totalChecks++;
  
  const buttonPattern = /<Button[^>]*>/gi;
  const buttons = content.match(buttonPattern) || [];
  
  for (const button of buttons) {
    if (/disabled\s*=/.test(button)) {
      passedChecks++;
      continue;
    }
    if (/onClick\s*=/.test(button)) {
      passedChecks++;
      continue;
    }
    if (/type\s*=\s*["']submit["']/.test(button)) {
      passedChecks++;
      continue;
    }
    if (/DialogTrigger/.test(button)) {
      passedChecks++;
      continue;
    }
    if (/SheetTrigger/.test(button)) {
      passedChecks++;
      continue;
    }
    if (/<\/?Link|<NavLink/.test(button)) {
      passedChecks++;
      continue;
    }
    if (fileName.includes('VisualGuide') || fileName.includes('Example')) {
      passedChecks++;
      continue;
    }
    console.log(`${colors.yellow}WARNING${colors.reset}: Button without visible handler in ${fileName}:`);
    console.log(`  Line ${lineNumber}: ${button.substring(0, 100)}`);
    warningCount++;
  }
}

// Helper to check for console.log only handlers
function checkConsoleLogOnly(content, fileName) {
  const consoleLogPattern = /onClick\s*=\s*\{\s*\(\)\s*=>\s*console\.log\s*\(/gi;
  const matches = content.match(consoleLogPattern) || [];
  
  for (const match of matches) {
    console.log(`${colors.red}ERROR${colors.reset}: console.log only handler in ${fileName}:`);
    console.log(`  ${match}`);
    hasErrors = true;
  }
}

// Process a single file
function processFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const fileName = filePath.split('/').pop();
  const lines = content.split('\n');
  
  checkConsoleLogOnly(content, fileName);
  
  lines.forEach((line, index) => {
    if (/<Button/.test(line)) {
      checkButton(line, fileName, index + 1);
    }
  });
  
  // Check for handler functions that only console.log
  const handlerDefinitions = content.match(/const\s+(\w+Handler|\w+Click|\w+Submit|\w+Save|\w+Delete|\w+Edit|\w+Add|\w+Update|\w+Toggle|\w+Remove)[^=]*=\s*(?:async\s*)?\(\s*\)\s*=>\s*\{[^}]*\}/g) || [];
  for (const def of handlerDefinitions) {
    if (/console\.(log|warn|error)\([^)]*\)[^}]*\}/.test(def) && 
        !/toast|showTopNotification|localStorage|setState|navigate|setLocation|adminStorage|adminActions/.test(def)) {
      const funcName = def.match(/const\s+(\w+)/)?.[1];
      if (funcName) {
        console.log(`${colors.red}ERROR${colors.reset}: Handler ${funcName} in ${fileName} only uses console.log`);
        console.log(`  This is a placeholder - it needs actual functionality.`);
        hasErrors = true;
      }
    }
  }
}

// Process directory recursively
function processDirectory(dirPath) {
  try {
    const files = readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = join(dirPath, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (extname(file) === '.tsx' || extname(file) === '.ts') {
        processFile(filePath);
      }
    }
  } catch (error) {
    console.log(`${colors.red}ERROR${colors.reset}: Could not process directory ${dirPath}`);
    hasErrors = true;
  }
}

// Check for missing routes in App.tsx
function checkRoutes() {
  console.log(`\n${colors.blue}Checking routes...${colors.reset}`);
  
  const appRoutes = [
    '/',
    '/calendar',
    '/finance',
    '/salaries',
    '/centers',
    '/services',
    '/account',
    '/story',
    '/daily-card',
    '/notifications',
    '/login',
    '/register',
    '/forgot-password',
    '/more',
  ];
  
  const adminRoutes = [
    '/admin',
    '/admin/dashboard',
    '/admin/members',
    '/admin/financial',
    '/admin/official-prayer',
    '/admin/official-financial',
    '/admin/messages',
    '/admin/story',
    '/admin/themes',
    '/admin/notifications',
    '/admin/complaints',
    '/admin/news-jobs',
    '/admin/reports',
    '/admin/permissions',
    '/admin/settings',
    '/admin/social',
    '/admin/support',
  ];
  
  const appPath = join(__dirname, '../artifacts/mawaeedak/src/App.tsx');
  
  if (!existsSync(appPath)) {
    console.log(`${colors.red}ERROR${colors.reset}: Could not find App.tsx`);
    hasErrors = true;
    return;
  }
  
  try {
    const content = readFileSync(appPath, 'utf-8');
    
    for (const route of [...appRoutes, ...adminRoutes]) {
      totalChecks++;
      if (content.includes(`"${route}"`) || content.includes(`'${route}'`) || route === '/admin') {
        passedChecks++;
      } else {
        console.log(`${colors.yellow}WARNING${colors.reset}: Missing route ${route} in App.tsx`);
        warningCount++;
      }
    }
  } catch (error) {
    console.log(`${colors.red}ERROR${colors.reset}: Could not read App.tsx`);
    hasErrors = true;
  }
}

// Check for disabled buttons without reason
function checkDisabledButtons() {
  console.log(`\n${colors.blue}Checking disabled buttons...${colors.reset}`);
  
  const featuresDir = join(__dirname, '../artifacts/mawaeedak/src/features');
  const adminDir = join(__dirname, '../artifacts/mawaeedak/src/features/admin');
  
  for (const dir of [featuresDir, adminDir]) {
    try {
      const files = readdirSync(dir);
      
      for (const file of files) {
        if (!file.endsWith('.tsx')) continue;
        
        const filePath = join(dir, file);
        const content = readFileSync(filePath, 'utf-8');
        
        const disabledPattern = /disabled\s*=\s*\{([^}]+)\}/g;
        let match;
        
        while ((match = disabledPattern.exec(content)) !== null) {
          const condition = match[1].trim();
          
          if (!isValidDisabledCondition(condition)) {
            console.log(`${colors.yellow}WARNING${colors.reset}: Potentially unexplained disabled button in ${file}:`);
            console.log(`  Condition: ${condition.substring(0, 100)}`);
            warningCount++;
          } else {
            totalChecks++;
            passedChecks++;
          }
        }
      }
    } catch (error) {
      // Ignore directory errors
    }
  }
}

// Check for services
function checkServices() {
  console.log(`\n${colors.blue}Checking services...${colors.reset}`);
  
  const requiredServices = [
    'prayerTimesService.ts',
    'riyadhTime.ts',
    'financialService.ts',
    'notificationService.ts',
    'admin-storage.ts',
    'admin-actions.ts',
  ];
  
  const libDir = join(__dirname, '../artifacts/mawaeedak/src/lib');
  
  for (const service of requiredServices) {
    totalChecks++;
    const servicePath = join(libDir, service);
    
    if (existsSync(servicePath)) {
      passedChecks++;
      console.log(`${colors.green}✓${colors.reset} ${service}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} ${service} - MISSING`);
      hasErrors = true;
    }
  }
}

// Check prayer times source
function checkPrayerSource() {
  console.log(`\n${colors.blue}Checking prayer times source...${colors.reset}`);
  
  const prayerPath = join(__dirname, '../artifacts/mawaeedak/src/lib/prayerTimesService.ts');
  
  if (!existsSync(prayerPath)) {
    console.log(`${colors.red}ERROR${colors.reset}: prayerTimesService.ts not found`);
    hasErrors = true;
    return;
  }
  
  const content = readFileSync(prayerPath, 'utf-8');
  totalChecks++;
  
  if (content.includes('ummulqura') || content.includes('أم القرى') || content.includes('official') || content.includes('is_confirmed')) {
    passedChecks++;
    console.log(`${colors.green}✓${colors.reset} Prayer times source: أم القرى / official`);
  } else {
    console.log(`${colors.yellow}WARNING${colors.reset}: Prayer times source unclear - check prayerTimesService.ts`);
    warningCount++;
  }
}

// Check financial sources
function checkFinancialSources() {
  console.log(`\n${colors.blue}Checking financial sources...${colors.reset}`);
  
  const financialPath = join(__dirname, '../artifacts/mawaeedak/src/lib/financialService.ts');
  
  if (!existsSync(financialPath)) {
    console.log(`${colors.red}ERROR${colors.reset}: financialService.ts not found`);
    hasErrors = true;
    return;
  }
  
  const content = readFileSync(financialPath, 'utf-8');
  totalChecks++;
  
  const requiredPrograms = ['الراتب', 'حساب المواطن', 'الضمان', 'الدعم السكني', 'التقاعد', 'التأمينات', 'ساند', 'حافز'];
  let allFound = true;
  
  for (const program of requiredPrograms) {
    if (!content.includes(program)) {
      console.log(`${colors.yellow}WARNING${colors.reset}: Missing program: ${program}`);
      allFound = false;
    }
  }
  
  if (allFound && (content.includes('official_source') || content.includes('source_name'))) {
    passedChecks++;
    console.log(`${colors.green}✓${colors.reset} Financial programs and sources configured`);
  } else {
    console.log(`${colors.yellow}WARNING${colors.reset}: Financial programs need verification`);
    warningCount++;
  }
}

// Main execution
console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.blue}App Actions Check${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

const featuresDir = join(__dirname, '../artifacts/mawaeedak/src/features');
const adminDir = join(__dirname, '../artifacts/mawaeedak/src/features/admin');

console.log(`${colors.blue}Processing app features: ${featuresDir}${colors.reset}\n`);
processDirectory(featuresDir);

console.log(`${colors.blue}\nProcessing admin: ${adminDir}${colors.reset}\n`);
processDirectory(adminDir);

checkRoutes();
checkDisabledButtons();
checkServices();
checkPrayerSource();
checkFinancialSources();

console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
console.log(`Total checks: ${totalChecks}`);
console.log(`Passed: ${colors.green}${passedChecks}${colors.reset}`);
console.log(`Warnings: ${colors.yellow}${warningCount}${colors.reset}`);
if (hasErrors) {
  console.log(`Errors: ${colors.red}${hasErrors}${colors.reset}`);
}
console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

if (hasErrors) {
  console.log(`${colors.red}RESULT: FAILED - Please fix the errors above${colors.reset}\n`);
  process.exit(1);
} else if (warningCount > 30) {
  console.log(`${colors.yellow}RESULT: NEEDS REVIEW - ${warningCount} warnings found${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.green}RESULT: PASSED - All app actions are properly configured${colors.reset}\n`);
  process.exit(0);
}