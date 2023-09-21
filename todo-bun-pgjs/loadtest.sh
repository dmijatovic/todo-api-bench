#!/bin/bash
# start solution
docker compose up -d
# wait 20 sec
echo "wait 20 sec. for container to settle"
sleep 20
# run load test
cd ../tests
npm run test:bun-pgjs
# close solution and clear volumes
cd ../todo-bun-pgjs
docker compose down --volumes
# notify
echo "Load test completed..."