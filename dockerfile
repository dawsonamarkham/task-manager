FROM golang:1.24.4 AS serverbuild

WORKDIR /usr/src/app

COPY task-manager-server-go/go.mod task-manager-server-go/go.sum ./
RUN go mod download

COPY task-manager-server-go/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v .

FROM node:22.16.0 AS webbuild

WORKDIR /usr/src/app

COPY task-manager-web/package.json task-manager-web/package-lock.json task-manager-web/tsconfig.json ./
RUN npm install

COPY task-manager-web/ ./
RUN npm run build

FROM alpine

WORKDIR /usr/src/app

COPY --from=webbuild /usr/src/app/build/ ./web
COPY --from=serverbuild /usr/src/app/.env .env
COPY --from=serverbuild /usr/src/app/task-manager-server-go task-manager-server-go
CMD ["./task-manager-server-go"]