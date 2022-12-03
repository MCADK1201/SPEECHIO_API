let main_blob = "";
async function _mergeAll(n) {
	$("#download").html(), n.length && ($("#download").children().replaceWith('\n\n            <div class="spinner-border text-info" role="status">\n\n  <span class="sr-only">Loading...</span>\n\n</div>\n\n          '), $("#download").addClass("btn-outline-info").removeClass("btn-outline-info").addClass("disabled"), $(".remove").each((function() {
		$(this).addClass("disabled")
	})), _concat("concatAudio", new Date, n))
}
async function _concat(n, o, e) {
	if (main_blob !== "") _download_(main_blob, o, sr = 48000);
	else {
		const a = new Crunker.default({
				sampleRate: sr
			}),
			l = await a.fetchAudio(...e),
			d = await a[n](l),
			i = await a.export(d, "audio/mp3");
		main_blob = i.blob, _download_(i.blob, o)
	}
	$("#download").removeClass("btn-outline-info").removeClass("disabled").addClass("btn-outline-info").children().replaceWith('<i class="fas fa-file-arrow-down mr-2">')
}

function _download_(n, o) {
	const e = window.URL.createObjectURL(n),
		a = document.createElement("a");
	a.style.display = "none", a.href = e, a.download = o + `.${n.type.split('/')[1]}`, document.body.appendChild(a), a.click(), a.remove(), window.URL.revokeObjectURL(e)
}

function blob_reset() {
	main_blob = "";
}
