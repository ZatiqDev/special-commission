# Special Commission Dashboard

A comprehensive **Next.js 15** application for managing and monitoring subscription commissions and performance metrics. This dashboard provides real-time insights into commission data, subscription analytics, and financial performance tracking.

## 🚀 Features

- **📊 Real-time Dashboard** - Monitor commission metrics and performance indicators
- **🔍 Advanced Filtering** - Filter data by promo ID, date ranges, and subscription types
- **📈 Performance Analytics** - Track total commissions, transactions, and completion rates
- **🏪 Shop Management** - Monitor unique shop partners and their performance
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **🔐 Secure Authentication** - Role-based access control with JWT authentication
- **📋 Data Tables** - Paginated tables with sorting and filtering capabilities
- **🎨 Modern UI** - Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context API
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)

## 📦 Prerequisites

Before running this project, make sure you have:

- **Node.js** 18.x or later
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- Access to the Zatiq Admin API (`https://admin-api.zatiq.tech/api/v1/admin`)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd special-commission
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory (if needed for additional configurations):

```bash
# Add any environment variables here if required
NEXT_PUBLIC_API_BASE_URL=https://admin-api.zatiq.tech/api/v1/admin
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Open the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
special-commission/
├── app/                          # Next.js App Router
│   ├── _components/             # Page-specific components
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   └── commission/         # Commission data endpoints
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                   # Reusable UI components
│   ├── auth/                   # Authentication components
│   ├── dashboard/              # Dashboard-specific components
│   ├── layout/                 # Layout components
│   └── ui/                     # shadcn/ui components
├── contexts/                     # React Context providers
├── hooks/                        # Custom React hooks
├── lib/                         # Utility functions
├── services/                    # API service functions
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # Type check without emitting files
```

## 🔐 Authentication

The application uses a role-based authentication system:

- **Login Component**: Located in `components/auth/login.tsx`
- **Auth Context**: Manages authentication state in `contexts/auth-context.tsx`
- **Protected Routes**: Wrapped with `AuthWrapper` component
- **Role Guard**: Additional role-based access control

### Default Credentials
Check `data/users.json` for available user credentials during development.

## 📊 Dashboard Features

### Metrics Cards
- **Total Commission**: Sum of all commission amounts
- **Total Transactions**: Count of all subscription records
- **Completion Rate**: Percentage of completed transactions
- **Unique Shops**: Number of active shop partners

### Data Filtering
- **Promo ID**: Filter by specific promotional campaign
- **Date Range**: Custom from/to date selection
- **Subscription Type**: First-time vs recurring subscriptions

### Data Tables
- **Pagination**: 20 records per page with navigation
- **Responsive Design**: Mobile-optimized table layout
- **Status Badges**: Visual status indicators
- **Currency Formatting**: Bengali Taka (BDT) formatting

## 🌐 API Integration

### Commission Data Endpoint
```typescript
GET /api/commission?from=YYYY-MM-DD&to=YYYY-MM-DD&promo_id=ID
```

### Response Format
```typescript
interface ApiResponse {
  current_page: number;
  data: SubscriptionRecord[];
  total: number;
  per_page: number;
  // ... pagination metadata
}

interface SubscriptionRecord {
  subscription_id: string;
  shop_id: string;
  shop_name: string;
  amount: string;
  commission_amount: string;
  status: string;
  subscription_type: string;
  created_at: string;
}
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components:

- **Table**: Data display with sorting and pagination
- **Card**: Metrics and content containers
- **Button**: Various button variants
- **Input**: Form input fields
- **Calendar**: Date picker component
- **Badge**: Status indicators
- **Tabs**: Content organization
- **Toast**: Notification system

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - `sm`: 640px and up
  - `md`: 768px and up
  - `lg`: 1024px and up
  - `xl`: 1280px and up

## 🔍 Error Handling

- **API Error Handling**: Comprehensive error catching and user feedback
- **Network Errors**: Automatic retry mechanisms
- **Validation**: Form and data validation
- **Toast Notifications**: User-friendly error messages

## 🔧 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify the API endpoint is accessible
   - Check network connectivity
   - Ensure proper authentication credentials

2. **Build Errors**
   - Run `npm run lint` to check for code issues
   - Verify all dependencies are installed
   - Check TypeScript errors with `npx tsc --noEmit`

3. **Authentication Problems**
   - Check user credentials in `data/users.json`
   - Verify auth context is properly configured
   - Clear browser cache and localStorage

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the ZatiqDev team**
