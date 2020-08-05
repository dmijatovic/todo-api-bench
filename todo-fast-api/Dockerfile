# FROM tiangolo/uvicorn-gunicorn-fastapi:python3.6-alpine3.8-2020-06-06

# FROM python:3.6

FROM python:slim-buster

WORKDIR /home/dv4all

EXPOSE 5432

COPY . .

RUN pip install -r requirements.txt

# CMD ["python3", "main.py"]
# NOTE! the arguments are in
# env variable GUNICORN_CMD_ARGS
# see docker-compose file
CMD ["gunicorn", "api:api"]


