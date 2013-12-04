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
	var out = "<table class='table'><thead><tr><td>#</td><td>标题</td></tr></thead><tbody>";
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
