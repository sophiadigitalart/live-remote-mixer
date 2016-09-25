"use strict"

var RemoteApi = require("live-remote-api").RemoteApi
var params = require("live-remote-params").params

module.exports = getSolo

var exclusive_solo = 0
var solo_apis = []

RemoteApi.onOpen(function() {
	RemoteApi.create("live_set", function(err, api) {
		api.get("exclusive_solo", function(val) {
			exclusive_solo = parseInt(val)
			api.destroy()
		})
	})
})

function getSolo(index) {
	var solo = new params.Toggle()
	solo.div().addClass("solo")
	
	//override live-remote-params/AbstractParam
	solo.api = function(api) {
		if(api === undefined) return solo._api
		solo._api = api
		api.observe("solo", function(val) { solo.setValue(parseFloat(val))})
		solo.onValue = function(val) {
			api.set("solo", val)
			if(!val || !exclusive_solo) return
			solo_apis.forEach(function(a) {
				if(a != api) a.set("solo", 0)
			})
		}
	}
	
	RemoteApi.create("live_set tracks " + index, function(err, api) {
		var api_index = solo_apis.push(api) - 1
		api.observe("id", function(id) {
			if(id != 0) return
			api.destroy()
			solo_apis.splice(api_index, 1)
		})
		solo.api(api)
	})
	return solo
}