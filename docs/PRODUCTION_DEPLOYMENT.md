# Production Deployment Guide

## 📋 Overview

This guide covers the complete production deployment process for the Baby Tracker application, including automated CI/CD pipelines, environment configuration, monitoring setup, and post-deployment procedures.

---

## 🚀 Pre-Deployment Checklist

### Code Quality Requirements
- [ ] All unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] No critical security vulnerabilities
- [ ] Performance benchmarks met
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility tested

### Configuration Requirements  
- [ ] Environment variables configured
- [ ] API keys and secrets secured
- [ ] SSL certificates valid
- [ ] Database migrations ready
- [ ] CDN configuration complete
- [ ] Monitoring tools configured
- [ ] Error tracking enabled
- [ ] Backup strategy implemented

### Legal & Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance verified
- [ ] App store guidelines compliance
- [ ] Content rating obtained
- [ ] Age-appropriate design verified

---

## 🌐 Web Application Deployment (Vercel)

### Step 1: Production Environment Setup

#### Environment Configuration
```bash
# Production environment variables (Vercel Dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GOOGLE_CLOUD_API_KEY=AIza...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://app.babytracker.com
NEXT_PUBLIC_SENTRY_DSN=https://...
NODE_ENV=production
```

#### Build Configuration
```javascript
// next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-project.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ],
  redirects: async () => [
    {
      source: '/app',
      destination: '/dashboard',
      permanent: true
    }
  ]
}
```

### Step 2: Automated Deployment Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy-web.yml
name: Deploy Web Application

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run linting
        run: pnpm lint
        
      - name: Type checking
        run: pnpm type-check
        
      - name: Run tests
        run: pnpm test:ci
        
      - name: Build application
        run: pnpm build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Run security audit
        run: pnpm audit --audit-level moderate
        
      - name: Dependency vulnerability scan
        uses: actions/dependency-review-action@v3
        
  deploy-preview:
    needs: [quality-check, security-scan]
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./web
          
  deploy-production:
    needs: [quality-check, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./web
          
      - name: Post-deployment health check
        run: |
          sleep 30
          curl -f https://app.babytracker.com/api/health || exit 1
          
  lighthouse-audit:
    needs: deploy-production
    runs-on: ubuntu-latest
    steps:
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://app.babytracker.com
            https://app.babytracker.com/dashboard
          configPath: './lighthouserc.json'
```

### Step 3: Domain and SSL Configuration

#### Custom Domain Setup
1. **Purchase domain**: `babytracker.com`
2. **Configure DNS**:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Vercel Configuration**:
   - Add `app.babytracker.com` as primary domain
   - Add `www.babytracker.com` as redirect
   - Enable automatic HTTPS

#### SSL Certificate Verification
```bash
# Verify SSL certificate
openssl s_client -servername app.babytracker.com -connect app.babytracker.com:443

# Check certificate details
curl -vI https://app.babytracker.com
```

---

## 📱 Mobile Application Deployment

### iOS App Store Deployment

#### Step 1: Final Build Preparation
```bash
# Update version and build number
cd mobile
npx expo config --version 1.0.0

# Clean build
eas build:configure
eas build --platform ios --profile production --clear-cache
```

#### Step 2: App Store Connect Submission
```yaml
# .github/workflows/deploy-ios.yml
name: Deploy iOS App

on:
  push:
    tags:
      - 'ios-v*'

jobs:
  deploy-ios:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Build iOS app
        run: eas build --platform ios --profile production --non-interactive --wait
        working-directory: ./mobile
        
      - name: Submit to App Store
        run: eas submit --platform ios --latest --non-interactive
        working-directory: ./mobile
        env:
          EXPO_APPLE_ID: ${{ secrets.EXPO_APPLE_ID }}
          EXPO_ASC_APP_ID: ${{ secrets.EXPO_ASC_APP_ID }}
          EXPO_APPLE_TEAM_ID: ${{ secrets.EXPO_APPLE_TEAM_ID }}
```

#### Step 3: App Store Metadata Configuration
```javascript
// mobile/app.config.js - iOS specific
export default {
  expo: {
    ios: {
      buildNumber: "1.0.0",
      bundleIdentifier: "com.babytracker.app",
      supportsTablet: true,
      requireFullScreen: false,
      config: {
        usesNonExemptEncryption: false
      },
      infoPlist: {
        NSCameraUsageDescription: "Baby Tracker uses your camera to capture photos of handwritten notes for digital conversion.",
        NSPhotoLibraryUsageDescription: "Baby Tracker accesses your photo library to select images for processing and to save baby photos.",
        NSLocationWhenInUseUsageDescription: "Baby Tracker uses location to remember where activities occurred.",
        NSFaceIDUsageDescription: "Baby Tracker uses Face ID for secure app access.",
        ITSAppUsesNonExemptEncryption: false
      },
      associatedDomains: [
        "applinks:app.babytracker.com"
      ]
    }
  }
}
```

#### App Store Information
```yaml
# App Store Connect Configuration
App Information:
  Name: Baby Tracker
  Subtitle: Track Your Baby's Daily Activities
  Category: Health & Fitness
  Age Rating: 4+ (Made for Kids)
  Content Rights: Does Not Use Third-Party Content
  
Version Information:
  Version: 1.0.0
  Copyright: © 2024 Baby Tracker Inc.
  Review Information:
    Email: support@babytracker.com
    Phone: +1-555-123-4567
    Demo Account: demo@example.com / password123
    
Pricing and Availability:
  Price: Free
  Availability: All territories
  Release: Manual release after approval
  
App Review Information:
  Description: |
    Baby Tracker helps parents monitor their baby's daily activities including feeding, 
    diaper changes, sleep patterns, and growth milestones. Features include:
    
    • Easy activity logging with one-tap entries
    • Photo scanning of handwritten notes using OCR technology
    • Smart text parsing for natural language input
    • Beautiful charts and analytics to track patterns
    • Offline support for reliable data entry
    • Secure cloud sync across all your devices
    • Export reports for healthcare providers
    
    Perfect for new parents who want to keep detailed records of their baby's 
    development and share insights with pediatricians.
    
  Keywords: baby,tracker,feeding,diaper,sleep,newborn,infant,parenting,health,growth
  
Privacy:
  Privacy Policy URL: https://babytracker.com/privacy
  Terms of Use URL: https://babytracker.com/terms
```

### Android Google Play Deployment

#### Step 1: Build AAB (Android App Bundle)
```bash
# Build production AAB
eas build --platform android --profile production
```

#### Step 2: Play Console Submission
```yaml
# .github/workflows/deploy-android.yml
name: Deploy Android App

on:
  push:
    tags:
      - 'android-v*'

jobs:
  deploy-android:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Build Android app
        run: eas build --platform android --profile production --non-interactive --wait
        working-directory: ./mobile
        
      - name: Submit to Google Play
        run: eas submit --platform android --latest --non-interactive
        working-directory: ./mobile
        env:
          GOOGLE_SERVICE_ACCOUNT_KEY: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_KEY }}
