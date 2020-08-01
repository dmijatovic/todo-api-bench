FROM python:3.6-alpine

# open /api
WORKDIR /home/flask_api

COPY requirements.txt .

# run all installs incl. pip installs in one go
# this ensures only ONE layer is created in the image
RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev libffi-dev postgresql-dev && \
 python3 -m pip install -r requirements.txt --no-cache-dir && \
 apk --purge del .build-deps

# copy current directory to /api
COPY . .

EXPOSE 5001
EXPOSE 5432

# run the command to start uWSGI
CMD ["uwsgi", "uwsgi.ini"]
