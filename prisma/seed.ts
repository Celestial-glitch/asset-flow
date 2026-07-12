import { UserRole, AssetStatus, AllocationStatus, BookingStatus, MaintenancePriority, MaintenanceStatus, AuditStatus, AuditItemStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('Clearing old data...')
  await prisma.activityLog.deleteMany()
  await prisma.auditItem.deleteMany()
  await prisma.auditCycle.deleteMany()
  await prisma.maintenanceRequest.deleteMany()
  await prisma.resourceBooking.deleteMany()
  await prisma.allocation.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.assetCategory.deleteMany()
  await prisma.user.deleteMany()
  await prisma.department.deleteMany()

  console.log('Seeding Departments...')
  const itDept = await prisma.department.create({ data: { name: 'IT Department', description: 'Information Technology' } })
  const hrDept = await prisma.department.create({ data: { name: 'Human Resources', description: 'HR & Operations' } })
  const engDept = await prisma.department.create({ data: { name: 'Engineering', description: 'Software & Hardware Engineering' } })

  console.log('Seeding Users...')
  const passwordHash = await bcrypt.hash('password123', 10)
  
  const admin = await prisma.user.create({
    data: { name: 'John Admin', email: 'admin@assetflow.com', passwordHash, role: UserRole.ADMIN, departmentId: itDept.id }
  })
  const manager = await prisma.user.create({
    data: { name: 'Sarah Manager', email: 'manager@assetflow.com', passwordHash, role: UserRole.ASSET_MANAGER, departmentId: hrDept.id }
  })
  const employee1 = await prisma.user.create({
    data: { name: 'Alex Developer', email: 'alex@assetflow.com', passwordHash, role: UserRole.EMPLOYEE, departmentId: engDept.id }
  })
  const employee2 = await prisma.user.create({
    data: { name: 'Sam HR', email: 'sam@assetflow.com', passwordHash, role: UserRole.EMPLOYEE, departmentId: hrDept.id }
  })

  console.log('Seeding Categories...')
  const catLaptop = await prisma.assetCategory.create({ data: { name: 'Laptops', requiresWarrantyTracking: true } })
  const catVehicle = await prisma.assetCategory.create({ data: { name: 'Company Vehicles', requiresWarrantyTracking: true } })
  const catProjector = await prisma.assetCategory.create({ data: { name: 'Projectors', requiresWarrantyTracking: false } })

  console.log('Seeding Assets...')
  const asset1 = await prisma.asset.create({
    data: { name: 'MacBook Pro M3', assetTag: 'AF-LPT-001', categoryId: catLaptop.id, status: AssetStatus.ALLOCATED, isSharedBookable: false }
  })
  const asset2 = await prisma.asset.create({
    data: { name: 'Dell XPS 15', assetTag: 'AF-LPT-002', categoryId: catLaptop.id, status: AssetStatus.ALLOCATED, isSharedBookable: false }
  })
  const asset3 = await prisma.asset.create({
    data: { name: 'Honda Civic Fleet', assetTag: 'AF-VEH-001', categoryId: catVehicle.id, status: AssetStatus.AVAILABLE, isSharedBookable: true }
  })
  const asset4 = await prisma.asset.create({
    data: { name: '4K Sony Projector', assetTag: 'AF-PRJ-001', categoryId: catProjector.id, status: AssetStatus.AVAILABLE, isSharedBookable: true }
  })

  console.log('Seeding Allocations...')
  await prisma.allocation.create({
    data: {
      assetId: asset1.id, userId: employee1.id, departmentId: engDept.id,
      status: AllocationStatus.ACTIVE, expectedReturnDate: new Date(new Date().setDate(new Date().getDate() + 30))
    }
  })
  
  // Create an overdue allocation to trigger reports/alerts
  await prisma.allocation.create({
    data: {
      assetId: asset2.id, userId: employee2.id, departmentId: hrDept.id,
      status: AllocationStatus.ACTIVE, expectedReturnDate: new Date(new Date().setDate(new Date().getDate() - 5))
    }
  })

  console.log('Seeding Bookings...')
  await prisma.resourceBooking.create({
    data: {
      assetId: asset3.id, userId: employee1.id,
      startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      endTime: new Date(new Date().setHours(new Date().getHours() + 5)),
      status: BookingStatus.UPCOMING
    }
  })

  console.log('Seeding Maintenance Requests...')
  await prisma.maintenanceRequest.create({
    data: {
      assetId: asset4.id, requestedById: employee2.id,
      issueDescription: 'Bulb is flickering constantly during presentations.',
      priority: MaintenancePriority.MEDIUM, status: MaintenanceStatus.PENDING
    }
  })
  
  console.log('Seeding Audits...')
  const audit = await prisma.auditCycle.create({
    data: { name: 'Q3 Global Equipment Audit', conductedById: admin.id, status: AuditStatus.OPEN }
  })
  
  await prisma.auditItem.create({
    data: { auditCycleId: audit.id, assetId: asset1.id, status: AuditItemStatus.VERIFIED }
  })
  await prisma.auditItem.create({
    data: { auditCycleId: audit.id, assetId: asset3.id, status: AuditItemStatus.MISSING }
  })
  
  console.log('Seeding Activity Logs...')
  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: 'REGISTERED_ASSET', details: 'Registered MacBook Pro M3' },
      { userId: manager.id, action: 'ALLOCATED_ASSET', details: 'Allocated Dell XPS 15 to Sam HR' },
      { userId: employee1.id, action: 'BOOKED_RESOURCE', details: 'Booked Honda Civic Fleet' }
    ]
  })

  console.log('✨ Database magically seeded with Hackathon demo data! ✨')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
