import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import * as uuid from 'uuid'
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodoRepository {
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
        return result.Items as TodoItem[]
    }

    async create(userId: string, body: CreateTodoRequest): Promise<string> {
        const todoId = uuid.v4();
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
        return this.docClient.update({
            TableName: this.tableName,
            Key: {
                "todoId": todoId,
                "userId": userId
            },
            UpdateExpression: "set #aliasName = :name, done = :done, dueDate = :dueDate",
            ExpressionAttributeNames: {
                "#aliasName": "name"
            },
            ExpressionAttributeValues: {
                ":name": body.name,
                ":done": body.done,
                ":dueDate": body.dueDate
            }
        }).promise()

    }

    async delete(todoId: string, userId: string): Promise<any> {
        return this.docClient.delete({
            TableName: this.tableName,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise();
    }
}