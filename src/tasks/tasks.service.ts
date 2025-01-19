import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks() {
    return this.prisma.task.findMany();
  }

  async getTask(id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (task?.description) return task;

    throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const newTask = this.prisma.task.create({
      data: {
        description: createTaskDto.description,
        completed: false,
      },
    });

    return newTask;
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    const findTask = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (!findTask) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const task = this.prisma.task.update({
      where: {
        id: findTask.id,
      },
      data: updateTaskDto,
    });

    return task;
  }

  async deleteTask(id: number) {
    const findTask = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (!findTask) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.task.delete({
      where: {
        id: findTask.id,
      },
    });

    return {
      message: 'Task Deleted',
    };
  }
}
