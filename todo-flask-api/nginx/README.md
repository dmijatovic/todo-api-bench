# Web server NGINX

This is setup for our frontend webserver. We use NGINX alpine.

The request to api points are fowarded to flask_api.

## Notes

NextJS static html export. Basic nginx config file defines only index.html as base. First other files were stored in the same folder. After changing flag in next.config.js the genrated site encluded folders and index.html files.

After this fix another problem appeared with href links. When using localhost:8080 as test the port 8080 would be removed after using page urls. This cased 404 error as localhost/page location was not valid. To fix this I pointed nginx container to default localhost (port 80). This seem to work for now.

After assigning nginx to port 80 I seem to have problem with proxy setup in next-food app. Therefore I created another nginx server config to listen to 5001 port and forward the trafic to flask_api.
