"""
Vercel Wrapper for Flask App
Wrapper de Vercel para la aplicación Flask BFS
"""

import sys
import os
from flask import Flask

# Agregar el directorio raíz al path para importar app.py
root_path = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, root_path)

# Importar la aplicación Flask desde app.py
from app import app

# Función principal para Vercel
def handler(event, context):
    """
    Handler function for Vercel serverless deployment
    """
    return app

# Para compatibilidad con Vercel, exportamos la app directamente
app = app
