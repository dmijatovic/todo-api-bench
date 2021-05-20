# these are Debian based images
FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build

WORKDIR /app

# copy csproj and restore as distinct layer
# COPY ./commander.csproj ./commander.csproj
# install dependencies
# RUN dotnet restore ./commander.csproj

# copy everything else and build
COPY . .
# build for production
RUN dotnet publish -c Release -r linux-x64 -o out
# options: -p:PublishReadyToRun=true
# RUN dotnet publish ./commander.csproj \
#   -c RELEASE \
#   -o out /p:Version=1.0.0
#   #--runtime linux-musl-x64 \
#   #\ -p:PublishTrimmed=true

FROM mcr.microsoft.com/dotnet/runtime-deps:3.1

WORKDIR /app

COPY --from=build ./app/out .

EXPOSE 5000

ENTRYPOINT [ "./todo-api" ]