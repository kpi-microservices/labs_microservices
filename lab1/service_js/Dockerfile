FROM node as builder
WORKDIR /src
COPY server.js ./

FROM astefanutti/scratch-node
COPY --from=builder /src /
ENTRYPOINT ["node", "server.js"]

