# Todo dotnet demo

This project is created for benchmarking dotnet, C# and MSSQL with other solutions for creating an REST api.

## Dependencies

```bash
# Entity framework
dotnet add package Microsoft.EntityFrameworkCore -v 3.1.15
dotnet add package Microsoft.EntityFrameworkCore.SqlServer -v 3.1.15
```

## Docker

```bash
docker build -t dv4all/dotnet-todo-api:0.0.1 .
```
