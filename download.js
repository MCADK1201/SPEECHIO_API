let a;
async function _mergeAll(n) {
	if (n.length) {
		$("#download").html('\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div>\n\n          '), $("#download").addClass("btn-outline-secondary").removeClass("btn-outline-info").addClass("disabled"), $(".remove").each((function() {
			$(this).addClass("disabled")
		}));
		let e = $("#download").html();
		alert(e), e = e.split(/id="/g)[1], "download-again" == e ? (_download_(a), alert("gain")) : a = _concat("concatAudio", n), $("#download").removeClass("btn-outline-secondary").addClass("btn-outline-info").removeClass("disabled").children().replaceWith('<i class="fas fa-file-arrow-down mr-2" id="download-again">')
	} else $("download").addClass("disabled")
}
async function _concat(n, b) {
	const e = new Crunker.default({
			sampleRate: 44100
		}),
		o = await e.fetchAudio(...b),
		d = await e[n](o),
		l = await e.export(d, "audio/mp3");
		_download_(l.blob);
        a = l.blob
}

function _download_(n) {
	let z = new Date;
	z += ".mp3";
	const e = window.URL.createObjectURL(n),
		o = document.createElement("a");
	o.style.display = "none", o.href = e, o.download = z, document.body.appendChild(o), o.click(), o.remove(), window.URL.revokeObjectURL(e)
}