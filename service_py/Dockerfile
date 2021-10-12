FROM alpine

WORKDIR /src
COPY server.py .
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
CMD ["python", "server.py"]
EXPOSE 8080

