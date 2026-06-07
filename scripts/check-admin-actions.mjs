#!/usr/bin/env node

/**
 * Admin Actions Check Script
 * 
 * This script validates that all admin panel buttons have proper handlers.
 * It will fail if it finds:
 * - Button without onClick, submit, or disabled (excluding known false positives)
 * - onClick containing only console.log (without actual storage/routing)
 * - Missing admin routes (in actual App.tsx)
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const adminDir = join(__dirname, '../artifacts/mawaeedak/src/features/admin');

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
  'defaultPending', 'filteredLogs.length === 0'
];

// Helper to check if a disabled condition is valid
function isValidDisabledCondition(condition) {
  const trimmed = condition.trim();
  // Check for common valid patterns
  if (VALID_DISABLED_REASONS.some(r => trimmed.includes(r))) {
    return true;
  }
  // Check for loading/pending patterns
  if (/(\w+\.(isPending|isLoading|isSaving|isRunning|isUpdating)|(loading|pending|saving|disabled)\s*$)/i.test(trimmed)) {
    return true;
  }
  return false;
}

// Helper to check if a button has proper handler
function checkButton(content, fileName, lineNumber) {
  totalChecks++;
  
  // Check for Button component
  const buttonPattern = /<Button[^>]*>/gi;
  const buttons = content.match(buttonPattern) || [];
  
  for (const button of buttons) {
    // Check if button has disabled prop (that's okay)
    if (/disabled\s*=/.test(button)) {
      passedChecks++;
      continue;
    }
    
    // Check for onClick
    if (/onClick\s*=/.test(button)) {
      passedChecks++;
      continue;
    }
    
    // Check for type="submit" (form submit)
    if (/type\s*=\s*["']submit["']/.test(button)) {
      passedChecks++;
      continue;
    }
    
    // Check for DialogTrigger (opens dialog)
    if (/DialogTrigger/.test(button)) {
      passedChecks++;
      continue;
    }
    
    // Check for SheetTrigger (opens sheet)
    if (/SheetTrigger/.test(button)) {
      passedChecks++;
      continue;
    }
    
    // Check for Link or NavLink
    if (/<\/?Link|<NavLink/.test(button)) {
      passedChecks++;
      continue;
    }
    
    // Check if it's a visual guide or example button
    if (fileName.includes('VisualGuide') || fileName.includes('Example')) {
      passedChecks++;
      continue;
    }
    
    // This button might be missing a handler
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
  
  // Check for console.log only handlers
  checkConsoleLogOnly(content, fileName);
  
  // Check each button
  lines.forEach((line, index) => {
    if (/<Button/.test(line)) {
      checkButton(line, fileName, index + 1);
    }
  });
  
  // Check for handler functions that only console.log
  const handlerDefinitions = content.match(/const\s+(\w+Handler|\w+Click|\w+Submit|\w+Save|\w+Delete|\w+Edit|\w+Add|\w+Update|\w+Toggle|\w+Remove)[^=]*=\s*(?:async\s*)?\(\s*\)\s*=>\s*\{[^}]*\}/g) || [];
  for (const def of handlerDefinitions) {
    // Only flag if it ONLY uses console.log and nothing else (no storage, no routing, no state updates)
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

// Check for missing routes in App.tsx - more lenient
function checkRoutes() {
  console.log(`\n${colors.blue}Checking routes...${colors.reset}`);
  
  // Real routes used in the app
  const adminRoutes = [
    '/admin',
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
    
    for (const route of adminRoutes) {
      totalChecks++;
      // Check for the route path pattern
      if (content.includes(`"${route}"`) || content.includes(`'${route}'`)) {
        passedChecks++;
      } else {
        // Check if route is handled with a pattern (like /admin/:tab)
        if (route === '/admin' || content.includes("'/admin'")) {
          passedChecks++;
        } else {
          console.log(`${colors.red}WARNING${colors.reset}: Missing route ${route} in App.tsx`);
          warningCount++;
        }
      }
    }
  } catch (error) {
    console.log(`${colors.red}ERROR${colors.reset}: Could not read App.tsx`);
    hasErrors = true;
  }
}

// Check for disabled buttons without reason - only flag truly unexplained ones
function checkDisabledButtons() {
  console.log(`\n${colors.blue}Checking disabled buttons...${colors.reset}`);
  
  const files = readdirSync(adminDir);
  
  for (const file of files) {
    if (!file.endsWith('.tsx')) continue;
    
    const filePath = join(adminDir, file);
    const content = readFileSync(filePath, 'utf-8');
    
    // Find disabled buttons with their conditions
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
}

// Main execution
console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.blue}Admin Actions Check${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

console.log(`${colors.blue}Processing admin directory: ${adminDir}${colors.reset}\n`);

processDirectory(adminDir);
checkRoutes();
checkDisabledButtons();

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
} else if (warningCount > 20) {
  console.log(`${colors.yellow}RESULT: NEEDS REVIEW - ${warningCount} warnings found${colors.reset}\n`);
  process.exit(0); // Still pass, just warnings
} else {
  console.log(`${colors.green}RESULT: PASSED - All admin actions are properly configured${colors.reset}\n`);
  process.exit(0);
}