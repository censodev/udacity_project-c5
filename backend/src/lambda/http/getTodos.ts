import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId, makeAPIGatewayProxyResult } from '../utils';
import { TodosService } from '../../helpers/todos'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const todosService = new TodosService()
    const userId = getUserId(event);
    const todos = await todosService.findByUserId(userId)
    return makeAPIGatewayProxyResult(200, {
      items: todos
    })
  })

handler.use(
  cors({
    credentials: true
  })
)
