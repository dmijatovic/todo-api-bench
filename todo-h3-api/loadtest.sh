#!/bin/bash
# start solution
docker-compose up -d
# wait 30 sec
# echo "wait 30 sec. for container to settle"
sleep 20
# run load test
cd ../tests
npm run test:js-h3-api
# close solution and clear volumes
cd ../todo-h3-api
docker-compose down --volumes
# notify
echo "Load test completed..."