async function last_update(t = {
	default_voice: default_voice,
	data: data,
	language: language
}) {
	await $.ajaxQueue({
		type: "POST",
		url: "last?id=mcadk",
		data: JSON.stringify(t),
		contentType: "application/json",
		dataType: "json",
		beforeSend: function() {
			console.log("updating last data")
		},
		success: function(t) {
			"success" == t.message && console.log("updated last data!"), "error" == t.message && console.log("error while updating last data!")
		},
		error: function() {
			console.log("failed to update data!")
		},
		timeout: 15e4
	})
}
async function retry(t) {
	$("#download").addClass("disabled");
	let n = {},
		e = $(t).attr("id");
	n.pid = e;
	let a = e.split("play")[1];
	n.did = "content" + a, n.add = "add" + a;
	var s = $("#language-area").val();
	s = s.toLowerCase(), n.language = s;
	let i = $(`#content${a}`).find("textarea").val();
	n.text = i;
	let l = $(t).attr("class").split(/\s+/);
	l = l.filter((t => t.startsWith("id-"))), l = l.toString(), l = l.split("-")[2], n.voice = l;
	const o = [n];
	$(".remove").each((function() {
		$(this).addClass("disabled")
	})), o.forEach((async (t, n) => {
		await $.ajaxQueue({
			type: "POST",
			url: "fetch?id=mcadk",
			data: JSON.stringify(o[n]),
			contentType: "application/json",
			dataType: "json",
			beforeSend: function() {
				$("#send").replaceWith('\n\n          <button class="btn btn-outline-primary btn-lg btn-block w-50 btn-block p-3 disabled" onclick="send()" id="send">\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div>\n\n          </button>'), $(`#${o[n].pid}`).replaceWith(`<button class="btn btn-outline-info  btn-md disabled" id="${o[n].pid}">\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div></button>`)
			},
			success: async function(t) {
				"success" == t.message ? (await checkAudio(t), $("#send").replaceWith('<button class="btn btn-success disabled btn-lg btn-block w-50 btn-block p-3" id="send">\n\n            <i class="fas fa-check mr-2"></i>\n\n          </button>'), $(".file").css({
					visibility: "visible",
					position: "relative"
				})) : "error" == t.message && ($(`#${t.pid}`).replaceWith(`<button class="btn btn-warning  btn-md retry id-${t.did}-${t.voice}" id="${t.pid}" onclick="retry(this)">\n\n                <i class="fas fa-rotate mr-2"></i>\n\n</div></button>`), setTimeout((() => {
					sub_enbl(`#${t.did}`)
				}), 90), $("#send").replaceWith('<button class="btn btn-warning btn-lg btn-block w-50 btn-block p-3" onclick="retryAll()" id="send">\n\n            <i class="fas fa-retweet mr-2"></i>\n\n          </button>'))
			},
			error: function(t) {
				$(`#${o[n].pid}`).replaceWith(`<button class="btn btn-warning  btn-md retry id-${o[n].did}-${o[n].voice}" id="${o[n].pid}" onclick="retry(this)">\n\n                <i class="fas fa-rotate mr-2"></i>\n\n</div></button>`), setTimeout((() => {
					sub_enbl(`#${o[n].did}`)
				}), 90), $("#send").replaceWith('<button class="btn btn-warning btn-lg btn-block w-50 btn-block p-3" onclick="retryAll()" id="send">\n\n            <i class="fas fa-retweet mr-2"></i>\n\n          </button>')
			},
			timeout: 15e4
		})
	}))
}

function retryAll() {
	$(".retry").each((function() {
		$(this).click()
	}))
}

function voice_default_change() {
	let t = $("#language-area").val();
	t = "Hindi" == t ? "Hindi" : "Hindi", $("#language-area").val(t)
}

function loading_box(t, n) {
	$("#loading-box").delay(n).queue((function(n) {
		$(this).css({
			display: t
		}), n()
	}))
	$("#main-box").delay(n).queue((function(n) {
		$(this).css({
			visibility: "visible"
		}), n()
	}))
}

