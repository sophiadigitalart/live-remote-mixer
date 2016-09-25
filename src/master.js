"use strict"

var RemoteApi = require("live-remote-api").RemoteApi
var params = require("live-remote-params").params
var $ = require("jquery")

module.exports = Master

function Master() {
	
	var volume = getVolume()
	var pan = getPan()
	var name = $('<div class="name">').text("Master")
	
	var div = $('<div class="master track">')
	.append(name, volume.div(), pan.div())
	.appendTo($("#container"))
	
}

function getVolume() {
	var volume = new params.Slider()
	volume.div().addClass("volume")
	RemoteApi.create("live_set master_track mixer_device volume", function(err, api) { volume.api(api)})
	return volume
}

function getPan() {
	var pan = new params.PanKnob()
	pan.div().addClass("pan")
	RemoteApi.create("live_set master_track mixer_device panning", function(err, api) { pan.api(api)})
	return pan
}


