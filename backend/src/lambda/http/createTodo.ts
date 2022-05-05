import { makeAPIGatewayProxyResult } from './../utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { TodoService } from '../../services/todo.service';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const service = new TodoService()
    const userId = getUserId(event);
    const id = await service.create(userId, newTodo);
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
