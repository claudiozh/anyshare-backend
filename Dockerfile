# FROM node:16.17.1-alpine

# WORKDIR /home/node/app

# ENV NODE_ENV development
# ENV TZ America/Fortaleza

# RUN npm install -g @nestjs/cli
# RUN apk add --no-cache tzdata
# RUN npx prisma generate

# CMD [ "npm", "run", "start:dev" ]

FROM node:16.17.1-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node/app

COPY . .
RUN npm ci && npm run build && npm prune --production

######## Start a new stage from scratch ####### 
FROM node:16.17.1-alpine

ENV NODE_ENV production
ENV TZ America/Fortaleza

USER node
WORKDIR /home/node/app

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/package.json .
COPY --from=builder /home/node/app/package-lock.json .
COPY --from=builder /home/node/app/node_modules/ /home/node/app/node_modules/

# RUN apk add --no-cache
# RUN apk add --no-cache ca-certificates tzdata
RUN npx prisma migrate deploy


# Command to run the executable
CMD ["node", "dist/main" ]

