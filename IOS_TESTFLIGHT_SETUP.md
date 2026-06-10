# iOS TestFlight Setup Guide

## ⚠️ Important Notice

**Building iOS apps requires macOS with Xcode.** The current environment is Linux and cannot run macOS-specific commands like `flutter build ipa` or `xcodebuild`.

This document provides step-by-step instructions for building and uploading to TestFlight.

---

## Prerequisites

### 1. macOS Machine with Xcode
- macOS 12.0 or later
- Xcode 14.0 or later
- Apple Developer Account ($99/year)

### 2. App Store Connect Access
- App Store Connect API Key (recommended)
- OR manual signing certificates

---

## Step 1: Local macOS Build

On your macOS machine:

```bash
# Clone the repository
git clone https://github.com/DANGERMANS/mawaeedak.git
cd mawaeedak/flutter_app

# Install Flutter dependencies
flutter pub get

# Configure iOS signing (one-time setup)
flutter doctor
flutter doctor --android-licenses  # If needed

# Open iOS workspace
open ios/Runner.xcworkspace

# In Xcode:
# 1. Select Runner → Signing & Capabilities
# 2. Select your Apple Developer Team
# 3. Bundle Identifier: com.mawaeedak.app
# 4. Version: 1.0.0, Build: 1
# 5. Build → Archive → Distribute to App Store
```

---

## Step 2: Create App Store Connect API Key

### Option A: API Key (Recommended)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **Users and Access** → **Keys**
3. Click **App Store Connect API** → **+**
4. Select **App Manager** role
5. Download the `.p8` private key file

### Option B: Manual Signing

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Create **Certificates** (iOS Distribution)
3. Create **Provisioning Profile** (App Store Connect)
4. Download and install on your Mac

---

## Step 3: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add new secrets:

```
APPSTORE_API_KEY_ISSUER_ID    = Your issuer ID (from App Store Connect)
APPSTORE_API_KEY_KEY_ID        = Your key ID
APPSTORE_API_KEY_PRIVATE_KEY  = Base64 encoded .p8 file
```

To encode your API key:
```bash
base64 -i api_key.p8 -o encoded_key.txt
```

---

## Step 4: Trigger GitHub Action

After adding secrets, trigger the workflow:

1. Go to **Actions** tab in GitHub
2. Select **iOS TestFlight Release**
3. Click **Run workflow**
4. Optionally add tester email (e.g., mansour@example.com)

---

## Step 5: Add Testers

### Adding Mansour as Tester:

1. Wait for build processing (~5-15 minutes)
2. Go to [App Store Connect](https://appstoreconnect.apple.com)
3. Navigate to **My Apps** → **مواعيدك**
4. Go to **TestFlight** tab
5. Click **External Testing** or **Internal Testing**
6. Add tester:
   - Email: mansour@example.com (or actual email)
   - First Name: منصور
   - Last Name: (enter last name)

### Alternative: Direct TestFlight Link

After upload, share the TestFlight public link:
```
https://testflight.apple.com/join/YOUR_BETA_CODE
```

---

## Current Build Status

| Component | Status |
|-----------|--------|
| Flutter App | ✅ Ready (v1.0.0) |
| iOS Project | ✅ Configured |
| Info.plist | ✅ Updated |
| GitHub Workflow | ✅ Created |

### Pending:
| Item | Status |
|------|--------|
| macOS Build | ⚠️ Requires macOS |
| Apple Developer Account | ⚠️ Not configured |
| TestFlight Upload | ⚠️ Requires credentials |

---

## Troubleshooting

### "No such file or directory" errors
- Ensure you're on macOS
- Ensure Xcode command line tools are installed: `xcode-select --install`

### Signing errors
- Check Apple Developer account is active
- Verify bundle identifier matches App Store Connect
- Ensure provisioning profile is valid

### Upload errors
- Verify API key has correct permissions
- Check API key is not expired
- Ensure build number is unique

---

## Quick Start Checklist

- [ ] macOS machine available
- [ ] Apple Developer Account ($99/year)
- [ ] Xcode installed
- [ ] App Store Connect API Key created
- [ ] GitHub secrets configured
- [ ] GitHub workflow triggered
- [ ] Build uploaded to TestFlight
- [ ] TestFlight processing complete
- [ ] Mansour invited as tester
- [ ] TestFlight link shared

---

## Support

For issues with iOS build:
1. Check [Flutter iOS documentation](https://docs.flutter.dev/deployment/ios)
2. Check [Apple Developer documentation](https://developer.apple.com/documentation)
3. Contact support@mawaeedak.com