function change_voice(t) {
	let n = $(t).html();
	n = n.split('src="')[1], n = n.split('.png"')[0];
	let e = $(t).html();
	e = e.replace(/src="\w+.\w+"/g, `src="${{"karishma":"mohan","james":"karishma","akash":"james","nitika":"akash","mohit":"nitika","devika":"mohit","navneet":"devika","mohan":"navneet"}[n]}.png"`), $(t).html(e)
}

function default_voice() {
	let t = $("#language").val();
	t = "Hindi" == t ? "English" : "Hindi", $("#language").attr({
		value: t
	})
}

function remove(t) {
	let n = $("#content-box").html();
	if (n = n.replace(/\s/g, ""), 1 == n.match(/class="content-div"/g).length) return $(".remove").each((function() {
		$(this).addClass("disabled")
	}));
	$($(t).parent()).parent().remove(), remove_button_disable_enable("remove")
}

function add(t) {
	var n = default_voice();
	$($($(t).parent()).parent()).attr("id"), remove_button_disable_enable("add"), $($($(t).parent()).parent()).after(add_content_str(n, ""))
}

function deleteAll() {
	if ($("#send").removeClass("disabled").addClass("btn-outline-primary").removeClass("btn-success"), $("#language-btn").removeClass("disabled"), $("#download").addClass("disabled"), confirm("Are your really want to delete all your content")) {
		let t = default_voice();
		$("#content-box").html(add_content_str(t, "")), remove_button_disable_enable("remove")
	}
}

function remove_button_disable_enable(t) {
	let n = $("#content-box").html();
	n = n.replace(/\s/g, "");
	var e = n.match(/class="content-div"/g).length;
	"remove" == t && 1 == e && $(".remove").each((function() {
		$(this).addClass("disabled")
	})), "add" == t && 1 == e && $(".remove").each((function() {
		$(this).hasClass("disabled") && $(this).removeClass("disabled")
	}))
}

function add_content_str(t, n) {
	return `<div class="content-div">\n\n<div class="input-group mb-2">\n\n          <button class="btn btn-danger btn-md remove" onclick="remove(this)">\n\n            <i class="fas fa-minus mr-2"></i>\n\n          </button>\n\n          <textarea rows="3" class="form-control content-box" placeholder="Paragraph..">${n}</textarea>\n\n          <button class="btn btn-secondary btn-sm btn-block mdl" type="button" onclick="change_voice(this)">\n\n            <img class="rounded-circle" width="45" src="${t}.png">\n\n          </button>\n\n        </div>\n\n        <div class="border d-flex justify-content-center rounded p-1 mb-3" style="width: 100%">\n\n          <button class="btn btn-lg w-25 btn-block btn-info add" onclick="add(this)">\n\n            <i class="fas fa-plus mr-2"></i>\n\n          </button>\n\n        </div>\n\n      </div>\n\n      </div>`
}

function default_voice() {
	var t = $("#default-voice").html();
	return (t = t.split('src="')[1]).split('.png"')[0]
}

function default_voice_str(t) {
	return `<img class="rounded-circle w-25 border border-4 h-100" src="${t}.png">`
}

