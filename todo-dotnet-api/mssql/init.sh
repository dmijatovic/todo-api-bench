#wait for the SQL Server to come up
sleep 15s
echo "todo api...running MSSQL set up script"
# run init.sql
/opt/mssql-tools/bin/sqlcmd -S localhost,$MSSQL_TCP_PORT -U sa -P $MSSQL_SA_PASSWORD -d master -i /home/mssql/init.sql