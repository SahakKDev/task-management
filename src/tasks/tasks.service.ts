import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  getTasks(filterDto: GetTasksFilterDto) {
    const { search, status } = filterDto;

    const qb = this.tasksRepository.createQueryBuilder('task');

    if (search) {
      qb.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    return qb.getMany();
  }

  async getTaskById(id: string) {
    const found = await this.tasksRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with #ID "${id}" does not exist.`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);

    return task;
  }

  async deleteTask(id: string) {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with #ID "${id}" does not exist.`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.tasksRepository.save(task);
    return task;
  }
}