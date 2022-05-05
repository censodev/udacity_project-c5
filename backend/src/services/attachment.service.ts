import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const bucketName = process.env.TODOS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({ signatureVersion: 'v4' });

export class AttachmentService {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
    }

    async createAttachmentPresignedUrl(todoId: string): Promise<string> {
        return s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: parseInt(urlExpiration)
        });
    }

    async updateTodoAttachmentUrl(todoId: string, userId: string) {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${todoId}`
            }
        }).promise();
    }
}