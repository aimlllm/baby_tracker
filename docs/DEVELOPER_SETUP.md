# Developer Setup & Deployment Guide

## 📋 Overview

This guide provides step-by-step instructions for setting up developer accounts, development environment, and deployment processes for the Baby Tracker application across all platforms.

---

## 🍎 Apple Developer Account Setup

### Step 1: Create Apple Developer Account

#### Individual Developer Account
1. **Visit**: [developer.apple.com](https://developer.apple.com)
2. **Sign in** with your Apple ID or create a new one
3. **Click** "Enroll" in the Apple Developer Program
4. **Choose** "Individual" enrollment
5. **Cost**: $99 USD per year
6. **Verification**: Provide legal name, address, phone number
7. **Payment**: Add credit card for annual fee
8. **Wait**: 24-48 hours for account approval

#### Organization Account (Recommended for Business)
1. **Requirements**:
   - D-U-N-S Number (free from Dun & Bradstreet)
   - Legal entity status (LLC, Corporation, etc.)
   - Authority to sign legal agreements
2. **Process**: Follow same steps but choose "Organization"
3. **Additional Verification**: May take 1-2 weeks

### Step 2: Configure Development Environment

#### Install Xcode
```bash
# Install from Mac App Store (free)
# Or download from developer.apple.com
xcode-select --install
```

#### Configure Xcode with Developer Account
1. Open Xcode
2. Go to **Xcode → Preferences → Accounts**
3. Click **+** and sign in with Apple Developer account
4. **Verify** your team appears in the list

#### Create App Identifier
1. **Visit**: [developer.apple.com/account](https://developer.apple.com/account)
2. **Navigate** to Certificates, Identifiers & Profiles
3. **Click** Identifiers → App IDs
4. **Register** new App ID:
   ```
   Description: Baby Tracker
   Bundle ID: com.yourcompany.babytracker
   Capabilities: 
   ✓ App Groups (for sharing data)
   ✓ Associated Domains (for universal links)
   ✓ Push Notifications
   ✓ Camera (for photo capture)
   ✓ Photo Library (for image selection)
   ```

### Step 3: Configure Push Notifications

#### Create APNs Certificate
1. **Go to** Certificates section in Apple Developer
2. **Click** + to create new certificate
3. **Choose** Apple Push Notification service SSL
4. **Select** your App ID
5. **Upload** Certificate Signing Request (CSR):
   ```bash
   # Generate CSR using Keychain Access
   # Applications → Utilities → Keychain Access
   # Keychain Access → Certificate Assistant → Request Certificate from CA
   ```
6. **Download** and install certificate

#### Configure Expo for Push Notifications
```bash
# Generate push notification key
npx expo credentials:manager
# Follow prompts to configure push notifications
```

### Step 4: Create Provisioning Profiles

#### Development Profile
1. **Go to** Profiles section
2. **Create** new profile
3. **Choose** iOS App Development
4. **Select** your App ID
5. **Choose** development certificates
6. **Select** test devices (if any)
7. **Download** and install

#### Distribution Profile (for App Store)
1. **Create** new profile
2. **Choose** App Store Distribution
3. **Select** your App ID
4. **Choose** distribution certificate
5. **Download** for later use

---

## 🤖 Android Developer Account Setup

### Step 1: Create Google Play Developer Account

#### Account Registration
1. **Visit**: [play.google.com/console](https://play.google.com/console)
2. **Sign in** with Google account
3. **Click** "Create Developer Account"
4. **Choose** account type:
   - **Personal**: Individual developer
   - **Organization**: Business entity
5. **Cost**: $25 USD one-time registration fee
6. **Verification**: 
   - Phone number verification
   - Identity verification (government ID)
   - Address verification

#### Complete Profile
1. **Developer Details**:
   ```
   Developer Name: Your Name/Company
   Email: support@yourcompany.com
   Phone: +1-xxx-xxx-xxxx
   Address: Complete business address
   ```
2. **Payment Profile**: Set up for app sales (if applicable)
3. **Tax Information**: Complete tax forms

### Step 2: Configure Development Environment

#### Install Android Studio
1. **Download** from [developer.android.com/studio](https://developer.android.com/studio)
2. **Install** with default settings
3. **Configure** SDK:
   ```bash
   # Required SDK components:
   - Android SDK Platform 34 (latest)
   - Android SDK Build-Tools 34.0.0
   - Android Emulator
   - Android SDK Platform-Tools
   ```

#### Set Environment Variables
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

#### Create Virtual Device (Emulator)
1. **Open** Android Studio
2. **Tools → AVD Manager**
3. **Create Virtual Device**
4. **Choose** Pixel 4 with API level 34
5. **Download** system image if needed

### Step 3: Generate Signing Key

#### Create Upload Key
```bash
# Generate keystore file
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore baby-tracker-upload-key.keystore \
  -alias baby-tracker-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Secure information to save:
# Keystore password: [SECURE_PASSWORD]
# Key alias: baby-tracker-key
# Key password: [SECURE_PASSWORD]
```

#### Store Keystore Securely
```bash
# Move to secure location
mkdir -p ~/.android-keys
mv baby-tracker-upload-key.keystore ~/.android-keys/
chmod 600 ~/.android-keys/baby-tracker-upload-key.keystore
```

### Step 4: Configure Play Console

#### Create Application
1. **Go to** Play Console → All apps
2. **Click** Create app
3. **Fill details**:
   ```
   App name: Baby Tracker
   Default language: English (United States)
   App or game: App
   Free or paid: Free (initially)
   Declarations: Complete all required forms
   ```

#### Configure App Information
1. **App category**: Health & Fitness
2. **Content rating**: Request rating questionnaire
3. **Target audience**: Parents (18+)
4. **Privacy Policy**: Required URL

#### Set Up Internal Testing
1. **Go to** Testing → Internal testing
2. **Create** new release
3. **Upload** APK/AAB file
4. **Add** internal testers (email addresses)

---

## 🚀 Expo Configuration

### Step 1: Install Expo CLI and EAS CLI

```bash
# Install globally
npm install -g @expo/cli eas-cli

# Login to Expo
npx expo login
eas login
```

### Step 2: Configure app.json/app.config.js

```javascript
// app.config.js
export default {
  expo: {
    name: "Baby Tracker",
    slug: "baby-tracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.babytracker",
      buildNumber: "1",
      config: {
        usesNonExemptEncryption: false
      },
      infoPlist: {
        NSCameraUsageDescription: "This app uses camera to capture photos of handwritten notes for digitization.",
        NSPhotoLibraryUsageDescription: "This app accesses photo library to select images for processing.",
        NSLocationWhenInUseUsageDescription: "This app uses location to track where activities occurred."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.yourcompany.babytracker",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "VIBRATE",
        "RECEIVE_BOOT_COMPLETED",
        "com.google.android.c2dm.permission.RECEIVE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-camera",
      "expo-image-picker",
      "expo-location",
      "expo-notifications",
      [
        "expo-document-picker",
        {
          iCloudContainerEnvironment: "Production"
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "your-project-id"
      }
    },
    owner: "your-expo-account"
  }
};
```

### Step 3: Configure EAS Build

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": "version"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123DEFG"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "production"
      }
    }
  }
}
```

---

## 📦 Build and Deployment Process

### Web Deployment (Vercel)

#### Step 1: Prepare Web Build
```bash
cd web
pnpm build
pnpm start # Test locally
```

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd web
vercel

# Production deployment
vercel --prod
```

