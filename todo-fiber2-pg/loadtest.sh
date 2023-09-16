#!/bin/bash
# start solution
docker compose up -d
# wait 30 sec
echo "wait 20 sec. for container to settle"
sleep 20
# run load test
cd ../tests
npm run test:go-fiber2-pg
# close solution and clear volumes
cd ../todo-fiber2-pg
docker compose down --volumes
# notify
echo "Load test completed..."