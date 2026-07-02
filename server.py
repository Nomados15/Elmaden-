import http.server
import socketserver
import os

PORT = 8080

class PremiumHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # منع التخزين المؤقت لضمان رؤية التحديثات البرمجية فوراً أثناء التطوير
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), PremiumHandler) as httpd:
    print("\n" + "="*40)
    print("      SERVEUR ELMADEN PREMIUM ACTIVE      ")
    print("="*40)
    print(f"-> URL Local: http://127.0.0.1:{PORT}")
    print("-> Pour quitter le serveur: Ctrl + C\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServeur arrêté proprement.")
