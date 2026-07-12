# AssetFlow ERP - Product Requirements Document (PRD)

## 1. Executive Summary
AssetFlow is a modernized, modular ERP built to solve a specific problem: physical asset chaos. Organizations often lose track of laptops, vehicles, and shared equipment because traditional ERPs are too bloated with accounting/invoicing, or spreadsheets are too manual and error-prone. AssetFlow provides a focused, atomic, and minimalist solution for tracking the physical lifecycle of corporate resources.

## 2. Core Objectives
- Deliver a lightning-fast, highly uncrowded UI that prioritizes data visibility over decorative elements.
- Prevent double-allocation and double-booking using strict database-level mathematical checks and Prisma transactions.
- Automate secondary status changes (e.g., a maintenance request automatically altering an asset's global availability).
- Provide instant accountability via physical Audit tracking and chronological Activity Logs.

## 3. User Personas & Roles
- **Admin**: Can create departments, manage global settings, and conduct organization-wide audits.
- **Asset Manager**: Responsible for assigning hardware, approving maintenance, and monitoring overdue returns for their specific department.
- **Employee**: The end-user who needs to see what they own, book a shared company car, or submit a broken laptop for repair.

## 4. Feature Specifications

### Phase 1: Infrastructure & RBAC
- **NextAuth Integration**: Secure credentials-based login system with bcrypt hashing.
- **Global Directory**: Relational models for Users, Departments, and Asset Categories.

### Phase 2: Asset Management
- **CRUD Assets**: Create, Read, Update, Delete physical assets.
- **Allocation Engine**: Assign an asset to a user. Must logically enforce that only `AVAILABLE` assets can become `ALLOCATED`.

### Phase 3: Bookings & Dashboards
- **Shared Resources**: Distinct handling for temporary bookings (e.g., reserving a projector for 3 hours) versus permanent allocations.
- **Collision Detection**: Server-side logic must reject overlapping timeframes before hitting the database.
- **Live KPIs**: Top-level dashboard cards showing total assets, active allocations, pending repairs, and active audits.

### Phase 4: Maintenance & Audits
- **Repair Kanban**: Visual drag-and-drop pipeline for maintenance tickets (Pending → In Progress → Resolved).
- **Audit Cycles**: The ability to group a set of assets for physical verification by scope.
- **Status Syncing**: Verification results must auto-update the master asset directory upon cycle closure via a transactional lock.

### Phase 5: Analytics & Logs
- **Activity Log**: Chronological feed of CRUD actions.
- **Automated Alerts**: System-generated warnings natively synthesized for overdue equipment and audit discrepancies.
- **Data Visualization**: Recharts integration depicting resource distribution and maintenance frequency.
- **Export**: Instant CSV blob generation utility.

## 5. Non-Functional Requirements
- **Performance**: Server Actions must be heavily utilized to offload computing and prevent excessive client-side fetching.
- **Design Philosophy**: Minimalist. No heavy borders, no unnecessary tables, extensive use of whitespace, and clear typography.
- **Database Safety**: Prisma `$transaction` blocks must wrap any logic that mutates multiple relational models simultaneously.