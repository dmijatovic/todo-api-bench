namespace todo_api.Models{
  public class ServiceResponse<T>{
    public T payload {get;set;}
    public string error {get;set;} = null;
  }
}