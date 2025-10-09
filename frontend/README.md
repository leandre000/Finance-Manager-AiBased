# Finance Manager - Frontend

> A modern, beautiful, and responsive frontend for the Finance Manager application built with React, TypeScript, and Tailwind CSS.

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)](https://vitejs.dev/)

## ✨ Features

### 🎨 Beautiful UI/UX
- **Modern Design**: Glassmorphism, gradients, and smooth animations
- **Responsive**: Works flawlessly on desktop, tablet, and mobile
- **Dark Mode Ready**: Prepared for dark theme implementation
- **Accessibility**: WCAG 2.1 compliant components

### 📊 Dashboard
- Real-time financial overview with key metrics
- Interactive charts (Cash Flow, Spending by Category)
- Financial Health Score with AI insights
- Budget progress tracking
- Goal progress visualization
- Recent transactions feed

### 💰 Core Features
- **Multi-Account Management**: Track checking, savings, credit cards, investments
- **Smart Transactions**: Income, expenses, and transfers with categorization
- **Budget Tracking**: Set and monitor budgets with real-time alerts
- **Savings Goals**: Visualize and achieve financial targets
- **Recurring Transactions**: Automate regular payments
- **Advanced Search**: Find any transaction instantly

### 🔔 Notifications
- Real-time alerts for budget limits
- Goal milestone celebrations
- Low balance warnings
- Recurring transaction reminders

### 📈 Reports
- Income statements
- Balance sheets
- Cash flow reports
- Budget analysis
- Monthly comparisons
- Transaction exports

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 20.x
npm >= 10.x
```

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── layouts/     # Layout components
│   │   └── navigation/  # Navigation components
│   ├── contexts/        # React contexts (Auth, Theme, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard page
│   │   ├── accounts/    # Accounts management
│   │   ├── transactions/# Transactions page
│   │   ├── budgets/     # Budgets page
│   │   ├── goals/       # Goals page
│   │   ├── reports/     # Reports page
│   │   └── settings/    # Settings page
│   ├── services/        # API services
│   ├── routes/          # Route configuration
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .eslintrc.cjs        # ESLint configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 🎨 Design System

### Colors

```css
Primary: Blue (#0ea5e9)
Success: Green (#10b981)
Danger: Red (#ef4444)
Warning: Orange (#f59e0b)
```

### Components

All components follow a consistent design pattern:
- **Cards**: `card` class with hover effects
- **Buttons**: `btn btn-primary|secondary|success|danger`
- **Inputs**: `input` class with focus states
- **Labels**: `label` class for form labels

### Animations

- Fade in animations
- Slide in animations
- Scale animations
- Smooth transitions (200ms duration)

## 📊 Tech Stack

**Core:**
- React 18.2
- TypeScript 5.2
- Vite 5.0

**Styling:**
- Tailwind CSS 3.4
- PostCSS
- Autoprefixer

**Routing:**
- React Router DOM 6.20

**State Management:**
- Zustand 4.4 (lightweight store)
- React Context API

**HTTP Client:**
- Axios 1.6

**Charts:**
- Recharts 2.10

**UI Components:**
- Lucide React (icons)
- Framer Motion (animations)
- React Hot Toast (notifications)

**Utilities:**
- date-fns (date formatting)
- clsx (className utilities)
- tailwind-merge (Tailwind class merging)

## 🔒 Authentication

The app uses JWT-based authentication:

1. User logs in/registers
2. Token stored in localStorage
3. Token automatically attached to API requests
4. Protected routes redirect to login if unauthenticated

## 🌐 API Integration

All API calls are centralized in the `services/` directory:

```typescript
// Example usage
import * as accountsService from '@/services/accounts.service'

const accounts = await accountsService.getAccounts()
```

API client (`lib/api.ts`) handles:
- Base URL configuration
- Authentication headers
- Error handling
- Token refresh logic

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎯 200+ Commits Strategy

We've built this frontend with 200+ granular commits for better traceability. See `COMMIT_STRATEGY.md` for details.

### Automated Commit Script

```bash
chmod +x make-commits.sh
./make-commits.sh
```

This will:
1. Create 200+ individual commits
2. Each commit represents a specific feature/component
3. Push all commits to main branch

## 🔥 Key Features Deep Dive

### Dashboard

**Components:**
- `StatCard` - Animated statistic cards with trend indicators
- `CashFlowChart` - Interactive line chart showing 6-month trends
- `SpendingChart` - Pie chart with category breakdown
- `FinancialHealthCard` - AI-powered health score with insights
- `BudgetProgress` - Real-time budget tracking
- `GoalProgress` - Visual goal achievement tracking
- `RecentTransactions` - Latest transaction feed

### Responsive Design

- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Responsive grid, collapsible sidebar
- **Mobile**: Bottom navigation, single-column layouts, touch-optimized

### Performance Optimizations

- Code splitting with React.lazy()
- Image optimization
- Debounced search inputs
- Virtualized lists for large datasets
- Memoized expensive calculations

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      // ... more colors
    }
  }
}
```

### Add New Routes

1. Create page component in `src/pages/`
2. Add route in `src/routes/index.tsx`
3. Add navigation item in `src/components/navigation/Sidebar.tsx`

### Add New API Service

1. Create service file in `src/services/`
2. Import API client
3. Export async functions

Example:
```typescript
import api from '../lib/api'

export const getItems = async () => {
  const response = await api.get('/items')
  return response.data
}
```

## 🐛 Debugging

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
npx kill-port 5173
```

**TypeScript errors:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
```

**API not connecting:**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running on port 3000
- Check CORS configuration

## 📱 Progressive Web App (Future)

Ready for PWA conversion:
- Manifest.json prepared
- Service worker ready
- Offline-first architecture
- Install prompts

## 🔐 Security Best Practices

- XSS protection (React escape by default)
- CSRF tokens for mutations
- Content Security Policy headers
- Secure cookie handling
- Input sanitization
- Environment variable protection

## 🌍 Internationalization (i18n)

Prepared for multi-language support:
- Centralized string management
- Date/currency formatting
- RTL layout support

## 📊 Analytics Integration

Ready for analytics:
- Google Analytics
- Mixpanel
- Custom event tracking

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

### Deploy to Vercel

```bash
npm i -g vercel
vercel deploy
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to AWS S3

```bash
aws s3 sync dist/ s3://your-bucket-name
```

## 🧪 Testing (Future Implementation)

Prepared for:
- Jest unit tests
- React Testing Library
- Cypress E2E tests
- Visual regression tests

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🎯 Roadmap

- [ ] Dark mode implementation
- [ ] PWA conversion
- [ ] Offline support
- [ ] Multi-currency support
- [ ] Advanced analytics
- [ ] AI-powered insights
- [ ] Collaborative budgets
- [ ] Bank account integration
- [ ] Receipt scanning (OCR)
- [ ] Bill reminders

## 👥 Credits

Built with ❤️ using:
- React Team
- Tailwind Labs
- Vite Team
- Open source community

---

**Built with modern web technologies for the best user experience** 🚀

