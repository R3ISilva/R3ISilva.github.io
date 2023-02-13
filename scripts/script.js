const graph = new SoundGraph(graphConfig)
const animationText = document.getElementById('animation-text')
const graphAudio = new GraphAudio(graph.config.backgroundAudio)
let mainContainer

function revealNext() {
	const adjContainers = graph.getAdjacentContainers(mainContainer)
	const nextContainers = adjContainers.filter(adjContainer => adjContainer.config.priority === 1 && !adjContainer.isRevealed)
	if (nextContainers.length !== 0) {
		const randomIdx = Math.floor(Math.random() * nextContainers.length)
		const nextContainer = nextContainers[randomIdx]
		nextContainer.reveal()
		graph.getLinesFromTo(mainContainer, nextContainer).forEach(line => line.reveal())
		nextContainer.setupAnimation(() => {
			revealNext(nextContainer)
			nextContainer.setupAnimation()
		})
	}
	const smallContainers = graph.containers.filter(_container => _container.isRevealed === false && _container.config.priority === 2 && graph.meetsPrerequisites(_container))
	for (const smallContainer of smallContainers) {
		smallContainer.reveal()
		graph.getLinesTo(smallContainer).forEach(line => line.reveal())
	}
}

const handler = () => {
	window.removeEventListener('click', handler)
	anime({
		targets: animationText,
		easing: 'linear',
		opacity: 0,
		duration: 2000,
		complete: () => {
			animationText.style.visibility = 'hidden'
			animationText.style.color = 'black'
		}
	})

	graph.init()
	mainContainer = graph.getContainer('zone')

	graph.draw()
	window.onresize = () => graph.draw()

	init()
}

window.onload = () => window.addEventListener('click', handler)

function init() {
	const cancelHoverHandler = () => {
		anime.remove(mainContainer.circle)
		anime.remove(animationText)
		const duration = 500
		anime.timeline({
			easing: 'easeInQuad',
			duration: duration
		})
			.add({
				targets: animationText,
				opacity: 0
			})
			.add({
				targets: mainContainer.circle,
				scale: 1
			},
			'-=' + duration)
	}

	const hoverHandler = () => {
		anime.remove(mainContainer.circle)
		anime.remove(animationText)
		anime.timeline({
			easing: 'easeOutQuad',
			duration: 1000
		})
			.add({
				targets: mainContainer.circle,
				scale: 3
			})
			.add({
				targets: animationText,
				easing: 'linear',
				opacity: 1,
				complete: () => {
					mainContainer.circle.removeEventListener('mouseenter', hoverHandler)
					mainContainer.circle.removeEventListener('mouseleave', cancelHoverHandler)
					bridge()
				}
			})
	}

	anime.remove(animationText)
	mainContainer.dom.style.visibility = 'visible'
	anime.timeline({
		easing: 'linear',
		duration: 2000
	})
		.add({
			targets: animationText,
			opacity: 0,
			complete: () => animationText.innerText = graph.config.title
		})
		.add({
			targets: mainContainer.circle,
			opacity: 1
		}).finished.then(() => {
		mainContainer.isRevealed = true
		mainContainer.circle.addEventListener('mouseenter', hoverHandler)
		mainContainer.circle.addEventListener('mouseleave', cancelHoverHandler)
	})
}

function bridge() {
	const tl = anime.timeline({
		easing: 'easeOutQuad',
		duration: 1000
	})
		.add({
			targets: animationText,
			opacity: [1, 0],
			complete: () => {
				animationText.style.visibility = 'hidden'
				animationText.style.top = '50%'
				animationText.style.color = 'black'
			}
		}, 2000)
		.add({
			targets: mainContainer.circle,
			scale: [3, 1]
		})
		.add({
			targets: mainContainer.text,
			opacity: 1,
			delay: 500
		})

	tl.finished.then(() => {
		mainContainer.reveal()

		mainContainer.setupAnimation(() => {
			revealNext(mainContainer)
			mainContainer.setupAnimation()
		})
	})
}