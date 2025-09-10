/**
 * BFS Visualization - JavaScript
 * Interactividad y visualización del algoritmo BFS
 */

class BFSVisualizer {
    constructor() {
        // Configuración del SVG
        this.svg = null;
        this.width = 800;
        this.height = 500;
        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        
        // Datos del algoritmo
        this.graphData = null;
        this.algorithmSteps = [];
        this.currentStep = 0;
        this.isAutoPlaying = false;
        this.autoPlayInterval = null;
        
        // Elementos del DOM
        this.elements = {
            runButton: document.getElementById('run-bfs'),
            resetButton: document.getElementById('reset'),
            prevButton: document.getElementById('prev-step'),
            nextButton: document.getElementById('next-step'),
            autoButton: document.getElementById('auto-play'),
            startNode: document.getElementById('start-node'),
            goalNode: document.getElementById('goal-node'),
            stepInfo: document.getElementById('step-info'),
            currentStepSpan: document.getElementById('current-step'),
            totalStepsSpan: document.getElementById('total-steps'),
            progressFill: document.getElementById('progress-fill'),
            queueVisualization: document.getElementById('queue-visualization')
        };
        
        this.initializeEventListeners();
        this.initializeSVG();
        this.loadGraphStructure();
    }
    
    /**
     * Inicializar event listeners
     */
    initializeEventListeners() {
        // Botones principales
        this.elements.runButton.addEventListener('click', () => this.runBFS());
        this.elements.resetButton.addEventListener('click', () => this.reset());
        
        // Controles de pasos
        this.elements.prevButton.addEventListener('click', () => this.previousStep());
        this.elements.nextButton.addEventListener('click', () => this.nextStep());
        this.elements.autoButton.addEventListener('click', () => this.toggleAutoPlay());
        
        // Tabs de información
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }
    
    /**
     * Inicializar el SVG para la visualización del grafo
     */
    initializeSVG() {
        // Limpiar SVG existente
        d3.select('#graph-svg').selectAll('*').remove();
        
        // Crear nuevo SVG
        this.svg = d3.select('#graph-svg')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');
        
        // Grupos para diferentes elementos
        this.svg.append('g').attr('class', 'links');
        this.svg.append('g').attr('class', 'nodes');
        this.svg.append('g').attr('class', 'labels');
    }
    
    /**
     * Cargar la estructura del grafo desde el backend
     */
    async loadGraphStructure() {
        try {
            const response = await fetch('/api/graph-structure');
            this.graphData = await response.json();
            this.renderGraph();
        } catch (error) {
            console.error('Error cargando estructura del grafo:', error);
            this.showError('Error al cargar la estructura del grafo');
        }
    }
    
    /**
     * Renderizar el grafo en el SVG
     */
    renderGraph() {
        if (!this.graphData) return;
        
        // Posiciones fijas para los nodos (basado en la imagen proporcionada)
        const nodePositions = {
            'A': { x: 400, y: 80 },
            'B': { x: 200, y: 200 },
            'C': { x: 600, y: 200 },
            'D': { x: 100, y: 320 },
            'E': { x: 300, y: 320 },
            'F': { x: 500, y: 320 },
            'G': { x: 700, y: 320 },
            'H': { x: 200, y: 420 },
            'I': { x: 600, y: 420 },
            'J': { x: 400, y: 480 }
        };
        
        // Preparar datos para D3
        const nodes = Object.keys(this.graphData.graph).map(nodeId => ({
            id: nodeId,
            x: nodePositions[nodeId].x,
            y: nodePositions[nodeId].y
        }));
        
        const links = [];
        Object.entries(this.graphData.graph).forEach(([source, targets]) => {
            targets.forEach(target => {
                // Evitar enlaces duplicados
                if (!links.find(l => (l.source === source && l.target === target) || 
                                   (l.source === target && l.target === source))) {
                    links.push({
                        source: source,
                        target: target,
                        weight: this.graphData.weights[`(${source}, ${target})`] || 
                               this.graphData.weights[`(${target}, ${source})`] || 1
                    });
                }
            });
        });
        
        // Renderizar enlaces
        const linkElements = this.svg.select('.links')
            .selectAll('.link')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('x1', d => nodePositions[d.source].x)
            .attr('y1', d => nodePositions[d.source].y)
            .attr('x2', d => nodePositions[d.target].x)
            .attr('y2', d => nodePositions[d.target].y);
        
        // Renderizar pesos de enlaces
        this.svg.select('.labels')
            .selectAll('.edge-label')
            .data(links)
            .enter()
            .append('text')
            .attr('class', 'edge-label')
            .attr('x', d => (nodePositions[d.source].x + nodePositions[d.target].x) / 2)
            .attr('y', d => (nodePositions[d.source].y + nodePositions[d.target].y) / 2)
            .text(d => d.weight);
        
        // Renderizar nodos
        const nodeElements = this.svg.select('.nodes')
            .selectAll('.node')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('class', 'node default')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 25)
            .attr('id', d => `node-${d.id}`);
        
