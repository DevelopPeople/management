define(['jquery', 'bootstrap', 'adminlte', 'pager', 'mine','mui'], function($, B, A, pager, mine,mui) {
	var typeArry = ['整体图', '细节图'];
	var editsaveId = '';
	getBodyHeight();
	getCompontentCategory();
	//	显示当前用户
	showCurrentUser();

	//	退出操作
	$('#out').click(function() {
		signOut();
	})

	//	控制左侧显示
	$('.sidebar-toggle').click(function() {
		console.log(window.screen.width);
		if(window.screen.width >= 768) {
			if($('body').hasClass('sidebar-collapse')) {
				$('body').removeClass('sidebar-collapse');
			} else {
				$('body').addClass('sidebar-collapse');
			}

		} else {
			if($('body').hasClass('sidebar-open')) {
				$('body').removeClass('sidebar-open');
			} else {
				$('body').addClass('sidebar-open');
			}
		}

	})
	
	var dataAll = getURLParameter();
	console.log(dataAll);
	dataAll = dataAll.split(':');
	$('.product-name').text(dataAll[1]);
	var productId = dataAll[0];
	getProductDetail(productId);

	function getProductDetail(id) {
		mine.showLoading();
		var url = urlBase + '/product/' + id;
		mine.get(url).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
//				console.log(JSON.stringify(data))
//				console.log(data.data.coverImage);
				if(data.data.coverImage == '' || data.data.coverImage == undefined) {
					data.data.coverImage = '../../dist/img/ll.png';
				} else {
					data.data.coverImage = 'data:image/jpeg;base64,' + data.data.coverImage;
				}
				data.data.zt = [];
				data.data.xj = [];
				$.each(data.data.productDetailTOList, function(index, item) {
					console.log()
					if(item.detailImg == '' || item.detailImg == undefined) {
						item.detailImgAll = '../../dist/img/ll.png';
					} else {
						item.detailImgAll = 'data:image/jpeg;base64,' + item.detailImg;
					}

					item.typeText = typeArry[item.type - 1];
					if(item.type == 1){
						data.data.zt.push(item);
					}else if(item.type == 2){
						data.data.xj.push(item);
					}
					
				});
				
				console.log(data);
				$.each(data.data.moduleTOList, function(index, item) {
					if(item.image == '' || item.image == undefined) {
						item.detailImgAll = '../../dist/img/ll.png';
					} else {
						item.detailImgAll = 'data:image/jpeg;base64,' + item.image;
					}
				});

				//			data:image/jpeg;base64
				mine.render("tpl/product_management_show_data.html", data).then(function(html) {
					$('#list').html(html);
					//	删除细节
					$('#list #detailBox .del-detail').click(function() {
						var value = $(this).attr('value');
						console.log(value);
						value = value.split(':');
						var delId = value[0];
						var delName = value[1];
						$('#myModal-topdel .delname').text(delName);
						$('#myModal-topdel #delSubmit').attr('delid', delId);
					});
					
					//	编辑细节
//					e10adc3949ba59abbe56e057f20f8834:产品1细节图1:2:../../dist/img/ll.png
					$('#list #detailBox .btn-info').click(function() {
						var value = $(this).attr('value');
						console.log(value);
						value = value.split(':');
						editsaveId = value[0];
						$('#edName').val(value[1]);
						$('#edType').val(value[2]);
						if(value[3] != "../../dist/img/ll.png") {
							console.log(value[3]);
							$(".edupload-img").attr('src', 'data:image/jpeg;base64,'+value[3]);
						}
					});
					
					//	删除关联
					$('#list #componentBox .del-detail').click(function() {
						var value = $(this).attr('value');
						console.log(value);
						value = value.split(':');
						var delId = value[0];
						var delName = value[1];
						$('#myModal-bottomdel .delname').text(delName);
						$('#myModal-bottomdel #delComponent').attr('delid', delId);
					});
				});
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

	var fileinput = document.getElementById('ztpimg');
	fileinput.addEventListener('change', function() {
		for(var i = 0; i < fileinput.files.length; i++) {
			var file = fileinput.files[i];
			console.log(file);
			readerFile(file, 'ztupload-img');
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
		
		var xjfileinput = document.getElementById('xjpimg');
		xjfileinput.addEventListener('change', function() {
			for(var i = 0; i < xjfileinput.files.length; i++) {
				var file = xjfileinput.files[i];
				console.log(file);
				readerFile(file, 'xjupload-img');
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

	//	新增产品整体图
	$('#addZtSave').click(function() {
		var addName = $('#myModal-ztadd #addName').val();
		var addimg = $('#myModal-ztadd .ztupload-img').attr('src');

		if(addName != '' && addType != '' && addimg != '') {
			console.log(typeof pimg)
			addimg = addimg.split(',')
			console.log(addimg[0]);
			var dataJson = {
				name: addName,
				type: 1,
				productId: productId,
				detailImg: addimg[1]

			}
			console.log(JSON.stringify(dataJson));
			addDetail(dataJson)
		} else {
			mui.alert('产品名称、数量、图片不能为空')
		}
	})
	
	//	新增产品细节图
	$('#addDetailSave').click(function() {
		var addName = $('#myModal-xjadd #addName').val();
		var addimg = $('#myModal-xjadd .xjupload-img').attr('src');

		if(addName != '' && addType != '' && addimg != '') {
			console.log(typeof pimg)
			addimg = addimg.split(',')
			console.log(addimg[0]);
			var dataJson = {
				name: addName,
				type: 2,
				productId: productId,
				detailImg: addimg[1]

			}
			console.log(JSON.stringify(dataJson));
			addDetail(dataJson)
		} else {
			mui.alert('产品名称、数量、图片不能为空')
		}
	})

	function addDetail(dataJson) {
		mine.showLoading();
		var url = urlBase + '/product/detail';
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
	$('#myModal-topdel #delSubmit').click(function() {
		var id = $(this).attr('delid');
		console.log(id);
		delDetail(id);
	});

	function delDetail(id) {
		mine.showLoading();
		var url = urlBase + '/product/detail/' + id;
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
	
	//	编辑操作
	$('#editSave').click(function() {
		var edName = $('#edName').val();
		var edType = $('#edType').val();
		var edImg = $('.edupload-img').attr('src');
		edType = parseInt(edType);
		if(edName != '' && edType != '' && edImg != '') {
			edImg = edImg.split(',')
			var dataJson = {
				id: editsaveId,
				productId: productId,
				name: edName,
				type: edType,
				detailImg: edImg[1]
		

			}
			console.log(JSON.stringify(dataJson));
			updateDetail(dataJson);
		} else {
			mui.alert('产品细节名称、类型、图片不能为空');
		}

	});

	function updateDetail(dataJson) {
		mine.showLoading();
		var url = urlBase + '/product/detail';
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
	
	
	//	关闭模态框清input数据---编辑模态框
	$('#myModal-topadd .close').click(function() {
		var arry = ['addName','pimg'];
		$('.upload-img').attr('src', '');
		clearInputValue(arry);
	});


	//	清除input value
	clearInputValue = function(idArry) {
		$.each(idArry, function(index, item) {
			$('#' + idArry[index]).val('');
		});
	}
	
	
	// 	获取组件分类
	function getCompontentCategory() {
		
		var url = urlBase + '/module_category/list';
		console.log(url)
		mine.get(url).then(function(data) {
			
			if(data.errCode == 0) {
				console.log(JSON.stringify(data))
				var oldData = data.dataList;
				$.each(oldData, function(index, item) {
					var list = '<option value="' + item.id + '">' + item.name + '</option>';
					$("#comCategory").append(list);
				});
			
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	//	监听组件分类框
	$('#comCategory').change(function(){
		var id = $(this).val();
//		mui.alert(id)
		$('#remainNum').val("");
		getComponentName(id);
		
	})
	
	$('#comName').change(function(){
		var remain = $(this).find("option:selected").attr("remaining");
		console.log(remain);
		$('#remainNum').val(remain);
	})
	//	根据组件分类获取组件名称
	function getComponentName(id) {
		$("#comName").html('<option value=""></option>');
		var url = urlBase + '/module_category/list/module/' + id;
		mine.get(url).then(function(data) {
			if(data.errCode == 0) {
				console.log(JSON.stringify(data));
				$.each(data.data, function(index, item) {
					var list = '<option value="' + item.id + '" remaining = "'+ item.remaining+'">' + item.name + '</option>';
					$("#comName").append(list);
				});
				
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	$('#addSave').click(function(){
		var moduleId = $('#comName').val();
		var num = $('#comNum').val();
		var remainnum = $('#remainNum').val();
		console.log(num);
		console.log(remainnum);
		num = parseInt(num);
		remainnum = parseInt(remainnum);
		if(moduleId == ''){
			mui.alert('请选择关联的组件名称');
		}else if(num > remainnum || num < 0){
			mui.alert('数量不能小于0且不能大于组件剩余总数量');
		}else{
			var json = {
				productId: productId,
				moduleId: moduleId,
				num: num
			}
			console.log(json);
			addComponent(json);
		}
	})
	
	// 关联组件
	function addComponent(dataJson) {
		mine.showLoading();
		var url = urlBase + '/product/module';
		mine.post(url, dataJson).then(function(data) {
			mine.closeLoading();
			console.log(data)
			if(data.errCode == 0) {
				mui.alert('添加成功');
				window.location.reload();
			} else if(data.errCode == 6){
				mui.alert('已经关联过，不要重复关联');
			}else{
				mui.alert('添加失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		})
	}
	
	
	//	删除关联组件
	$('#delComponent').click(function(){
		var id = $(this).attr('delid');
		console.log(id);
		delComponent(id);
	})
	
	//	删除关联组件
	function delComponent(id) {
		mine.showLoading();
		var url = urlBase + '/product/module/'+ productId +'/' + id;
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
	
	
	
	

});