function send() {
	$("#send").replaceWith('\n\n          <button class="btn btn-outline-primary btn-lg btn-block w-50 btn-block p-3 disabled" onclick="send()" id="send">\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div>\n\n          </button>');
	let t = [];
	if ($(".content-box").each((function() {
			let n = $(this).val(),
				e = new RegExp(/^(?:(\d*)(?:(\d*))?|\s*)$/gm);
			test = e.test(n), test ? test = "retry" : test = "go", t.push(test)
		})), !t.includes("go")) return $("#send").replaceWith('<button class="btn btn-warning btn-lg btn-block w-50 btn-block p-3" onclick="send()" id="send">\n\n            <i class="fas fa-retweet mr-2"></i>\n\n          </button>');
	var n = [],
		e = [],
		a = [],
		s = (default_voice(), 1);
	$(".content-box").each((function() {
		let t = $($(this).parent()).parent(),
			n = $(this).val(),
			e = new RegExp(/^(?:(\d*)(?:(\d*))?|\s*)$/gm);
		test = e.test(n), n ? (t.attr({
			id: "content" + s
		}), s++) : t.remove()
	})), $(".content-box").each((function() {
		a.push($(this).val())
	})), $(".mdl").each((function() {
		var t = $(this).html();
		t = (t = t.split('src="')[1]).split('.png"')[0], e.push(t)
	}));
	var i = $("#language-area").val();
	i = i.toLowerCase(), e.forEach(((t, s) => {
		n.push({
			text: a[s],
			pid: "play" + (s + 1),
			voice: e[s],
			language: i,
			did: "content" + (s + 1),
			add: "add" + (s + 1)
		})
	})), $(".remove").each((function() {
		$(this).addClass("disabled")
	})), $(".add").each((function() {
		$(this).addClass("disabled")
	})), $("#language-btn").addClass("disabled"), $("#default-voice").addClass("disabled"), $(".file").css({
		visibility: "hidden",
		position: "absolute"
	}), $(".content-box").each((function() {
		$(this).attr({
			readonly: !0
		})
	})), $(".mdl").each((function(t) {
		$(this).attr({
			id: `play${t+1}`
		}), $(".mdl").addClass("disabled")
	})), $(".add").each((function(t) {
		$(this).attr({
			id: `add${t+1}`
		})
	}));
	var l = n.length,
		o = 0,
		d = 0;
	n.forEach((async (t, e) => {
		await $.ajaxQueue({
			type: "POST",
			url: "fetch?id=mcadk",
			data: JSON.stringify(n[e]),
			contentType: "application/json",
			dataType: "json",
			beforeSend: function() {
				$("#delete-all").addClass("disabled"), $(`#${n[e].pid}`).replaceWith(`<button class="btn btn-outline-info  btn-md disabled" id="${n[e].pid}">\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div></button>`)
			},
			success: async function(t) {
				"success" == t.message ? (o++, ajex_complete(l, o, d), await checkAudio(t)) : "error" == t.message && (d++, o++, $(`#${t.pid}`).replaceWith(`<button class="btn btn-warning  btn-md retry id-${t.did}-${t.voice}" id="${t.pid}" onclick="retry(this)">\n\n                <i class="fas fa-rotate mr-2"></i>\n\n</div></button>`), ajex_complete(l, o, d), setTimeout((() => {
					sub_enbl(`#${t.did}`)
				}), 90));
			},
			error: function(t) {
				d++, o++, $(`#${n[e].pid}`).replaceWith(`<button class="btn btn-warning  btn-md retry id-${n[e].did}-${n[e].voice}" id="${n[e].pid}" onclick="retry(this)">\n\n                <i class="fas fa-rotate mr-2"></i>\n\n</div></button>`), ajex_complete(l, o, d), setTimeout((() => {
					sub_enbl(`#${n[e].did}`)
				}), 90)
			},
			timeout: 15e4
		})
	}))
}

function ajex_complete(t, n, e) {
	t == n && (e > 0 ? $("#send").replaceWith('<button class="btn btn-warning btn-lg btn-block w-50 btn-block p-3" onclick="retryAll()" id="send">\n\n            <i class="fas fa-retweet mr-2"></i>\n\n          </button>') : ($("#send").replaceWith('<button class="btn btn-success disabled btn-lg btn-block w-50 btn-block p-3" id="send" onclick="send()">\n\n            <i class="fas fa-check mr-2"></i>\n\n          </button>'), $(".file").css({
		visibility: "visible",
		position: "relative"
	}), setTimeout((() => {
		$("#download").removeClass("disabled")
	}), 1500), $("#delete-all").removeClass("disabled")))
}

