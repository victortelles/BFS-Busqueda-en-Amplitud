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

# Exportar la app para Vercel (esto es lo que Vercel ejecutará)
# No necesitamos handler, Vercel usa la variable 'app' directamente
