let player = null
let score = 0
let quizList = null
let timeleft = 15
let quizleft = 10
let rank = localStorage.rank ? JSON.parse(localStorage.rank) : []
let status = true

//获取题目
$.get('quiz.json').then(function (res) {
	quizList = res
})

//输入框浮动效果
$('.welcomePage .input input').focus(function () {
	$('.welcomePage .input').css('box-shadow','0px 6px 10px dimgrey')
})
$('.welcomePage .input input').blur(function () {
	$('.welcomePage .input').css('box-shadow','none')
})

//开始游戏，转场
//点击转场
$(".welcomePage .start").click('ontouchstart',function () {
	if($('.welcomePage .input input').val() != '' && status){
		status = false
		$(".welcomePage .start").css('box-shadow','none')
		setTimeout(function () {
			$('.welcomePage').fadeOut(500)
			$('.mainPage').fadeIn(500)
			player = $('.welcomePage .input input').val()
			refresh()
			delayDone()
		},300)
	}
})
//按键转场
$('.welcomePage .input input').keypress(function (e) {
	if($('.welcomePage .input input').val() != '' && e.key == 'Enter' && status){
		status = false
		$(".welcomePage .start").css('box-shadow','none')
		setTimeout(function () {
			$('.welcomePage').fadeOut(500)
			$('.mainPage').fadeIn(500)
			player = $('.welcomePage .input input').val()
			refresh()
			delayDone()
		},300)
	}
})

//题目更新
function refresh() {
	quizleft --
	if(quizleft < 0){
		$('.mainPage').fadeOut(500)
		$('.scorePage').fadeIn(500)
		$('.scorePage .again').css('box-shadow','0px 6px 10px dimgrey')
		//进入分数页面时刷新题目数
		quizleft = 10
		scoreRefresh()
	}else {
		let question = quizList.splice(Math.floor(quizList.length * Math.random()),1)[0]
		//开始新题目时重置时间
		timeleft = 15
		$('.mainPage .timeout').html('15')
		$('.mainPage .qno').html(`
		<div class="question">Q${10 - quizleft}: ${question.quiz}</div>
\t\t\t\t<div class="answer" data-index="1" id="a1">1、${question.options[0]}</div>
\t\t\t\t<div class="answer" data-index="2" id="a2">2、${question.options[1]}</div>
\t\t\t\t<div class="answer" data-index="3" id="a3">3、${question.options[2]}</div>
\t\t\t\t<div class="answer" data-index="4" id="a4">4、${question.options[3]}</div>
		`)
		let countDown = setInterval(function () {
			timeleft --
			$('.mainPage .timeout').html(`${timeleft}`)
			if(timeleft == 0){
				clearInterval(countDown)
				$('.mainPage .qno').off('click')
				$('#a' + question.answer).css('background-color','#92d050')
				setTimeout(refresh,2000)
			}
		},1000)
		$('.mainPage .qno').click(function (e) {
			if(e.target.className == 'answer'){
				clearInterval(countDown)
				$('.mainPage .qno').off('click')
				$('#a' + e.target.dataset.index).css('box-shadow','none')
				if(e.target.dataset.index == question.answer){
					$('#a' + e.target.dataset.index).css('background-color','#92d050')
					score += 10
				} else {
					$('#a' + question.answer).css('background-color','#92d050')
					$('#a' + e.target.dataset.index).css('background-color','red')
				}
				setTimeout(refresh,2000)
			}
		})
	}
}

//刷新排行榜
function scoreRefresh() {
	$('.scorePage .score h1').html(score)
	if(rank.length == 0){
		rank.push({
			name: player,
			score: score
		})
	}else {
		for(let i = 0; i < rank.length; i++) {
			if(score > rank[i].score){
				rank.splice(i,0,{
					name: player,
					score: score
				})
				break
			}
			if (i == rank.length - 1){
				rank.push({
					name: player,
					score: score
				})
				break
			}
		}
	}
	if (rank.length > 10){
		rank.splice(10,rank.length - 9)
	}
	rank.forEach(function (item,index) {
		$('.scorePage .rank .player' + (index + 1)).html(item.name + '&nbsp&nbsp' + item.score + '分')
	})
	localStorage.rank = JSON.stringify(rank)
	score = 0
	player = null
}

//重新进入开始界面
$('.scorePage .again').click(function () {
	if(status){
		status = false
		$('.scorePage .again').css('box-shadow','none')
		setTimeout(function () {
			$('.scorePage').fadeOut(500)
			$('.welcomePage').fadeIn(500)
			$(".welcomePage .start").css('box-shadow','0px 6px 10px dimgrey')
			delayDone()
		},300)
	}
})

//等等页面完全fadeout再允许按键
function delayDone() {
	setTimeout(function () {
		status = true
	},600)
}


