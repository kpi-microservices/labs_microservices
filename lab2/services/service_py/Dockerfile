FROM alpine

WORKDIR /src
COPY service-py.py .
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
CMD ["python", "service-py.py"]
EXPOSE 8080

