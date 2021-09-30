function close_window() {
	SoloAlert.confirm ({

		title: "Do you want to exit?",

		body: "Are you sure?",

		theme: "dark",


		useTransparency: true,

		onOk: function () {
			close ();
		},
		onCancel: function () { },

	})
}

function reset_rec() {
	SoloAlert.confirm ({

		title: "Do you want to reset records?",

		body: "Are you sure?",

		theme: "dark",


		useTransparency: true,

		onOk: function () {
			resetRecords ();
			putRecords ();
		},
		onCancel: function () { },

	})
}

function getName() {
	return localStorage.getItem ("name");
}

function getRecord() {
	let tsf = localStorage.getItem ("record");
	if (tsf === null)
		return false;
	else
		return tsf;
}

function switchName(inp, cancel = false) {
	if (inp) {
		$ ('#i_n').removeClass ("d-none");
		$ ('#i_wr_n').addClass ("d-none");
		if (!cancel) {
			let nm = document.getElementById ('input_name').value;
			localStorage.setItem ('name', nm);
			refreshName (nm);
		}
	} else {
		$ ('#i_n').addClass ("d-none");
		$ ('#i_wr_n').removeClass ("d-none");
	}
}

function refreshName(nam) {
	$ ('#name').text (nam);
}

function checkedBC(cname, isRequired = false) {
	let chb = document.getElementById (cname);
	localStorage.setItem (cname, chb.checked);
	if (isRequired)
		return chb.checked;
}

function checkAudio(cname) {
	let chk = checkedBC (cname, true);
	switch (cname) {
		case 'music': {
			if (chk && bg.paused) {
				bg.play ();
			} else if (!chk && !bg.paused) {
				bg.pause ();
				bg.currentTime = 0;
			}
		}
			break;
		case 'sound' : {
			canPlaySounds = chk;
		}
			break;

	}

}

function getBoolean(bnm, issp = false, canWrite=false) {
	let bn = localStorage.getItem (bnm);
	if (bn !== null)
		return bn === "true";
	else {
		if (canWrite)
			localStorage.setItem (bnm, issp);
		return issp;
	}
}

function getRecords() {
	let tsf = localStorage.getItem ("records");
	if (tsf === null)
		return null;
	else
		return JSON.parse (tsf);
}

function resetRecords() {
	localStorage.removeItem ('records');
}

function putRecords() {
	if (getRecord ()) {
		let table_rec = document.getElementById ('table_records');
		let str = '';
		let records = getRecords ();
		if (records !== null) {
			records = records.filter (function (el) {
				return el != null;
			});
			// console.log(records);
			records.sort ((a, b) => b[1] - a[1]);

			let mn = Math.min (records.length, 5);
			for (let i = 0; i < mn; i++) {
				// console.log (i + ': ' + records[i] + ', max: ' + records.length);
				if (records[i] !== null) {
					str += `<tr><td>` + records[i][0] + `</td><td>` + records[i][1] + `</td></tr>`;
				} else {
					str += `<tr><td>Empty</td><td>Empty</td></tr>`;
				}
			}
			let mx = Math.abs (Math.max (records.length - 1, 4) - (mn - 1));
			for (let i = 0; i < mx; i++) {
				str += `<tr><td>Empty</td><td>Empty</td></tr>`;
			}

			table_rec.innerHTML = str;
		} else {
			for (let i = 0; i < 5; i++) {
				str += `<tr><td>Empty</td><td>Empty</td></tr>`;
			}
		}
		table_rec.innerHTML = str;
	}
}

function getTime() {
	let tsf = localStorage.getItem ("time");
	if (tsf === null)
		return 30;
	else
		return tsf;
}

function getVolume() {
	let tsf = localStorage.getItem ("volume");
	if (typeof tsf === 'string') {
		tsf = parseFloat (tsf);
	}

	if (tsf === null)
		return 0.5;
	else
		return tsf;
}

var canPlaySounds = getBoolean ('sound');

function putToPlaces() {
	let chks = ['music', 'sound', 'record'];
	for (let i = 0; i < chks.length; i++) {
		let chb = document.getElementById (chks[i]);
		chb.checked = getBoolean (chks[i], true,true);
	}
	let name = getName ();
	if (name !== null) {
		refreshName (name);
		document.getElementById ('input_name').value = name;
	} else {
		$ ('#i_n').addClass ("d-none");
		$ ('#i_wr_n').removeClass ("d-none");
	}

	$ ("#time").val (getTime ());

	// addRecord(['B2',2]);

	putRecords ();

	var popupView = new popup ({
		dom: document.querySelector ('#popup_options')
	});

	document.querySelector ('#option-button').addEventListener ('click', function () {
		popupView.show ();
	});

	document.querySelector ('#popup_close').addEventListener ('click', function () {
		popupView.hide (dom, hideCallback);
	});

	var popupRecord = new popup ({
		dom: document.querySelector ('#popup_records')
	});

	document.querySelector ('#records-button').addEventListener ('click', function () {
		popupRecord.show ();
	});

	document.querySelector ('#popup_records_close').addEventListener ('click', function () {
		popupRecord.hide (dom, hideCallback);
	});

	document.querySelector ('#save_button').addEventListener ('click', function () {
		switchName (true)
	});

	document.querySelector ('#i_n').addEventListener ('click', function () {
		switchName (false)
	});

	document.querySelector ('#cancel_button').addEventListener ('click', function () {
		switchName (true, true)
	});

	$ ('#time').on ('change', function () {
		// console.log(this.value);
		localStorage.setItem ('time', this.value);
	});

	/*	let btn_1 = new Howl ({
			src: ['http://127.0.0.1:8887/button_1.aac'],
			volume: 1,
		});

		let strange_1 = new Howl ({
			src: ['http://127.0.0.1:8887/strange_1.aac'],
			volume: 1,
		});*/


	var btn_1 = new Audio ("audio/button_1.aac");
	btn_1.volume = 1;
	btn_1.loop = false;

	var strange_1 = new Audio ("audio/strange_1.aac");
	strange_1.volume = 1;
	strange_1.loop = false;

	$ ('.button').click (function () {
		strange_1.volume = getVolume ();
		if (canPlaySounds)
			strange_1.play ();
	});

	$ (".button").mouseenter (function () {
		btn_1.volume = getVolume ();
		if (canPlaySounds)
			btn_1.play ();
	});
}

putToPlaces ();

/*

var bg = new Howl({
	src: ['https://docs.google.com/uc?export=download&id=1fyMRt6AzJ_6FElf8G6dl40csZ3LS9EKQ'],
	autoplay: true,
	loop: true,
	volume: 1,
});

bg.play();*/