#### Step 3: Configure Domain
1. **Go to** Vercel Dashboard
2. **Select** your project
3. **Go to** Settings → Domains
4. **Add** custom domain: `app.babytracker.com`
5. **Configure** DNS:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

### iOS Deployment

#### Step 1: Build with EAS
```bash
# Development build (for testing)
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

#### Step 2: Test Build
```bash
# Install on simulator
npx expo install --ios

# Install on physical device (via TestFlight)
eas build --platform ios --profile preview
```

#### Step 3: Submit to App Store

##### Automatic Submission
```bash
eas submit --platform ios --latest
```

##### Manual Submission
1. **Download** .ipa file from EAS build
2. **Open** Xcode
3. **Go to** Window → Organizer
4. **Click** Distribute App
5. **Choose** App Store Connect
6. **Upload** and follow prompts

#### Step 4: App Store Connect Configuration
1. **Go to** [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. **Select** your app
3. **Complete** app information:
   ```
   App Name: Baby Tracker
   Subtitle: Track Your Baby's Daily Activities
   Category: Health & Fitness
   Keywords: baby, tracker, feeding, diaper, sleep, newborn, infant, parenting
   App Description: [Comprehensive description]
   Screenshots: Required for all device sizes
   App Review Information: Contact details and demo account
   Version Release: Manual or automatic
   ```

### Android Deployment

#### Step 1: Build AAB (Android App Bundle)
```bash
# Production build
eas build --platform android --profile production
```

#### Step 2: Upload to Play Console

##### Automatic Submission
```bash
# Configure service account key first
eas submit --platform android --latest
```

##### Manual Upload
1. **Download** .aab file from EAS build
2. **Go to** Play Console
3. **Select** app → Production
4. **Create** new release
5. **Upload** AAB file
6. **Fill** release details

#### Step 3: Play Console Configuration
1. **Store Listing**:
   ```
   App name: Baby Tracker
   Short description: Track feeding, sleep, and diaper changes
   Full description: [Detailed description]
   Graphics: Icon, feature graphic, screenshots
   Categorization: Health & Fitness
   Contact details: Email and website
   Privacy Policy: Required URL
   ```

2. **Content Rating**: Complete questionnaire
3. **App Content**: Complete declarations
4. **Pricing & Distribution**: Select countries and pricing

---

## 🔐 Security and Compliance Setup

### Environment Variables Management

#### Development Environment
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
GOOGLE_CLOUD_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...
```