```

#### Step 3: Play Console Configuration
```javascript
// mobile/app.config.js - Android specific
export default {
  expo: {
    android: {
      package: "com.babytracker.app",
      versionCode: 1,
      compileSdkVersion: 34,
      targetSdkVersion: 34,
      buildToolsVersion: "34.0.0",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "VIBRATE",
        "USE_BIOMETRIC",
        "USE_FINGERPRINT",
        "com.google.android.c2dm.permission.RECEIVE"
      ]
    }
  }
}
```

#### Google Play Store Listing
```yaml
# Play Console Configuration
Store Listing:
  App name: Baby Tracker
  Short description: Track feeding, sleep, and diaper changes easily
  Full description: |
    Keep track of your baby's daily activities with Baby Tracker - the comprehensive 
    app designed for modern parents.

    ✨ KEY FEATURES:
    • Quick Activity Logging: Log feeding, diaper changes, sleep, and activities
    • Smart Photo Scanning: Convert handwritten notes to digital entries
    • Natural Language Input: Type "fed 4oz at 3pm" and we'll understand
    • Beautiful Analytics: Visualize patterns and trends over time
    • Offline Ready: Works without internet, syncs when connected
    • Multi-Device Sync: Access your data on phone, tablet, and web
    • Healthcare Reports: Export data for pediatrician visits

    🍼 FEEDING TRACKER:
    Track bottle feeds, breastfeeding sessions, and solid food introduction

    💤 SLEEP MONITORING:
    Log sleep sessions, track total hours, and identify sleep patterns

    🍼 DIAPER LOG:
    Record wet and dirty diapers with notes about consistency and color

    📊 GROWTH TRACKING:
    Monitor weight, height, and developmental milestones

    📱 SMART FEATURES:
    • OCR technology for scanning handwritten logs
    • AI-powered text parsing for natural language entries
    • Automatic pattern recognition and insights
    • Customizable reminders and notifications

    🔒 PRIVACY & SECURITY:
    Your baby's data is encrypted and stored securely. We never share personal 
    information with third parties.

    Perfect for new parents, nannies, and anyone caring for infants and toddlers.
    
  Graphics:
    Icon: 512x512 PNG (uploaded)
    Feature Graphic: 1024x500 PNG
    Screenshots:
      Phone: 8 screenshots (1080x1920 or 1440x2560)
      Tablet: 8 screenshots (2048x1536 or higher)
      
