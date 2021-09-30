var bg = document.getElementById ('bg_audio'); //or you can get it with getelementbyid
bg.volume = getVolume () * 0.75;
var vol = getVolume ();

function tryToPlay() {
	let canPlayMusic = getBoolean ('music', true);
	if (canPlayMusic) {

		var resp = bg.play ();
		if (resp !== undefined) {

			resp.then (_ => {
			}).catch (error => {
				setTimeout (tryToPlay, 2000);
			});
		}
	}

}

bg.addEventListener ('canplay', function () {

	setTimeout (tryToPlay, 2000);
})

$ (window).bind ('mousewheel DOMMouseScroll', function (event) {
	if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		if (vol < 1) {
			vol += 0.05;
			if (vol > 1)
				vol = 1;
		}
	} else {
		if (vol > 0) {
			vol -= 0.05;
			if (vol < 0)
				vol = 0;
		}
	}
	bg.volume = vol * 0.75;
	// console.log(vol);
	localStorage.setItem ('volume', vol);
});
