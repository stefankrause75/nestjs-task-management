import { Test } from '@nestjs/testing';
import { GetTaksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;
  const user = { username: 'Joe' };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters = new GetTaksFilterDto();
      filters.search = 'abc';
      const results = await tasksService.getTasks(filters, user);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(results).toEqual('someValue');
    });
  });
});
