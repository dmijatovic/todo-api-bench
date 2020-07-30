# Todo api in python with fastapi, uvicorn and database

At the moment the fastest api solution with python seem to be [FastAPI using async SQL database](https://fastapi.tiangolo.com/advanced/async-sql-databases/). For database we use PostgreSQL (as with others).

In the first version I decided not to use SqlAlchemy to keep api simple and light. The databases lib supports basic CRUD query that I want to test.

## Database driver and asyncpg

For more information about [database](https://www.encode.io/databases/database_queries/) and [asyncpg](https://github.com/MagicStack/asyncpg) see provided links.

## Dependencies

```bash
# install all dependencies (one by one)
pip install fastapi uvicorn databases databases[postgresql] asyncpg

# install using requirements.txt
pip install -r requirements.txt
```
