import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async createModule(name: string) {
    return this.prisma.module.create({
      data: { name },
    });
  }

  async updateModule(id: number, name: string) {
    const module = await this.prisma.module.update({
      where: { id },
      data: { name },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async deleteModule(id: number) {
    const module = await this.prisma.module.delete({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async getAllModules() {
    return this.prisma.module.findMany();
  }

  async getModuleById(id: number) {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }
}
