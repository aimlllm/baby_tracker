# Baby Tracker Application - Design Document

## 📋 Product Requirements

### Overview
A comprehensive baby tracking application that enables parents to monitor and analyze their baby's daily activities through multiple interfaces (Web, iOS, Android). The application features OCR scanning for digitizing handwritten notes, natural language processing for easy data entry, and analytics dashboards for pattern visualization.

### Core Features
1. **Activity Tracking**
   - Feeding (breast milk, formula, solid foods)
   - Diaper changes
   - Sleep patterns
   - Activities and milestones
   - Location tracking

2. **Data Entry Methods**
   - OCR scanning of handwritten notebooks
   - Natural language text input with AI parsing
   - Structured forms for manual entry
   - Voice input (future enhancement)

3. **Analytics & Insights**
   - Daily/weekly/monthly activity patterns
   - Growth charts
   - Feeding trends
   - Sleep analysis
   - Customizable reports

4. **Multi-Platform Support**
   - Responsive web application
   - Native iOS application
   - Native Android application
   - Real-time sync across all platforms

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#4F46E5',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#4338CA',
    'lineColor': '#6366F1',
    'secondaryColor': '#E2E8F0',
    'tertiaryColor': '#F1F5F9',
    'textColor': '#000000',
    'mainBkg': '#ffffff'
  }
}}%%
graph TB
    subgraph "Client Applications"
        Web["Web App<br>Next.js + React<br>Vercel Hosting"]
        iOS["iOS App<br>React Native"]
        Android["Android App<br>React Native"]
    end

    subgraph "API Gateway"
        Gateway["API Gateway<br>Supabase Edge Functions"]
    end

    subgraph "Backend Services"
        Auth["Authentication<br>Supabase Auth"]
        OCR["OCR Service<br>Google Vision API"]
        NLP["NLP Service<br>OpenAI API"]
        Storage["File Storage<br>Supabase Storage"]
    end

    subgraph "Data Layer"
        DB[(Supabase PostgreSQL<br>Database)]
        Cache["Redis Cache<br>For Analytics"]
    end

    Web --> Gateway
    iOS --> Gateway
    Android --> Gateway
    
    Gateway --> Auth
    Gateway --> OCR
    Gateway --> NLP
    Gateway --> Storage
    Gateway --> DB
    
    DB --> Cache

    classDef default fill:#F8FAFC,stroke:#475569,stroke-width:2px
    classDef client fill:#E0E7FF,stroke:#4338CA,stroke-width:2px
    classDef service fill:#DCFCE7,stroke:#166534,stroke-width:2px
    classDef data fill:#F3E8FF,stroke:#6B21A8,stroke-width:2px
    
    class Web,iOS,Android client
    class Auth,OCR,NLP,Storage,Gateway service
    class DB,Cache data
