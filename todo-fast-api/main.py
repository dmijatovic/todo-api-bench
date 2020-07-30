from api import config

import uvicorn

if __name__== "__main__":
  uvicorn.run("api:api",\
    host='0.0.0.0',\
    port=config.API_PORT,\
    reload=config.API_RELOAD,\
    debug=config.API_DEBUG,\
    workers=config.API_WORKERS
  )


