define(['jquery', 'bootstrap', 'adminlte', 'pager', 'mine','mui'], function($, B, A, pager, mine,mui) {
	getBodyHeight();
	var totalRecords;
	var totalPage = 1;
	var orderType = 0;
	var editsaveId = '';
	pageSize = 10;
	var allCategory = [];
	var pidArry = [];
	var showArry = {
		'true': '是',
		'false': '否'
	}
	getProductList(orderType, page);
	getProductCategory();

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

	function getProductList(orderType, page) {
		mine.showLoading();
		var url = urlBase + '/product/list/' + orderType + '/' + page + '/' + pageSize;
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
						getProductList(orderType,n - 1);
					}
				});
				$.each(data.dataList, function(index, item) {
					item.availableText = showArry[item.available];
				});

				mine.render("tpl/product_management_data.html", data).then(function(html) {
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
					//	40289ffd5f8bf361015f8bffe5c70001:火箭:50:e10adc3949ba59abbe56e057f20f8831:蓝牙锁控:true
					$('.task-list .btn-info').click(function() {
						var value = $(this).attr('value');
						console.log(value);
						value = value.split(':');
						editsaveId = value[0];
						$('#edpname').val(value[1]);
						$('#edpnum').val(value[2]);
						console.log(value[3]);
//						alert(editsaveId);
						var parentId;
						var url = urlBase + '/product/' + editsaveId;
//						alert(url);
						$("#editloading").show();
						mine.get(url).then(function(data) {
							$("#editloading").hide();
							if(data.errCode == 0) {
								console.log(JSON.stringify(data));
							 	console.log(data.data.productCategoryTO.id);  
								console.log(data.data.productCategoryTO.pid); 
							
								if(data.data.productCategoryTO.pid != ''){
									$('#edpid').val(data.data.productCategoryTO.pid);
									searchTreeShow(data.data.productCategoryTO.pid, '#edtwoid',data.data.productCategoryTO.id);
								}else{
									$('#edpid').val(data.data.productCategoryTO.id);
								}
								
//								$('#edtwoid').val(data.data.productCategoryTO.id);
									
//								$("#edpid option[value=" + data.data.productCategoryTO.pid + "]").attr('selected', 'selected');
//								$("#edpid option").siblings().removeAttr('selected');
////								
								
							}
						}).fail(function(status) {
							statusHandler(status);
						});
						
						
//						$("#edpid option").siblings().removeAttr('selected');
//							if( != undefined || data.data.productCategoryTO.pid != ''){
//									$("#edtwoid option[value=" + data.data.productCategoryTO.pid + "]").attr('selected', 'selected');
//									$("#edtwoid option").siblings().removeAttr('selected');
//								}
//						if(value[3] !== "") {
//							$("#edpid option[value=" + value[3] + "]").attr('selected', 'selected');
//							$("#edpid option").siblings().removeAttr('selected');
//						}
						$("#edpava option[value=" + value[5] + "]").attr('selected', 'selected');
						if(value[6] !== "") {
							$(".edupload-img").attr('src', 'data:image/jpeg;base64,'+value[6]);
						}
					});

					//	查看操作
					$('.task-list .btn-primary').click(function() {
						var id = $(this).attr('value');
						//								alert(id);
						id = encodeURIComponent(id);
						window.location.href = "product_management_show.html?" + id;
					});

				});
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

	$('#add-lock').click(function() {
		window.location.href = "smartLock_add.html";
	})

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
	//	function getProductCategory() {
	//		var url = urlBase + '/product_category/list';
	//		console.log(url)
	//		mine.get(url).then(function(data) {
	//			if(data.errCode == 0) {
	//				console.log(JSON.stringify(data))
	//				var oldData = data.dataList;
	//				$.each(data.dataList, function(index, item) {
	//					var list = '<option value="' + item.id + '">' + item.name + '</option>';
	//					$("#pcategory").append(list);
	//					$("#edpcategory").append(list);
	//
	//				});
	//
	//			}
	//		}).fail(function(status) {
	//			statusHandler(status);
	//		});
	//	}

	function getProductCategory() {
		mine.showLoading();
		var url = urlBase + '/product_category/list';
		console.log(url)
		mine.get(url).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
				console.log(JSON.stringify(data))
				oldData = data.dataList;
				$.each(data.dataList, function(index, item) {
					if(item.pid == undefined || item.pid == '') {
						item.parent = '无';
						var newdata = {
							id: item.id,
							name: item.name
						}
						pidArry.push(newdata);
					}

				});

				$.each(pidArry, function(index, item) {
					var list = '<option value="' + item.id + '">' + item.name + '</option>';
					$("#edpid").append(list);
					$("#addPid").append(list);

				});
				console.log(pidArry);
			}

		}).fail(function(status) {
			statusHandler(status);
		});
	}

	//	切换排序
	$('#status').change(function() {
		orderType = $(this).children('option:selected').val();
		$('.task-list').html("");
		getProductList(orderType, page);
	})

	//	增加产品
	$('#addProduct').click(function() {
		var pname = $('#pname').val();
		var pnum = $('#pnum').val();
		pnum = parseInt(pnum);
		var pcategory = $('#twoid').val();
		var pava = $('#pava').val();
		var pimg = $('.upload-img').attr('src');
		console.log(pname);
		console.log(pnum);
		//		console.log(pimg)
		//		pimg = encodeURIComponent(pimg);
		if(pname != '' && pnum != '' && pimg != '' && pcategory != '') {
			console.log(typeof pimg)
			pimg = pimg.split(',')
			console.log(pimg[0]);
			//			console.log(pimg[1]);
			var dataJson = {
				name: pname,
				remaining: pnum,
				productCategoryId: pcategory,
				available: pava,
				coverImage: pimg[1]

			}
			console.log(JSON.stringify(dataJson));
			addProduct(dataJson)
		} else {
			mui.alert('产品名称、数量、图片、所属产品分类不能为空')
		}
	})

	function addProduct(dataJson) {
		mine.showLoading();
		var url = urlBase + '/product';
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
		delProduct(id);
	});

	function delProduct(id) {
		mine.showLoading();
		var url = urlBase + '/product/' + id;
		mine.del(url).then(function(data) {
			mine.closeLoading();
			console.log(JSON.stringify(data));
			if(data.errCode == 0) {
				mui.alert('刪除成功');
				window.location.reload();
			} else {
				console.log(data.errCode)
				mui.alert('刪除失败');
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
		var edpcategory = $('#edtwoid').val();
		var edpava = $('#edpava').val();
		var edpimg = $('.edupload-img').attr('src');
		edpnum = parseInt(edpnum);
		if(edpname != '' && edpnum != '' && edpimg != '' && edpcategory != '') {
			edpimg = edpimg.split(',');
			var dataJson = {
				id: editsaveId,
				productCategoryId: edpcategory,
				name: edpname,
				remaining: edpnum,
				coverImage: edpimg[1],
				available: edpava

			}
			console.log(JSON.stringify(dataJson));
			updateProduct(dataJson);
		} else {
			mui.alert('产品名称、数量、图片、所属产品分类不能为空');
		}

	});

	function updateProduct(dataJson) {
		mine.showLoading();
		var url = urlBase + '/product';
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

	$('#addPid').change(function() {
		console.log($(this).val());
		var value = $(this).val();
		if(value != '') {
			searchTree(value, '#twoid');
			$('#twoTree').attr('style', 'display: block;');
		} else {
			$('#twoTree').attr('style', 'display: none;');
		}
	});

	$('#edpid').change(function() {
		console.log($(this).val());
		var value = $(this).val();
		if(value != '') {
			searchTree(value, '#edtwoid');
			$('#edtwoTree').attr('style', 'display: block;');
		} else {
			$('#edtwoTree').attr('style', 'display: none;');
		}
	});

//	$('#twoid').change(function() {
//		console.log($(this).val());
//		var value = $(this).val();
//		console.log(value)
//		if(value != '') {
//			$('#twoTree').attr('style', 'display: block;');
//		} else {
//			$('#twoTree').attr('style', 'display: none;');
//		}
//	});
//
//	$('#edtwoid').change(function() {
//		console.log($(this).val());
//		var value = $(this).val();
//		console.log(value)
//		if(value != '') {
//			$('#edtwoTree').attr('style', 'display: block;');
//		} else {
//			$('#edtwoTree').attr('style', 'display: none;');
//		}
//	});

	function searchTree(id, dom) {
		$("#editloading").show();
		$(dom).html('');
		var url = urlBase + '/product_category/list/' + id;
		var list
		mine.get(url).then(function(data) {
			$("#editloading").hide();
//			mine.closeLoading();
			if(data.errCode == 0) {
				$.each(data.dataList, function(index, item) {
					list = '<option value="' + item.id + '">' + item.name + '</option>';
					$(dom).append(list);
				});

			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	function searchTreeShow(id, dom, auto) {
		$("#editloading").show();
//		mine.showLoading();
		$(dom).html('');
		var url = urlBase + '/product_category/list/' + id;
		var list;
		mine.get(url).then(function(data) {
			$("#editloading").hide();
//			mine.closeLoading();
			if(data.errCode == 0) {
				$.each(data.dataList, function(index, item) {
					if(auto != undefined && auto != '' && auto == item.id ){
						list = '<option value="' + item.id + '" selected>' + item.name + '</option>';
					}else{
						list = '<option value="' + item.id + '">' + item.name + '</option>';
					}
					
					$(dom).append(list);
				});
				
				
				

			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
});