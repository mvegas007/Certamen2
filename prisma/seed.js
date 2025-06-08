const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/auth');

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar si ya existe un usuario
    const existingUser = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingUser) {
      console.log('Usuario admin ya existe, omitiendo seed...');
      return;
    }

    // Crear el primer usuario del sistema
    const hashedPassword = await hashPassword('certamen123');
    
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        name: 'Administrador',
        password: hashedPassword,
      }
    });

    console.log('Usuario creado exitosamente:', user);

    // Crear algunos recordatorios de ejemplo
    await prisma.reminder.createMany({
      data: [
        {
          content: 'Revisar el sistema de autenticación',
          important: true,
          userId: user.id
        },
        {
          content: 'Implementar validaciones',
          important: false,
          userId: user.id
        },
        {
          content: 'Documentar la API',
          important: true,
          userId: user.id
        }
      ]
    });

    console.log('Recordatorios de ejemplo creados');

  } catch (error) {
    console.error('Error en seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });