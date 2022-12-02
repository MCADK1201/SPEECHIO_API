module.exports = (o, e) => {
	setInterval((function() {
		let r = new RegExp(/^http:/g);
		var n = require("https");
		r.test(o) && (n = require("http")), n.get(o, (function(o) {
			o.on("data", (function(o) {
				try {
					console.log("RESPONSE: " + o)
				} catch (o) {
					console.log(o.message)
				}
			}))
		})).on("error", (function(o) {
			console.log("Error: " + o.message)
		}))
	}), e)
};
