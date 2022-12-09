async function checkAudio(audios) {
  let url = "";
  let audios_ = Object.values(audios);
  if(audios_.length == 1) {
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
  return url;
};