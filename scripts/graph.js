// Simple ordered graph implementation
class Graph {

	constructor(size) {
		this.size = size
		this.adjacencyList = new Map()
	}

	addVertex(vertex) {
		this.adjacencyList.set(vertex, [])
		return this.adjacencyList.get(vertex)
	}

	addEdge(startVertex, endVertex) {
		this.adjacencyList.get(startVertex).push(endVertex)
		this.adjacencyList.get(endVertex).push(startVertex)
	}

	forEach(callback) {
		for (const vertex of this.adjacencyList.keys()) {
			callback(vertex)
		}
	}

	getAdjacentVertices(vertex) {
		return this.adjacencyList.get(vertex)
	}
}

// Implementation using custom data models (Container and Line) and features such as: audio playback control,
// node prerequisites and event listening controls.
class SoundGraph extends Graph {

	constructor(config) {
		if (config === undefined) throw new Error('No graph configuration provided')
		if (config.circles === undefined) throw new Error('No circles found in graph configuration (size = 0)')
		const size = Object.keys(config.circles).length
		super(size);

		this.config = config
		this.lines = []
		this.containers = []
	}

	init() {
		const circlesContainer = document.getElementById(this.config.circlesContainerId)
		if (circlesContainer === null) throw new Error('No container for circles found')
		this.circlesContainer = circlesContainer

		const linesContainer = document.getElementById(this.config.linesContainerId)
		if (linesContainer === null) throw new Error('No container for lines found')
		this.linesContainer = linesContainer

		// Create containers
		const circleEntries = Object.entries(this.config.circles)
		for (const entry of circleEntries) {
			const id = entry[0]
			const config = entry[1]
			this.addContainer(id, config)
		}

		// Add prerequisites
		for (const container of this.containers) {
			if (container.config.prerequisites !== undefined && container.config.prerequisites.length > 0) {
				for (const prerequisite of container.config.prerequisites) {
					container.prerequisites.push(this.getContainer(prerequisite))
				}
			}
		}

		// Create lines
		for (const entry of circleEntries) {
			const id = entry[0]
			const config = entry[1]
			if (config.lines !== undefined && config.lines.length > 0) {
				for (const lineConfig of config.lines) {
					const startContainer = this.getContainer(id)
					const endContainer = this.getContainer(lineConfig.adjacentCircle)
					this.addLine(startContainer, endContainer, lineConfig)
				}
			}
		}

		graphAudio.playAudio(this.config.backgroundAudio)
	}

	draw() {
		for (const line of this.lines) {
			line.draw()
		}
	}

	addContainer(id, config) {
		const container = new Container(id, config)

		super.addVertex(container)
		this.containers.push(container)
		container.dom = this.circlesContainer.appendChild(container.dom)

		return container
	}

	addLine(startContainer, endContainer, config) {
		const line = new Line(startContainer, endContainer, config)

		super.addEdge(startContainer, endContainer)
		this.lines.push(line)

		if (line.config.isDashed) {
			this.linesContainer.prepend(line.mask)
			line.mask = document.getElementById(line.id + '-mask')
		}
		this.linesContainer.prepend(line.dom)
		line.dom = document.getElementById(line.id)


		return line
	}

	getContainer(id) {
		const container = this.containers.find(container => container.id === id)

		if (container === undefined) throw new Error("Container '" + id + "' not found")

		return container
	}

	meetsPrerequisites(container) {
		return container.prerequisites.every((prerequisite) => prerequisite.isRevealed)
	}

	getAdjacentContainers(container) {
		return super.getAdjacentVertices(container)
	}

	getLinesTo(container) {
		return container.lines.filter((line) => line.id.endsWith(`-${container.id}`))
	}

	getLinesFrom(container) {
		return container.lines.filter((line) => line.id.startsWith(`${container.id}-`))
	}

	getLinesFromTo(startContainer, endContainer) {
		return this.lines.filter(line => line.id === `${startContainer.id}-${endContainer.id}`)
	}

	getPossibleAdjacentContainers(container) {
		return this.getAdjacentContainers(container).filter((adjContainer) => {
			return !adjContainer.container.isRevealed && adjContainer.container.prerequisites.every((prerequisite) => prerequisite.isRevealed)
		})
	}

	getUnrevealedAdjacentContainers(container) {
		return this.getAdjacentContainers(container).filter((adjContainer) => !adjContainer.container.isRevealed)
	}

	setAnimation(container, state) {
		const otherContainers = this.containers.filter(_container => _container.isRevealed && _container !== container)

		// Is in animation state
		if (state) {
			otherContainers.forEach(_container => _container.dom.style.visibility = 'hidden')
		} else {
			otherContainers.forEach(_container => _container.dom.style.visibility = 'visible')
		}
	}
}