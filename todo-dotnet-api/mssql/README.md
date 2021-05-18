# MQSQL docker compose

This docker-compose setup for todo app using MS SQL 2017 server.

## Environment variables

The env variables are stored in database.env file.

## Initial (migration) script

Initial SQL script need to be executed via entrypoint.sh script. MSSQL docker image does not have init.sql location so we need to setup this on our own. Based on some online examples and searching on internet these is advised approach at the moment:

- entrypoint.sh: this script is runned via command. It will run init.sh and start sql server
- init.sh: it wil wait for 15 seconds for SQL server to start and tham call sqlcmd passing init.sql script to execute
- init.sql: script that will create todo_db database and two tables.

## MS SQL container tools

There is command tool in the MSSQL container which can be used for basic checks

```bash
# open bash in MSSQL container
docker exec -it <Container ID> /bin/bash

# copy files FROM container
docker cp <Container ID>:<Container path> <host path>
docker cp d6b75213ef80:/var/opt/mssql/log/errorlog /tmp/errorlog
# copy files INTO container
docker cp <Host path> <Container ID>:<Container path>
docker cp /tmp/mydb.mdf d6b75213ef80:/var/opt/mssql/data

# start mssql terminal
/opt/mssql-tools/bin/sqlcmd -S <host>,<port> -U SA -P '<YourPassword>'
/opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U SA -P 'Pa55word!'

```

### Commands

SQLcmd tools commands can be [found here](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-ver15#sqlcmd-commands)

```bash
# enter sqlcmd in container
docker-compose exec mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Pa55word!
# use database
USE commander_db
# execute query
select * from Command
GO
# Exit sqlcmd tool
:QUIT

```

### View logs

```bash
# enter container
docker-compose exec mssql bash
# enter sqlcmd in container
docker-compose exec mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Pa55word!
# get logs
cd /var/opt/mssql/log
cat setup*.log
cat errorlog
```

## MS SQL queries

MS SQL has different SQL command for returning inserted record. It uses OUTPUT keywoard between fields and VALUES. See below

```sql
-- create todo list and return inserted values
INSERT INTO todo_list (title) OUTPUT inserted.id VALUES("TEST TITLE");

INSERT INTO todo_list (title) OUTPUT inserted.id, inserted.title VALUES("Todo list title added from TESTING");
```
