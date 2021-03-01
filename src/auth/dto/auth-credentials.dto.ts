import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(128)
  username: string;

  @IsString()
  @MinLength(8, { message: 'password too weak' })
  @MaxLength(128)
  password: string;
}
