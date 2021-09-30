var paused = false;
var isQuestionAsked = false;
var mask = $ ('#mask');
var maskWin = $ ('#maskWin');
var maskLose = $ ('#maskLose');
var tx_question = $ ('#question');
var time_text = $ ('#time');
var name_text = $ ('#name');
var score_text = $ ('#score');
var volume_bar = $ ('#volume');
var vol = getVolume ();
var progress_bars = $ ('.progress-bar');
var canS = $ ('#canS');
var answerFields = [
	$ ('#answer-text-0'),
	$ ('#answer-text-1'),
	$ ('#answer-text-2'),
	$ ('#answer-text-3'),
]
var ans = -1;
var p_height = 0;
var c_a_id = 0;
var c_a_text = "";
var currentStage = 1;
var currentCount = 1;
var currentScore = 0;
var stageCount = 0;
var currentQuestions;
var last_an;
var canPress = true;
var pressable = true;
var canPhone = true;
var isPhoning = false;
var can2to2 = true;
var canAsk = true;
var canTakeMoney = false;
var justUsed2To2 = false;
var tim = 30;
var maxTime = 30;
var scores = [
	0, 100,
	200, 300,
	500, 1000,
	2000, 4000,
	8000, 16000,
	32000, 64000,
	125000, 250000,
	500000, 1000000,
];
var bg;
var winner;

var startS = new Audio ("audio/select.mp3");
startS.volume = vol * 0.75;


function togglePause(toTrue = false, prese = false) {
	if (toTrue && paused) {
	} else {
		paused = !paused;
		if (paused) {
			mask.addClass ('opacity-1');
			mask.removeClass ('z-n-1');
			mask.addClass ('z-98');
		} else {
			mask.removeClass ('opacity-1');
			mask.addClass ('z-n-1');
			mask.removeClass ('z-98');
			timeSecond ();
		}
	}
}

function toggleWin(toTrue = false) {
	paused = true;
	maskWin.addClass ('opacity-1');
	maskWin.removeClass ('z-n-1');
	maskWin.addClass ('z-100');
	if (toTrue) {
		$ ('#win_text').html ('Well, you did what you wanted. Here you can see records: <br>' +
			'<table class="table table-dark bg-transparent w-50 mx-auto">\n' +
			'\t\t\t\t<thead>\n' +
			'\t\t\t\t<tr>\n' +
			'\t\t\t\t\t<th class="border-0" scope="col">Name</th>\n' +
			'\t\t\t\t\t<th class="border-0" scope="col">Score</th>\n' +
			'\t\t\t\t</tr>\n' +
			'\t\t\t\t</thead>\n' +
			'\t\t\t\t<tbody id="table_records">\n' +
			'\t\t\t\t</tbody>\n' +
			'\t\t\t</table>');
		putRecords ();
		BigPrize (false, true, 15, '#00BB0B', '#FFFC00');
	} else {
		$ ('#win_text').text ("Congratulations! You won 1000000 TMT! You did it! But, this is just record in the game. Nobody won't give you the money. Anyway, Good luck!");

	}
}

function toggleLose(toTrue = false) {
	if (toTrue && paused) {
	} else {
		paused = true;
		let ind = Math.floor (Math.random () * lost.length);
		// console.log (ind);
		// lost[ind];
		// console.log (lost[ind]);
		$ ('#lost-text').html (lost[ind]);
		maskLose.addClass ('opacity-1');
		maskLose.removeClass ('z-n-1');
		maskLose.addClass ('z-100');
	}
}

function return_to_menu() {
	togglePause (true);
	SoloAlert.confirm ({

		title: "Do you want to return?",

		body: "Your progress won't be saved. Are you sure?",

		theme: "dark",


		useTransparency: true,

		onOk: function () {
			goMenu ();
		},
		onCancel: function () {
			togglePause ();
		},

	})
}

function restart() {
	if (pressable) {
		pressable = false;
		togglePause (true);
		SoloAlert.confirm ({

			title: "Do you want to restart?",

			body: "Your progress won't be saved. Are you sure?",

			theme: "dark",


			useTransparency: true,

			onOk: function () {
				startNewGame (true);
			},
			onCancel: function () {
				pressable = true;
				togglePause ();
			},

		})
	}
}

function goMenu() {
	location.href = 'index.html';
}

