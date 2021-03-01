import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaksFilterDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}
