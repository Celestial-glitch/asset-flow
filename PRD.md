# Product Requirements Document (PRD): AssetFlow

## 1. Executive Summary

**Product Vision:** 
AssetFlow simplifies and digitizes how organizations track, allocate, and maintain their physical assets and shared resources through a centralized ERP platform[cite: 1]. 
*   **Target User & Use Case:** Any organization (including offices, schools, hospitals, factories, and agencies) needing to manage equipment, furniture, vehicles, or shared spaces[cite: 1].
*   **Key Differentiator & Value Proposition:** Delivers core ERP functionality, clean architecture, and secure role-based workflows without the complexity of purchasing, invoicing, or accounting modules[cite: 1].
*   **Success Definition & Metrics:** Success is defined by the elimination of manual tracking inefficiencies, providing real-time visibility into asset locations, and preventing booking overlaps[cite: 1].

**Strategic Alignment:**
*   **Business Objectives:** Build a user-centric, responsive application that demonstrates proper ERP architecture and reusable modules[cite: 1].
*   **User Problems Solved:** Replaces inefficient spreadsheets and paper logs[cite: 1]. 
*   **Competitive Advantage:** Offers an intuitive UI/UX while seamlessly handling complex relationships between departments, employees, assets, bookings, maintenance, and audits[cite: 1].

## 2. Problem Statement & Opportunity

**Problem Definition:**
*   Organizations suffer from manual tracking inefficiencies due to reliance on spreadsheets and paper logs[cite: 1].
*   There is a lack of real-time visibility into who holds specific assets, where they are located, and their current condition[cite: 1].
*   Current systems allow for the double-allocation of a single asset and overlapping bookings for shared resources[cite: 1].
*   Organizations lack structured workflows for maintenance approvals and scheduled audit cycles[cite: 1].

## 3. User Requirements & Stories

**Primary User Personas:**
*   **Admin:** Manages master data including departments, asset categories, audit cycles, and employee role assignments[cite: 1]. 
*   **Asset Manager:** Registers assets, approves transfers and maintenance requests, and handles audit discrepancy resolutions[cite: 1].
*   **Department Head:** Views departmental assets, approves internal allocations, and books shared resources on behalf of the department[cite: 1].
*   **Employee:** Views their allocated assets, books shared resources, and raises maintenance or transfer requests[cite: 1].

## 4. Functional Requirements

**Core Features (Must Have):**
*   **Login / Signup Screen:** Email and password authentication where signup creates a basic Employee account only[cite: 1].
*   **Dashboard / Home Screen:** Provides role-based KPI cards (Assets Available, Maintenance Today, Active Bookings) and quick action buttons[cite: 1].
*   **Organization Setup (Admin Only):** Three tabs for managing departments, asset categories, and the employee directory[cite: 1].
*   **Asset Registration & Directory:** Allows registration of assets with details like Serial Number, Condition, and Location, alongside search and filtering capabilities[cite: 1].
*   **Asset Allocation & Transfer:** Manages assignments with explicit conflict rules preventing double-allocation, and includes an approval workflow for transfers[cite: 1].
*   **Resource Booking:** Features a calendar view for time-slot booking of shared resources with strict overlap validation[cite: 1].
*   **Maintenance Management:** Routes repair requests through a Pending to Approved/Rejected workflow, updating asset status automatically[cite: 1].
*   **Asset Audit:** Facilitates structured verification cycles where auditors mark assets as Verified, Missing, or Damaged, generating discrepancy reports[cite: 1].

## 5. Technical Specifications

**Architecture & Stack:**
*   **Frontend/Framework:** Next.js (App Router), React, Tailwind CSS.
*   **Database:** Supabase (PostgreSQL) for hosted relational data.
*   **ORM:** Prisma for type-safe database queries and schema migrations.
*   **Design Pattern:** Modular ERP architecture separating core tracking features from accounting/purchasing concerns[cite: 1].

## 6. UX & Design Reference
*   **Visual Mockups (Excalidraw):** https://app.excalidraw.com/l/65VNwvy7c4X/5ceOBMjbDby
*   **Interface Requirements:** Dashboard must highlight overdue returns separately; Booking screens must utilize a calendar view; Allocation conflicts must display current asset holder[cite: 1].