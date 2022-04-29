import { TodosService } from './../../helpers/todos';
import { makeAPIGatewayProxyResult } from './../utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const todosService = new TodosService()
    const userId = getUserId(event);
    const id = await todosService.create(userId, newTodo);
    return makeAPIGatewayProxyResult(200, {
      item:
      {
        todoId: id,
        ...newTodo
      }
    })
  }
)

handler.use(
  cors({
    credentials: true
  })
)
