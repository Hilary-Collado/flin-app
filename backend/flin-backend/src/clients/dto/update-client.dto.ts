import { IsInt, IsOptional, IsString, IsUrl, IsIn, MinLength } from 'class-validator';

export class UpdateClientDto {
  @IsOptional() @IsString() @MinLength(2)
  name?: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsInt()
  serviceId?: number;

  @IsOptional() @IsString()
  notes?: string;

  @IsOptional() @IsUrl()
  avatarUrl?: string;

  @IsOptional() @IsString() @IsIn(['PENDING','IN_PROGRESS','DONE'])
  status?: string;
}
