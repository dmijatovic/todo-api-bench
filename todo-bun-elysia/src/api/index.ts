
import {AddTodoItem, AddTodoList, DeleteTodoItem, DeleteTodoList, GetAllTodoLists, GetTodoItem, GetTodoItems, GetTodoList, UpdateTodoItem, UpdateTodoList} from "../db/todos"
import { logInfo } from "../utils/log"

type ApiMessage = {
  set: any,
  status?: number,
  message: string
}

function sendError({ set, status=500, message }: ApiMessage) {
  set.status = status
  return {
    status,
    statusMessage: message
  }
}


export async function getHome() {
  return {
    status: 200,
    statusMessage: "Todo Bun Elysia api server running!"
  }
}

export async function getTodoLists({set}:{set:any}) {
  try {
    // make db request
    const payload = await GetAllTodoLists()

    if (payload) {
      set.status = 200
      set.headers['x-powered-by'] = 'bun-elysia-api'

      // return data
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e: any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function getTodoList({set,params}:{set:any,params:any}) {
  try {
    const { id } = params
    const payload = await GetTodoList(id)
    if (payload) {
      // return data
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e:any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function postTodoList({set,body}:{set:any,body:any}) {
  try {
    const title = body['title']
    const payload = await AddTodoList(title)
    if (payload) {
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e:any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function updateTodoList({ set, body }: { set: any, body: any }) {
  try {
    const payload = await UpdateTodoList({
      id: body['id'],
      title: body['title']
    })
    if (payload) {
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e: any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function deleteTodoList({ set, params }: { set: any, params: any }) {
  try {
    const { id } = params
    const payload = await DeleteTodoList(id)
    if (payload) {
      // return data
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e: any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function getTodoItems({ set, params }: { set: any, params: any }) {
  try {
    const { id } = params
    const payload = await GetTodoItems(id)
    if (payload) {
      // return data
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e: any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function addTodoItem({ set, body, params }: { set: any, body: any, params:any }) {
  try {
    const payload = await AddTodoItem({
      list_id: params['id'],
      title: body['title'],
      checked: body['checked']
    })
    if (payload) {
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e: any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function getTodoItem({ set, params }: { set: any, params: any }) {
  try {
    const { id } = params
    const payload = await GetTodoItem(id)
    if (payload) {
      // return data
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e: any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function updateTodoItem({ set, body, params }: { set: any, body: any, params: any }) {
  try {
    const payload = await UpdateTodoItem({
      id: params['id'],
      list_id: body['list_id'],
      title: body['title'],
      checked: body['checked']
    })
    if (payload) {
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e: any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}

export async function deleteTodoItem({ set, params }: { set: any, params: any }) {
  try {
    const { id } = params
    const payload = await DeleteTodoItem(id)
    if (payload) {
      // return data
      return {
        status: 200,
        statusMessage: "OK",
        payload
      }
    }
    return sendError({
      set,
      status: 400,
      message: "Bad request"
    })
  } catch (e: any) {
    // send error back
    return sendError({
      set,
      message: e.message
    })
  }
}
