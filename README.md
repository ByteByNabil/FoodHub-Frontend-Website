# 🍔 FoodHub Frontend Website

The stunning, highly-interactive, and responsive frontend application for the FoodHub platform. Built with Next.js and the latest React ecosystem, this project provides distinct experiences for Customers, Food Providers (Restaurants), and Administrators.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & Radix UI
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Authentication:** [Better Auth Client](https://better-auth.com/)
- **Data Fetching:** [SWR](https://swr.vercel.app/)
- **Payments:** [Stripe Elements](https://stripe.com/docs/stripe-js)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📁 Project Structure

The project utilizes the Next.js App Router pattern for file-based routing and a clean component architecture.

```text
src/
├── app/               # Next.js App Router (Pages & API Routes)
│   ├── admin/         # Admin dashboard pages
│   ├── cart/          # User shopping cart
│   ├── checkout/      # Stripe payment & checkout flow
│   ├── login/         # User authentication
│   ├── meals/         # Meal browsing and discovery
│   ├── profile/       # User profile management
│   ├── provider/      # Restaurant owner dashboard
│   └── verify-email/  # Email verification flow
├── components/        # Reusable UI components (shadcn/ui, layout)
├── contexts/          # React Context providers for global state
├── hooks/             # Custom React hooks (e.g., useCart, useAuth)
├── lib/               # Utility functions, API clients, and Auth setup
└── styles/            # Global CSS and Tailwind configurations
```

## ✨ Key Features

- **Modern & Responsive UI:** Built with Tailwind CSS and Radix UI primitives for an accessible, mobile-first design.
- **Dynamic Animations:** Smooth page transitions and micro-interactions powered by Framer Motion.
- **Role-Based Dashboards:** Dedicated portal views depending on the authenticated user's role (`Customer`, `Provider`, `Admin`).
- **Seamless Authentication:** Secure login, registration, and OAuth (Google) handled via Better Auth.
- **Shopping Cart & Checkout:** Real-time cart management and secure payment processing integrated with Stripe Elements.
- **Data Fetching & Caching:** Fast and optimistic UI updates using SWR for API requests.
- **Dark Mode Support:** Integrated theme switching using `next-themes`.

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- pnpm (Package Manager)
- Running instance of the FoodHub Backend Server

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
```

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd FoodHub-Frontend-Website
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

- `pnpm run dev`: Starts the Next.js development server.
- `pnpm run build`: Builds the application for production deployment.
- `pnpm run start`: Starts the Next.js production server.
- `pnpm run lint`: Runs ESLint to catch potential errors and enforce code style.
