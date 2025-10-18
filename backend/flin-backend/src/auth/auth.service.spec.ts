// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,  // <-- se inyecta desde PrismaModule
    private readonly jwt: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.users.findUnique({ where: { Email: email } });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    const ok = await bcrypt.compare(password, user.PasswordHash);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.UserId, email: user.Email, orgId: user.OrganizationId };
    return { access_token: await this.jwt.signAsync(payload) };
  }
}
