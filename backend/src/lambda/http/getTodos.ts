import { TodoService } from './../../services/todo.service';
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId, makeAPIGatewayProxyResult } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const service = new TodoService()
    const userId = getUserId(event);
    const todos = await service.findByUserId(userId)
    return makeAPIGatewayProxyResult(200, {
      items: todos
    })
  })

handler.use(
  cors({
    credentials: true
  })
)
