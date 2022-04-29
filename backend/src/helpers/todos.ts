import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
export class TodosService {
    constructor(private readonly todosAccess = new TodosAccess) {}

    async findByUserId (userId: string): Promise<TodoItem[]> {
        return this.todosAccess.findByUserId(userId)
    }

    async create (userId: string, body: CreateTodoRequest): Promise<string> {
        return this.todosAccess.create(userId, body)
    }

    async update (todoId: string, userId: string, body: UpdateTodoRequest): Promise<void> {
        await this.todosAccess.update(todoId, userId, body)
    }

    async delete (todoId, userId: string): Promise<any> {
        await this.todosAccess.delete(todoId, userId)
    }
}
