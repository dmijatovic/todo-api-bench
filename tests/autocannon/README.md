# Load test

We use autocannon for loaded testing. The easiest way to add new api to a benchmark is to create endpoints described in this read me. These endpoints ensure the benchmark test same amount of CRUD operations for each api.

## API endpoints for load testing

### Home

- Request

```Javascript
{
  type: "GET",
  path: "/"
}
```

- Response

```json
{
  "status": "OK"
}
```

### Todo list(s)

#### Create todo list

- Request

```Javascript
{
  type: "POST",
  path: "/list"
  body:{
    "title":"Todo list title added"
  }
}
```

- Response

```json
{
  "id": 1,
  "title": "Todo list title added from hyper"
}
```

#### Update todo list

- Request

```Javascript
{
  type: "PUT",
  path: "/list/{id}"
  body:{
    "title":"Todo list title UPDATED"
  }
}
```

- Response

```json
{
  "id": 1,
  "title": "Todo list title UPDATED"
}
```

#### View todo list

- Request

```Javascript
{
  type: "GET",
  path: "/list/{id}"
}
```

- Response

```json
{
  "id": 1,
  "title": "Todo list title UPDATED"
}
```

#### Delete todo list

- Request

```Javascript
{
  type: "DELETE",
  path: "/list/{id}"
}
```

- Response

```json
{
  "id": 1,
  "title": "Todo list title UPDATED"
}
```

#### Get all lists

- Request

```Javascript
{
  type: "GET",
  path: "/list"
}
```

- Response (return max. 50 items)

```json
[{
    "id": 1,
    "title": "Todo list title CHANGED again"
  },
  {
    "id": 2,
    "title": "Todo list title added from hyper"
  },
  {
    "id": 3,
    "title": "Todo list title added from hyper"
}]
```

#### Get all todo items for a list

- Request

```Javascript
{
  type: "GET",
  path: "/list/{id}/todo"
}
```

- Response (return max. 50 items)

```json
[
  {
      "id": 1,
      "title": "CHANGED item title",
      "checked": true,
      "list_id": 1
  },
  {
      "id": 2,
      "title": "Todo item title FROM POSTMAN",
      "checked": false,
      "list_id": 1
  },
  {
      "id": 3,
      "title": "Todo item title FROM POSTMAN",
      "checked": false,
      "list_id": 1
  },
  {
      "id": 4,
      "title": "Todo item title FROM POSTMAN",
      "checked": false,
      "list_id": 1
  },
  {
      "id": 5,
      "title": "Todo item title FROM POSTMAN",
      "checked": false,
      "list_id": 1
  }
]
```

### Todo item(s)

#### Create todo item that belong to a list

- Request

```Javascript
{
  type: "POST",
  path: "/todo"
  body:{
    "list_id":1,
    "title":"Todo item title FROM POSTMAN",
    "checked": false
  }
}
```

- Response

```json
{
  "id": 1,
  "title": "Todo item title FROM POSTMAN",
  "checked": false,
  "list_id": 1
}
```

#### Update todo item that belong to a list

- Request

```Javascript
{
  type: "PUT",
  path: "/todo/{id}"
  body:{
    "list_id":1,
    "title":"Todo item title UPDATE",
    "checked": false
  }
}
```

- Response

```json
{
  "id": 1,
  "list_id": 1,
  "title":"Todo item title UPDATE",
  "checked": false
}
```

#### Delete todo item that belong to a list

- Request

```Javascript
{
  type: "DELETE",
  path: "/todo/{id}"
}
```

- Response

```json
{
  "id": 1,
  "list_id": 1,
  "title":"Todo item title UPDATE",
  "checked": false
}
```

#### View todo item

- Request

```Javascript
{
  type: "GET",
  path: "/todo/{id}"
}
```

- Response

```json
{
  "id": 1,
  "list_id": 1,
  "title":"Todo item title UPDATE",
  "checked": false
}
```
