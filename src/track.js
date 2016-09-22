"use strict"

var RemoteApi = require("live-remote-api").RemoteApi
var params = require("live-remote-params").params
var getSolo = require("./solo")
var $ = require("jquery")

module.exports = Track

var host = $('<div class="tracks">').prependTo(document.body)

function Track(index, id) {
	
	var volume = getVolume(index)
	var pan = getPan(index)
	var activator = getActivator(index)
	var solo = getSolo(index)
	var name = getName(index)
	
	var div = $('<div class="track">')
	.append(name.div(), volume.div(), pan.div(), activator.div(), solo.div())
	
	if(index == 0) div.prependTo(host)
	else div.insertAfter(host.children(".track").eq(index - 1))
	
	RemoteApi.create("live_set tracks " + index, (err, api) => {
		if(api.info.id != id) console.error("expected api id " + id + " at index " + index + ", was " + api.info.id + ". Something is seriously wrong!")
		api.destroy()
	})
	
	this.id = id
	this.move = function(newIndex) {
		if(newIndex == 0) div.detach().prependTo(host)
		else div.detach().insertAfter(host.children(".track").eq(newIndex - 1))
		activator.div().children(".number").text(newIndex + 1)
	}
	
	this.remove = function() {
		div.remove()
		name.api().destroy()
		volume.api().destroy()
		pan.api().destroy()
		activator.api().destroy()
		solo.api().destroy()
	}
}

function getName(index) {
	var api;
	var div = $('<div class="name">')
	RemoteApi.create("live_set tracks " + index, (err, api) => {
		api.observe("name", val => div.text(val))
	})
	return { div: () => div, api: () => api }
}


function getVolume(index) {
	var volume = new params.Slider()
	volume.div().addClass("volume")
	RemoteApi.create("live_set tracks " + index + " mixer_device volume", (err, api) => volume.api(api))
	return volume
}

function getPan(index) {
	var pan = new params.PanKnob()
	pan.div().addClass("pan")
	RemoteApi.create("live_set tracks " + index + " mixer_device panning", (err, api) => pan.api(api))
	return pan
}


function getActivator(index) {
	var activator = new params.Toggle()
	RemoteApi.create("live_set tracks " + index + " mixer_device track_activator", (err, api) => activator.api(api))
	activator.div()
	.addClass("activator")
	.append($('<div class="number">').text(index + 1))
	return activator
}
	
