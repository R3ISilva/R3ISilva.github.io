class Container {
	constructor(id, config) {
		this.id = id
		this.config = config
		this.isRevealed = false
		this.lines = []
		this.prerequisites = []

		this.dom = this.createDOM()

		this.setupAudio()
	}

	createDOM() {
		const container = document.createElement('div')
		container.id = this.id
		container.classList.add('container')
		container.classList.add(this.config.size)
		container.style.visibility = 'hidden'

		const circle = document.createElement('div')
		circle.classList.add('circle')
		circle.style.opacity = '0'

		const text = document.createElement('p')
		text.classList.add('circle-text')
		text.innerText = this.config.text
		text.style.opacity = '0'

		this.circle = container.appendChild(circle)
		this.text = container.appendChild(text)
		return container
	}

	reveal() {
		anime.remove(this.dom)
		anime.remove(this.circle)
		anime.remove(this.text)
		this.dom.style.visibility = 'visible'
		const tl = anime.timeline()
			.add({
				targets: this.circle,
				easing: 'linear',
				opacity: 1,
				duration: 1000
			})
			.add({
				targets: this.text,
				easing: 'linear',
				opacity: 1,
				duration: 500,
				complete: () => {
					this.isRevealed = true
					this.setHover(true)
				}
			})
		return tl.finished
	}

	startAnimation(callback) {
		this.circle.removeEventListener('click', this.animationHandler)
		this.setHover(false)
		const steps = this.config.animation.steps
		animationText.style.visibility = 'visible'
		graphAudio.playAudio(this.config.animation.audio)

		const animate = (stepCount) => {
			this.circle.onmousemove = () => {}
			const step = steps[stepCount]
			let duration = 0
			if (step !== undefined)
				duration = (step.duration === undefined) ? 0 : Number(step.duration)
			switch (stepCount) {
				case 0: // First step
					animationText.innerText = step.text
					anime.remove(this.circle)
					anime.remove(animationText)
					anime.timeline()
						.add({
							targets: this.circle,
							duration: 0,
							opacity: 1
						})
						.add({
							targets: this.circle,
							easing: 'easeInOutElastic(1, .6)',
							scale: 200,
							duration: 500
						})
						.add({
							targets: animationText,
							opacity: 1,
							duration: 500
						})
						.finished.then(() => {
						setTimeout(() => {
							window.onmousemove = () => {
								window.onmousemove = () => {}
								animate(++stepCount)
							}
						}, duration)
					})
					break

				case steps.length: // Last step
					anime.remove(animationText)
					anime.timeline()
						.add({
							targets: animationText,
							opacity: 0,
							duration: 500,
							complete: () => animationText.style.visibility = 'hidden'
						})
						.add({
							targets: this.circle,
							easing: 'easeOutQuad',
							scale: 1,
							duration: 500
						})
						.finished.then(() => {
							graphAudio.playAudio(graph.config.backgroundAudio)
							this.setHover(true)
							if (callback !== undefined && typeof callback === 'function') callback()
							else this.defaultAnimationCallback()
						})
					break

				default: // Middle steps
					anime.remove(animationText)
					anime.timeline({
						easing: 'easeOutQuad',
						duration: 1000
					})
						.add({
							targets: animationText,
							opacity: 0,
							complete: () => animationText.innerText = step.text
						})
						.add({
							targets: animationText,
							opacity: 1
						})
						.finished.then(() => {
						setTimeout(() => {
							window.onmousemove = () => {
								window.onmousemove = () => {}
								animate(++stepCount)
							}
						}, duration)
					})
					break
			}
		}

		animate(0)
	}

	defaultAnimationCallback() {
		this.animationHandler = () => this.startAnimation()
		this.circle.addEventListener('click', this.animationHandler)
	}

	setHover(state) {
		const audioID = this.config.hoverAudio
		if (this.config.hoverAudio !== undefined) {
			if (this.playHoverAudioHandler === undefined) this.playHoverAudioHandler = () => graphAudio.playAudio(audioID)
			if (this.stopHoverAudioHandler === undefined) this.stopHoverAudioHandler = () => graphAudio.playAudio(graph.config.backgroundAudio)
			if (state) {
				this.circle.addEventListener('mouseenter', this.playHoverAudioHandler)
				this.circle.addEventListener('mouseleave', this.stopHoverAudioHandler)
			} else {
				this.circle.removeEventListener('mouseenter', this.playHoverAudioHandler)
				this.circle.removeEventListener('mouseleave', this.stopHoverAudioHandler)
			}
		}
		this.circle.classList.toggle('circle-hover', state)
	}

	setupAudio() {
		if (this.config.hoverAudio !== undefined) {
			graphAudio.addAudio(this.config.hoverAudio, this.config.hoverAudio)
		}

		if (this.config.animation === undefined ||
			this.config.animation.steps === undefined ||
			this.config.animation.steps.length === 0)
			return

		if (this.config.animation.audio !== undefined) {
			graphAudio.addAudio(this.config.animation.audio, this.config.animation.audio)
		}
	}

	setupAnimation(callback) {
		if (this.config.animation === undefined || this.config.animation.steps === undefined || this.config.animation.steps.length === 0) return

		this.animationHandler = () => this.startAnimation(callback)
		this.circle.addEventListener('click', this.animationHandler)
	}
}

