/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(
	({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
		console.log('Stream Deck connected!')
	},
)

const timeSettingsToSeconds = (hours, minutes, seconds) => {
	const parsePart = (part) => {
		const parsed = parseInt(part, 10)
		return isNaN(parsed) ? 0 : parsed
	}
	return (
		parsePart(hours) * 60 * 60 + parsePart(minutes) * 60 + parsePart(seconds)
	)
}

const setAction = new Action('eu.just-countdown.set-action')
setAction.onKeyUp(async ({ payload }) => {
	const { identifier } = payload.settings
	if (!identifier) {
		return
	}
	const seconds = timeSettingsToSeconds(
		payload.settings.hours,
		payload.settings.minutes,
		payload.settings.seconds,
	)
	await fetch(
		`https://just-countdown.eu/api/control?id=${encodeURIComponent(
			identifier,
		)}&set=${seconds}`,
	)
})

const viewAction = new Action('eu.just-countdown.view-action')
viewAction.onKeyUp(async ({ payload }) => {
	const { identifier } = payload.settings
	if (!identifier) {
		return
	}
	await fetch(
		`https://just-countdown.eu/api/control?id=${encodeURIComponent(
			identifier,
		)}&togglePaused`,
	)
})
viewAction.onDialRotate(({ action, context, device, event, payload }) => {
	console.log('Your dial code goes here!')
})

const adjustAction = new Action('eu.just-countdown.adjust-action')
adjustAction.onKeyUp(async ({ payload }) => {
	const { identifier, mode } = payload.settings
	if (!identifier) {
		return
	}
	const sign = mode === 'add' ? 1 : -1
	const seconds =
		sign *
		timeSettingsToSeconds(
			payload.settings.hours,
			payload.settings.minutes,
			payload.settings.seconds,
		)
	await fetch(
		`https://just-countdown.eu/api/control?id=${encodeURIComponent(
			identifier,
		)}&adjust=${seconds}`,
	)
})
