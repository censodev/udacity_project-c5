import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId, makeAPIGatewayProxyResult } from '../utils'
import { TodosService } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const userId = await getUserId(event)
    const todosService = new TodosService()
    await todosService.update(todoId, userId, updatedTodo)
    return makeAPIGatewayProxyResult(200, {})
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
