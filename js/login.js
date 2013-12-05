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
				document.location.href = 'app.html';
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			alert('oh no!' + xhr.responseText);
			alert(thrownError);
		}
	});
});
