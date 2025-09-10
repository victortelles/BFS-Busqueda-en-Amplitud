import sys
import os

# Agregar el directorio raíz al path
root_path = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, root_path)

# Importar la aplicación Flask
from app import app

# Handler para Vercel
def handler(request, context):
    return app(request.environ, lambda status, headers: None)
