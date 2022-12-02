async function _mergeAll(n) {
	if (n.length) {
		$("#download").children().replaceWith('\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div>\n\n          '), $("#download").addClass("btn-outline-info").removeClass("btn-outline-info").addClass("disabled"), $(".remove").each((function() {
			$(this).addClass("disabled")
		}));
		const o = new Date;
		let e = $("#download").html();
		e.split(/id="blob/g), e = "blob" + e[1], e = e.split(/">/g), console.log(e);
		let a = new RegExp(/^blob:http/g);
		void 0 !== e && "" !== e && null !== e ? a.test(e) ? (ajax_download(e, o + ".mp3"), $("#download").removeClass("btn-outline-info").removeClass("disabled").addClass("btn-outline-info").children().replaceWith(`<i class="fas fa-file-arrow-down mr-2" id="${e}">`)) : a.test(e) || _concat("concatAudio", o, n) : _concat("concatAudio", o, n)
	}
}
async function _concat(n, o, e) {
	const a = new Crunker.default,
		l = await a.fetchAudio(...e),
		t = await a[n](l),
		d = await a.export(t, "audio/mp3");
	let i = await a.download(d.blob, o);
	$("#download").removeClass("btn-outline-info").removeClass("disabled").addClass("btn-outline-info").children().replaceWith(`<i class="fas fa-file-arrow-down mr-2" id="${i}">`)
}

function ajax_download(n, o) {
	fetch(n).then((n => n.blob())).then((n => {
		const e = window.URL.createObjectURL(n),
			a = document.createElement("a");
		a.style.display = "none", a.href = e, a.download = o, document.body.appendChild(a), a.click(), a.remove(), window.URL.revokeObjectURL(e)
	})).catch((() => {}))
}
