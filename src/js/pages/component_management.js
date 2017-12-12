define(['jquery', 'bootstrap', 'adminlte', 'pager', 'mine','mui'], function($, B, A, pager, mine,mui) {
	getBodyHeight();
	var totalRecords;
	var totalPage = 1;
	var editsaveId = '';
	pageSize = 10;
	getComponentList(page);
	var allCategory = [];
	var showArry = {
		'true': '是',
		'false': '否'
	}
	var priorityArry = ['低', '中低', '中', '中高', '高'];
	getCompontentCategory();

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

	function getComponentList(page) {
		mine.showLoading();
		var url = urlBase + '/module/list/' + page + '/' + pageSize;
		mine.get(url).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
				console.log(JSON.stringify(data))
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
						getComponentList(n - 1);
					}
				});
				$.each(data.dataList, function(index, item) {
					item.priorityText = priorityArry[item.priority - 1];
				
				});

				mine.render("tpl/component_management_data.html", data).then(function(html) {
					$('.task-list').html(html);
					//	删除操作
					$('.task-list .btn-danger').click(function() {
						var value = $(this).val();
						console.log(value);
						value = value.split(':');
						var delId = value[0];
						var delName = value[1];
						$('#delname').text(delName);
						$('#delSubmit').attr('delid', delId);
					});
					//	编辑操作
					//							{{id}}:{{name}}:{{remaining}}:{{moduleCategoryTO.id}}:{{moduleCategoryTO.name}}:{{priority}}:{{coverImage}}
					//e10adc3949ba59abbe56e057f20f8831:290:99:cfcd208495d565ef66e7dff9f98764d3:摄像头模组:1:
					$('.task-list .btn-info').click(function() {
						var value = $(this).val();
						console.log(value);
						value = value.split(':');
						editsaveId = value[0];
						$('#edpname').val(value[1]);
						$('#edpnum').val(value[2]);
						$('#edmemo').val(value[6]);
						console.log(value[2]);
						if(value[3] !== "") {
							//									alert('不是空的');
							$("#edpcategory option").siblings().removeAttr('selected');
							$("#edpcategory option[value=" + value[3] + "]").attr('selected', 'selected');
						}
						$("#edPriority option[value=" + value[5] + "]").attr('selected', 'selected');

						
						$(".edupload-img").attr('src', 'data:image/jpeg;base64,'+value[7]);
						
					});

		

				});
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

//	$('#add-lock').click(function() {
//		window.location.href = "smartLock_add.html";
//	})

	var fileinput = document.getElementById('pimg');
	fileinput.addEventListener('change', function() {
		for(var i = 0; i < fileinput.files.length; i++) {
			var file = fileinput.files[i];
			console.log(file);
			readerFile(file, 'upload-img');
		}
	});

	var edfileinput = document.getElementById('edpimg');
	edfileinput.addEventListener('change', function() {
		for(var i = 0; i < edfileinput.files.length; i++) {
			var file = edfileinput.files[i];
			console.log(file);
			readerFile(file, 'edupload-img');
		}
	});

	function readerFile(file, dom, space) {
		//	新建阅读器
		var reader = new FileReader();

		//根据文件类型选择阅读方式
		switch(file.type) {
			//图像类型读取方式
			case 'image/jpeg':
			case 'image/jpg':
			case 'image/png':
			case 'image/gif':
			case 'image/bmp':
				reader.readAsDataURL(file);
				break;

		}
		//        当文件阅读结束后执行的方法
		reader.addEventListener('load', function() {
			switch(file.type) {
				//图像读取和创建标签
				case 'image/jpeg':
				case 'image/png':
				case 'image/gif':
				case 'image/bmp':
				case 'image/jpg':
					console.log(space)
					space = reader.result;
					$('.' + dom).attr('src', space);
					break;
			}
		});

	}

	//	 获得产品的分类
	function getCompontentCategory() {
		mine.showLoading();
		var url = urlBase + '/module_category/list';
		console.log(url)
		mine.get(url).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
				console.log(JSON.stringify(data))
				var oldData = data.dataList;
				$.each(data.dataList, function(index, item) {
					var list = '<option value="' + item.id + '">' + item.name + '</option>';
					$("#pcategory").append(list);
					$("#edpcategory").append(list);

				});

			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

	//	增加产品
	$('#addProduct').click(function() {
		var pname = $('#pname').val();
		var pnum = $('#pnum').val();
		pnum = parseInt(pnum);
		var pcategory = $('#pcategory').val();
		var priority = $('#addPriority').val();
		var pimg = $('.upload-img').attr('src');
		var memo = $('#memo').val();
		console.log(pname);
		console.log(pnum);
		console.log(pimg);
		if(pname != '' && pnum != '' && pimg !== '') {
			pimg = pimg.split(',');
			var dataJson = {
				name: pname,
				remaining: pnum,
				moduleCategoryId: pcategory,
				priority: priority,
				image: pimg[1],
				memo: memo

			}
			console.log(JSON.stringify(dataJson));
			addComponent(dataJson)
		} else {
			mui.alert('组件名称、数量、图片不能为空')
		}
	})

	function addComponent(dataJson) {
		mine.showLoading();
		var url = urlBase + '/module';
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
		delComponent(id);
	});

	function delComponent(id) {
		mine.showLoading();
		var url = urlBase + '/module/' + id;
		mine.del(url).then(function(data) {
			mine.closeLoading();
			console.log(JSON.stringify(data));
			if(data.errCode == 0) {
				mui.alert('刪除成功');
				window.location.reload();
			} else if(data.errCode == 5) {
				mui.alert('当前组件已被应用，不能删除');
			} else{
				mui.alert('删除失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		})
	}

	//	关闭模态框清input数据---新增模态框
	$('#myModal .close').click(function() {
		var arry = ['pname', 'pnum', 'pimg']
		$('.upload-img').attr('src', '');
		clearInputValue(arry);
	});

	$('#myModal .btn-default').click(function() {
		var arry = ['pname', 'pnum', 'pimg']
		$('.upload-img').attr('src', '');
		clearInputValue(arry);
	});

	//	关闭模态框清input数据---编辑模态框
	$('#myModal-edit .close').click(function() {
		var arry = ['edpname', 'edpnum', 'edpimg']
		$('.edupload-img').attr('src', '');
		clearInputValue(arry);
	});

	$('#myModal-edit .btn-default').click(function() {
		var arry = ['edpname', 'edpnum', 'edpimg']
		$('.edupload-img').attr('src', '');
		clearInputValue(arry);
	});

	//	编辑操作
	$('#editSave').click(function() {
		var edpname = $('#edpname').val();
		var edpnum = $('#edpnum').val();
		var edpcategory = $('#edpcategory').val();
		var edPriority = $('#edPriority').val();
		var edpimg = $('.edupload-img').attr('src');
		var edmemo = $('#edmemo').val();
		edPriority = parseInt(edPriority);
		if(edpname != '' && edpnum != ''&& edpimg != '') {
			edpimg = edpimg.split(',');
			var dataJson = {
				id: editsaveId,
				moduleCategoryId: edpcategory,
				name: edpname,
				remaining: edpnum,
				image: edpimg[1],
				memo: edmemo,
				priority: edPriority

			}
			console.log(JSON.stringify(dataJson));
			updateComponent(dataJson);
		} else {
			mui.alert('组件名称、数量、图片不能为空');
		}

	});

	function updateComponent(dataJson) {
		mine.showLoading();
		var url = urlBase + '/module';
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
});