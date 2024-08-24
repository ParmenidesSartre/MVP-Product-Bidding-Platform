import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../guard/permissions.guard';
import { Resource } from '../decorators/resource.decorator';

@Controller('modules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @Resource('Module')
  createModule(@Body('name') name: string) {
    return this.moduleService.createModule(name);
  }

  @Patch(':id')
  @Resource('Module')
  updateModule(@Param('id') id: number, @Body('name') name: string) {
    return this.moduleService.updateModule(id, name);
  }

  @Delete(':id')
  @Resource('Module')
  deleteModule(@Param('id') id: number) {
    return this.moduleService.deleteModule(id);
  }

  @Get()
  @Resource('Module')
  getAllModules() {
    return this.moduleService.getAllModules();
  }

  @Get(':id')
  @Resource('Module')
  getModuleById(@Param('id') id: number) {
    return this.moduleService.getModuleById(id);
  }
}
