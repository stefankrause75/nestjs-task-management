import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsOptional()
  priority: number;

  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;

  @IsDate()
  @IsOptional()
  due: Date;
}
