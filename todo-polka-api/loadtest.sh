#!/bin/bash
# start solution
docker-compose up -d
# wait 30 sec
# echo "wait 30 sec. for container to settle"
sleep 20
# run load test
cd ../tests
npm run test:js-polka
# close solution and clear volumes
cd ../todo-polka-api
docker-compose down --volumes
# notify
echo "Load test completed..."