import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHmac } from 'crypto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: any) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Find the default role (e.g., "User")
    const userRole = await this.prisma.role.findUnique({
      where: { name: data.role || 'User' },
    });

    if (!userRole) {
      throw new NotFoundException('Default role not found');
    }

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: {
          connect: { id: userRole.id },
        },
      },
      include: { role: true },
    });
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  async updateUser(userId: number, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: data,
      include: { role: true },
    });
  }

  async savePasswordResetCode(
    userId: number,
    resetCode: string,
    expirationTime: Date,
  ) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: resetCode,
        passwordTokenExpires: expirationTime,
      },
    });
  }

  async validatePasswordResetCode(userId: number, resetCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (
      !user ||
      user.passwordResetToken !== resetCode ||
      new Date() > user.passwordTokenExpires
    ) {
      return false;
    }

    return true;
  }

  async updatePassword(userId: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordTokenExpires: null,
      },
    });
  }

  async getUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
  }
}
