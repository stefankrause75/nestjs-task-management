import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    task.description = createTaskDto.description;
    task.title = createTaskDto.title;
    task.due = createTaskDto.due;
    task.isPrivate = createTaskDto.isPrivate;
    task.priority = createTaskDto.priority;
    task.status = TaskStatus.OPEN;
    task.userId = user.id;
    try {
      return await task.save();
    } catch (err) {
      this.logger.error(
        `Failed to create task for user ${user?.username} data ${JSON.stringify(
          createTaskDto,
        )}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTasks(filterDto: GetTaksFilterDto, user: User): Promise<Task[]> {
    console.log('getTasks', filterDto, user?.id);
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title like :search OR task.description like :search)',
        {
          search: `%${search}%`,
        },
      );
    }
    query.addOrderBy('task.id');
    console.log('sql ', query.getSql());
    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get user for ${user?.username} dto : ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
