FROM node as builder
WORKDIR /src
COPY service-js-2.js package.json ./
RUN npm install

FROM astefanutti/scratch-node
COPY --from=builder /src /
ENTRYPOINT ["node", "service-js-2.js"]

