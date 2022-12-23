var generator = require("generate-password"),
	express = require("express"),
	app = express(),
	path = require("path"),
	bodyParser = require("body-parser"),
	_voices = require("./voices.json"),
	_names = require("./names.json"),
	fetch = require("cross-fetch"),
	cors = require('cors'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.mongo);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

const lastSchema = new Schema({
	_id: String,
	data: String
});

lastSchema.create({
	_id: 'mcadk'
});

async function read_(e) {
	const s = await lastSchema.findOne({
		_id: 'mcadk'
	});
	return console.log(e + " Fetched!"), s.data
}

async function write_(e, s) {
	let k = await last.findOneAndUpdate({
		_id: 'mcadk'
	}, {
		data: s
	});
	console.log(`${e}: Write!`);
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


var corsOptions = {
	"origin": true,
	"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
	"preflightContinue": false,
	"optionsSuccessStatus": 200,
};

require("dotenv").config(), app.use(bodyParser.raw({
	type: "application/vnd.custom-type"
})), app.use(express.json({
	limit: "50mb"
})), app.use(cors(corsOptions)), app.use(express.urlencoded({
	limit: "50mb",
	extended: !0
})), app.use(express.static(path.join(__dirname, "./"))), app.use("/", (function(e, s, o) {
	e.query.id !== process.env.id && s.send({
		message: "error",
		status: "unauthorised!"
	}), e.query.id == process.env.id && o()
})), app.get("/", (async (e, s) => {
	try {
		s.send({
			message: "success",
			voice: Object.keys(_voices)
		})
	} catch (e) {
		s.send({
			message: "error"
		})
	}
})), app.get("/last", (async (e, s) => {
	try {
		let e = await read_("last");
		e = JSON.parse(e), e.message = "success", s.send(e)
	} catch (e) {
		s.send({
			message: "error",
			error: e
		})
	}
})), app.post("/last", (async (e, s) => {
	try {
		var o = JSON.stringify(e.body);
		await write_("last", o), s.send({
			message: "success"
		})
	} catch (e) {
		s.send({
			message: "error",
			error: e
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
}));
connectDB().then(() => {
	app.listen(process.env.port, (() => {
		console.log("Studio Started!!");
	}));
});