function take_money() {
	if (canTakeMoney) {
		togglePause (true);
		SoloAlert.confirm ({

			title: "Do you want to take your money?",

			body: "Your record will be saved if it's higher than anyone. Are you sure?",

			theme: "dark",


			useTransparency: true,

			onOk: function () {
				addRecord ([getName (), currentScore]);
				toggleWin (true);
			},
			onCancel: function () {
				togglePause ();
			},

		})
	}
}

function getRecord() {
	let tsf = localStorage.getItem ("record");
	if (tsf === null)
		return false;
	else
		return tsf;
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

function getBoolean(bnm, issp = false) {
	let bn = localStorage.getItem (bnm);
	if (bn !== null)
		return bn === "true";
	else
		return issp;
}

function vol_down() {
	$ ('#volume').val (0);
}

function vol_up() {
	$ ('#volume').val (1);
}

volume_bar.on ('input', function () {
	vol = parseFloat (volume_bar.val ());
	localStorage.setItem ('volume', parseFloat (volume_bar.val ()));
});

function onSelectAnswer(element) {
	if (canPress && !isPhoning) {
		element = $ (element);
		// console.log($('.answer-text', element).hasClass('invisible'));
		if (justUsed2To2) {
			if ($ ('.answer-text', element).hasClass ('invisible'))
				return;
		}
		pressable = false;
		paused = true;
		ans = parseInt (element.attr ('answer'));
		// console.log (ans);
		element.addClass ('selected');
		canPress = false;
		canS.removeClass ('canSelect');
		selecting.volume = vol;
		if (getBoolean ('sound'))
			selecting.play ();
		isQuestionAsked = false;
		setTimeout (waitAndShowResult, 3000);
	}
}

function waitAndShowResult() {
	if (ans !== -1) {
		last_an = $ ('.selected');
		last_an.removeClass ('selected');
		if (ans === c_a_id) {
			paused = true;
			last_an.addClass ('right');
			stageCount++;
			let curprize = $ ('#prize_' + currentCount);
			curprize.addClass ('text-success');
			currentScore = scores[currentCount];
			updateScore ();
			currentCount++;
			addProgress ();
			right.volume = vol;
			if (getBoolean ('sound'))
				right.play ();
			canTakeMoney = true;
			if (stageCount === 5) {
				currentStage++;
				stageCount = 0;
				loadAudioByLevel ();

				if (currentStage == 4)
					BigPrize (true, true);
				else {
					loadQuestion ();
					BigPrize ();
				}
			} else {
				Prize ();
			}
		} else {
			pressable = true;
			wrong.volume = vol;
			if (getBoolean ('sound'))
				wrong.play ();
			toggleLose ();
		}
	}
}

function addProgress() {
	p_height += 6.666666666666667;
	if (p_height > 100)
		p_height = 100;
	progress_bars.height (p_height + '%')
}

function shuffle(array) {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

		// Pick a remaining element...
		randomIndex = Math.floor (Math.random () * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

function selectAndPutQuestion() {
	let q_id = Math.floor (Math.random () * currentQuestions.length);
	tx_question.text (he.decode (currentQuestions[q_id]['question']));
	c_a_text = currentQuestions[q_id]['answers'][currentQuestions[q_id]['ans']];
	let answers = currentQuestions[q_id]['answers'].slice ();
	// console.log (rght);
	// console.log (answers);
	shuffle (answers);
	// console.log (answers);
	// console.log (answers.indexOf (rght));
	c_a_id = answers.indexOf (c_a_text);
	isQuestionAsked = true;
	canTakeMoney = false;
	for (let i = 0; i < answers.length; i++) {
		answerFields[i].text (he.decode(answers[i]));
	}

	if (q_id > -1) {
		currentQuestions.splice (q_id, 1);
	}
}

function eventers() {
	$ ("#2to2")
		.on ("mouseenter", function () {
			if (can2to2)
				$ ("img", this).first ().attr ('src', 'img/lifeline-5050-hover.png');
		})
		.on ("mouseleave", function () {
			if (can2to2)
				$ ("img", this).first ().attr ('src', 'img/lifeline-5050.png');
		});

	$ ("#audience")
		.on ("mouseenter", function () {
			if (canAsk)
				$ ("img", this).first ().attr ('src', 'img/lifeline-ata-hover.png');
		})
		.on ("mouseleave", function () {
			if (canAsk)
				$ ("img", this).first ().attr ('src', 'img/lifeline-ata.png');
		});

}

function startNewRound(first = false, justUsed = false) {
	selectAndPutQuestion ();
	if (getBoolean ('sound'))
		startS.play ();
	pressable = true;
	paused = false;
	if (!first) {
		let an = $ ('.right');
		an.removeClass ('right');
		canS.addClass ('canSelect');
		canPress = true;
	}
	tim = maxTime;
	if (justUsed2To2 || justUsed) {
		$ ('.answer-text').removeClass ('invisible');
		$ ('.answer').removeClass ('disabled');
		if (justUsed2To2)
			justUsed2To2 = false;
		else {
			$ ("#2to2 > img").attr ({"src": "img/lifeline-5050.png"});
			$ ("#2to2 > img").attr ({"src": "img/lifeline-5050.png"});
			$ ("#2to2").css ("cursor", "pointer");
			if ($ ("#phone_F").hasClass ('text-black-50')) {
				$ ("#phone_F").removeClass ('text-black-50');
				$ ("#phone_F").addClass ('text-light');
			}
			$ ("#phone_F").css ("cursor", "pointer");
			$ ("#audience > img").attr ({"src": "img/lifeline-ata.png"});
			$ ("#audience").css ("cursor", "pointer");
		}
	}
	timeSecond ();
}

function loadQuestion() {
	currentQuestions = stages[currentStage]['data'].slice ();
}

function Prize(effect = false) {
	var duration = 3 * 1000;
	var animationEnd = Date.now () + duration;
	var defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

	function randomInRange(min, max) {
		return Math.random () * (max - min) + min;
	}

	var interval = setInterval (function () {
		var timeLeft = animationEnd - Date.now ();

		if (timeLeft <= 0) {
			return clearInterval (interval);
		}

		var particleCount = 50 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		confetti (Object.assign ({}, defaults, {particleCount, origin: {x: randomInRange (0.1, 0.3), y: Math.random () - 0.2}}));
		confetti (Object.assign ({}, defaults, {particleCount, origin: {x: randomInRange (0.7, 0.9), y: Math.random () - 0.2}}));
	}, 250);
	if (!effect)
		setTimeout (startNewRound, 3000);
}

function BigPrize(grand = false, effect = false, times = 5, frst = '#BB0000', scn = '#FFFFFF') {
	var isg = times;
	if (grand) {
		if (getBoolean ('sound'))
			winner.play ();
		bg.pause ();
		addRecord ([getName (), currentScore]);
		toggleWin ();
		isg = 7;
	}
	var end = Date.now () + (isg * 1000);

	var colors = [frst, scn];

	(function frame() {
		confetti ({
			particleCount: 2,
			angle: 60,
			spread: 55,
			origin: {x: 0},
			colors: colors
		});
		confetti ({
			particleCount: 2,
			angle: 120,
			spread: 55,
			origin: {x: 1},
			colors: colors
		});

		if (Date.now () < end) {
			requestAnimationFrame (frame);
		}
	} ());
	if (!effect) {
		setTimeout (startNewRound, 5000);
	} else {
		if (grand) {
			setTimeout (Prize, 7000, true);
		}
	}
}

function startNewGame(first = false) {
	hideAllToogles ();
	loadQuestion ();
	putFields ();
	startNewRound (true, true);
	if (first) {
		loadAudioByLevel ();
		if (winner != null && !winner.paused)
			winner.pause ();
	}
}

function hideAllToogles() {

	if (maskLose.hasClass ('opacity-1')) {
		maskLose.removeClass ('opacity-1');
		maskLose.addClass ('z-n-1');
		maskLose.removeClass ('z-100');
	}
	if (maskWin.hasClass ('opacity-1')) {
		maskWin.removeClass ('opacity-1');
		maskWin.addClass ('z-n-1');
		maskWin.removeClass ('z-100');
	}
	if (mask.hasClass ('opacity-1')) {
		mask.removeClass ('opacity-1');
		mask.addClass ('z-n-1');
		mask.removeClass ('z-98');
		paused = false;
	}
	if (last_an != null) {
		if (last_an.hasClass ('right'))
			last_an.removeClass ('right');
		if (last_an.hasClass ('wrong'))
			last_an.removeClass ('wrong');
		if (!canS.hasClass ('canSelect')) {
			canS.addClass ('canSelect');
		}
	}
	for (let o = 1; o < 16; o++) {
		let pr = $ ('#prize_' + o);
		if (pr.hasClass ('text-success')) {
			pr.removeClass ('text-success');
		}
	}
	p_height = 0;
	progress_bars.height (p_height + '%');
	canPress = true;
}

function timeSecond() {
	if (!paused) {
		tim--;
		updateTime ();
		if (tim <= 0) {
			pressable = true;
			if (getBoolean ('sound'))
				wrong.play ();
			toggleLose ();
		} else {
			setTimeout (timeSecond, 1000);
		}
	}
}

function updateScore() {
	score_text.text (currentScore);
}

function updateTime() {
	time_text.text (tim);
}

function putFields() {
	name_text.text (getName ());
	score_text.text (0);
	currentStage = 1;
	currentCount = 1;
	currentScore = 0;
	stageCount = 0;
	maxTime = getTime ();
	volume_bar.val (getVolume ());
	canPhone = true;
	canAsk = true;
	can2to2 = true;
	isQuestionAsked = false;
}

function getName() {
	let tsf = localStorage.getItem ("name");
	if (tsf === null)
		return "Anonym";
	else
		return tsf;
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

function getRecords() {
	let tsf = localStorage.getItem ("records");
	if (tsf === null)
		return null;
	else
		return JSON.parse (tsf);
}

function addRecord(newR) {
	let newRecords = [];
	let records = getRecords ();
	if (records !== null) {
		let mn = Math.min (records.length, 5);
		let isF = false;
		for (let i = 0; i < mn; i++) {
			if (records[i] != null) {
				newRecords[i] = records[i];
			} else {
				newRecords[i] = newR;
				isF = true;
				break;
			}
		}
		if (!isF) {
			// console.log (newRecords);
			let mx = Math.max (records.length - 1, 4);
			// console.log (newRecords[mx]);
			// console.log (newR);
			if (newRecords[mx] !== undefined && newRecords[mx] !== null && newRecords[mx][1] < newR[1])
				newRecords[mx] = newR;
			else if (newRecords[mx] === undefined || newRecords[mx] === null) {
				// console.log (newR);
				newRecords[mx] = newR;
				// console.log (newRecords[mx]);
			}
		}
	} else {
		newRecords[0] = newR;
	}
	if (newRecords !== null) {
	newRecords = newRecords.filter (function (el) {
		return el != null;
	});
	}
	newRecords.sort ((a, b) => b[1] - a[1]);

	localStorage.setItem ('records', JSON.stringify (newRecords));
}

startNewGame (true);

eventers ();

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
	bg.volume = vol;
	wrong.volume = vol;
	right.volume = vol;
	selecting.volume = vol;
	winner.volume = vol;
	startS.volume = vol * 0.75;
	audienceSound.volume = vol;
	volume_bar.val (vol);
	localStorage.setItem ('volume', vol);
});

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

function loadAudio(path = "easy.mp3") {
	bg = new Audio ("audio/" + path);
	bg.loop = true;
	bg.volume = vol * 0.75;
	bg.addEventListener ('canplay', function () {
//code, when audio can play
		setTimeout (tryToPlay, 2000);
	})

}

function loadAudioByLevel() {
	switch (currentStage) {
		case 1: {
			if (bg != null) {
				bg.pause ();
				bg = null;
			}
			loadAudio ();
		}
			break;
		case 2: {
			if (bg != null) {
				bg.pause ();
				bg = null;
			}
			loadAudio ("medium.mp3");
		}
			break;
		case 3: {
			if (bg != null) {
				bg.pause ();
				bg = null;
			}
			loadAudio ("hard.mp3");
		}
			break;
	}
}

function phoneFriend() {
	if (canPhone && isQuestionAsked) {
		canPhone = false;
		isPhoning = true;
		paused = true;
		let friend_text = $ ('#friend_text');
		let friend = ['Alexander', 'Diana', 'Taylor', 'Maria', 'Kate', 'John']
		let randFriend = Math.floor (Math.random () * friend.length);
		let sure = ["100%", "80%", "60%", "50%", "30%"];
		let randResp = Math.floor (Math.random () * 4);
		let resp = ["I'm sure it\'s ", "It\'s certainly ", "It\'s definitely ", "I think it\'s ", "I'm not sure to choose "];
		let answer_tfi = "";

		$ ('#phone_Help').removeClass ('invisible');
		$ ("#phone_F").removeClass ('text-light');
		$ ("#phone_F").addClass ('text-black-50');
		$ ("#phone_F").css ("cursor", "default");

		if (randResp < 3) {
			answer_tfi = c_a_text;
		} else {
			let answr = "";
			if (Math.random () < 0.50) {
				let ns = Math.floor (Math.random () * 3);
				answr = $ ('#answer-text-' + ns).text ();
			} else {
				answr = c_a_text;
			}
			answer_tfi = answr;
		}

		setTimeout (() => {
			friend_text.html ("Calling... ☎")
		}, 100)

		setTimeout (() => {
			friend_text.html ("Connected ✔")
		}, 2000)

		setTimeout (
			function () {
				friend_text.html ('ME: Hello ' + friend[randFriend] + '. I need your help, I need the answer to this question...');
			}
			, 3800)

		setTimeout (
			function () {
				friend_text.html (`${ friend[randFriend] }: Thinking...`)
			}
			, 7000)

		setTimeout (
			function () {
				friend_text.html (`${ friend[randFriend] }: ${ resp[randResp] } ${ answer_tfi }.`)
				isPhoning = false;
			}
			, 10000)

		setTimeout (
			function () {
				friend_text.html ("ME: How confident are you?")
			}
			, 13000)

		setTimeout (
			function () {
				friend_text.html (`${ friend[randFriend] }: I'm ${ sure[randResp] } sure.`)
				paused = false;
				timeSecond ();
			}
			, 16000)

		setTimeout (
			function () {
				friend_text.html ("")
				$ ('#phone_Help').addClass ('invisible');
			}, 18000)
	}
}

function make2To2() {
	if (can2to2 && isQuestionAsked) {
		can2to2 = false;
		justUsed2To2 = true;
		if (getBoolean ('sound'))
			audienceSound.play ();
		let ns = Math.floor (Math.random () * 3);
		if (ns === c_a_id) {
			ns = Math.floor (Math.random () * 3);
			if (ns === c_a_id) {
				ns = Math.floor (Math.random () * 3);
			}
		}
		for (let i = 0; i < 4; i++) {
			if (i !== ns && i !== c_a_id) {
				$ ('#answer-text-' + i).addClass ('invisible');
				$ ('#answer' + i).addClass ('disabled');
			}
		}
		$ ("#2to2 > img").attr ({"src": "img/lifeline-5050-used.png"});
		$ ("#2to2").css ("cursor", "default");
	}
}

function getRandomArbitrary(min, max) {
	return Math.random () * (max - min) + min;
}

function audience() {
	if (canAsk) {
		canAsk = false;
		paused = true;
		if (getBoolean ('sound'))
			audienceSound.play ();
		let help_text = $ ('#friend_text');

		help_text.text ("");
		$ ("#audience > img").attr ({"src": "img/lifeline-ata-used.png"});
		$ ("#audience").css ("cursor", "default");

		setTimeout (function () {
			$ ('#phone_Help').removeClass ('invisible');
			help_text.text ("Throwing question to audience...")
		}, 100);

		setTimeout (function () {
			help_text.text ("Audience thinking...")
		}, 1200);

		setTimeout (function () {
			help_text.text ("");
			$ ('#phone_Help').addClass ('invisible');
			$ ('#audience_bars').removeClass ('invisible');

			var options = ["A", "B", "C", "D"]
			let highest = getRandomArbitrary (40, 75);
			let maxs = 100 - highest;
			for (var i = 0; i < options.length; i++) {
				if (i != c_a_id) {
					let rndm = getRandomArbitrary (0, maxs);
					if (rndm > highest) {
						rndm = getRandomArbitrary (0, maxs);
						if (rndm > highest)
							rndm = getRandomArbitrary (0, maxs);
					}
					maxs -= rndm;
					$ (`.bar-${ options[i] }`).css ("width", `${ rndm }%`).attr ('aria-valuenow', rndm.toFixed (1));
					$ (`#bar-${ options[i] }`).text (`${ rndm.toFixed (1) }%`);
				} else {
					$ (`.bar-${ options[i] }`).css ("width", `${ highest }%`).attr ('aria-valuenow', highest.toFixed (1));
					$ (`#bar-${ options[i] }`).text (`${ highest.toFixed (1) }%`);
				}
			}


		}, 2700);

		setTimeout (function () {
			$ ('#audience_bars').addClass ('invisible');


			paused = false;
			timeSecond ();
		}, 7000);


		$ (".closeBtn").click (function () {
			$ ('#audience_bars').addClass ('invisible');
		})
	}
}

var right = new Audio ("audio/right.mp3");
right.volume = vol;

var wrong = new Audio ("audio/wrong.mp3");
wrong.volume = vol;

var selecting = new Audio ("audio/start.mp3");
selecting.volume = vol;

var winner = new Audio ("audio/winner.mp3");
winner.volume = vol;
winner.loop = true;

var audienceSound = new Audio ("audio/50_50.mp3");
audienceSound.volume = vol;

console.log(stages);