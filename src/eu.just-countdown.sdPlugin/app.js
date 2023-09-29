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

const myAction = new Action('com.elgato.template.action')

myAction.onKeyUp(({ action, context, device, event, payload }) => {
	console.log('Your key code goes here!')
	console.log({ action, context, device, event, payload })
})
myAction.onDialRotate(({ action, context, device, event, payload }) => {
	console.log('Your dial code goes here!')
})

const setAction = new Action('eu.just-countdown.set-action')
setAction.onKeyUp(({ action, context, device, event, payload }) => {
	console.log('Your key code goes here!')
	console.log({ action, context, device, event, payload })
})
setAction.onDialRotate(({ action, context, device, event, payload }) => {
	console.log('Your dial code goes here!')
})
