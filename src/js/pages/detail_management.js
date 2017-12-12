define(['jquery', 'bootstrap', 'adminlte', 'pager', 'mine','mui'], function($, B, A, pager, mine,mui) {
	var priorityArry = ['低', '中低', '中', '中高', '高'];
	var showArry = {
		'true': '是',
		'false': '否'
	}
	var pidArry = [];
	var editsaveId;

	getBodyHeight();
	getProductCategory();

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

	function getProductCategory() {
		mine.showLoading();
		var url = urlBase + '/product_category/list';
		console.log(url)
		mine.get(url).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
				console.log(JSON.stringify(data))
				var oldData = data.dataList;
				$.each(data.dataList, function(index, item) {
					if(item.pid == undefined || item.pid == '') {
						item.parent = '无';
						var newdata = {
							id: item.id,
							name: item.name
						}
						console.log(JSON.stringify(newdata))
						pidArry.push(newdata);
					} else {
						var newpid = item.pid;
						var newparent;
						$.each(data.dataList, function(index, item) {
							console.log(item.id)
							if(newpid == item.id) {
								newparent = item.name;
								return;
							}
						});
						item.parent = newparent;
					}
					console.log(typeof item.pid);
					item.priorityText = priorityArry[item.priority - 1];
					//					item.availableText =  showArry[item.available];

				});

				$.each(pidArry, function(index, item) {
					var list = '<option value="' + item.id + '">' + item.name + '</option>';
					$("#edpid").append(list);
					$("#addpid").append(list);

				});
				console.log(pidArry);
				mine.render("tpl/product_category_data.html", data).then(function(html) {
					$('.task-list').html(html);

					$('.task-list .btn-danger').click(function() {
						var value = $(this).val();
						console.log(value);
						value = value.split(':');
						var delId = value[0];
						var delName = value[1];
						$('#delname').text(delName);
						$('#delSubmit').attr('delid', delId);
					});
					$('.task-list .btn-info').click(function() {
						var value = $(this).val();
						console.log(value);
						value = value.split(':');
						editsaveId = value[0];
						$('#edName').val(value[1]);
						console.log(value[2]);
						if(value[2] !== "") {
							$("#edpid option").siblings().removeAttr('selected');
							$("#edpid option[value=" + value[2] + "]").attr('selected', 'selected');
						} else {
							$("#edpid option[name='none']").attr('selected', 'selected');
						}
						$("#edPriority option[value=" + value[3] + "]").attr('selected', 'selected');
						$("#edAva option[value=" + value[4] + "]").attr('selected', 'selected');

					});

				});
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

	//	删除操作
	$("#delSubmit").click(function() {
		var id = $(this).attr('delid');
		console.log(id);
		delProductCategory(id);
	});

	function delProductCategory(id) {
		mine.showLoading();
		var url = urlBase + '/product_category/' + id;
		mine.del(url).then(function(data) {
			mine.closeLoading();
			console.log(JSON.stringify(data));
			if(data.errCode == 0) {
				mui.alert('刪除成功');
				window.location.reload();
			} else if(data.errCode == 5){
				mui.alert('删除失败');
			} else{
				mui.alert('刪除失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		})
	}

	//	编辑保存操作
	$('#editSave').click(function() {
		var saveName = $('#edName').val();
		var savePid = $('#edpid').val();
		var saveAva = $('#edAva').val();
		var savePriority = $('#edPriority').val();
		savePriority = parseInt(savePriority);
		if(saveName != '') {
			var dataJson = {
				id: editsaveId,
				pid: savePid,
				name: saveName,
				priority: savePriority,
				available: saveAva

			}
			console.log(JSON.stringify(dataJson));
			updateProductCategory(dataJson);
		}

	});

	function updateProductCategory(dataJson) {
		mine.showLoading();
		var url = urlBase + '/product_category';
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

	//	新增产品分类
	$('#addSave').click(function() {
		var addName = $('#addName').val();
		var addPid = $('#addPid').val();
		var addPriority = $('#addPriority').val();
		var addAva = $('#addAva').val();
		addPriority = parseInt(addPriority);
		if(addName != '') {
			var addJson = {
				pid: addPid,
				name: addName,
				priority: addPriority,
				available: addAva
			}
			console.log(addJson)
			addProductCategory(addJson);
		} else {
			mui.alert('名称不能为空');
		}

	});

	function addProductCategory(dataJson) {
		mine.showLoading();
		var url = urlBase + '/product_category';
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

});