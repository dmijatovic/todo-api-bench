#!/bin/bash
# start solution
docker-compose up -d
# wait 30 sec
echo "wait 30 sec. for container to settle"
sleep 30
# run load test
cd ../tests
npm run test:ql-hasura
# close solution and clear volumes
cd ../todo-hasura-api
docker-compose down --volumes
# notify
echo "Load test completed..."