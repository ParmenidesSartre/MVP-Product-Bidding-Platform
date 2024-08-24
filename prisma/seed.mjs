// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create the SuperAdmin Role with associated RoleModulePermissions
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SuperAdmin' },
    update: {},
    create: {
      name: 'SuperAdmin',
      permissions: {
        create: [
          {
            Module: {
              connectOrCreate: {
                where: { name: 'Role' },
                create: { name: 'Role' },
              },
            },
            canCreate: true,
            canRead: true,
            canUpdate: true,
            canDelete: true,
            canDownload: true,
          },
        ],
      },
    },
  });

  // Create the User Role with associated RoleModulePermissions
  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      permissions: {
        create: [
          {
            Module: {
              connectOrCreate: {
                where: { name: 'Role' },
                create: { name: 'Role' },
              },
            },
            canCreate: false,
            canRead: true,
            canUpdate: false,
            canDelete: false,
            canDownload: false,
          },
        ],
      },
    },
  });

  const hashedPassword = await bcrypt.hash('superadminpassword', 10);

  // Create a new User and associate it with the SuperAdmin role
  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: {
        connect: { id: superAdminRole.id }, // Associate the user with the SuperAdmin role
      },
    },
  });
  console.log('SuperAdmin and User roles created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
