import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: any) {
    console.log('TaskStatusValidationPipe', value);
    if (
      ![TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE].includes(
        value.status,
      )
    ) {
      throw new BadRequestException(`status "${value.status}" is invalid`);
    }
    return value;
  }
}
