import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaksFilterDto } from './dto/get-tasks-filter.dto';
import { IdParamDto } from './dto/id-param.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(private taskService: TasksService) {}
  @Get()
  getTasks(
    @Query() filterDto: GetTaksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user?.username}" retrieve all tasks. Filter: "${JSON.stringify(
        filterDto,
      )}"`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param() p: IdParamDto, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskByid(p.id, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param() p: IdParamDto, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTaskById(p.id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} create Task ${JSON.stringify(createTaskDto)}`,
    );
    console.log('createTask', createTaskDto, user);
    const task = await this.taskService.createTask(createTaskDto, user);
    return task;
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user,
  ): Promise<Task> {
    console.log('updateTaskStatus', updateTaskStatusDto);
    return this.taskService.updateTaskStatus(id, updateTaskStatusDto, user);
  }
}
