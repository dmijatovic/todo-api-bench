
export interface ApiResponse{
  status: number,
  statusText: string,
  payload: any
}

export function respOK(data:any, status=200, statusText="OK"):ApiResponse{
  return {
    status,
    statusText,
    payload: data
  }
}

export function respErr(status=500, statusText="Internal error", data:any=null):ApiResponse{
  return {
    status,
    statusText,
    payload: data
  }
}