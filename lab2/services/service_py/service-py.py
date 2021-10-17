from http.server import BaseHTTPRequestHandler, HTTPServer

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.end_headers()

        message = "Hello World from Python server!"
        self.wfile.write(bytes(message, "utf8"))

with HTTPServer(('', 8080), handler) as server:
    server.serve_forever()
