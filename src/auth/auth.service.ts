import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { MailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (isPasswordValid) {
      delete user.password;
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    });

    return { access_token: token };
  }

  async register(data: { email: string; password: string; name: string }) {
    return this.userService.createUser(data);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate and save a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Code expires in 10 minutes

    await this.userService.savePasswordResetCode(
      user.id,
      resetCode,
      expirationTime,
    );

    // Send the reset code via email (implement your email sending logic here)
    await this.mailService.sendPasswordResetEmail(email, resetCode, user.name);

    return 'A password reset code has been sent to your email address.';
  }

  async resetPassword(email: string, resetCode: string, newPassword: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidCode = await this.userService.validatePasswordResetCode(
      user.id,
      resetCode,
    );

    if (!isValidCode) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    await this.userService.updatePassword(user.id, newPassword);

    return { message: 'Password reset successfully' };
  }

  private async verifyPassword(
    providedPassword: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    if (!providedPassword || !storedPasswordHash) {
      throw new UnauthorizedException('Missing password data');
    }

    return bcrypt.compare(providedPassword, storedPasswordHash);
  }
}