Contact Details:
  Website: https://babytracker.com
  Email: support@babytracker.com
  Phone: +1-555-123-4567
  
Privacy Policy: https://babytracker.com/privacy

Content Rating:
  Target Age Group: Designed for everyone
  Content Descriptors: None
  Interactive Elements: None
  
App Category:
  Category: Health & Fitness
  Tags: parenting, baby, health, tracking, newborn
  
Pricing & Distribution:
  Free app
  Contains ads: No
  In-app purchases: No (initially)
  Content rating: Everyone
  Target countries: All countries
```

---

## 🗄️ Database Deployment (Supabase)

### Step 1: Production Database Setup

#### Create Production Project
1. **Go to** [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Create** new project:
   ```
   Organization: Baby Tracker
   Project name: baby-tracker-prod
   Database password: [STRONG_PASSWORD]
   Region: us-east-1 (closest to users)
   Pricing plan: Free (upgrade as needed)
   ```

3. **Configure** project settings:
   ```
   API URL: https://abc123.supabase.co
   Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

#### Run Production Migrations
```bash
# Link to production project
cd backend
supabase link --project-ref abc123

# Push schema to production
supabase db push

# Verify migration
supabase db diff
```

### Step 2: Configure Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaper_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_data ENABLE ROW LEVEL SECURITY;

-- Test RLS policies
SELECT * FROM users WHERE id = auth.uid(); -- Should only return current user
SELECT * FROM babies WHERE user_id = auth.uid(); -- Should only return user's babies
```

### Step 3: Configure Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('photos', 'photos', true),
  ('documents', 'documents', false),
  ('avatars', 'avatars', true);

-- Set up storage policies
CREATE POLICY "Users can upload their own photos" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own photos" ON storage.objects
  FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 4: Edge Functions Deployment

```bash
# Deploy all edge functions
supabase functions deploy process-ocr
supabase functions deploy parse-nlp
supabase functions deploy generate-analytics
supabase functions deploy send-notifications

# Verify deployment
supabase functions list
```

#### OCR Processing Function
```typescript
// supabase/functions/process-ocr/index.ts
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { imageUrl, userId } = await req.json()
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Call Google Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${Deno.env.get('GOOGLE_CLOUD_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { source: { imageUri: imageUrl } },
            features: [{ type: 'TEXT_DETECTION' }]
          }]
        })
      }
    )
    
    const result = await response.json()
    const extractedText = result.responses[0]?.textAnnotations?.[0]?.description || ''
    
    // Store result
    const { data, error } = await supabase
      .from('ocr_uploads')
      .update({
        extracted_text: extractedText,
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('file_url', imageUrl)
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({ success: true, text: extractedText }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
```

---

## 📊 Monitoring and Analytics Setup

### Application Performance Monitoring

#### Sentry Configuration
```typescript
// web/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

```typescript
// mobile/App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_DSN_HERE',
  tracesSampleRate: 1.0,
});

export default Sentry.wrap(App);
```

#### Custom Analytics Dashboard
```typescript
// utils/analytics.ts
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  user_id?: string;
  timestamp: string;
}

export const trackEvent = async (event: string, properties: any = {}) => {
  const analyticsData: AnalyticsEvent = {
    event,
    properties: {
      ...properties,
      platform: typeof window !== 'undefined' ? 'web' : 'mobile',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      timestamp: new Date().toISOString()
    },
    user_id: getCurrentUserId(),
    timestamp: new Date().toISOString()
  };

  // Send to analytics service
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analyticsData)
    });
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
};

// Usage examples
trackEvent('baby_created', { baby_name: 'John', baby_age_days: 0 });
trackEvent('feeding_logged', { type: 'formula', amount_ml: 120 });
trackEvent('ocr_processed', { accuracy_score: 0.85, processing_time_ms: 2400 });
```

### Health Check Endpoints

```typescript
// web/pages/api/health.ts
export default async function handler(req, res) {
  try {
    // Check database connectivity
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
      
    if (error) throw error;
    
    // Check external API connectivity
    const externalServices = await Promise.allSettled([
      fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
      }),
      fetch(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_API_KEY}`, {
        method: 'POST',
        body: JSON.stringify({ requests: [] })
      })
    ]);
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      database: 'connected',
      external_services: {
        openai: externalServices[0].status === 'fulfilled' ? 'connected' : 'error',
        google_vision: externalServices[1].status === 'fulfilled' ? 'connected' : 'error'
      }
    };
    
    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

