# Deployment Guide

## 📋 Prerequisites

Before deploying the Baby Tracker application, ensure you have:

- [ ] Node.js 20+ installed
- [ ] pnpm package manager installed
- [ ] Git repository set up
- [ ] Accounts created for required services

## 🔑 Required Accounts

### Essential Services
1. **Supabase Account** - [supabase.com](https://supabase.com)
2. **Vercel Account** - [vercel.com](https://vercel.com)
3. **GitHub Account** - [github.com](https://github.com)

### Mobile Deployment
4. **Apple Developer Account** - $99/year (iOS)
5. **Google Play Developer Account** - $25 one-time (Android)
6. **Expo Account** - [expo.dev](https://expo.dev)

### API Services
7. **Google Cloud Account** - For Vision API (OCR)
8. **OpenAI Account** - For GPT-4 API (NLP)

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Configure:
   ```
   Project Name: baby-tracker
   Database Password: [Generate strong password]
   Region: Choose closest to your users
   Pricing Plan: Free (to start)
   ```
4. Wait for project provisioning (~2 minutes)

### Step 2: Run Database Migrations

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your project:
   ```bash
   cd backend
   supabase link --project-ref [your-project-ref]
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

### Step 3: Configure Authentication

1. Go to Authentication → Providers
2. Enable Email provider
3. Configure email templates:
   - Confirmation email
   - Password reset
   - Magic link

4. Set up OAuth providers (optional):
   - Google
   - Apple
   - Facebook

### Step 4: Set Up Storage Buckets

1. Go to Storage → Create new bucket
2. Create buckets:
   ```
   - photos (public)
   - documents (private)
   - avatars (public)
   ```

3. Configure policies for each bucket

### Step 5: Edge Functions Setup

1. Create edge functions:
   ```bash
   supabase functions new process-ocr
   supabase functions new parse-nlp
   supabase functions new generate-report
   ```

2. Deploy functions:
   ```bash
   supabase functions deploy process-ocr
   supabase functions deploy parse-nlp
   supabase functions deploy generate-report
   ```

---

## 🌐 Web Deployment (Vercel)

### Step 1: Prepare for Deployment

1. Build the project locally:
   ```bash
   cd web
   pnpm build
   ```

2. Test production build:
   ```bash
   pnpm start
   ```

### Step 2: Connect to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow prompts:
   ```
   ? Set up and deploy "~/baby-tracker/web"? [Y/n] Y
   ? Which scope do you want to deploy to? Your Account
   ? Link to existing project? [y/N] N
   ? What's your project's name? baby-tracker
   ? In which directory is your code located? ./
   ```

### Step 3: Configure Environment Variables

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables
3. Add all variables from `.env.example`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   GOOGLE_CLOUD_API_KEY
   OPENAI_API_KEY
   ```

### Step 4: Configure Custom Domain

1. Go to Settings → Domains
2. Add your domain: `babytracker.app`
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Step 5: Set Up CI/CD

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to Vercel
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 20
         - uses: pnpm/action-setup@v2
           with:
             version: 8
         - run: pnpm install
         - run: pnpm build
         - uses: amondnet/vercel-action@v25
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
   ```

---

## 📱 Mobile Deployment

### iOS Deployment

#### Step 1: Configure Expo

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS:
   ```bash
   cd mobile
   eas build:configure
   ```

3. Update `eas.json`:
   ```json
   {
     "build": {
       "preview": {
         "ios": {
           "simulator": true
         }
       },
       "production": {
         "ios": {
           "buildNumber": "1.0.0"
         }
       }
     }
   }
   ```

#### Step 2: Build for iOS

1. Create build:
   ```bash
   eas build --platform ios
   ```

2. Download `.ipa` file when ready

#### Step 3: Submit to App Store

1. Via EAS:
   ```bash
   eas submit --platform ios
   ```

2. Or manually via App Store Connect:
   - Upload with Transporter app
   - Fill in app metadata
   - Submit for review

### Android Deployment

#### Step 1: Build for Android

1. Create build:
   ```bash
   eas build --platform android
   ```

2. Download `.aab` file when ready

#### Step 2: Submit to Google Play

1. Via EAS:
   ```bash
   eas submit --platform android
   ```

2. Or manually via Play Console:
   - Upload to internal testing
   - Progress through testing tracks
   - Submit for production

---

## 🔧 API Services Setup

### Google Cloud Vision API

1. Create project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Vision API
3. Create service account key
4. Download JSON credentials
5. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
   ```

### OpenAI API

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Set usage limits:
   - Monthly budget: $50
   - Request limit: 100/min
4. Add to environment variables

---

## 📊 Monitoring Setup

### Vercel Analytics

1. Enable in Vercel dashboard
2. Add to `next.config.js`:
   ```javascript
   module.exports = {
     analytics: true
   }
   ```

### Sentry Error Tracking

1. Create project at [sentry.io](https://sentry.io)
2. Install SDK:
   ```bash
   pnpm add @sentry/nextjs @sentry/react-native
   ```
3. Initialize in app

### Uptime Monitoring

1. Use Vercel's built-in monitoring
2. Or set up external service:
   - UptimeRobot
   - Pingdom
   - StatusCake

---

## 🚀 Production Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Storage buckets created
- [ ] Authentication providers configured
- [ ] API keys secured
- [ ] SSL certificates active
- [ ] CDN configured
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Backup strategy in place

### Security
- [ ] RLS policies enabled
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

### Performance
- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Lazy loading implemented
- [ ] Caching strategy defined
- [ ] Database indexed
- [ ] API responses optimized
- [ ] Bundle size minimized

### Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Accessibility audit passed
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified

### Legal & Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance (if EU)
- [ ] COPPA compliance (children's data)
- [ ] Cookie consent implemented
- [ ] Data retention policy defined

---

## 🔄 Post-Deployment

### Immediate Tasks
1. Verify all services are running
2. Test critical user flows
3. Monitor error rates
4. Check performance metrics
5. Verify email delivery

### First 24 Hours
1. Monitor server resources
2. Check database performance
3. Review error logs
4. Analyze user behavior
5. Address critical issues

### First Week
1. Gather user feedback
2. Fix reported bugs
3. Optimize slow queries
4. Tune caching
5. Plan first update

---

## 🆘 Rollback Procedures

### Web Application
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]

# Or promote specific deployment
vercel promote [deployment-url]
```

### Database
```bash
# Revert migration
supabase db reset

# Or restore from backup
supabase db restore --backup [backup-id]
```

### Mobile Apps
- Use Expo's rollback feature
- Or submit hotfix update
- Worst case: contact store support

---

## 📞 Support Contacts

### Service Support
- **Supabase**: support@supabase.io
- **Vercel**: support@vercel.com
- **Expo**: support@expo.dev
- **Google Cloud**: cloud.google.com/support
- **OpenAI**: help.openai.com

### App Store Support
- **Apple**: developer.apple.com/contact
- **Google**: support.google.com/googleplay/android-developer

---

## 📚 Additional Resources

- [Supabase Deployment Docs](https://supabase.com/docs/guides/hosting/overview)
- [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
- [Expo Deployment Guide](https://docs.expo.dev/distribution/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/guidelines/)
- [Google Play Guidelines](https://play.google.com/console/about/)
