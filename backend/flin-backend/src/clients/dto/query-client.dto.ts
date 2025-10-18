import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

export class QueryClientDto {
  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsString() @IsIn(['PENDING','IN_PROGRESS','DONE'])
  status?: string;

  @IsOptional() @IsNumberString()
  serviceId?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  skip?: number = 0;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  take?: number = 20;

  @IsOptional() @IsString() @IsIn(['CreatedAt','Name'])
  orderBy?: 'CreatedAt' | 'Name' = 'CreatedAt';

  @IsOptional() @IsString() @IsIn(['asc','desc'])
  orderDir?: 'asc' | 'desc' = 'desc';
}