---

## 🔒 Security Hardening

### Environment Security

#### Secrets Management
```bash
# Vercel CLI secrets management
vercel secrets add supabase-service-key "eyJhbGciOiJIUzI1NiI..."
vercel secrets add openai-api-key "sk-..."
vercel secrets add google-cloud-api-key "AIzaSy..."

# GitHub secrets for CI/CD
# Repository → Settings → Secrets and variables → Actions
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
EXPO_TOKEN=...
GOOGLE_SERVICE_ACCOUNT_KEY=...
```

#### API Rate Limiting
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 0, resetTime: now + windowMs })
  }
  
  const rateLimitInfo = rateLimitMap.get(ip)
  
  if (now > rateLimitInfo.resetTime) {
    rateLimitInfo.count = 0
    rateLimitInfo.resetTime = now + windowMs
  }
  
  if (rateLimitInfo.count >= maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  rateLimitInfo.count++
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
```

### Content Security Policy
```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app *.vercel-analytics.com;
  child-src *.youtube.com *.vimeo.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' *.gstatic.com;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, '')
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'false'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

module.exports = {
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  }
}
```

---

## 📈 Post-Deployment Monitoring

### Key Metrics Dashboard

#### Performance Metrics
```typescript
// utils/performance-monitoring.ts
export const performanceMetrics = {
  // Web Vitals
  trackWebVitals: (metric) => {
    const { name, value, id } = metric;
    trackEvent('web_vital', {
      metric_name: name,
      value: Math.round(value),
      metric_id: id
    });
  },
  
  // API Response Times
  trackApiResponse: (endpoint: string, responseTime: number, status: number) => {
    trackEvent('api_response', {
      endpoint,
      response_time_ms: responseTime,
      status_code: status
    });
  },
  
  // Database Query Performance
  trackDbQuery: (query: string, duration: number) => {
    trackEvent('db_query', {
      query_type: query,
      duration_ms: duration
    });
  }
};
```

#### Business Metrics
```typescript
// utils/business-metrics.ts
export const businessMetrics = {
  // User Engagement
  trackUserSession: (sessionDuration: number) => {
    trackEvent('user_session', {
      duration_seconds: sessionDuration
    });
  },
  
  // Feature Usage
  trackFeatureUsage: (feature: string, success: boolean) => {
    trackEvent('feature_usage', {
      feature_name: feature,
      success
    });
  },
  
  // Data Entry Patterns
  trackDataEntry: (entryType: string, method: 'manual' | 'ocr' | 'nlp') => {
    trackEvent('data_entry', {
      entry_type: entryType,
      input_method: method
    });
  }
};
```

### Automated Alerting

#### Uptime Monitoring
```yaml
# .github/workflows/uptime-monitoring.yml
name: Uptime Monitoring

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes

jobs:
  uptime-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Web App
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://app.babytracker.com/api/health)
          if [ "$response" != "200" ]; then
            echo "Web app health check failed with status $response"
            exit 1
          fi
          
      - name: Check API Endpoints
        run: |
          # Test critical API endpoints
          endpoints=(
            "https://app.babytracker.com/api/auth/status"
            "https://app.babytracker.com/api/babies"
          )
          
          for endpoint in "${endpoints[@]}"; do
            response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
            if [ "$response" != "200" ] && [ "$response" != "401" ]; then
              echo "API endpoint $endpoint failed with status $response"
              exit 1
            fi
          done
          
      - name: Notify on Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: '🚨 Baby Tracker app is down! Please investigate immediately.'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### Performance Alerts