#### Production Environment
1. **Vercel**: Configure in dashboard environment variables
2. **EAS**: Configure in eas.json and EAS secrets
   ```bash
   eas secret:create --name SUPABASE_URL --value https://...
   eas secret:create --name SUPABASE_ANON_KEY --value eyJ...
   ```

### SSL Certificate Configuration
1. **Vercel**: Automatic HTTPS with custom domains
2. **Mobile**: Certificate pinning (optional)
   ```javascript
   // app.config.js
   ios: {
     infoPlist: {
       NSAppTransportSecurity: {
         NSExceptionDomains: {
           "your-api-domain.com": {
             NSExceptionRequiresForwardSecrecy: false,
             NSExceptionMinimumTLSVersion: "1.0",
             NSIncludesSubdomains: true
           }
         }
       }
     }
   }
   ```

### Privacy Policy and Terms of Service

#### Required Content
1. **Data Collection**: What data is collected
2. **Data Usage**: How data is used
3. **Data Sharing**: If/how data is shared
4. **Data Storage**: Where and how data is stored
5. **User Rights**: Access, correction, deletion rights
6. **Contact Information**: How to reach privacy officer

#### Template Privacy Policy
```markdown
# Privacy Policy for Baby Tracker

## Information We Collect
- Baby profile information (name, birth date, photo)
- Activity logs (feeding, diaper, sleep data)
- Photos uploaded by users
- Usage analytics (anonymized)

## How We Use Information
- Provide app functionality
- Sync data across devices
- Generate insights and analytics
- Improve app performance

## Data Storage and Security
- Data encrypted in transit and at rest
- Stored on secure cloud infrastructure
- Regular security audits
- No data sharing with third parties without consent

## Your Rights
- Access your data
- Correct inaccuracies
- Delete your account and data
- Export your data

## Contact Us
Email: privacy@babytracker.app
Address: [Your business address]
```

---

## 🧪 Testing Strategy

### Development Testing

#### Unit Testing
```bash
# Run unit tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

#### Integration Testing
```bash
# API integration tests
pnpm test:api

# Database integration tests
pnpm test:db
```

#### E2E Testing
```bash
# Web E2E tests
pnpm test:e2e:web

# Mobile E2E tests (Detox)
pnpm test:e2e:mobile
```

### Beta Testing

#### iOS TestFlight Setup
1. **Build** with preview profile
2. **Upload** to TestFlight
3. **Add** external testers
4. **Send** invitation emails
5. **Monitor** crash reports and feedback

#### Android Internal Testing
1. **Upload** AAB to internal testing track
2. **Add** tester emails
3. **Share** testing link
4. **Collect** feedback through Play Console

### Production Monitoring

#### Error Tracking
```bash
# Install Sentry
pnpm add @sentry/nextjs @sentry/react-native

# Configure Sentry
# sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

#### Performance Monitoring
1. **Vercel Analytics**: Built-in web performance
2. **Firebase Performance**: Mobile performance monitoring
3. **Supabase Metrics**: Database performance
4. **Custom Metrics**: Business-specific KPIs

