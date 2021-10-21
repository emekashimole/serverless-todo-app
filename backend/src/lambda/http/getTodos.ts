import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserTodos } from '../../helpers/businessLogic'
import { AttachmentUtils } from '../../helpers/attachmentUtils'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const attachmentUtils = new AttachmentUtils()
const logger = createLogger('todos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const todos = await getUserTodos(userId)
    logger.info(`Fetched Todo items for user: ${userId}`)

    for (const todo of todos) {
      todo.attachmentUrl = await attachmentUtils.getTodoAttachmentUrl(todo.todoId)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
