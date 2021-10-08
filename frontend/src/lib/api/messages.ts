import client from "lib/api/client"
import { Message } from "interfaces/index"

export const createMessage = (data: Message) => {
  return client.post("messages", data)
}