import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { title } from 'process';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';



@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.description.toLowerCase().includes(search) || task.title.toLowerCase().includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    }

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTaskById(id: string): void {
    const task: Task = this.tasks.find((task) => task.id === id);
    this.tasks.splice(this.tasks.indexOf(task), 1);

  }

  updateTaskStatusById(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  searchTask(title: string, description: string): Task {
    if (title.length == 0 && description.length == 0) {
      return null;
    }
    const task: Task = this.tasks.find((task) => {
      if (task.title == title || task.description == description) {
        return task;
      }
    });
    return task;
  }

}
