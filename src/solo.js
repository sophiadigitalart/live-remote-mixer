"use strict"

var RemoteApi = require("live-remote-api").RemoteApi
var params = require("live-remote-params").params

module.exports = getSolo

var exclusive_solo = 0
var solo_apis = []

RemoteApi.onOpen(() => {
	RemoteApi.create("live_set", (err, api) => {
		api.get("exclusive_solo", val => {
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
		api.observe("solo", val => solo.setValue(parseFloat(val)))
		solo.onValue = val => {
			api.set("solo", val)
			if(!val || !exclusive_solo) return
			solo_apis.forEach(a => {
				if(a != api) a.set("solo", 0)
			})
		}
	}
	
	RemoteApi.create("live_set tracks " + index, (err, api) => {
		var api_index = solo_apis.push(api) - 1
		api.observe("id", id => {
			if(id != 0) return
			api.destroy()
			solo_apis.splice(api_index, 1)
		})
		solo.api(api)
	})
	return solo
}