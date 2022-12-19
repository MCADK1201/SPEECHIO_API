var generator = require("generate-password"),
	express = require("express"),
	app = express(),
	path = require("path"),
	fs = require("fs"),
	bodyParser = require("body-parser"),
	_voices = require("./voices.json"),
	_names = require("./names.json"),
	fetch = require("cross-fetch");
async function read_(e) {
	const s = await fs.promises.readFile(e, "utf-8");
	return console.log(e + " Fetched!"), s
}
async function write_(e, s) {
	await fs.promises.writeFile(e, s, "utf-8", (() => {})), console.log(`${e}: Added or Updated!`)
}

function generate(e) {
	var s = 11;
	if (e > s) return generate(s) + generate(e - s);
	var o = (s = Math.pow(10, e + 1)) / 10;
	return ("" + (Math.floor(Math.random() * (s - o + 1)) + o)).substring(1)
}

function email_() {
	let e = _names.name;
	e = e[Math.floor(Math.random() * e.length)];
	let s = e + "@gmail.com";
	return s = s.replace('"', ""), s = s.replace("'", ""), s.toLowerCase()
}

function fixedEncodeURIComponent(e) {
	return encodeURIComponent(e).replace(/[!'()*]/g, (function(e) {
		return "%" + e.charCodeAt(0).toString(16)
	}))
}
require("dotenv").config(), app.use(bodyParser.raw({
	type: "application/vnd.custom-type"
})), app.use(express.json({
	limit: "50mb"
})), app.use(express.urlencoded({
	limit: "50mb",
	extended: !0
})), app.use(express.static(path.join(__dirname, "./"))), app.use("/", (function(e, s, o) {
	e.query.id !== process.env.id && s.send({
		message: "error",
		status: "unauthorised!"
	}), e.query.id == process.env.id && o()
})), app.get("/last", (async (e, s) => {
	try {
		let e = await read_("./last.txt");
		e = JSON.parse(e), e.message = "success", s.send(e)
	} catch (e) {
		s.send({
			message: "error"
		})
	}
})), app.post("/last", (async (e, s) => {
	try {
		var o = JSON.stringify(e.body);
		await write_("last.txt", o), s.send({
			message: "success"
		})
	} catch (e) {
		s.send({
			message: "error"
		})
	}
})), app.post("/fetch", (async (e, s) => {
	try {
		let r = _voices[e.body.voice];
		var o = generator.generate({
			length: 35,
			numbers: !1
		});
		if ("post" == r.method) {
			var t = {
				email: email_(),
				captchaResponse: o,
				text: e.body.text,
				language: e.body.language,
				voice: e.body.voice
			};
			const a = {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			};
			await fetch(r.baseUrl, {
				method: "post",
				headers: a,
				body: JSON.stringify(t)
			}).then((e => e.json())).then((function(o) {
				"success" == o.status ? s.send({
					message: "success",
					pid: e.body.pid,
					add: e.body.add,
					audio: {
						0: r.fileUrl + o.info.fileId
					},
					voice: e.body.voice,
					did: e.body.did
				}) : s.send({
					message: "error",
					pid: e.body.pid,
					add: e.body.add,
					voice: e.body.voice,
					did: e.body.did
				})
			}))
		} else if ("get" == r.method) {
			let o = e.body.text,
				t = r.limit,
				a = Math.ceil(o.length / t),
				d = [],
				u = {};
			for (i = 0; i < a; i++) {
				let e = o.slice(i * t, (i + 1) * t);
				u[`${(i + 1)}`] = r.baseUrl + fixedEncodeURIComponent(e);
			}
			p = 0, s.send({
				message: "success",
				pid: e.body.pid,
				add: e.body.add,
				audio: u,
				voice: e.body.voice,
				did: e.body.did
			})
		}
	} catch (o) {
		s.send({
			message: "error",
			pid: e.body.pid,
			add: e.body.add,
			voice: e.body.voice,
			did: e.body.did
		})
	}
})), app.listen(process.env.port, (() => {
	console.log("Studio Started!!");
}));
