"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { AllocationStatus, AuditItemStatus } from "@prisma/client";

export async function getCombinedLogsAndAlerts() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // 1. Fetch raw system Activity Logs (foundation for tracking all CRUD actions)
  const logs = await prisma.activityLog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const feed: any[] = logs.map(log => ({
    id: log.id,
    type: 'LOG',
    title: log.action,
    description: log.details || `Action performed by ${log.user.name}`,
    timestamp: log.createdAt,
    severity: 'neutral'
  }));

  // 2. Synthesize Active Overdue Alerts natively
  const overdueAllocations = await prisma.allocation.findMany({
    where: { 
      status: AllocationStatus.ACTIVE,
      expectedReturnDate: { lt: new Date() }
    },
    include: {
      asset: { select: { name: true, assetTag: true } },
      user: { select: { name: true } }
    }
  });

  overdueAllocations.forEach(alloc => {
    feed.push({
      id: `overdue-${alloc.id}`,
      type: 'ALERT',
      title: 'Asset Overdue Return',
      description: `${alloc.asset.name} (${alloc.asset.assetTag}) is overdue from ${alloc.user.name} (Expected: ${new Date(alloc.expectedReturnDate!).toLocaleDateString()})`,
      timestamp: new Date(), // Always surface live alerts to the very top
      severity: 'error'
    });
  });

  // 3. Synthesize Active Audit Discrepancies
  const discrepancies = await prisma.auditItem.findMany({
    where: {
      status: { in: [AuditItemStatus.MISSING, AuditItemStatus.DAMAGED] },
      auditCycle: { status: 'OPEN' } // Only alert for active cycle discrepancies
    },
    include: {
      asset: { select: { name: true, assetTag: true } },
      auditCycle: { select: { name: true } }
    }
  });

  discrepancies.forEach(disc => {
    feed.push({
      id: `disc-${disc.id}`,
      type: 'ALERT',
      title: `Audit Discrepancy: ${disc.status}`,
      description: `${disc.asset.name} (${disc.asset.assetTag}) flagged as ${disc.status} during ${disc.auditCycle.name}.`,
      timestamp: disc.createdAt,
      severity: disc.status === 'MISSING' ? 'error' : 'warning'
    });
  });

  // Sort the combined multidimensional feed chronologically descending
  feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return feed;
}
