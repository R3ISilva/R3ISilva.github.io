class GraphAudio {

	constructor(backgroundAudio) {
		this.audios = new Map()
		this.addAudio(backgroundAudio, backgroundAudio)
		this.backgroundAudio = backgroundAudio
		this.currentPlayingID = undefined
	}

	addAudio(id, src) {
		if (this.audios.has(id)) return
		const audio = {
			howl: new Howl({
				src: '../audio/' + src,
				loop: true,
				volume: 0
			}),
			id: undefined
		}
		this.audios.set(id, audio)
		audio.howl.once('load', () => {
			audio.id = audio.howl.play()
		})
		return audio
	}

	playAudio(id) {
		const audio = this.audios.get(id)
		if (audio === undefined) throw new Error("Audio '" + id + "' not found")

		// Same audio, return
		if (this.currentPlayingID !== undefined && audio.id === this.currentPlayingID) return

		// Pause current sound
		if (this.currentPlayingID !== undefined) {
			this.stopAudio(this.currentPlayingID)
		}

		// Play new sound
		audio.howl.fade(audio.howl.volume(audio.id), 1.0, 500, audio.id)
		this.currentPlayingID = id
	}

	stopAudio(id) {
		let audio = this.audios.get(id)
		if (audio === undefined) throw new Error("Audio '" + this.currentPlayingID + "' not found")

		audio.howl.fade(audio.howl.volume(audio.id), 0, 500, audio.id)
	}
}