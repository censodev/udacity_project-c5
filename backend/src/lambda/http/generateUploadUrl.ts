import { AttachmentService } from './../../services/attachment.service';
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId, makeAPIGatewayProxyResult } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const attachmentService = new AttachmentService()
    const uploadUrl = await attachmentService.createAttachmentPresignedUrl(todoId);
    const userId = getUserId(event)
    await attachmentService.updateTodoAttachmentUrl(todoId, userId);
    return makeAPIGatewayProxyResult(200, {
      uploadUrl: uploadUrl
    })
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
