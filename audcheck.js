async function checkAudio(t) {
	let url = "";
	let audios_ = Object.values(t.audio);
	if (audios_.length == 1) {
		url = audios_[0];
	} else {
		const a = new Crunker.default({
				sampleRate: 48000
			}),
			l = await a.fetchAudio(...audios_),
			d = await a["concatAudio"](l),
			i = await a.export(d, "audio/mp3");
		const e = window.URL.createObjectURL(i.blob);
		url = e;
	}
	($(`#${t.pid}`).replaceWith(`<button class="btn btn-success  btn-md" id="${t.pid}">\n\n                <i class="fas fa-check-double mr-2"></i></div></button>`), $(`#${t.add}`).replaceWith(`<div class="container-audio" id="${t.add}"><audio controls controlsList="nodownload noplaybackrate novolume" id="${audio}">\n\n                   <source src="${audio}">\n\n                   Your browser dose not Support the audio Tag\n\n               </audio></div>`), setTimeout((() => {
		back_to_voice(`#${t.pid}`, t.voice), sub_enbl(`#${t.did}`)
	}), 1500), $("#delete-all").removeClass("disabled"))
	return url;
};
