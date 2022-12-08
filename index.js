const RequestQueue = require('node-request-queue');
let rq = new RequestQueue(1);

var generator = require("generate-password"),
	express = require("express"),
	app = express(),
	path = require("path"),
	fs = require("fs"),
	bodyParser = require("body-parser"),
	_voices = require("./voices.json"),
	_names = require("./names.json"),
	fetch = require("cross-fetch"),
	keep_alive = require("./keep_alive.js");
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
	var r = (s = Math.pow(10, e + 1)) / 10;
	return ("" + (Math.floor(Math.random() * (s - r + 1)) + r)).substring(1)
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
})), app.use(express.static(path.join(__dirname, "./"))), app.use("/", (function(e, s, r) {
	e.query.id !== process.env.id && s.send({
		message: "error",
		status: "unauthorised!"
	}), e.query.id == process.env.id && r()
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
		var r = JSON.stringify(e.body);
		await write_("last.txt", r), s.send({
			message: "success"
		})
	} catch (e) {
		s.send({
			message: "error"
		})
	}
})), app.post("/fetch", (async (e, s) => {
	try {
		let model = _voices[e.body.voice];
		if (model["method"] == "post") {
			var r = generator.generate({
					length: 35,
					numbers: !1
				}),
				a = {
					email: email_(),
					captchaResponse: r,
					text: e.body.text,
					language: e.body.language,
					voice: e.body.voice
				};
			const h = {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			};
			await fetch(model.baseUrl, {
				method: "post",
				headers: h,
				body: JSON.stringify(a)
			}).then((e => e.json())).then((function(r) {
				"success" == r.status ? s.send({
					message: "success",
					pid: e.body.pid,
					add: e.body.add,
					file: model.fileUrl + r.info.fileId,
					voice: e.body.voice,
					did: e.body.did
				}) : s.send({
					message: "error",
					pid: e.body.pid,
					add: e.body.add,
					voice: e.body.voice,
					did: e.body.did
				})
			}));
		} else if (model["method"] == "get") {
			let text = e.body.text;
			let slice_rate = model.limit;
			let loops = Math.ceil((text.length / slice_rate));
			let req_container = [];

			for (i = 0; i < loops; i++) {
				let sliced_text = text.slice((i * slice_rate), ((i + 1) * slice_rate));
				let request = {
					method: 'GET',
					uri: model.baseUrl + fixedEncodeURIComponent(sliced_text)
				};
				req_container.push(request);
			};
			rq.pushAll(req_container);
			let number = [];
			let j = 0;
			req_container.forEach(() => {
				number.push(j);
				j++;
			});
			let index_queue = 0;
			let arrayBuffers = {};

			rq.on('resolved', res => {

				arrayBuffers[`${index_queue}`] = Buffer.from(res);
				index_queue++;
			}).on('rejected', err => {
				rq.push(req_container[index_queue]);
				number.splice(index_queue, 1);
				number.push(index_queue);
			}).on('completed', () => {
				index_queue = 0;
				s.send({
					message: "error",
					pid: e.body.pid,
					add: e.body.add,
					"file": "file",
					voice: e.body.voice,
					did: e.body.did
				});
			});
		}
	} catch (r) {
		console.log(r)
		s.send({
			message: "error",
			pid: e.body.pid,
			add: e.body.add,
			voice: e.body.voice,
			did: e.body.did
		})
	}
})), app.listen(process.env.port, (() => {
	keep_alive("https://speechstudio.thor1201.repl.co/", 6e4), console.log("Studio Started!!")
}));

function fixedEncodeURIComponent(str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
		return '%' + c.charCodeAt(0).toString(16);
	});
};