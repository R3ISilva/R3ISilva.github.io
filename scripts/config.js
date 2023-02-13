const graphConfig = {
	title: "Tell me where you've been and I'll tell you who you are",
	circlesContainerId: 'graph',
	linesContainerId: 'lines',
	backgroundAudio: 'zone/hover.wav',
	mainCircle: 'zone',
	circles: {
		zone: {
			text: 'ZONE',
			size: 'normal',
			priority: 0,
			prerequisites: [],
			lines: [
				{ adjacentCircle: 'work', isDashed: false },
				{ adjacentCircle: 'home', isDashed: false },
				{ adjacentCircle: 'studio', isDashed: false },
				{ adjacentCircle: 'bar', isDashed: false },
				{ adjacentCircle: 'favorite_spot', isDashed: false }
			],
			animation: {
				audio: 'zone/anim.wav',
				steps: [
					{
						text: 'ZONE, the only non-physical soundscape',
					  	duration: 1000
					},
					{
						text: 'A blend of soundscapes',
						duration: 1000
					}
				]
			}
		},
		work: {
			text: 'WORK',
			size: 'normal',
			hoverAudio: 'work/hover.wav',
			priority: 1,
			prerequisites: ['zone'],
			lines: [
				{ adjacentCircle: 'productivity', isDashed: true }
			],
			animation: {
				audio: 'work/anim.wav',
				steps: [
					{
						text: 'The place to sustain other places',
						duration: 1000
					}
				]
			}
		},
		studio: {
			text: 'STUDIO',
			size: 'normal',
			hoverAudio: 'studio/hover.wav',
			priority: 1,
			prerequisites: ['zone'],
			lines: [
				{ adjacentCircle: 'productivity', isDashed: true },
				{ adjacentCircle: 'friends', isDashed: true }
			],
			animation: {
				audio: 'studio/anim.wav',
				steps: [
					{
						text: 'A place to work, create, and have fun,',
						duration: 1000
					},
					{
						text: 'a good place for a good amount of productivity and leisure',
						duration: 1000
					}
				]
			}
		},
		home: {
			text: 'HOME',
			size: 'normal',
			hoverAudio: 'home/hover.wav',
			priority: 1,
			prerequisites: ['zone'],
			lines: [
				{ adjacentCircle: 'family', isDashed: true },
				{ adjacentCircle: 'productivity', isDashed: true },
				{ adjacentCircle: 'food', isDashed: true },
				{ adjacentCircle: 'friends', isDashed: true }
			],
			animation: {
				audio: 'home/anim.wav',
				steps: [
					{
						text: "A place where I'm myself the most,",
						duration: 1000
					},
					{
						text: "at 21 years old, I've spent ~100 000 hours at home.",
						duration: 1000
					}
				]
			}
		},
		bar: {
			text: 'BAR',
			size: 'normal',
			hoverAudio: 'bar/hover.wav',
			priority: 1,
			prerequisites: ['zone'],
			lines: [
				{ adjacentCircle: 'food', isDashed: true },
				{ adjacentCircle: 'friends', isDashed: true }
			],
			animation: {
				audio: 'bar/anim.wav',
				steps: [
					{
						text: 'A place to relax and brainstorm',
						duration: 1000
					}
				]
			},
		},
		favorite_spot: {
			text: 'FAVORITE SPOT',
			size: 'normal',
			hoverAudio: 'favorite_spot/hover.wav',
			priority: 1,
			prerequisites: ['zone'],
			lines: [
				{ adjacentCircle: 'friends', isDashed: true }
			],
			animation: {
				audio: 'favorite_spot/anim.wav',
				steps: [
					{
						text: 'A place to forget everything,',
						duration: 1000
					},
					{
						text: 'and experience the sound and landscape',
						duration: 1000
					}
				]
			}
		},
		family: {
			text: 'FAMILY',
			size: 'small',
			priority: 2,
			prerequisites: ['home']
		},
		friends: {
			text: 'FRIENDS',
			size: 'small',
			priority: 2,
			prerequisites: ['home', 'studio', 'bar', 'favorite_spot']
		},
		food: {
			text: 'FOOD',
			size: 'small',
			priority: 2,
			prerequisites: ['home', 'bar']
		},
		productivity: {
			text: 'PRODUCTIVITY',
			size: 'small',
			priority: 2,
			prerequisites: ['work', 'studio', 'home']
		}
	}
}