        // Renderizar etiquetas de nodos
        this.svg.select('.labels')
            .selectAll('.node-label')
            .data(nodes)
            .enter()
            .append('text')
            .attr('class', 'node-label')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .text(d => d.id);
        
        // Marcar nodos inicial y objetivo
        this.updateNodeStyles();
    }
    
    /**
     * Actualizar estilos de nodos según el estado actual
     */
    updateNodeStyles() {
        if (!this.graphData) return;
        
        // Resetear todos los nodos
        this.svg.selectAll('.node')
            .attr('class', 'node default');
        
        // Marcar nodo inicial
        const startNode = this.elements.startNode.value;
        d3.select(`#node-${startNode}`)
            .attr('class', 'node initial');
        
        // Marcar nodo objetivo
        const goalNode = this.elements.goalNode.value;
        d3.select(`#node-${goalNode}`)
            .attr('class', 'node goal');
    }
    
    /**
     * Ejecutar el algoritmo BFS
     */
    async runBFS() {
        const startNode = this.elements.startNode.value;
        const goalNode = this.elements.goalNode.value;
        
        if (startNode === goalNode) {
            this.showError('El nodo inicial y objetivo deben ser diferentes');
            return;
        }
        
        // Deshabilitar controles durante la ejecución
        this.setControlsEnabled(false);
        this.elements.stepInfo.innerHTML = '<p>🔄 Ejecutando algoritmo BFS...</p>';
        
        try {
            const response = await fetch(`/api/run-bfs?start=${startNode}&goal=${goalNode}`);
            const result = await response.json();
            
            this.algorithmSteps = result.steps;
            this.currentStep = 0;
            
            // Actualizar información
            this.elements.totalStepsSpan.textContent = this.algorithmSteps.length;
            this.elements.currentStepSpan.textContent = '0';
            
            // Habilitar controles de navegación
            this.enableStepControls();
            this.showStep(0);
            
        } catch (error) {
            console.error('Error ejecutando BFS:', error);
            this.showError('Error al ejecutar el algoritmo BFS');
            this.setControlsEnabled(true);
        }
    }
    
    /**
     * Mostrar un paso específico del algoritmo
     */
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.algorithmSteps.length) return;
        
        this.currentStep = stepIndex;
        const step = this.algorithmSteps[stepIndex];
        
        // Actualizar información del paso
        this.updateStepInfo(step);
        
        // Actualizar visualización del grafo
        this.updateGraphVisualization(step);
        
        // Actualizar cola
        this.updateQueueVisualization(step);
        
        // Actualizar progreso
        this.updateProgress();
        
        // Actualizar controles
        this.updateStepControls();
    }
    
    /**
     * Actualizar información del paso actual
     */
    updateStepInfo(step) {
        let html = `
            <h3>📍 Paso ${step.step}: ${step.action}</h3>
            <p><strong>Descripción:</strong> ${step.description}</p>
        `;
        
        if (step.current_node) {
            html += `<p><strong>Nodo actual:</strong> <span class="highlight">${step.current_node}</span></p>`;
        }
        
        if (step.expanded_nodes && step.expanded_nodes.length > 0) {
            html += `<p><strong>Nodos expandidos:</strong> ${step.expanded_nodes.join(', ')}</p>`;
        }
        
        if (step.visited && step.visited.length > 0) {
            html += `<p><strong>Nodos visitados:</strong> ${step.visited.join(', ')}</p>`;
        }
        
        if (step.queue && step.queue.length > 0) {
            html += `<p><strong>Cola actual:</strong></p><ul>`;
            step.queue.forEach((path, index) => {
                html += `<li>${index + 1}. [${path.join(' → ')}]</li>`;
            });
            html += '</ul>';
        }
        
        this.elements.stepInfo.innerHTML = html;
    }
    
    /**
     * Actualizar visualización del grafo
     */
    updateGraphVisualization(step) {
        // Resetear todos los nodos
        this.svg.selectAll('.node')
            .attr('class', 'node default');
        
        // Resetear todos los enlaces
        this.svg.selectAll('.link')
            .attr('class', 'link');
        
        // Marcar nodos visitados
        if (step.visited) {
            step.visited.forEach(nodeId => {
                d3.select(`#node-${nodeId}`)
                    .attr('class', 'node visited');
            });
        }
        
        // Marcar nodos en la frontera
        if (step.queue) {
            const frontierNodes = step.queue.map(path => path[path.length - 1]);
            frontierNodes.forEach(nodeId => {
                if (!step.visited || !step.visited.includes(nodeId)) {
                    d3.select(`#node-${nodeId}`)
                        .attr('class', 'node frontier');
                }
            });
        }
        
        // Marcar nodo actual
        if (step.current_node) {
            d3.select(`#node-${step.current_node}`)
                .attr('class', 'node current');
        }
        
        // Mantener marcas de inicial y objetivo
        const startNode = this.elements.startNode.value;
        const goalNode = this.elements.goalNode.value;
        
        if (!step.visited || !step.visited.includes(startNode)) {
            d3.select(`#node-${startNode}`)
                .attr('class', 'node initial');
        }
        
        if (step.current_node !== goalNode) {
            d3.select(`#node-${goalNode}`)
                .attr('class', 'node goal');
        }
    }
    
    /**
     * Actualizar visualización de la cola
     */
    updateQueueVisualization(step) {
        let html = '<h4>Cola (Frontera) actual:</h4>';
        
        if (step.queue && step.queue.length > 0) {
            html += '<div class="queue-items">';
            step.queue.forEach((path, index) => {
                html += `<div class="queue-item">${index + 1}. [${path.join(' → ')}]</div>`;
            });
            html += '</div>';
        } else {
            html += '<p>Cola vacía</p>';
        }
        
        this.elements.queueVisualization.innerHTML = html;
    }
    
    /**
     * Actualizar barra de progreso
     */
    updateProgress() {
        const progress = ((this.currentStep + 1) / this.algorithmSteps.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.currentStepSpan.textContent = this.currentStep + 1;
    }
    
    /**
     * Actualizar controles de navegación
     */
    updateStepControls() {
        this.elements.prevButton.disabled = this.currentStep === 0;
        this.elements.nextButton.disabled = this.currentStep === this.algorithmSteps.length - 1;
    }
    
    /**
     * Paso anterior
     */
    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    /**
     * Paso siguiente
     */
    nextStep() {
        if (this.currentStep < this.algorithmSteps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }
    
    /**
     * Toggle reproducción automática
     */
    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
    
    /**
     * Iniciar reproducción automática
     */
    startAutoPlay() {
        this.isAutoPlaying = true;
        this.elements.autoButton.textContent = '⏸️ Pausar';
        
        this.autoPlayInterval = setInterval(() => {
            if (this.currentStep < this.algorithmSteps.length - 1) {
                this.nextStep();
            } else {
                this.stopAutoPlay();
            }
        }, 2000);
    }
    
    /**
     * Detener reproducción automática
     */
    stopAutoPlay() {
        this.isAutoPlaying = false;
        this.elements.autoButton.textContent = '⏯️ Auto';
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    /**
     * Habilitar controles de navegación por pasos
     */
    enableStepControls() {
        this.elements.prevButton.disabled = false;
        this.elements.nextButton.disabled = false;
        this.elements.autoButton.disabled = false;
        this.setControlsEnabled(true);
    }
    
    /**
     * Establecer estado de controles
     */
    setControlsEnabled(enabled) {
        this.elements.runButton.disabled = !enabled;
        this.elements.startNode.disabled = !enabled;
        this.elements.goalNode.disabled = !enabled;
    }
    
    /**
     * Reiniciar visualización
     */
    reset() {
        // Detener reproducción automática
        this.stopAutoPlay();
        
        // Limpiar datos
        this.algorithmSteps = [];
        this.currentStep = 0;
        
        // Resetear interfaz
        this.elements.stepInfo.innerHTML = '<p>Presiona "Ejecutar BFS" para comenzar la visualización</p>';
        this.elements.currentStepSpan.textContent = '0';
        this.elements.totalStepsSpan.textContent = '0';
        this.elements.progressFill.style.width = '0%';
        this.elements.queueVisualization.innerHTML = '<p>La cola estará visible durante la ejecución del algoritmo</p>';
        
        // Deshabilitar controles de pasos
        this.elements.prevButton.disabled = true;
        this.elements.nextButton.disabled = true;
        this.elements.autoButton.disabled = true;
        
        // Habilitar controles principales
        this.setControlsEnabled(true);
        
        // Resetear visualización
        this.updateNodeStyles();
    }
    
    /**
     * Cambiar pestaña de información
     */
    switchTab(tabName) {
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }
    
    /**
     * Mostrar mensaje de error
     */
    showError(message) {
        this.elements.stepInfo.innerHTML = `<p style="color: #e74c3c;">❌ Error: ${message}</p>`;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new BFSVisualizer();
});
