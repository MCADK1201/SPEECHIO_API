async function _mergeAll(n) {
	let a;
	if (n.length) {
		$("#download").children().replaceWith('\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div>\n\n          '), $("#download").addClass("btn-outline-info").removeClass("btn-outline-info").addClass("disabled"), $(".remove").each((function() {
			$(this).addClass("disabled")
		}));
		let e = $("#download").html();
		e = e.split(/id="/g)[1], "download-again" == e ? _download_(a) : a = _concat("concatAudio", o, n), $("#download").removeClass("btn-outline-secondary").addClass("btn-outline-info").removeClass("disabled").children().replaceWith('<i class="fas fa-file-arrow-down mr-2" id="download-again">')
	}
}
async function _concat(n, o, a) {
	const e = new Crunker.default({
			sampleRate: 44100
		}),
		d = await e.fetchAudio(...a),
		l = await e[n](d),
		t = await e.export(l, "audio/mp3");
	return _download_(t.blob), t.blob
}

function _download_(n) {
	n = new Blob(n);
	let o = new Date;
	o += ".mp3";
	const a = window.URL.createObjectURL(n),
		e = document.createElement("a");
	e.style.display = "none", e.href = a, e.download = o, document.body.appendChild(e), e.click(), e.remove(), window.URL.revokeObjectURL(a)
}
