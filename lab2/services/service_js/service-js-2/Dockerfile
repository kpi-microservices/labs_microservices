FROM node as builder
WORKDIR /src
COPY service-js-2.js ./

FROM astefanutti/scratch-node
COPY --from=builder /src /
ENTRYPOINT ["node", "service-js-2.js"]