---

## 🔄 CI/CD Pipeline Setup

### GitHub Actions Configuration

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm lint
      - run: pnpm type-check

  build-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build:web
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  build-mobile:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

### Automated Deployment Triggers

#### Staging Deployment
- **Trigger**: Push to `develop` branch
- **Deploy**: Vercel preview deployment
- **Test**: Run automated E2E tests
- **Notify**: Slack/Discord notification

#### Production Deployment
- **Trigger**: Push to `main` branch
- **Deploy**: Vercel production deployment
- **Build**: EAS build for mobile apps
- **Submit**: Automatic submission to app stores (optional)
- **Monitor**: Watch for errors and rollback if needed

---

## 📊 Analytics and Monitoring Setup

### Application Performance Monitoring

#### Vercel Analytics
```javascript
// next.config.js
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  },
  analytics: {
    id: process.env.VERCEL_ANALYTICS_ID
  }
}
```

#### Custom Analytics
```typescript
// utils/analytics.ts
export const trackEvent = (eventName: string, properties: any) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Custom analytics
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: eventName, properties })
  });
};
```

### Business Metrics Dashboard

#### Key Metrics to Track
1. **User Engagement**:
   - Daily/Monthly active users
   - Session duration
   - Feature adoption rates
   - Retention curves

2. **Technical Metrics**:
   - App crashes and errors
   - API response times
   - Database query performance
   - Sync success rates

3. **Business Metrics**:
   - User acquisition cost
   - Conversion rates
   - Support ticket volume
   - App store ratings

---

## 🆘 Troubleshooting Guide

### Common iOS Issues

#### Code Signing Errors
```bash
# Clean build folder
cd ios && rm -rf build/
cd .. && npx react-native run-ios

# Reset certificates
eas credentials:manager
```

#### Simulator Issues
```bash
# Reset iOS Simulator
xcrun simctl erase all

# Reset Expo cache
expo r -c
```

### Common Android Issues

#### Build Failures
```bash
# Clean Android build
cd android && ./gradlew clean
cd .. && npx react-native run-android

# Reset Metro cache
npx react-native start --reset-cache
```

#### Keystore Issues
```bash
# Verify keystore
keytool -list -v -keystore baby-tracker-upload-key.keystore

# Generate new keystore if corrupted
keytool -genkeypair -v -storetype PKCS12 -keystore new-keystore.keystore
```

### Common Web Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules && pnpm install

# Clear Vercel cache
vercel --debug
```

#### Environment Variable Issues
1. Check variable names match exactly
2. Verify values don't contain special characters
3. Ensure NEXT_PUBLIC_ prefix for client-side variables
4. Restart development server after changes

---

## 📞 Support and Resources

### Official Documentation
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Apple Developer Documentation](https://developer.apple.com/documentation)
- [Android Developer Documentation](https://developer.android.com)
- [Supabase Documentation](https://supabase.com/docs)

### Community Resources
- [Expo Discord](https://chat.expo.dev)
- [React Native Discord](https://discord.gg/reactnative)
- [Stack Overflow](https://stackoverflow.com)
- [GitHub Issues](https://github.com/expo/expo/issues)

### Development Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com)
- [Xcode Instruments](https://developer.apple.com/xcode/features/)
- [Android Studio Profiler](https://developer.android.com/studio/profile)

### Useful Commands Cheat Sheet

```bash
# Development
pnpm dev                    # Start all development servers
pnpm dev:web               # Start web development server
pnpm dev:mobile            # Start mobile development server

# Building
pnpm build                 # Build all projects
eas build --platform ios   # Build iOS app
eas build --platform android # Build Android app

# Testing
pnpm test                  # Run unit tests
pnpm test:e2e             # Run E2E tests
pnpm lint                 # Run linting

# Deployment
vercel                     # Deploy web app
eas submit --platform ios  # Submit iOS app
eas submit --platform android # Submit Android app

# Utilities
expo doctor               # Check Expo setup
eas credentials:manager   # Manage certificates
npx react-native info    # Check RN environment
```

---

This comprehensive guide provides everything needed to set up development accounts, configure the development environment, and deploy the Baby Tracker application across all platforms. Follow each section carefully and refer to the troubleshooting guide when issues arise.
