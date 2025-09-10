"""
Flask Server - BFS Visualization
Servidor Flask para la visualización del algoritmo BFS
"""

from flask import Flask, render_template, jsonify, request, send_from_directory
import sys
import os

# Agregar el directorio backend al path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.append(backend_path)

from bfs_algorithm import BFSGraph

# Crear la aplicación Flask
app = Flask(__name__, 
            template_folder='frontend/templates',
            static_folder='frontend/static')

# Instancia global del grafo
bfs_graph = BFSGraph()


# Endpoint para servir archivos de la carpeta public
@app.route('/public/<path:filename>')
def public_files(filename):
    """
    Servir archivos estáticos de la carpeta public
    """
    return send_from_directory('public', filename)

# Endpoint para la página principal
@app.route('/')
def index():
    """
    Página principal - Visualización del algoritmo BFS
    """
    return render_template('index.html')


# Endpoint para obtener información del grafo
@app.route('/api/graph-info')
def get_graph_info():
    """
    API endpoint para obtener información del grafo
    """
    return jsonify(bfs_graph.get_graph_info())

# Endpoint para ejecutar el algoritmo BFS
@app.route('/api/run-bfs')
def run_bfs():
    """
    API endpoint para ejecutar el algoritmo BFS
    """
    start = request.args.get('start', 'A')
    goal = request.args.get('goal', 'J')
    
    # Ejecutar BFS
    result = bfs_graph.bfs_step_by_step(start, goal)
    
    return jsonify(result)

# Endpoint para obtener la estructura del grafo
@app.route('/api/graph-structure')
def get_graph_structure():
    """
    API endpoint para obtener la estructura del grafo
    """
    # Convertir las claves tupla a string para JSON en el formato correcto
    weights_str = {}
    for key, value in bfs_graph.weights.items():
        # Formato que espera el frontend: "(A, B)"
        weights_str[f"({key[0]}, {key[1]})"] = value
        # También agregar el formato inverso para enlaces bidireccionales
        weights_str[f"({key[1]}, {key[0]})"] = value
    
    return jsonify({
        'graph': bfs_graph.graph,
        'weights': weights_str,
        'initial_state': bfs_graph.initial_state,
        'goal_state': bfs_graph.goal_state
    })

# Ejecutar la aplicación
if __name__ == '__main__':
    print("🚀 Iniciando servidor BFS Visualization...")
    print("📍 Accede a: http://localhost:5000")
    print("🔍 Para ver la visualización del algoritmo BFS")
    app.run(debug=True, host='0.0.0.0', port=5000)