```typescript
// utils/alert-system.ts
export const alertSystem = {
  checkPerformance: async () => {
    const metrics = await getPerformanceMetrics();
    
    // Alert on slow response times
    if (metrics.avgResponseTime > 2000) {
      await sendAlert({
        type: 'performance',
        severity: 'warning',
        message: `Average response time is ${metrics.avgResponseTime}ms`,
        metric: 'response_time',
        value: metrics.avgResponseTime,
        threshold: 2000
      });
    }
    
    // Alert on high error rate
    if (metrics.errorRate > 0.05) {
      await sendAlert({
        type: 'errors',
        severity: 'critical',
        message: `Error rate is ${(metrics.errorRate * 100).toFixed(2)}%`,
        metric: 'error_rate',
        value: metrics.errorRate,
        threshold: 0.05
      });
    }
  }
};
```

---

## 🔄 Rollback Procedures

### Web Application Rollback

#### Automated Rollback
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback https://baby-tracker-abc123.vercel.app

# Promote specific deployment to production
vercel promote https://baby-tracker-xyz789.vercel.app
```

#### Manual Rollback Process
1. **Identify Issue**: Monitor alerts and user reports
2. **Assess Impact**: Determine if rollback is necessary
3. **Execute Rollback**: Use Vercel dashboard or CLI
4. **Verify Rollback**: Check health endpoints
5. **Communicate**: Notify stakeholders
6. **Root Cause Analysis**: Investigate and fix underlying issue

### Mobile Application Rollback

#### Over-the-Air Updates (Expo)
```bash
# Revert to previous update
eas update --branch production --message "Rollback to previous version"

# Check update status
eas update:list --branch production
```

#### App Store Rollback
1. **iOS**: Remove current version and revert to previous in App Store Connect
2. **Android**: Use staged rollout to gradually revert to previous version
3. **Critical Issues**: Contact Apple/Google for expedited review of fix

### Database Rollback

#### Migration Rollback
```bash
# Revert specific migration
supabase migration repair --status reverted

# Restore from backup (if needed)
supabase db restore --backup-id abc123
```

---

## 📞 Emergency Response Plan

### Incident Response Team
- **Technical Lead**: Primary incident commander
- **DevOps Engineer**: Infrastructure and deployment
- **Product Manager**: User impact assessment
- **Customer Support**: User communication

### Incident Severity Levels

#### P0 - Critical (Complete Service Down)
- **Response Time**: 15 minutes
- **Actions**:
  1. Page on-call team immediately
  2. Create incident channel
  3. Begin immediate rollback if applicable
  4. Communicate with users via status page
  5. Document timeline and actions taken

#### P1 - High (Major Feature Down)
- **Response Time**: 1 hour
- **Actions**:
  1. Notify incident response team
  2. Assess user impact
  3. Implement fix or rollback
  4. Monitor metrics closely
  5. Post-mortem within 24 hours

#### P2 - Medium (Minor Feature Issues)
- **Response Time**: 4 hours
- **Actions**:
  1. Create bug ticket with priority
  2. Assess and plan fix
  3. Deploy fix in next release cycle
  4. Monitor user feedback

### Communication Templates

#### Status Page Update
```markdown
**[RESOLVED] - Baby Tracker Service Disruption**

**Update - [Timestamp]**: 
Service has been fully restored. We have implemented a fix for the database connectivity issue that was causing login failures for some users.

**Issue Summary**: 
Between [Start Time] and [End Time], approximately 15% of users experienced login failures due to a database connectivity issue.

**Root Cause**: 
A configuration change in our database connection pooling caused timeouts during peak usage.

**Resolution**: 
We have reverted the configuration change and implemented additional monitoring to prevent similar issues.

**Next Steps**: 
We will be conducting a full post-mortem and implementing additional safeguards to prevent similar incidents.

We apologize for any inconvenience this may have caused.
```

#### User Communication Email
```html
Subject: Service Restored - Thank You for Your Patience

Dear Baby Tracker Users,

We want to update you on the service disruption that occurred earlier today.

**What Happened**: 
Some users experienced difficulty logging into Baby Tracker between [time range] due to a technical issue with our servers.

**Current Status**: 
The issue has been fully resolved and all features are working normally.

**What We're Doing**: 
We're implementing additional monitoring and safeguards to prevent similar issues in the future.

**Your Data**: 
All your baby's data remained secure and safe throughout this incident.

Thank you for your patience and continued trust in Baby Tracker.

Best regards,
The Baby Tracker Team

---
If you continue to experience issues, please contact us at support@babytracker.com
```

This comprehensive deployment guide ensures a smooth production launch with proper monitoring, security, and incident response procedures in place.
