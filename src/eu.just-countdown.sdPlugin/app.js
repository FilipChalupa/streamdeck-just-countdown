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
setAction.onKeyUp(async ({ payload, context }) => {
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
	$SD.showOk(context)
})

const viewAction = new Action('eu.just-countdown.view-action')
viewAction.onKeyUp(async ({ payload, context }) => {
	const { identifier } = payload.settings
	if (!identifier) {
		return
	}
	await fetch(
		`https://just-countdown.eu/api/control?id=${encodeURIComponent(
			identifier,
		)}&togglePaused`,
	)
	$SD.showOk(context)
})
const countdownIframes = document.querySelector('#countdowns')
window.addEventListener('message', (event) => {
	if (
		event.origin === 'https://just-countdown.eu' &&
		typeof event.data.id === 'string'
	) {
		const iframe = countdownIframes.querySelector(
			`[src="https://just-countdown.eu/screen?id=${encodeURIComponent(
				event.data.id,
			)}"]`,
		)
		if (!iframe) {
			return
		}
		const context = iframe.getAttribute('data-context')
		$SD.setTitle(context, event.data.formattedTime)
	}
})
const handleViewSettingsAppearAction = async ({ payload, context }) => {
	let iframe = countdownIframes.querySelector(`[data-context="${context}"]`)
	const { identifier } = payload.settings
	if (!identifier) {
		if (iframe) {
			iframe.remove()
		}
		return
	}
	if (!iframe) {
		iframe = document.createElement('iframe')
		iframe.setAttribute('data-context', context)
		countdownIframes.appendChild(iframe)
	}
	const src = `https://just-countdown.eu/screen?id=${encodeURIComponent(
		identifier,
	)}`
	if (src !== iframe.src) {
		iframe.src = src
	}
}
viewAction.onDidReceiveSettings(handleViewSettingsAppearAction)
viewAction.onWillAppear(handleViewSettingsAppearAction)

const adjustAction = new Action('eu.just-countdown.adjust-action')
adjustAction.onKeyUp(async ({ payload, context }) => {
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
	$SD.showOk(context)
})
