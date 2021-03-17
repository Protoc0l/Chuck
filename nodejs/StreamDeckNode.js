const maxApi = require("max-api");

const path = require('path');
const { openStreamDeck } = require('elgato-stream-deck');
const myStreamDeck = openStreamDeck();

maxApi.post("StreamDeckNode.js successfully started!");  

var RGB = {key: '0', r: '255', g: '255', b: '255'};
var imagepath;
var imagepath2;
var keyID;
var keyID2;
var keyID3;
var brightness;
var temp_rotation;
var rotation = 0;

maxApi.addHandler('ping', function() {
	maxApi.outlet("ping");
}); 

maxApi.addHandler('rotateIMAGE', (temp_rotation) => {
	rotation = temp_rotation;
});

	
maxApi.addHandler('setRGB', (key, r, g, b) => {
//	maxApi.outlet(key, r, g, b);
	myStreamDeck.fillColor(key, r, g, b);
});


maxApi.addHandler('clearRGB', (keyID) => {
	myStreamDeck.clearKey(keyID);
});

maxApi.addHandler('brightness', (prct) => {
	myStreamDeck.setBrightness(prct);
});

maxApi.addHandler('clear', () => {
	myStreamDeck.clearAllKeys();
});

myStreamDeck.on('down', keyIndex => {
	maxApi.outlet('down', keyIndex);
});

myStreamDeck.on('up', keyIndex => {
	maxApi.outlet('up', keyIndex);
});

maxApi.addHandler('setIMAGE', (keyID2, imagepath) => {
	const sharp = require('sharp') // See http://sharp.dimens.io/en/stable/ for full docs on this great library!
	sharp(path.resolve(__dirname, imagepath))
		.rotate(rotation)
		.flatten() // Eliminate alpha channel, if any.
		.resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
		.raw() // Give us uncompressed RGB.
		.toBuffer()
		.then(buffer => {
			myStreamDeck.fillImage(keyID2, buffer);
		});
});
//	.catch(err => {
//		console.error(err);
//	});

maxApi.addHandler('setPANEL', (imagepath2) => {
	const sharp = require('sharp') // See http://sharp.dimens.io/en/stable/ for full docs on this great library!
	sharp(path.resolve(__dirname, imagepath2))
		.rotate(rotation)
		.flatten() // Eliminate alpha channel, if any.
		.resize(myStreamDeck.ICON_SIZE * myStreamDeck.KEY_COLUMNS, myStreamDeck.ICON_SIZE * myStreamDeck.KEY_ROWS) // Scale up/down to the right size, cropping if necessary.
		.raw() // Give us uncompressed RGB.
		.toBuffer()
		.then(buffer => {
			myStreamDeck.fillPanel(buffer);
		});
});

myStreamDeck.on('error', error => {
	console.error(error)
});