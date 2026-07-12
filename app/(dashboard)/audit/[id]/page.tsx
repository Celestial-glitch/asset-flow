import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AuditChecklist } from "./AuditChecklist";
import { auth } from "@/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AuditDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  const cycle = await prisma.auditCycle.findUnique({
    where: { id: resolvedParams.id },
    include: {
      department: true,
      items: true
    }
  });

  if (!cycle) notFound();

  // Fetch all active inventory assets
  const assets = await prisma.asset.findMany({
    where: {
      status: { notIn: ['RETIRED'] }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/audit" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 mb-4 transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Audits
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{cycle.name}</h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <p>Scope: <span className="font-medium text-gray-700">{cycle.department?.name || 'Global (All)'}</span></p>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
          <p>Status: <span className="font-medium text-gray-700">{cycle.status}</span></p>
        </div>
      </div>

      <AuditChecklist 
        cycleId={cycle.id} 
        assets={assets} 
        loggedItems={cycle.items} 
        status={cycle.status} 
        canManage={session?.user?.role !== "EMPLOYEE"}
      />
    </div>
  );
}
