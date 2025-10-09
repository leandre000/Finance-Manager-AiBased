import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export async function seedInitialUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository('User');
  
  // Check if user already exists
  const existingUser = await userRepository.findOne({
    where: { email: 'Iamshemaleandre@gmail.com' }
  });

  if (existingUser) {
    console.log('Initial admin user already exists');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('shema@1050!', 10);
  
  const adminUser = userRepository.create({
    email: 'Iamshemaleandre@gmail.com',
    fullName: 'Shema Leandre',
    password: hashedPassword,
    isActive: true
  });

  await userRepository.save(adminUser);
  console.log('✅ Initial admin user created successfully');
  console.log('Email: Iamshemaleandre@gmail.com');
}

