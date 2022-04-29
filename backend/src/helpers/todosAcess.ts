import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly tableName = process.env.TODOS_TABLE) { }

    async findByUserId(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.tableName,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            },
            ScanIndexForward: false
        }).promise();
        logger.info(`Todo findByUserId ${userId}: ${result}`);
        return result.Items as TodoItem[]
    }

    async create(userId: string, body: CreateTodoRequest): Promise<string> {
        const todoId = uuid.v4();
        logger.info(`Todo create with id ${todoId} for user ${userId}: ${body}`);
        await this.docClient.put({
            TableName: this.tableName,
            Item: {
                userId: userId,
                todoId: todoId,
                createdAt: new Date().toISOString(),
                done: false,
                ...body
            }
        }).promise();
        return todoId;
    }

    async update(todoId: string, userId: string, body: UpdateTodoRequest): Promise<any> {
        logger.info(`Todo update with id ${todoId} of user ${userId}: ${body}`)
        return this.docClient.update({
            TableName: this.tableName,
            Key: {
                "todoId": todoId,
                "userId": userId
            },
            UpdateExpression: "set name = :name, done = :done, dueDate = :dueDate",
            ExpressionAttributeValues: {
                ":name": body.name,
                ":done": body.done,
                ":dueDate": body.dueDate
            }
        }).promise()

    }

    async delete(todoId: string, userId: string): Promise<any> {
        logger.info(`Todo delete id ${todoId} of user ${userId}`);
        return this.docClient.delete({
            TableName: this.tableName,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise();
    }
}