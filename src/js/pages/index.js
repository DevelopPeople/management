define(['jquery', 'bootstrap', 'adminlte', 'pager', 'mine','md5','mui'], function($, B, A, pager, mine, md5,mui) {
	var userRole = ['普通用户','管理员'];
    advanceAndRetreat();
	$('#login').click(function() {
		var userphone = $('#user').val();
		var userpass = $('#userpass').val();
		if(userphone !== '' && userpass !== "") {
			console.log(checkMobile(userphone))
            if(checkMobile(userphone)){
                userpass = md5(userpass);
                console.log(userpass);
                console.log(userphone);
                getTask(userphone,userpass);
            }
		} else  {
			mui.alert('用户名和密码不能为空');
		}
	})

	function getTask(userphone,password) {
		mine.showLoading();
		var url = urlBase + '/user/login/'+ userphone +'/'+ password;
		console.log(url);
		mine.get(url).then(function(data) {
			mine.closeLoading();
			console.log(JSON.stringify(data));
            console.log(data);
			if(data.errCode == 0) {
                // data.data.role = userRole[data.data.role-1];
                // var storage = window.localStorage;
                // storage.id = data.data.id;
	            // storage.username = data.data.username;
	           	// storage.realname = data.data.realname;
	           	// storage.role = data.data.role;
				if(data.dataList[0].role == 1 || data.dataList[0].role == 2){
                    var storage =window.localStorage;
                    storage.id=data.dataList[0].id;
                    storage.userphone=data.dataList[0].mobile;
                    storage.password=data.dataList[0].password;
                    storage.username=data.dataList[0].username;
                    console.log(storage.username);
                    window.location.href = "main.html";
                }else{
                	mui.alert("没有权限访问页面")
				}
			} else if(data.errCode == 1) {
				mui.alert("用户不存在");
			} else if(data.errCode == 2){
				mui.alert("用户密码错误");
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

});