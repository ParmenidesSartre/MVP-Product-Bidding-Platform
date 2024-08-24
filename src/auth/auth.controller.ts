import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    try {
      const userData = { email, password, name };
      await this.authService.register(userData);
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    const message = await this.authService.forgotPassword(email);
    return { message };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    const message = await this.authService.resetPassword(
      email,
      token,
      newPassword,
    );
    return { message };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: Request) {
    return req.user;
  }

  // Social Media Authentication
  @UseGuards(GithubAuthGuard)
  @Get('github')
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  githubAuth(@Req() req: Request) {
    console.log('GitHub authentication started for session:', req.sessionID);
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  @HttpCode(HttpStatus.OK)
  githubAuthCallback(@Req() req: Request) {
    return this.authService.login(req.user);
  }
}
