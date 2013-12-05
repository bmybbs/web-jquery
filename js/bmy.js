var appkey = 'newweb';

var bmysecstrs = [
	{ id: '0', name: "本站系统" },
	{ id: '1', name: "交通大学" },
	{ id: '2', name: "开发技术" },
	{ id: '3', name: "电脑应用" },
	{ id: '4', name: "学术科学" },
	{ id: '5', name: "社会科学" },
	{ id: '6', name: "文学艺术" },
	{ id: '7', name: "知性感性" },
	{ id: '8', name: "体育运动" },
	{ id: '9', name: "休闲音乐" },
	{ id: 'G', name: "游戏天地" },
	{ id: 'N', name: "新闻信息" },
	{ id: 'H', name: "乡音乡情" },
	{ id: 'A', name: "校务信息" },
	{ id: 'C', name: "俱乐部区" }
];

function parse_article_list(articles, callback) {
	var out = "<table class='table table-hover'><thead><tr><td>#</td><td>标题</td></tr></thead><tbody>";
	for(var i=0; i<articles.length; i++) {
		out += "<tr><td>" + i + "</td><td>" + articles[i].title + "</td></tr>";
	}
	out += "</tbody></table>";

	callback(out);
}

function load_top_board() {
	for(var i=0; i<bmysecstrs.length; i++) {
		$.ajax({
			type: "GET",
			url: 'api/board/list?secstr='+bmysecstrs[i].id+'&userid='+localStorage.userid+'&sessid='+localStorage.sessid+'&appkey='+appkey,
			dataType: 'json',
			async: false,
			success: function(data) {
				var out = "<div class='bmy-sec'><div class='bmy-sectitle'>"+bmysecstrs[i].id+"区/"+bmysecstrs[i].name+"</div><div>";
				var boards = data.boardlist; // 默认人气排序
				var maxnum = (boards.length > 5) ? 5 : boards.length;
				for(var j=0; j<maxnum; j++) {
					out += "<a href='#'>"+boards[j].zh_name+"</a> ";
				}
				out += "</div></div>";
				$(out).appendTo('div#bmy-brd-index');
			}
		});
	}
}

function load_topten() {
	$.ajax({
		type: "GET",
		url: 'api/article/list?type=top10',
		dataType: 'json',
		success: function(data) {
			parse_article_list(data.articlelist, function(out) {
				$('div#topten').html(out);
			});
		}
	});
}

function load_announce() {
	$.ajax({
		type: "GET",
		url: 'api/article/list?type=announce',
		dataType: 'json',
		success: function(data) {
			parse_article_list(data.articlelist, function(out) {
				$('div#announce').html(out);
			});
		}
	});
}

function load_commend() {
	$.ajax({
		type: "GET",
		url: 'api/article/list?type=commend',
		dataType: 'json',
		success: function(data) {
			parse_article_list(data.articlelist, function(out) {
				$('div#commend').html(out);
			});
		}
	});
}

function load_personal_status() {
	if(typeof(localStorage.userid) == 'undefined')
		$('#bmy-ps-info').html("<span id='login-button'>登录</span>");
	else {
		var url_query_user = 'api/user/query?userid=' + localStorage.userid + '&sessid=' + localStorage.sessid + '&appkey=' + appkey;
		$.getJSON(url_query_user, function(data) {
			if(data.errcode == 0) {
				$('#bmy-ps-info').html(localStorage.userid + " | 站内信(<span class='bmy-ps-info-num'>" + data.unread_mail + "</span>) | 提醒(<span class='bmy-ps-info-num'>" + data.unread_notify + "</span>) | 工具箱 | <span id='logout-button'>注销</span>");
			} else {
				$('#bmy-ps-info').html("<span id='login-button'>登录</span>");
			}
		});
	}
}

function bind_login_button(callback) {
	$('button#btn-login').click(function() {
		var userid   = $('input#username').val();
		var passwd   = $('input#password').val();
		var is_rmbme = $('input#chk_remember').is(':checked');

		var url_login = 'api/user/login?userid='+userid+'&passwd='+passwd+'&appkey=newweb';

		$.ajax({
			type: "GET",
			url: url_login,
			dataType: 'json',
			success: function(data) {
				if(data.errcode != 0) {
					alert(data.errcode);
				} else {
					localStorage.userid = data.userid;
					localStorage.sessid = data.sessid;
					localStorage.token  = data.token;
					localStorage.is_rmbme = is_rmbme;
					if(callback && typeof(callback)=="function") {
						callback();
					}
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert('oh no!' + xhr.responseText);
				alert(thrownError);
			}
		});
	});
}

function bind_logout_button(callback) {
	$('span#logout-button').click(function() {
		var url_logout = 'api/user/logout?userid=' + localStorage.userid + '&sessid=' + localStorage.sessid + '&appkey=' + appkey;
		$.ajax({
			type: "GET",
			url: url_logout,
			dataType: 'json',
			success: function(data) {
				if(data.errcode != 0) {
					alert(data.errcode);
				} else {
					localStorage.removeItem("userid");
					localStorage.removeItem("sessid");
					localStorage.removeItem("token");
					localStorage.removeItem("is_rmbme");

					if(callback && typeof(callback)=="function") {
						callback();
					}
				}
			}
		});
	});
}

function bmy_app_init() {
	load_personal_status();
	load_top_board();

	var popup;

	$('#login-button').bind('click', function(e) {
		e.preventDefault();
		popup = $('#login-box').bPopup({
			modalClose: false,
			opacity: 0.6,
			positionStyle: 'fixed'
		});
	});

	bind_login_button(function() {
		popup.close();
	});

	bind_logout_button(function() {
		document.location.href = 'index.html';
	});

	setInterval(load_personal_status, 30000);
}
