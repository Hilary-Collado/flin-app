import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString() @IsNotEmpty() @MinLength(2)
  name: string;

  @IsString() @IsNotEmpty()
  phone: string;

  // Si usas catálogo de servicios: envías el id del Service
  @IsOptional() @IsInt()
  serviceId?: number;

  @IsOptional() @IsString()
  notes?: string;

  @IsOptional() @IsUrl()
  avatarUrl?: string;
}