class Line {
	constructor(startContainer, endContainer, config) {
		this.id = startContainer.id + '-' + endContainer.id
		this.startContainer = startContainer
		this.endContainer = endContainer
		this.config = config
		this.isRevealed = false

		const [lineDOM, maskDOM] = this.createDOM()
		this.dom = lineDOM
		this.mask = maskDOM

		startContainer.lines.push(this)
		endContainer.lines.push(this)
	}

	createDOM() {
		const namespaceURL = "http://www.w3.org/2000/svg"
		const line = document.createElementNS(namespaceURL,'line')
		if (this.config.isDashed) line.classList.add('dashed')
		line.id = this.id
		line.style.opacity = '0'

		let mask = undefined
		if (this.config.isDashed) {
			mask = document.createElementNS(namespaceURL,'line')
			mask.classList.add('dashed-mask')
			mask.id = this.id + '-mask'
		}

		return [line, mask]
	}

	reveal() {
		anime.remove(this.dom)
		const tl = anime.timeline({
			targets: this.dom,
			easing: 'easeInOutQuad'
		})
			.add({
				opacity: 1,
				duration: 0
			})
			.add({
				strokeDashoffset: [anime.setDashoffset, 0],
				duration: 1000,
				complete: () => {
					this.isRevealed = true
				}
			})
		return tl.finished
	}

	draw() {
		const startCircle = this.startContainer.circle
		const endCircle = this.endContainer.circle
		Line.draw(this.dom, startCircle, endCircle)
		if (this.mask !== undefined) Line.draw(this.mask, startCircle, endCircle)
	}

	static draw(target, startCircle, endCircle) {
		const startElementWidth = startCircle.getBoundingClientRect().width
		const startElementHeight = startCircle.getBoundingClientRect().height
		const endElementWidth = endCircle.getBoundingClientRect().width
		const endElementHeight = endCircle.getBoundingClientRect().height
		const startRect = startCircle.getBoundingClientRect()
		const startOffset = {
			left: startRect.left + window.scrollX,
			top: startRect.top + window.scrollY
		}
		const endRect = endCircle.getBoundingClientRect()
		const endOffset = {
			left: endRect.left + window.scrollX,
			top: endRect.top + window.scrollY
		}
		const x1 = startOffset.left + startElementWidth / 2
		const y1 = startOffset.top + startElementHeight / 2
		const x2 = endOffset.left + endElementWidth / 2
		const y2 = endOffset.top + endElementHeight / 2
		target.x1.baseVal.value = x1
		target.x2.baseVal.value = x2
		target.y1.baseVal.value = y1
		target.y2.baseVal.value = y2
	}
}