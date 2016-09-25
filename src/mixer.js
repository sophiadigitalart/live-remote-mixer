"use strict"

var RemoteApi = require("live-remote-api").RemoteApi
var params = require("live-remote-params").params
var Master = require("./master")
var Track = require("./track")
var tracks = []

function createTrack(index, id) {
	tracks[index] = new Track(index, id)
}

function swapTrack(index, id) {
	var swap_1 = tracks[index]
	for(var i=0;i<tracks.length;++i) {
		if(i == index) continue
		var swap_2 = tracks[i]
		if(swap_2.id != id) continue
		swap_1.move(i)
		swap_2.move(index)
		tracks[i] = swap_1
		tracks[index] = swap_2
		break
	}
} 

function removeTracks(index) {
	while(tracks.length > index) tracks.pop().remove()
}

RemoteApi.onOpen(function() {
	Master()
	RemoteApi.create("live_set", function(err, api) {
		if(err) {
			console.error(err)
			return
		}
		api.observe("tracks", function(idlist) {
			var track_ids = idlist.substr(3).split(/ id /g).map(function(id) { return parseInt(id)})
			track_ids.forEach(function(id, index) {
				var track = tracks[index]
				if(!track) createTrack(index, id)
				else if(track.id != id) swapTrack(index, id)
			})
			removeTracks(track_ids.length)
		})
	})
})



