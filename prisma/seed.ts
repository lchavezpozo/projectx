import { PrismaClient, SystemRole, CompanyRole, BookingStatus, AbsenceType, NotificationType, NotificationChannel, Rating, ReviewStatus, Weekday, SubscriptionPlan, SubscriptionStatus, Company, Branch, Staff, Client, ServiceProvider, Service, ServiceBranch } from '../lib/generated/prisma';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.staffAbsence.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.availabilityTemplate.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.serviceBranch.deleteMany();
  await prisma.service.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.client.deleteMany();
  await prisma.companyMember.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await hash('123456', 12);

  // 1. Crear 2 empresas
  const companies: Company[] = await Promise.all([
    prisma.company.create({
      data: {
        name: 'Bella Estética Spa',
        timezone: 'America/Mexico_City',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Centro de Bienestar Zen',
        timezone: 'America/Mexico_City',
      },
    }),
  ]);

  console.log('✅ Empresas creadas');

  // 2. Crear sucursales para cada empresa (2 por empresa)
  const branches: Branch[] = [];
  for (const company of companies) {
    const companyBranches = await Promise.all([
      prisma.branch.create({
        data: {
          name: `${company.name} - Centro`,
          address: 'Av. Principal #123, Centro',
          companyId: company.id,
        },
      }),
      prisma.branch.create({
        data: {
          name: `${company.name} - Norte`,
          address: 'Blvd. Norte #456, Zona Norte',
          companyId: company.id,
        },
      }),
    ]);
    branches.push(...companyBranches);
  }

  console.log('✅ Sucursales creadas');

  // 3. Crear servicios
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Corte de Cabello',
        description: 'Corte profesional de cabello',
        duration: 45,
        basePrice: 300,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Manicura',
        description: 'Cuidado profesional de uñas',
        duration: 60,
        basePrice: 250,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Masaje Relajante',
        description: 'Masaje terapéutico para relajación',
        duration: 90,
        basePrice: 800,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Facial Hidratante',
        description: 'Tratamiento facial completo',
        duration: 75,
        basePrice: 600,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Pedicura',
        description: 'Cuidado profesional de pies',
        duration: 50,
        basePrice: 280,
      },
    }),
  ]);

  console.log('✅ Servicios creados');

  // 4. Crear ServiceBranch (servicios disponibles en cada sucursal)
  const serviceBranches = [];
  for (const branch of branches) {
    for (const service of services) {
      const serviceBranch = await prisma.serviceBranch.create({
        data: {
          serviceId: service.id,
          branchId: branch.id,
          price: service.basePrice + (Math.random() * 100 - 50), // Variación de precio por sucursal
        },
      });
      serviceBranches.push(serviceBranch);
    }
  }

  console.log('✅ Servicios por sucursal creados');

  // 5. Crear usuarios staff para cada empresa (10 por empresa)
  const staffMembers = [];

  for (let companyIndex = 0; companyIndex < companies.length; companyIndex++) {
    const company = companies[companyIndex];
    
    for (let i = 1; i <= 10; i++) {
      const user = await prisma.user.create({
        data: {
          email: `staff${i}@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
          password: hashedPassword,
          name: `Staff ${i} ${company.name.split(' ')[0]}`,
          phone: `555-0${i.toString().padStart(3, '0')}`,
        },
      });

      const companyMember = await prisma.companyMember.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: CompanyRole.STAFF,
        },
      });

      const staff = await prisma.staff.create({
        data: {
          companyMemberId: companyMember.id,
        },
      });

      staffMembers.push(staff);
    }
  }

  console.log('✅ Staff creado');

  // 6. Crear ServiceProviders (staff que ofrece servicios)
  const serviceProviders = [];
  for (const staff of staffMembers) {
    // Cada staff ofrece 2-3 servicios aleatorios
    const numberOfServices = 2 + Math.floor(Math.random() * 2);
    
    // Obtener companyMember para determinar la empresa
    const companyMember = await prisma.companyMember.findUnique({ 
      where: { id: staff.companyMemberId } 
    });
    
    if (companyMember) {
      const shuffledServiceBranches = serviceBranches
        .filter(sb => branches.find(b => b.id === sb.branchId)?.companyId === companyMember.companyId)
        .sort(() => 0.5 - Math.random())
        .slice(0, numberOfServices);

      for (const serviceBranch of shuffledServiceBranches) {
        const serviceProvider = await prisma.serviceProvider.create({
          data: {
            serviceBranchId: serviceBranch.id,
            staffId: staff.id,
            price: serviceBranch.price + (Math.random() * 50 - 25), // Variación personal
          },
        });
        serviceProviders.push(serviceProvider);
      }
    }
  }

  console.log('✅ Proveedores de servicios creados');

  // 7. Crear clientes para cada empresa (20 por empresa)
  const clients = [];
  for (let companyIndex = 0; companyIndex < companies.length; companyIndex++) {
    const company = companies[companyIndex];
    
    for (let i = 1; i <= 20; i++) {
      const user = await prisma.user.create({
        data: {
          email: `cliente${i}@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
          password: hashedPassword,
          name: `Cliente ${i} ${company.name.split(' ')[0]}`,
          phone: `555-1${i.toString().padStart(3, '0')}`,
        },
      });

      const companyMember = await prisma.companyMember.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: CompanyRole.CLIENT,
        },
      });

      const client = await prisma.client.create({
        data: {
          companyMemberId: companyMember.id,
        },
      });

      clients.push(client);
    }
  }

  console.log('✅ Clientes creados');

  // 8. Crear AvailabilityTemplates
  const templates = await Promise.all([
    prisma.availabilityTemplate.create({
      data: {
        name: 'Horario Matutino',
        isActive: true,
      },
    }),
    prisma.availabilityTemplate.create({
      data: {
        name: 'Horario Vespertino',
        isActive: true,
      },
    }),
    prisma.availabilityTemplate.create({
      data: {
        name: 'Fin de Semana',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Plantillas de disponibilidad creadas');

  // 9. Crear AvailabilitySlots
  const weekdays = [Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY, Weekday.THURSDAY, Weekday.FRIDAY];
  const weekendDays = [Weekday.SATURDAY, Weekday.SUNDAY];

  // Horario matutino (8:00 - 14:00)
  for (const serviceProvider of serviceProviders.slice(0, Math.floor(serviceProviders.length / 2))) {
    for (const weekday of weekdays) {
      await prisma.availabilitySlot.create({
        data: {
          templateId: templates[0].id,
          serviceProviderId: serviceProvider.id,
          weekday,
          startTime: '08:00',
          endTime: '14:00',
        },
      });
    }
  }

  // Horario vespertino (14:00 - 20:00)
  for (const serviceProvider of serviceProviders.slice(Math.floor(serviceProviders.length / 2))) {
    for (const weekday of weekdays) {
      await prisma.availabilitySlot.create({
        data: {
          templateId: templates[1].id,
          serviceProviderId: serviceProvider.id,
          weekday,
          startTime: '14:00',
          endTime: '20:00',
        },
      });
    }
  }

  // Horario fin de semana
  for (const serviceProvider of serviceProviders.slice(0, Math.floor(serviceProviders.length / 3))) {
    for (const weekday of weekendDays) {
      await prisma.availabilitySlot.create({
        data: {
          templateId: templates[2].id,
          serviceProviderId: serviceProvider.id,
          weekday,
          startTime: '10:00',
          endTime: '16:00',
        },
      });
    }
  }

  console.log('✅ Slots de disponibilidad creados');

  // 10. Crear bookings (5 por empresa)
  const bookings = [];
  for (let companyIndex = 0; companyIndex < companies.length; companyIndex++) {
    const companyBranches = branches.filter(b => b.companyId === companies[companyIndex].id);
    const companyClients = clients.slice(companyIndex * 20, (companyIndex + 1) * 20);
    
    // Filtrar service providers por empresa
    const companyServiceProviders = [];
    for (const sp of serviceProviders) {
      const staff = staffMembers.find(s => s.id === sp.staffId);
      if (staff) {
        const companyMember = await prisma.companyMember.findUnique({ 
          where: { id: staff.companyMemberId } 
        });
        if (companyMember && companyMember.companyId === companies[companyIndex].id) {
          companyServiceProviders.push(sp);
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      const randomClient = companyClients[Math.floor(Math.random() * companyClients.length)];
      const randomServiceProvider = companyServiceProviders[Math.floor(Math.random() * companyServiceProviders.length)];
      const randomBranch = companyBranches[Math.floor(Math.random() * companyBranches.length)];
      
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + Math.floor(Math.random() * 30)); // Próximos 30 días
      startTime.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0); // Entre 9:00 y 17:00
      
      const service = await prisma.serviceBranch.findUnique({
        where: { id: randomServiceProvider.serviceBranchId },
        include: { service: true }
      });
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (service?.service.duration || 60));

      const booking = await prisma.booking.create({
        data: {
          clientId: randomClient.id,
          serviceProviderId: randomServiceProvider.id,
          branchId: randomBranch.id,
          startTime,
          endTime,
          status: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED][Math.floor(Math.random() * 3)],
          notes: i % 2 === 0 ? `Nota para booking ${i + 1}` : null,
        },
      });

      bookings.push(booking);
    }
  }

  console.log('✅ Reservas creadas');

  // 11. Crear StaffAbsence (2 miembros del staff)
  const selectedStaff = [staffMembers[0], staffMembers[10]]; // Uno de cada empresa

  for (let i = 0; i < selectedStaff.length; i++) {
    const staff = selectedStaff[i];
    
    await prisma.staffAbsence.create({
      data: {
        staffId: staff.id,
        type: i === 0 ? AbsenceType.VACATION : AbsenceType.SICK_LEAVE,
        startDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000), // En 1-2 semanas
        endDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000 + 3 * 24 * 60 * 60 * 1000), // 3 días después
        description: i === 0 ? 'Vacaciones familiares' : 'Recuperación médica',
        isApproved: true,
      },
    });
  }

  console.log('✅ Ausencias del staff creadas');

  // 12. Crear suscripciones para las empresas
  for (const company of companies) {
    await prisma.subscription.create({
      data: {
        companyId: company.id,
        plan: SubscriptionPlan.PROFESSIONAL,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        maxUsers: 50,
        maxBranches: 10,
        features: {
          maxBookingsPerDay: 100,
          customDomain: true,
          advancedAnalytics: true,
          emailNotifications: {
            bookingReminders: true,
            marketing: true
          },
          integrations: {
            googleCalendar: true,
            stripe: true
          },
          customization: {
            branding: true,
            customFields: 10
          }
        },
      },
    });
  }

  console.log('✅ Suscripciones creadas');

  // 13. Crear algunas reseñas para bookings completados
  const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
  
  for (const booking of completedBookings.slice(0, 3)) {
    await prisma.review.create({
      data: {
        bookingId: booking.id,
        clientId: booking.clientId,
        rating: [Rating.FOUR_STARS, Rating.FIVE_STARS][Math.floor(Math.random() * 2)],
        comment: 'Excelente servicio, muy recomendado!',
        status: ReviewStatus.APPROVED,
      },
    });
  }

  console.log('✅ Reseñas creadas');

  console.log('🎉 Seed completado exitosamente!');
  console.log(`
📊 Resumen de datos creados:
• 2 empresas
• 4 sucursales (2 por empresa)
• 5 servicios
• 20 usuarios staff (10 por empresa)
• 40 clientes (20 por empresa)
• 3 plantillas de disponibilidad
• ${serviceProviders.length} proveedores de servicios
• 10 reservas (5 por empresa)
• 2 ausencias de staff
• 2 suscripciones
• 3 reseñas
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 