// './auth.service.ts'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.users.findUnique({ where: { Email: email } });
        if (!user) throw new UnauthorizedException('Credenciales incorrectas');

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) throw new UnauthorizedException('Credenciales incorrectas');

        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        // 👈 AGREGA OrganizationId al payload
        const payload = {
            sub: user.UserId,
            email: user.Email,
            orgId: user.OrganizationId, // <-- clave para multi-empresa
        };

        const token = await this.jwt.signAsync(payload);
        return { access_token: token };
    }
} 