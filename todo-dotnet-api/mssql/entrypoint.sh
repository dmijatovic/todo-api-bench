#start SQL Server, start the script to create/setup the DB
/home/mssql/init.sh & /opt/mssql/bin/sqlservr

# #run the setup script to create the DB and the schema in the DB
# #do this in a loop because the timing for when the SQL instance is ready is indeterminate
# # sleep 10 sec
# sleep 30

# for i in {1..10};
# do
#   /opt/mssql-tools/bin/sqlcmd -S localhost,$MSSQL_TCP_PORT -U sa -P $MSSQL_SA_PASSWORD -d master -i init.sql
#   if [ $? -eq 0 ]
#   then
#       echo "init.sql completed"
#       break
#   else
#       echo "not ready yet..."
#       sleep 1
#   fi
# done