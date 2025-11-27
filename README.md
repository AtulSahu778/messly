# 🍽️ Messly - Hostel Mess Bill Tracker

> A beautiful, iOS-inspired app to track your hostel mess attendance and manage monthly bills effortlessly.



## ✨ What is Messly?

Messly is a modern web app designed specifically for hostel students to track their daily mess attendance and calculate monthly bills. Built with a stunning iOS-inspired dark theme, it makes managing your mess expenses simple and elegant.

## 🎯 Key Features

### 📅 Smart Calendar Management
- Track lunch and dinner attendance separately for each day
- Visual calendar with color-coded attendance status
- Quick actions to mark both meals present/absent
- Beautiful iOS-style date picker

### 💰 Automatic Bill Calculation
- Set monthly advance amount
- Automatic calculation of total spent
- Remaining balance tracking
- Carry-forward from previous months
- Detailed breakdown of meals consumed

### 📊 Monthly Summary
- View total lunches and dinners consumed
- See days with both meals, only lunch, or only dinner
- Track spending patterns
- Monitor remaining balance

### ⚙️ Flexible Settings
- Customize meal costs (lunch and dinner)
- Set monthly advance amount
- Reset data when needed
- Clean, intuitive interface

### 🔄 Data Sync (Optional)
- Works offline with localStorage
- Optional Supabase integration for cloud sync
- Access your data across multiple devices
- Secure authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm installed
- (Optional) Supabase account for cloud sync

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AtulSahu778/messly.git
cd messly
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the app**
```bash
npm run dev
```

The app will open at `https://messly.vercel.app`

### Optional: Enable Cloud Sync

1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Copy your project URL and anon key
4. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
5. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
6. Restart the dev server

See [SUPABASE_QUICK_SETUP.md](SUPABASE_QUICK_SETUP.md) for detailed instructions.

## 🎨 Design Philosophy

Messly follows iOS 17 design principles with a finance-optimized dark palette:

- **Primary Background**: `#070A09` - Deep, comfortable dark
- **Card Surface**: `#111513` - Elevated surfaces
- **Money Green**: `#30D158` - Primary actions and success
- **Expense Red**: `#FF453A` - Warnings and absent days

The interface uses smooth animations, rounded corners, and iOS-style interaction physics for a premium feel.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Backend (Optional)**: Supabase
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📱 Features in Detail

### Calendar View
- Click any date to manage attendance
- Visual indicators for meal status
- Color-coded days (present/absent/partial)
- Responsive grid layout
- Desktop-optimized with sidebar legend

### Summary View
- Current month overview
- Financial breakdown
- Meal consumption statistics
- Quick access to advance settings
- Beautiful card-based layout

### Settings
- Meal cost customization
- Monthly advance management
- Data reset option
- App information
- Account management (with Supabase)

## 📂 Project Structure

```
messly/
├── src/
│   ├── components/       # React components
│   │   ├── AuthScreen.tsx
│   │   ├── CalendarTab.tsx
│   │   ├── SummaryTab.tsx
│   │   └── SettingsTab.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useMessData.ts
│   │   └── useSupabaseSync.ts
│   ├── lib/             # Utilities and configs
│   │   └── supabase.ts
│   ├── types/           # TypeScript types
│   └── pages/           # Page components
├── public/              # Static assets
├── supabase-schema.sql  # Database schema
└── README.md
```

## 🔒 Privacy & Data

- **Local Mode**: All data stored in browser localStorage
- **Cloud Mode**: Data encrypted and stored in Supabase
- **No tracking**: We don't collect any analytics or personal data
- **Your data, your control**: Export or delete anytime

## 🙏 Acknowledgments

- Design inspired by iOS 17
- Icons by [Lucide](https://lucide.dev)
- UI components by [shadcn/ui](https://ui.shadcn.com)

---

**Built with ❤️ by Atul Sahu**
