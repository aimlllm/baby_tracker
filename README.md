# Baby Tracker - Multi-Platform Baby Activity Tracking Application

## 🍼 Overview

Baby Tracker is a comprehensive application for parents to monitor and analyze their baby's daily activities. Available on Web, iOS, and Android platforms with features including OCR scanning of handwritten notes, natural language processing for easy data entry, and detailed analytics dashboards.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- Supabase account
- Google Cloud account (for OCR)
- OpenAI API key (for NLP)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/baby-tracker.git
cd baby-tracker

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start development servers
pnpm dev
```

## 📁 Project Structure

```
baby-tracker/
├── web/                 # Next.js web application
├── mobile/             # React Native mobile app
├── backend/            # Supabase backend configuration
├── shared/             # Shared utilities and types
├── docs/               # Documentation
└── DESIGN.md          # Comprehensive design document
```

## 🛠️ Tech Stack

- **Frontend Web**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Mobile**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **OCR**: Google Cloud Vision API
- **NLP**: OpenAI GPT-4 API
- **Hosting**: Vercel (web), App Store & Play Store (mobile)

## 📱 Features

### Core Functionality
- 📊 Activity tracking (feeding, diapers, sleep, activities)
- 📷 OCR scanning of handwritten notes
- 💬 Natural language input with AI parsing
- 📈 Analytics and trend visualization
- 🔄 Real-time sync across all devices
- 🔐 Secure authentication and data protection

### Supported Platforms
- 🌐 Progressive Web App
- 📱 iOS Native App
- 🤖 Android Native App

## 🚀 Development

### Web Development
```bash
cd web
pnpm dev
# Open http://localhost:3000
```

### Mobile Development
```bash
cd mobile
pnpm start
# Use Expo Go app or simulators
```

### Backend Setup
```bash
cd backend
supabase start
# Local Supabase instance at http://localhost:54321
```

## 📝 Environment Variables

Create `.env.local` files in both `web/` and `mobile/` directories:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Cloud Vision
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific platform tests
pnpm test:web
pnpm test:mobile

# E2E tests
pnpm test:e2e
```

## 📦 Deployment

### Web Deployment (Vercel)
```bash
cd web
vercel deploy
```

### Mobile Deployment
```bash
cd mobile
# iOS
eas build --platform ios
eas submit --platform ios

# Android
eas build --platform android
eas submit --platform android
```

## 🤝 Contributing

Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Design Document](DESIGN.md)
- [API Documentation](docs/api/README.md)
- [UI Components](docs/ui/README.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 👥 Team

- Product Design & Development Team

## 🙏 Acknowledgments

- Supabase for the backend infrastructure
- Vercel for web hosting
- React Native community
- Open source contributors