```

### Technology Stack

#### Frontend
- **Web**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Mobile**: React Native with Expo (unified codebase for iOS/Android)
- **State Management**: Zustand + React Query
- **UI Components**: shadcn/ui for web, React Native Elements for mobile
- **Charts**: Recharts (web), Victory Native (mobile)

#### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions (Deno)
- **OCR**: Google Cloud Vision API / Tesseract.js
- **NLP**: OpenAI GPT-4 API for text parsing
- **Real-time**: Supabase Realtime subscriptions

#### Infrastructure
- **Web Hosting**: Vercel
- **Mobile Distribution**: 
  - iOS: App Store Connect
  - Android: Google Play Console
- **CDN**: Cloudflare (for static assets)
- **Monitoring**: Sentry, Vercel Analytics
- **CI/CD**: GitHub Actions

---

## 📊 Database Schema

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#4F46E5',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#4338CA',
    'lineColor': '#6366F1',
    'secondaryColor': '#E2E8F0',
    'tertiaryColor': '#F1F5F9',
    'textColor': '#000000',
    'mainBkg': '#ffffff'
  }
}}%%
erDiagram
    USERS ||--o{ BABIES : "has"
    USERS ||--o{ CAREGIVERS : "manages"
    BABIES ||--o{ FEEDING_LOGS : "has"
    BABIES ||--o{ DIAPER_LOGS : "has"
    BABIES ||--o{ SLEEP_LOGS : "has"
    BABIES ||--o{ ACTIVITY_LOGS : "has"
    BABIES ||--o{ MEDIA_ATTACHMENTS : "has"
    USERS ||--o{ OCR_UPLOADS : "uploads"
    
    USERS {
        uuid id PK
        string email
        string name
        json preferences
        timestamp created_at
        timestamp updated_at
    }
    
    BABIES {
        uuid id PK
        uuid user_id FK
        string name
        date birth_date
        string gender
        json medical_info
        timestamp created_at
    }
    
    FEEDING_LOGS {
        uuid id PK
        uuid baby_id FK
        timestamp time
        string type "breast|formula|solid"
        float amount_ml
        int duration_minutes
        string food_type
        json notes
        uuid created_by FK
    }
    
    DIAPER_LOGS {
        uuid id PK
        uuid baby_id FK
        timestamp time
        string type "wet|dirty|both"
        json notes
        uuid created_by FK
    }
    
    SLEEP_LOGS {
        uuid id PK
        uuid baby_id FK
        timestamp start_time
        timestamp end_time
        string quality "good|fair|poor"
        json notes
        uuid created_by FK
    }
    
    ACTIVITY_LOGS {
        uuid id PK
        uuid baby_id FK
        timestamp time
        string activity_type
        string location
        json details
        uuid created_by FK
    }
    
    MEDIA_ATTACHMENTS {
        uuid id PK
        uuid baby_id FK
        string url
        string type "photo|document"
        json metadata
        timestamp created_at
    }
    
    OCR_UPLOADS {
        uuid id PK
        uuid user_id FK
        string file_url
        json extracted_data
        string status
        timestamp processed_at
    }
```

---

## 🔄 User Workflows

### 1. OCR Notebook Scanning Flow

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#818CF8',
    'primaryTextColor': '#312E81',
    'primaryBorderColor': '#4338CA',
    'lineColor': '#6366F1',
    'secondaryColor': '#E0E7FF',
    'tertiaryColor': '#EEF2FF',
    'noteTextColor': '#1E1B4B',
    'noteBorderColor': '#4338CA',
    'noteBkgColor': '#E0E7FF',
    'activationBorderColor': '#4338CA',
    'activationBkgColor': '#EEF2FF',
    'sequenceNumberColor': '#312E81'
  }
}}%%
sequenceDiagram
    participant U as User
    participant App as Mobile/Web App
    participant OCR as OCR Service
    participant NLP as NLP Parser
    participant DB as Database
    
    rect rgb(224, 231, 255)
        Note over U,DB: OCR Notebook Scanning Workflow
        
        U->>App: Upload notebook photo
        Note over App: Request:<br/>Image file<br/>User context
        
        App->>OCR: Process image
        Note over OCR: Extract text<br/>Identify structure
        
        OCR-->>App: Raw text data
        Note over OCR: Response:<br/>Text blocks<br/>Confidence scores
        
        App->>NLP: Parse text to structured data
        Note over NLP: Identify:<br/>- Timestamps<br/>- Activities<br/>- Quantities
        
        NLP-->>App: Structured data
        Note over NLP: Response:<br/>Feeding: 60ml at 10am<br/>Diaper: 11:30am<br/>Sleep: 2-4pm
        
        App-->>U: Show preview for approval
        Note over App: Display:<br/>Extracted entries<br/>Edit options
        
        U->>App: Approve/Edit entries
        
        App->>DB: Save confirmed entries
        Note over DB: Store:<br/>Multiple log entries<br/>Original image reference
        
        DB-->>App: Confirmation
        
        App-->>U: Success notification
        Note over App: Show:<br/>Entries added<br/>View in timeline
    end