function back_to_voice(t, n) {
	$(t).replaceWith(`<button class="btn btn-secondary btn-sm btn-block disabled mdl" type="button" id="${t}" onclick="change_voice(this)">\n\n            <img class="rounded-circle" width="45" src="${n}.png">\n\n          </button>`)
}

function sub_enbl(t) {
	$(t).find(".remove").removeClass("disabled")
}

function download() {
	var t = [];
	$("#content-box").find("audio").each((function() {
		t.push($(this).attr("id"))
	})), _mergeAll(t)
}
document.addEventListener(["input"], (function(t) {
		var n = $("#language-area").val();
		let e = [];
		$(".mdl").each((function() {
			let t = $(this).html();
			t = t.split('src="')[1], t = t.split(".png")[0], e.push(t)
		}));
		let a = [],
			s = [];
		$(".content-box").each((function() {
			s.push($(this).val())
		}));
		let i = default_voice();
		s.forEach(((t, n) => {
			a.push({
				text: s[n].trim(),
				voice: e[n]
			})
		})), last_update({
			default_voice: i,
			language: n,
			data: a
		})
	})),
	function(t) {
		var n = t({});
		t.ajaxQueue = function(e) {
			var a = e.complete;
			n.queue((function(n) {
				e.complete = function() {
					a && a.apply(this, arguments), n()
				}, t.ajax(e)
			}))
		}
	}(jQuery), document.addEventListener("play", (function(t) {
		for (var n = document.getElementsByTagName("audio"), e = 0, a = n.length; e < a; e++) n[e] != t.target && n[e].pause()
	}), !0), $(window).on("load", (async () => {
		remove_button_disable_enable("remove"), (async () => {
			await $.ajax({
				type: "GET",
				url: "last?id=mcadk",
				headers: {
					"content-type": "application/json"
				},
				success: function(t) {
					if ("success" == t.message) {
						let n = "";
						t.data.forEach((t => {
							n += add_content_str(t.voice, t.text)
						}));
						let e = default_voice_str(t.default_voice);
						loading_box("none", 35), $("#content-box").html(n), $("#default-voice").html(e), $("#language-area").val(t.language || "Hindi")
					} else loading_box("none", 35)
				},
				error: function(t) {
					loading_box("none", 35)
				}
			})
		})()
	})), $(document.body).ready((() => {})), $(document).delegate("#file", "change", (function(t) {
		$("#send").removeClass("btn-success"), $("#send").addClass("btn-outline-primary");
		var n = default_voice();
		let e = t.target.files[0];
		$("#download").addClass("disabled"), $("#send").removeClass("disabled"), $("#language-btn").removeClass("disabled"), $("#delete-all").removeClass("disabled");
		let a = new FileReader;
		a.onload = function(t) {
			var e;
			e = (e = t.target.result.split(/\n/g)).filter((t => {
				if (t.length > 1) return t
			}));
			let a = "";
			e.forEach(((t, e) => {
				a += add_content_str(n, t, e += 1)
			})), $("#content-box").html(a);
			var s = $("#language-area").val();
			let i = [],
				l = [];
			$(".mdl").each((function() {
				let t = $(this).html();
				t = t.split('src="')[1], t = t.split(".png")[0], i.push(t)
			})), $(".content-box").each((function() {
				l.push($(this).val())
			}));
			let o = [],
				d = default_voice();
			l.forEach(((t, n) => {
				o.push({
					text: l[n].trim(),
					voice: i[n]
				})
			})), last_update({
				default_voice: d,
				language: s,
				data: o
			})
		}, a.readAsText(e), $("#file").val("")
	})), $("textarea").dblclick((function() {
		for (var t = $(this).prop("selectionStart"), n = $(this).val().substr(t, 1);
			"\n" != n && t >= 0;) t--, n = $(this).val().substr(t, 1);
		$(this).val($(this).val().substr(0, t + 1) + "-" + $(this).val().substr(t + 1))
	}));
