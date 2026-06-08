import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash mật khẩu chung là '1'
  const hashedPassword = await bcrypt.hash('1', 10)

  // 1. Tạo tài khoản Admin
  const admin = await prisma.nGUOI_DUNG.upsert({
    where: { TAI_KHOAN: 'admin' },
    update: {},
    create: {
      TAI_KHOAN: 'admin',
      MAT_KHAU: hashedPassword,
      QUYEN: 'ADMIN',
    },
  })

  // 2. Tạo tài khoản User thông thường
  const user = await prisma.nGUOI_DUNG.upsert({
    where: { TAI_KHOAN: 'user' },
    update: {},
    create: {
      TAI_KHOAN: 'user',
      MAT_KHAU: hashedPassword,
      QUYEN: 'USER',
    },
  })

  // 3. (Tuỳ chọn) Thêm thông tin đăng nhập khác ở đây
  const manager = await prisma.nGUOI_DUNG.upsert({
    where: { TAI_KHOAN: 'manager' },
    update: {},
    create: {
      TAI_KHOAN: 'manager',
      MAT_KHAU: hashedPassword,
      QUYEN: 'ADMIN',
    },
  })

  console.log('Seeding finished.')
  console.log({ admin: admin.TAI_KHOAN, user: user.TAI_KHOAN, manager: manager.TAI_KHOAN })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