```

### 2. Natural Language Input Flow

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#A5B4FC',
    'primaryTextColor': '#312E81',
    'primaryBorderColor': '#4338CA',
    'lineColor': '#6366F1',
    'secondaryColor': '#E0E7FF',
    'tertiaryColor': '#EEF2FF',
    'noteTextColor': '#1E1B4B',
    'noteBorderColor': '#4338CA',
    'noteBkgColor': '#E0E7FF',
    'activationBorderColor': '#4338CA',
    'activationBkgColor': '#EEF2FF',
    'sequenceNumberColor': '#312E81'
  }
}}%%
sequenceDiagram
    participant U as User
    participant App as Application
    participant NLP as NLP Service
    participant DB as Database
    
    rect rgb(224, 231, 255)
        Note over U,DB: Natural Language Entry Flow
        
        U->>App: Type text entry
        Note over App: Input:<br/>"Fed baby 60ml formula at 10am"
        
        App->>NLP: Parse natural language
        Note over NLP: Extract:<br/>Action: feeding<br/>Amount: 60ml<br/>Type: formula<br/>Time: 10:00
        
        NLP-->>App: Structured data
        Note over NLP: Response:<br/>{type: "feeding",<br/>amount: 60,<br/>food_type: "formula",<br/>time: "10:00"}
        
        App-->>U: Show interpreted data
        Note over App: Display:<br/>Preview card<br/>with extracted info
        
        alt Auto-approval enabled
            App->>DB: Save entry
            DB-->>App: Saved
            App-->>U: Show confirmation
        else Manual approval required
            U->>App: Approve/Edit
            App->>DB: Save entry
            DB-->>App: Saved
            App-->>U: Show confirmation
        end
    end
```

### 3. Analytics Dashboard Flow

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#4F46E5',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#4338CA',
    'lineColor': '#6366F1',
    'secondaryColor': '#E2E8F0',
    'tertiaryColor': '#F1F5F9',
    'textColor': '#000000',
    'mainBkg': '#ffffff'
  }
}}%%
graph TB
    subgraph "Analytics Views"
        Daily["Daily Summary<br>Timeline view"]
        Weekly["Weekly Patterns<br>Bar charts"]
        Monthly["Monthly Trends<br>Line graphs"]
        Custom["Custom Reports<br>Date range selection"]
    end
    
    subgraph "Metrics Tracked"
        Feed["Feeding Metrics<br>• Volume/Duration<br>• Frequency<br>• Type distribution"]
        Sleep["Sleep Analytics<br>• Total hours<br>• Wake times<br>• Quality scores"]
        Diaper["Diaper Tracking<br>• Change frequency<br>• Type patterns<br>• Health indicators"]
        Growth["Growth Charts<br>• Weight progression<br>• Height tracking<br>• Percentiles"]
    end
    
    subgraph "Export Options"
        PDF["PDF Reports"]
        CSV["CSV Data Export"]
        Share["Share with Healthcare"]
    end
    
    Daily --> Feed
    Daily --> Sleep
    Daily --> Diaper
    
    Weekly --> Feed
    Weekly --> Sleep
    Weekly --> Diaper
    
    Monthly --> Growth
    Monthly --> Feed
    Monthly --> Sleep
    
    Custom --> PDF
    Custom --> CSV
    Custom --> Share

    classDef default fill:#F8FAFC,stroke:#475569,stroke-width:2px
    classDef view fill:#E0E7FF,stroke:#4338CA,stroke-width:2px
    classDef metric fill:#DCFCE7,stroke:#166534,stroke-width:2px
    classDef export fill:#F3E8FF,stroke:#6B21A8,stroke-width:2px
    
    class Daily,Weekly,Monthly,Custom view
    class Feed,Sleep,Diaper,Growth metric
    class PDF,CSV,Share export
```

---

## 🎨 UI/UX Design Principles

### Design System
- **Colors**: 
  - Primary: Indigo (#4F46E5)
  - Secondary: Purple (#9333EA)
  - Success: Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Neutral: Slate grays

- **Typography**:
  - Headers: Inter (sans-serif)
  - Body: System fonts
  - Monospace: JetBrains Mono (for data)

- **Components**:
  - Card-based layouts
  - Timeline views for daily activities
  - Chart components for analytics
  - Modal dialogs for quick entry
  - Bottom sheets (mobile)
  - Floating action buttons

### Mobile-First Responsive Design
- Touch-optimized interfaces
- Swipe gestures for navigation
- Pull-to-refresh for data sync
- Offline-first architecture
- Progressive Web App capabilities

---

## 🚀 Implementation Phases

### Phase 1: MVP (Weeks 1-4)
- [ ] Basic authentication (Supabase Auth)
- [ ] Database schema setup
- [ ] Manual entry forms (feeding, diaper, sleep)
- [ ] Simple timeline view
- [ ] Web application deployment on Vercel

### Phase 2: Mobile Apps (Weeks 5-8)
- [ ] React Native setup with Expo
- [ ] Shared component library
- [ ] iOS app development
- [ ] Android app development
- [ ] Cross-platform data sync

### Phase 3: Advanced Features (Weeks 9-12)
- [ ] OCR integration
- [ ] Natural language processing
- [ ] Analytics dashboard
- [ ] Export functionality
- [ ] Push notifications

### Phase 4: Enhancement (Weeks 13-16)
- [ ] Voice input
- [ ] Healthcare provider sharing
- [ ] Multiple baby support
- [ ] Caregiver collaboration
- [ ] Advanced analytics & ML insights

---

## 🔐 Security & Privacy

### Data Protection
- End-to-end encryption for sensitive data
- HIPAA compliance considerations
- GDPR compliance for EU users
- Secure file storage with access controls
- Regular security audits

### Authentication & Authorization
- Multi-factor authentication
- Role-based access control (parents, caregivers)
- Session management
- Secure API endpoints
- Rate limiting

---

## 📱 Mobile Deployment Strategy

### iOS Deployment
- App Store Connect setup
- TestFlight for beta testing
- App Store optimization
- Push notification certificates

### Android Deployment
- Google Play Console setup
- Internal testing tracks
- Production rollout strategy
- Google Play optimization

### Updates & Maintenance
- Over-the-air updates (Expo)
- Version management
- Backward compatibility
- User migration strategies

---

## 🔄 API Design

### RESTful Endpoints

```yaml
Authentication:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout
  POST   /api/auth/refresh

Babies:
  GET    /api/babies
  POST   /api/babies
  GET    /api/babies/{id}
  PUT    /api/babies/{id}
  DELETE /api/babies/{id}

Activity Logs:
  GET    /api/babies/{id}/feeding
  POST   /api/babies/{id}/feeding
  GET    /api/babies/{id}/diapers
  POST   /api/babies/{id}/diapers
  GET    /api/babies/{id}/sleep
  POST   /api/babies/{id}/sleep
  GET    /api/babies/{id}/activities
  POST   /api/babies/{id}/activities

Analytics:
  GET    /api/analytics/summary?baby_id={id}&period={daily|weekly|monthly}
  GET    /api/analytics/trends?baby_id={id}&metric={feeding|sleep|diapers}
  GET    /api/analytics/export?baby_id={id}&format={pdf|csv}

OCR & NLP:
  POST   /api/ocr/upload
  GET    /api/ocr/status/{job_id}
  POST   /api/nlp/parse
```

---

## 📈 Success Metrics

### Key Performance Indicators
- User retention rate (30-day, 90-day)
- Daily active users
- Average session duration
- Feature adoption rates
- Data entry frequency
- OCR accuracy rate
- NLP parsing accuracy

### User Satisfaction
- App store ratings
- User feedback surveys
- Feature request tracking
- Support ticket volume
- Time to resolution

---

## 🛠️ Development Tools

### Required Tools
- Node.js 20+
- pnpm (package manager)
- Git
- VS Code / Cursor
- Xcode (for iOS)
- Android Studio (for Android)
- Docker (optional)

### Development Environment
```bash
# Clone repository
git clone [repo-url]

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Run development servers
pnpm dev:web
pnpm dev:mobile
```

---

## 📝 Notes & Considerations

### Technical Debt Management
- Regular refactoring sprints
- Code review process
- Automated testing coverage
- Performance monitoring
- Dependency updates

### Scalability Planning
- Database indexing strategy
- CDN implementation
- API rate limiting
- Caching strategies
- Horizontal scaling preparation

### Future Enhancements
- AI-powered insights and predictions
- Wearable device integration
- Video monitoring integration
- Community features
- Telehealth integration
- Multi-language support

---

## 🤝 Team Collaboration

### Development Workflow
1. Feature branch creation
2. Incremental commits
3. Pull request with review
4. Automated testing
5. Staging deployment
6. Production release

### Communication Channels
- GitHub Issues for bug tracking
- GitHub Discussions for features
- Slack/Discord for real-time communication
- Weekly sync meetings
- Sprint planning sessions
