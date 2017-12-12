define(['jquery', 'bootstrap', 'adminlte', 'pager', 'mine', 'md5','mui'], function($, B, A, pager, mine, md5,mui) {
	getBodyHeight();
	var totalRecords;
	var totalPage = 1;
	var editsaveId = '';
	var status = 0;
	pageSize = 10;
	getChallengeList(status, page);
	var allCategory = [];
	var showArry = {
		'true': '是',
		'false': '否'
	}
	var userRole = ['普通用户', '管理员'];

	var statusArry = ['完成','取消'];
	//			var priorityArry = ['低','中低','中','中高','高'];
	//			getCompontentCategory();

	//	显示当前用户
	showCurrentUser();

	//	退出操作
	$('#out').click(function() {
		signOut();
	})
	
		//	控制左侧显示
	$('.sidebar-toggle').click(function(){
		console.log(window.screen.width);
		if(window.screen.width >= 768){
			if($('body').hasClass('sidebar-collapse')){
				$('body').removeClass('sidebar-collapse');
			}else{
				$('body').addClass('sidebar-collapse');
			}
			
		}else{
			if($('body').hasClass('sidebar-open')){
				$('body').removeClass('sidebar-open');
			}else{
				$('body').addClass('sidebar-open');
			}
		}
		
	})

	function getChallengeList(status, page) {
		mine.showLoading();
		var url = urlBase + '/challenge/list/e10adc3949ba59abbe56e057f20f8830/' + status + '/' + page + '/' + pageSize;
		mine.get(url).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
				console.log(data)
				totalRecords = data.totalRecords;
				totalPage = totalRecords % pageSize == 0 ? totalRecords / pageSize : Math.ceil(totalRecords / pageSize);
				console.log(totalPage);
				if(totalPage == 1) {
					$('.pageJump').hide();
				} else {
					$('.pageJump').show();
				}
				var startnum = page + 1;
				Page({
					num: totalPage, //页码数
					startnum: startnum, //指定页码
					elem: $('#page1'), //指定的元素
					callback: function(n) { //回调函数
						getUnlocking(n - 1);
					}
				});
				$.each(data.dataList, function(index, item) {
					item.status = statusArry[item.status-1];
					item.roleText = userRole[item.userTO.role - 1];
					
					if(item.startTime == undefined){
						item.startTime = '';
					}else{
						item.startTime = formatDate(item.startTime);
					}
					if(item.endTime == undefined){
						item.endTime = '';
					}else{
						item.endTime = formatDate(item.endTime);
					}
					
					
				});

				mine.render("tpl/user_challenge_data.html", data).then(function(html) {
					$('.task-list').html(html);
					//	删除操作
					$('.task-list .btn-danger').click(function() {
						var value = $(this).val();
						console.log(value);
						value = value.split(':');
						var delId = value[0];
						var delName = value[1];
						$('#delname').text(delName);
						$('#objectname').text(value[2]);
						$('#delSubmit').attr('delid', delId);
					});
					
					// 查看操作
// {{userTO.username}}:{{userTO.realname}}:{{userTO.mobile}}:{{productTO.name}}:{{status}}:{{startTime}}:{{endTime}}:{{productTO.completeNum}}:{{productTO.remaining}}
					var showArry = ["usernam","realname","roleText","challenge","result","starttime","endtime","completeNum","remaining"];
					$('.task-list .btn-primary').click(function(){
						var value = $(this).val();
						console.log(value);
						value = value.split('!');
						console.log(value);
						$('#usernam').text(value[0]);
						insertInputValue(showArry,value);
						
					})
					

				});
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

	
	//	增加用户
	$('#addUser').click(function() {
		var role = $('#role').val();
		role = parseInt(role);
		var username = $('#username').val();
		var realname = $('#relaname').val();
		var mobile = $('#mobile').val();
		var password = $('#password').val();
		var repassword = $('#repassword').val();
		var available = $('#available').val();
		if(username != '' && relaname != '' && mobile != '' && password != '' && repassword != '') {
			if(password == repassword) {
				password = md5(password);
				console.log(password);
				var dataJson = {
					username: username,
					realname: realname,
					mobile: mobile,
					role: role,
					password: password,
					available: available

				}
				console.log(JSON.stringify(dataJson));
				addUser(dataJson)

			} else {
				mui.alert('密码不一致，请重新输入密码')
			}

		} else {
			mui.alert('新增用户所有属性为必填项')
		}
	})

	function addUser(dataJson) {
		mine.showLoading();
		var url = urlBase + '/user';
		mine.post(url, dataJson).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
				mui.alert('添加成功');
				window.location.reload();
			} else {
				mui.alert('添加失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		})
	}

	//	删除操作
	$('#delSubmit').click(function() {
		var id = $(this).attr('delid');
		console.log(id);
		delUser(id);
	});

	function delUser(id) {
		mine.showLoading();
		var url = urlBase + '/challenge/' + id;
		mine.del(url).then(function(data) {
			mine.closeLoading();
			console.log(JSON.stringify(data));
			if(data.errCode == 0) {
				mui.alert('刪除成功');
				window.location.reload();
			} else {
				mui.alert('刪除失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		})
	}

	//	关闭模态框清input数据---查看模态框
	//	$('#myModal-edit .close').click(function(){
	//		var arry = ['edpname','edpnum','edpimg']
	//		$('.edupload-img').attr('src','');
	//		clearInputValue(arry);
	//	});
	//	
	//	$('#myModal-edit .btn-default').click(function(){
	//		var arry = ['edpname','edpnum','edpimg']
	//		$('.edupload-img').attr('src','');
	//		clearInputValue(arry);
	//	});
	//	

	//	编辑操作
	$('#editSave').click(function() {
		var role = $('#edrole').val();
		role = parseInt(role);
		var username = $('#edusername').val();
		var realname = $('#edrelaname').val();
		var mobile = $('#edmobile').val();
		var password = $('#edpassword').val();
		var repassword = $('#edrepassword').val();
		var available = $('#edavailable').val();
		if(username != '' && relaname != '' && mobile != '' && password != '' && repassword != '') {
			if(password == repassword) {
				password = md5(password);
				console.log(password);
				var dataJson = {
					id: editsaveId,
					username: username,
					realname: realname,
					mobile: mobile,
					role: role,
					password: password,
					available: available

				}
				console.log(JSON.stringify(dataJson));
				updateUser(dataJson)

			} else {
				mui.alert('密码不一致，请重新输入密码')
			}
		} else {
			mui.alert('新增用户所有属性为必填项')
		}
	});

	function updateUser(dataJson) {
		mine.showLoading();
		var url = urlBase + '/user';
		mine.put(url, dataJson).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
				mui.alert('修改成功');
				window.location.reload();
			} else {
				mui.alert('修改失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		})
	}

	//	清除input value
	clearInputValue = function(idArry) {
		$.each(idArry, function(index, item) {
			$('#' + idArry[index]).val('');
		});
	}

	//	赋值input value
	insertInputValue = function(doms, values) {
		$.each(doms, function(index, item) {
			$('#' + doms[index]).val(values[index]);
		});
	}
	
	
	//	切换排序
	$('#status').change(function() {
		status = $(this).children('option:selected').val();
		$('.task-list').html("");
		getChallengeList(status, page);
	})

});