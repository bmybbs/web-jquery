var appkey = 'newweb';
var popup;
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

function convert_timestamp_to_date_time_string(timestamp) {
	var t = new moment.unix(timestamp);
	return t.format('YYYY.MM.DD HH:mm:ss');
}

function parse_article_list(articles, callback) {
	var out = "";
	for(var i=0; i<articles.length; i++) {
		out += "<div class='dashboard-item'><span>" + articles[i].title + "</span></div>";
	}

	if(callback && typeof(callback)=="function")
		callback(out);
}

function parse_topten_list(articles, callback) {
	var out = "";
	for(var i=0; i<articles.length; i++) {
		out += "<div class='dashboard-item'><div class='dashboard-item-title float-left'><span class='bmy-span-icon bmy-bg-color-";
		out += (i<3) ? "red1" : "gray1";
		out += "'></span><span>" + articles[i].title + "</span><span class='dashboard-item-author'>" + articles[i].author + "@" + articles[i].board + "</span></div>";
		out += "<div class='float-right'>"+convert_timestamp_to_date_time_string((articles[i].type==1) ? articles[i].tid : articles[i].aid)+"</div>";
		out += "<div class='clear'></div></div>";
	}

	if(callback && typeof(callback)=="function")
		callback(out);
}

function parse_sec_list(articles, callback) {
	var out = "";
	for(var i=0; i<articles.length; i++) {
		out += "<div class='dashboard-item'><div class='dashboard-item-title float-left'><span class='bmy-span-icon bmy-bg-color-gray1'></span>";
		out += "<span>" + articles[i].title + "</span><span class='dashboard-item-author'>" + articles[i].author + "@" + articles[i].board + "</span></div>";
		out += "<div class='float-right'>"+convert_timestamp_to_date_time_string((articles[i].type==1) ? articles[i].tid : articles[i].aid)+"</div>";
		out += "<div class='clear'></div></div>";
	}

	if(callback && typeof(callback)=="function")
		callback(out);
}

function load_top_board() {
	for(var i=0; i<bmysecstrs.length; i++) {
		var url;
		if(typeof(localStorage.userid)!="undefined" && typeof(localStorage.sessid)!="undefined")
			tb_url = 'api/board/list?secstr='+bmysecstrs[i].id+'&userid='+localStorage.userid+'&sessid='+localStorage.sessid+'&appkey='+appkey;
		else
			tb_url = 'api/board/list?secstr='+bmysecstrs[i].id+'&appkey='+appkey;
		$.ajax({
			type: "GET",
			url: tb_url,
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
			parse_topten_list(data.articlelist, function(out) {
				$(out).appendTo('div#dashboard-topten');
			});
		}
	});
}

function load_sectop() {
	for(var i=0; i<bmysecstrs.length; i++) {
		$.ajax({
			type: "GET",
			url: 'api/article/list?type=sectop&secstr='+bmysecstrs[i].id,
			dataType: 'json',
			async: false,
			success: function(data) {
				parse_sec_list(data.articlelist, function(out) {
					$(out).appendTo('div#dashboard-sec-'+bmysecstrs[i].id);
				});
			}
		});
	}
}

function load_announce() {
	$.ajax({
		type: "GET",
		url: 'api/article/list?type=announce',
		dataType: 'json',
		success: function(data) {
			parse_article_list(data.articlelist, function(out) {
				$(out).appendTo('div#dashboard-announce');
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
				$(out).appendTo('div#dashboard-commend');
			});
		}
	});
}

function load_personal_status(callback) {
	if(typeof(localStorage.userid) == 'undefined') {
		$('#bmy-ps-info').html("<span id='login-button'>登录</span>");
		if(callback && typeof(callback)=="function")
			callback();
	}
	else {
		var url_query_user = 'api/user/query?userid=' + localStorage.userid + '&sessid=' + localStorage.sessid + '&appkey=' + appkey;
		$.getJSON(url_query_user, function(data) {
			if(data.errcode == 0) {
				$('#bmy-ps-info').html(localStorage.userid + " | 站内信(<span class='bmy-ps-info-num'>" + data.unread_mail + "</span>) | 提醒(<span class='bmy-ps-info-num'>" + data.unread_notify + "</span>) | 工具箱 | <span id='logout-button'>注销</span>");
			} else {
				$('#bmy-ps-info').html("<span id='login-button'>登录</span>");
			}

			if(callback && typeof(callback)=="function")
				callback();
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
	load_personal_status(function() {
		$('#login-button').bind('click', function(e) {
			e.preventDefault();
			popup = $('#login-box').bPopup({
				modalClose: false,
				opacity: 0.6,
				positionStyle: 'fixed'
			});
		});

		bind_logout_button(function() {
			document.location.href = 'index.html';
		});

		bind_login_button(function() {
			popup.close();
		});
	});

	load_top_board();

	//setInterval(load_personal_status, 30000);
}
