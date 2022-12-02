module.exports = (o, t, e) => {
	setInterval((function() {
		var e = {
			host: o + ".herokuapp.com",
			port: t,
			path: "/"
		};
		let r = new RegExp(/^http:/g);
		var n = require("https");
		r.test(url) && (n = require("http")), n.get(e, (function(o) {
			o.on("data", (function(o) {
				try {
					console.log("HEROKU RESPONSE: " + o)
				} catch (o) {
					console.log(o.message)
				}
			}))
		})).on("error", (function(o) {
			console.log("Error: " + o.message)
		}))
	}), e)
};
