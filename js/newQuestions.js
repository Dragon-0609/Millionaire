var Url = "https://opentdb.com/api_token.php?command=request";
  $.get(Url, function start(data) {
    console.log(data.token);
		$.ajax({url: "https://opentdb.com/api.php?amount=1&&difficulty=easy&token="+data.token, success: function(result){
		console.log(result); // raw questions
		let arr = result['results'];
		let newR = [];
		for(let i in arr){
			let answs = arr[i]['incorrect_answers'];
			if(answs.length==3){ // select, where answers are 4
				answs.push(arr[i]['correct_answer']);
				let vr =
				{
					'question': arr[i]['question'],
					'answers': answs,
					'ans': 3 // Add correct. On selecting, game will shuffle
				};
				newR.push(vr);
			}
		}	
		console.log(JSON.stringify(newR));
	  }});
  });