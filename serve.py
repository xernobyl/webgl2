from http.server import HTTPServer, SimpleHTTPRequestHandler

class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_cache_headers()
        super().end_headers()

    def send_cache_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")

if __name__ == "__main__":
    server = HTTPServer(("localhost", 8000), NoCacheHTTPRequestHandler)
    print("Serving on http://localhost:8000")
    server.serve_forever()
