"""
BFS Algorithm Implementation
Implementación del algoritmo de Búsqueda en Amplitud (BFS)
"""
# Importar librerías necesarias
from collections import deque
from typing import List, Dict, Tuple, Optional

class BFSGraph:
    """
    Clase que representa un grafo para aplicar el algoritmo BFS
    Basado en grafos
    """
    
    def __init__(self):
        # Definir el grafo basado en las imágenes proporcionadas
        # Estado inicial: A, Estado objetivo: J
        self.graph = {
            'A': ['B', 'C'],           # A conecta con B y C
            'B': ['A', 'D', 'E'],      # B conecta con A, D y E
            'C': ['A', 'F', 'G'],      # C conecta con A, F y G
            'D': ['B', 'H'],           # D conecta con B y H
            'E': ['B', 'H'],           # E conecta con B y H
            'F': ['C', 'I'],           # F conecta con C e I
            'G': ['C', 'I'],           # G conecta con C e I
            'H': ['D', 'E', 'J'],      # H conecta con D, E y J
            'I': ['F', 'G', 'J'],      # I conecta con F, G y J
            'J': ['H', 'I']            # J conecta con H e I (NODO OBJETIVO)
        }

        # Pesos de las aristas (para referencia visual)
        self.weights = {
            ('A', 'B'): 2, ('A', 'C'): 1,
            ('B', 'D'): 2, ('B', 'E'): 4,
            ('C', 'F'): 5, ('C', 'G'): 1,
            ('D', 'H'): 1, ('E', 'H'): 1,
            ('F', 'I'): 2, ('G', 'I'): 3,
            ('H', 'J'): 3, ('I', 'J'): 2
        }

        # Variables para el seguimiento del algoritmo
        self.initial_state = 'A'
        self.goal_state = 'J'
        self.steps = []  # Para almacenar cada paso del algoritmo

    def bfs_step_by_step(self, start: str, goal: str) -> Dict:
        """
        Ejecuta BFS paso a paso y registra cada iteración

        Args:
            start: Nodo inicial
            goal: Nodo objetivo

        Returns:
            Diccionario con toda la información del recorrido
        """
        print("="*60)
        print("ALGORITMO BFS - BÚSQUEDA EN AMPLITUD")
        print("="*60)
        print(f"Estado Inicial: {start}")
        print(f"Estado Objetivo: {goal}")
        print("="*60)
        
        # a) Formulación del problema
        print("\na) FORMULACIÓN DEL PROBLEMA:")
        print(f"   Estado Inicial: Estar en el nodo '{start}'")
        print(f"   Estado Objetivo: Llegar al nodo '{goal}'")
        
        # b) Conjunto de acciones posibles
        print("\nb) CONJUNTO DE ACCIONES POSIBLES:")
        for node, neighbors in self.graph.items():
            print(f"   Desde {node}: puede ir a {neighbors}")
        
        # c) Modelo de transición
        print("\nc) MODELO DE TRANSICIÓN:")
        print("   Función sucesor: Dado un nodo, devuelve todos los nodos adyacentes")
        
        # Inicializar estructuras de datos para BFS
        queue = deque([[start]])  # Cola FIFO con caminos (no solo nodos)
        visited = set()           # Conjunto de nodos visitados
        step_number = 1
        
        # Estructura para almacenar toda la información
        algorithm_info = {
            'steps': [],
            'solution_found': False,
            'solution_path': None,
            'total_steps': 0
        }
        
        print("\n" + "="*60)
        print("EJECUCIÓN PASO A PASO DEL ALGORITMO BFS")
        print("="*60)
        
        # Paso inicial
        print(f"\nPASO {step_number}: Inicialización")
        print(f"   Frontera (Cola): {list(queue)}")
        print(f"   Visitados: {visited}")
        
        algorithm_info['steps'].append({
            'step': step_number,
            'action': 'Inicialización',
            'queue': [list(path) for path in queue],
            'visited': list(visited),
            'current_node': None,
            'expanded_nodes': [],
            'description': f"Inicializar la cola con el nodo inicial [{start}]"
        })
        
        step_number += 1
        
        # Bucle principal de BFS
        while queue:
            # Extraer el primer camino de la cola (FIFO)
            current_path = queue.popleft()
            current_node = current_path[-1]  # Último nodo del camino
            
            print(f"\nPASO {step_number}: Expandir nodo '{current_node}'")
            print(f"   Camino actual extraído: {current_path}")
            print(f"   Nodo a expandir: '{current_node}'")
            
            # Verificar si ya hemos visitado este nodo
            if current_node in visited:
                print(f"   ❌ Nodo '{current_node}' ya fue visitado, saltar...")
                algorithm_info['steps'].append({
                    'step': step_number,
                    'action': f'Saltar nodo visitado {current_node}',
                    'queue': [list(path) for path in queue],
                    'visited': list(visited),
                    'current_node': current_node,
                    'expanded_nodes': [],
                    'description': f"Nodo {current_node} ya visitado, continuar..."
                })
                step_number += 1
                continue
            
            # Marcar el nodo como visitado
            visited.add(current_node)
            
            # Test de objetivo
            if current_node == goal:
                print(f"   🎯 ¡OBJETIVO ENCONTRADO! Nodo '{current_node}' es el objetivo")
                print(f"   🏆 SOLUCIÓN: {current_path}")
                print(f"   📏 Longitud del camino: {len(current_path) - 1} pasos")
                
                algorithm_info['solution_found'] = True
                algorithm_info['solution_path'] = current_path
                algorithm_info['total_steps'] = step_number
                
                algorithm_info['steps'].append({
                    'step': step_number,
                    'action': f'Objetivo encontrado: {current_node}',
                    'queue': [list(path) for path in queue],
                    'visited': list(visited),
                    'current_node': current_node,
                    'expanded_nodes': [],
                    'description': f"¡Objetivo {goal} encontrado! Camino: {current_path}"
                })
                
                return algorithm_info
            
            # Expandir el nodo actual (generar sucesores)
            expanded_nodes = []
            new_paths = []
            
            print(f"   🔍 Expandiendo '{current_node}', vecinos: {self.graph[current_node]}")
            
            for neighbor in self.graph[current_node]:
                if neighbor not in visited and neighbor not in [path[-1] for path in queue]:
                    new_path = current_path + [neighbor]
                    queue.append(new_path)
                    expanded_nodes.append(neighbor)
                    new_paths.append(new_path)
                    print(f"      ➕ Agregar a cola: {new_path}")
                else:
                    print(f"      ❌ Nodo '{neighbor}' ya visitado o en cola")
            
            print(f"   📋 Nueva frontera (Cola): {[list(path) for path in queue]}")
            print(f"   ✅ Visitados: {sorted(list(visited))}")
            
            algorithm_info['steps'].append({
                'step': step_number,
                'action': f'Expandir {current_node}',
                'queue': [list(path) for path in queue],
                'visited': list(visited),
                'current_node': current_node,
                'expanded_nodes': expanded_nodes,
                'description': f"Expandir {current_node} → generar: {expanded_nodes}"
            })
            
            step_number += 1
        
        # Si llegamos aquí, no se encontró solución
        print(f"\n❌ NO SE ENCONTRÓ SOLUCIÓN al objetivo '{goal}'")
        algorithm_info['total_steps'] = step_number - 1
        return algorithm_info
    
    def get_graph_info(self) -> Dict:
        """
        Retorna información del grafo para la visualización
        """
        return {
            'nodes': list(self.graph.keys()),
            'edges': [(node, neighbor) for node in self.graph for neighbor in self.graph[node]],
            'weights': self.weights,
            'initial_state': self.initial_state,
            'goal_state': self.goal_state
        }


def main():
    """
    Función principal para demostrar el algoritmo BFS
    """
    # Crear instancia del grafo
    bfs_graph = BFSGraph()
    
    # Ejecutar BFS desde A hasta J
    result = bfs_graph.bfs_step_by_step('A', 'J')
    
    print("\n" + "="*60)
    print("RESUMEN FINAL")
    print("="*60)
    
    if result['solution_found']:
        print(f"✅ SOLUCIÓN ENCONTRADA:")
        print(f"   Camino: {' → '.join(result['solution_path'])}")
        print(f"   Pasos totales: {len(result['solution_path']) - 1}")
        print(f"   Iteraciones del algoritmo: {result['total_steps']}")
    else:
        print("❌ NO SE ENCONTRÓ SOLUCIÓN")
    
    print(f"\n📊 ESTADÍSTICAS:")
    print(f"   Nodos totales en el grafo: {len(bfs_graph.graph)}")
    print(f"   Pasos del algoritmo: {len(result['steps'])}")
    
    return result


if __name__ == "__main__":
    main()
