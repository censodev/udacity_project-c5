import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoRepository } from './../repositories/todo.repository';

export class TodoService {
    constructor(private readonly repo = new TodoRepository) {}

    async findByUserId (userId: string): Promise<TodoItem[]> {
        return this.repo.findByUserId(userId)
    }

    async create (userId: string, body: CreateTodoRequest): Promise<string> {
        return this.repo.create(userId, body)
    }

    async update (todoId: string, userId: string, body: UpdateTodoRequest): Promise<void> {
        await this.repo.update(todoId, userId, body)
    }

    async delete (todoId, userId: string): Promise<any> {
        await this.repo.delete(todoId, userId)
    }
}