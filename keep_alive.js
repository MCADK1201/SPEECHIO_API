function startKeepAlive(t, e, o) {
	setInterval((function() {
		let e = new RegExp(/^http:/g);
		var o = require("https");
		e.test(t) && (o = require("http")), o.get({
			host: "your_app_name.herokuapp.com",
			port: 5879,
			path: "/"
		}, (function(t) {
			t.on("data", (function(t) {
				try {
					console.log("HEROKU RESPONSE: " + t)
				} catch (t) {
					console.log(t.message)
				}
			}))
		})).on("error", (function(t) {
			console.log("Error: " + t.message)
		}))
	}), o)
};
