var generator = require("generate-password"),
	express = require("express"),
	app = express(),
	path = require("path"),
	fs = require("fs"),
	bodyParser = require("body-parser"),
	_config = require("./config.json"),
	_names = require("./names.json");
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
	var a = (s = Math.pow(10, e + 1)) / 10;
	return ("" + (Math.floor(Math.random() * (s - a + 1)) + a)).substring(1)
}

function email_() {
	let e = _names.name;
	e = e[Math.floor(Math.random() * e.length)];
	let s = e + "@gmail.com";
	return s = s.replace('"', ""), s = s.replace("'", ""), s.toLowerCase()
}
require("dotenv").config(), app.use(bodyParser.raw({
	type: "application/vnd.custom-type"
})), app.use(express.json({
	limit: "50mb"
})), app.use(express.urlencoded({
	limit: "50mb",
	extended: !0
})), app.use(express.static(path.join(__dirname, "./"))), app.use("/", (function(e, s, a) {
	e.query.id !== process.env.id && s.send({
		message: "error",
		status: "unauthorised!"
	}), e.query.id == process.env.id && a()
})), app.get("/", (async (e, s) => {
	s.sendFile("./studio.html", {
		root: __dirname
	})
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
		var a = JSON.stringify(e.body);
		await write_("last.txt", a), s.send({
			message: "success"
		})
	} catch (e) {
		s.send({
			message: "error"
		})
	}
})), app.post("/fetch", (async (e, s) => {
	var a = generator.generate({
			length: 35,
			numbers: !1
		}),
		r = {
			email: email_(),
			captchaResponse: a,
			text: e.body.text,
			language: e.body.language,
			voice: e.body.voice
		};
	try {
		const a = {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		};
		await fetch(_config.generateUrl, {
			method: "post",
			headers: a,
			body: JSON.stringify(r)
		}).then((e => e.json())).then((function(a) {
			"success" == a.status ? s.send({
				message: "success",
				pid: e.body.pid,
				add: e.body.add,
				file: _config.fileUrl + a.info.fileId,
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
	} catch {
		s.send({
			message: "error",
			pid: e.body.pid,
			add: e.body.add,
			voice: e.body.voice,
			did: e.body.did
		})
	}
})), app.listen(5879, (() => {
	console.log("Studio Started!!")
}));