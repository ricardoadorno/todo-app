import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
}
