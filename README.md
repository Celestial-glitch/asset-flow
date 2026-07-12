# AssetFlow ERP 🚀

AssetFlow is a next-generation, highly modular Enterprise Resource Planning (ERP) system designed to eliminate spreadsheet chaos for modern organizations. Built specifically for this Hackathon, AssetFlow focuses entirely on atomic physical asset tracking, role-based workflows, and real-time operational analytics without the bloat of traditional accounting or invoicing modules.

## 🌟 Key Features in Detail

### 1. Role-Based Access Control (RBAC) & Security
- **Authentication**: Secured end-to-end via NextAuth.js (v5 Beta) using bcrypt hashing.
- **Hierarchical Roles**: 
  - **Administrator**: Full system oversight, audit capabilities, and global user management.
  - **Asset Manager**: Department-level control, allocation authority, and maintenance approval.
  - **Employee**: Limited to viewing assigned personal assets, requesting hardware repairs, and booking shared company resources.
- **Session Protection**: All Server Actions explicitly validate NextAuth sessions before touching the database to prevent unauthorized API manipulation.

### 2. Comprehensive Asset Registry
- **Directory**: Track Laptops, Vehicles, Projectors, Furniture, and more.
- **Categorization**: Group assets by customizable categories (e.g., requires warranty tracking).
- **Atomic State Tracking**: Master statuses (`AVAILABLE`, `ALLOCATED`, `MAINTENANCE`, `LOST`, `RETIRED`) are strictly enforced via Prisma transactions to prevent double-booking or ghost states.

### 3. Allocation & Transfer Engine
- **Active Assignments**: Securely bind equipment to specific employees and departments.
- **Expected Return Tracking**: Automatically monitor when hardware is due back to the IT/HR department (surfaces in the Analytics module).
- **Real-Time Availability**: The allocation engine natively filters out currently allocated hardware from the pool to prevent conflicts.

### 4. Overlap-Proof Resource Booking
- **Shared Assets**: Support for temporary booking of shared equipment (e.g., Company Fleet Vehicles, Conference Room Projectors).
- **Mathematical Overlap Prevention**: The `createBooking` Server Action utilizes strict timestamp bounds checking directly on the database to ensure two people can never book the exact same asset at overlapping times.

### 5. Automated Maintenance Workflows
- **Kanban Pipeline**: A beautiful, uncrowded Kanban board (`Pending` → `In Progress` → `Resolved`).
- **Auto-Sync Engine**: When a manager approves a repair ticket and moves it to `In Progress`, the master asset is automatically locked into `MAINTENANCE` status. When resolved, it seamlessly reverts to `AVAILABLE`.

### 6. Lightning-Fast Audit Cycles
- **Zero-Ghost Inventory**: Managers can spin up localized (department-specific) or global physical verification audits.
- **Real-Time Checklist**: A high-speed Client Component interface allows auditors to rapidly mark items as `Verified`, `Missing`, or `Damaged` without slow page reloads.
- **Automated Repercussions**: Closing an audit transactionally updates master states (Missing → `LOST`, Damaged → `MAINTENANCE`).

### 7. Real-Time Analytics & System Notifications
- **Server-Rendered Dashboards**: Instant loading of active allocations, overdue returns, and maintenance frequencies.
- **Recharts Integration**: Beautiful, minimalist Bar and Pie charts for data visualization without heavy client-side libraries.
- **CSV Export Engine**: Instantly compile raw analytics into a downloadable CSV blob directly from the browser context.
- **Unified Alert Feed**: Chronological synthesis of human activity logs merged seamlessly with automated System Alerts (e.g., Overdue Hardware warnings and Audit Discrepancies).

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Database**: PostgreSQL (Hosted via Supabase)
- **ORM**: Prisma (with `@prisma/adapter-pg` for edge-ready execution)
- **Authentication**: NextAuth.js (v5 Beta)
- **Styling**: Tailwind CSS v4 (Minimalist, glassmorphism, completely uncrowded design philosophy)
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Environment Setup**: Add your Supabase `DATABASE_URL` and `AUTH_SECRET` to `.env`.
4. **Sync Database**: `npx prisma db push && npx prisma generate`
5. **Seed Demo Data**: `npx tsx prisma/seed.ts`
6. **Run Dev Server**: `npm run dev`
