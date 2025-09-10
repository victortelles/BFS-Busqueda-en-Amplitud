"""
Vercel Wrapper for Flask App
Wrapper de Vercel para la aplicación Flask BFS
"""

import sys
import os

# Agregar el directorio raíz al path para importar app.py
root_path = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, root_path)

# Importar la aplicación Flask desde app.py
from app import app

# Esta es la función que Vercel ejecutará
def handler(request):
    """
    Handler function for Vercel serverless deployment
    """
    return app(request.environ, lambda status, headers: None)

# Para compatibilidad con Vercel
if __name__ == "__main__":
    app.run()
