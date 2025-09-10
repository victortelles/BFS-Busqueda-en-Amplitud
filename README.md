# 🔍 BFS Algorithm Visualization

Actividad de Fundamentos de inteligencia artificial para aprender el algoritmo de **Búsqueda en Amplitud (BFS)** con visualización interactiva paso a paso.

## 📋 Descripción del Proyecto

Este proyecto implementa el algoritmo BFS con:
- **Backend en Python**: Lógica del algoritmo con explicaciones detalladas
- **Frontend interactivo**: Visualización paso a paso del recorrido
- **Servidor Flask**: Conexión entre backend y frontend
- **Comentarios educativos**: Código pensado para estudiantes

## 🏗️ Estructura del Proyecto

```
BFS/
├── backend/
│   └── bfs_algorithm.py    # Lógica del algoritmo BFS
├── frontend/
│   ├── templates/
│   │   └── index.html      # Interfaz principal
│   └── static/
│       ├── style.css       # Estilos CSS
│       └── script.js       # Interactividad JavaScript
├── public/
│   └── grafo_busqueda_ejercicio_BFS.png
├── app.py                  # Servidor Flask
├── requirements.txt        # Dependencias Python
├── main.py                 # Archivo principal (vacío, para referencia)
└── README.md              # Este archivo
```

## 🚀 Instalación y Ejecución

### 0. Clona el repositorio de descargalo

```bash
git clone https://github.com/tu_usuario/BFS-Busqueda-en-Amplitud.git
```

### 1. Configurar entorno Python

```bash
# Navegar al directorio donde descargaste o clonaste el proyecto
cd "BFS-Busqueda-en-Amplitud"

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows (power shell):
venv\Scripts\activate.ps1
# En Windows: (cmd)
venv\Scripts\activate.bat
# En Linux/Mac:
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Ejecutar el servidor

```bash
python app.py
```

### 4. Abrir en navegador

Ir a: `http://localhost:5000`

## 📚 Características del Algoritmo BFS

### a) Formulación del Problema

- **Estado Inicial**: Nodo A
- **Estado Objetivo**: Nodo J
- **Acciones**: Moverse entre nodos conectados
- **Modelo de Transición**: Función que devuelve nodos adyacentes

### b) Características del Algoritmo

- ✅ **Completo**: Siempre encuentra solución si existe
- ✅ **Óptimo**: Encuentra el camino más corto
- 🔄 **Sistemático**: Usa cola FIFO (First In, First Out)
- 📏 **Nivel por nivel**: Explora por niveles de profundidad

### c) Complejidad

- **Temporal**: O(V + E) donde V = nodos, E = aristas
- **Espacial**: O(V) para almacenar cola y nodos visitados

## 🎮 Cómo Usar la Visualización

1. **Seleccionar nodos**: Elegir nodo inicial y objetivo
2. **Ejecutar BFS**: Presionar "🚀 Ejecutar BFS"
3. **Navegar pasos**: Usar controles ⏮️ ⏭️ para ver cada paso
4. **Reproducción automática**: Usar ⏯️ Auto para ver automáticamente
5. **Reiniciar**: Usar 🔄 Reiniciar para comenzar de nuevo

## 🔍 Ejemplo de Ejecución (A → J)

### Paso 1: Inicialización
- **Frontera**: [[A]]
- **Visitados**: []

### Paso 2: Expandir A
- **Frontera**: [[A,B], [A,C]]
- **Visitados**: [A]

### Paso 3: Expandir B
- **Frontera**: [[A,C], [A,B,D], [A,B,E]]
- **Visitados**: [A, B]

### Paso 4: Expandir C
- **Frontera**: [[A,B,D], [A,B,E], [A,C,F], [A,C,G]]
- **Visitados**: [A, B, C]

... continúa hasta encontrar J

## 🎯 Objetivos Educativos

### Para Estudiantes:
- Entender cómo funciona BFS paso a paso
- Visualizar el concepto de "frontera" o cola
- Comprender la diferencia entre nodos visitados y en cola
- Aprender sobre algoritmos de búsqueda sistemática

### Para Programadores:
- Implementación clara y comentada de BFS
- Separación de lógica (backend) y presentación (frontend)
- Uso de Flask para APIs REST
- Visualización con D3.js

## 🛠️ Tecnologías Utilizadas

- **Python 3.x**: Lógica del algoritmo
- **Flask**: Servidor web y API REST
- **HTML5**: Estructura de la interfaz
- **CSS3**: Estilos y animaciones
- **JavaScript**: Interactividad
- **D3.js**: Visualización de grafos

## 📖 Archivos Importantes

### `backend/bfs_algorithm.py`
Contiene la implementación completa del algoritmo BFS con:
- Clase `BFSGraph` que representa el grafo
- Método `bfs_step_by_step()` que ejecuta BFS paso a paso
- Comentarios explicativos en español
- Código en inglés siguiendo buenas prácticas

### `app.py`
Servidor Flask que proporciona:
- Ruta principal `/` para la interfaz
- API `/api/run-bfs` para ejecutar el algoritmo
- API `/api/graph-structure` para obtener datos del grafo

### `frontend/templates/index.html`
Interfaz web con:
- Controles para seleccionar nodos
- Visualización interactiva del grafo
- Panel de información del paso actual
- Tabs con información del algoritmo

## 🎓 Para Profesores

Este proyecto puede usarse para:
- Demostrar algoritmos de búsqueda
- Enseñar conceptos de grafos
- Mostrar implementación práctica
- Explicar complejidad algoritmica

## 🔧 Extensiones Posibles

- Agregar más algoritmos (DFS, A*, Dijkstra)
- Permitir grafos personalizados
- Agregar análisis de rendimiento
- Implementar diferentes heurísticas

## 📞 Soporte

Si encuentras problemas:
1. Verifica que Python esté instalado
2. Asegúrate de que Flask esté instalado
3. Revisa que el puerto 5000 esté disponible
4. Consulta la consola del navegador para errores JavaScript

---

**Fundamentos de Inteligencia Artificial** | Proyecto educativo BFS

### Créditos

- **Desarrolladores**: [Victor Telles](https://github.com/victortelles)
- **AI**: Con Ayuda de 'Claude sonnet 4'

- **Recursos**:
  - [Documentación de Flask](https://flask.palletsprojects.com)
  - [D3.js](https://d3js.org/)
  - [Profesor Fernando V. - Clase BFS Búsqueda en Amplitud](https://www.linkedin.com/in/fernando-velasco-loera/?originalSubdomain=mx)
