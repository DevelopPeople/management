define(['jquery', 'adminlte', 'pager', 'mine','mui'], function($, A, pager, mine,mui) {
	advanceAndRetreat();
	var priorityArry = ['低', '中低', '中', '中高', '高'];
	var showArry = {
		'true': '是',
		'false': '否'
	}
	var pidArry = [];
	var editsaveId;
	var oldData = [];
	getBodyHeight();
	getProductCategory();
	
	
//	显示当前用户
	showCurrentUser();
	
//	退出操作
	$('#out').click(function(){
		signOut();
	})
//	storage.username;
//	storage.realname;
//	storage.role;
	advanceAndRetreat();
	
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
		
	});
	
	function getProductCategory() {
		// mine.showLoading();
		var url = urlBase + '/campusSale/search/'+page+'/'+pageSize;
		console.log(url)
		mine.get(url).then(function(data) {
			// mine.closeLoading();
			if(data.errCode == 0) {
				console.log(JSON.stringify(data))
				oldData = data.dataList;
				console.log(data.dataList);
				$.each(data.dataList,function(index,item){
					console.log(item.image);
					var images =item.image;
					item.images=images.split('|');
					$.each(item.images,function(index,item){
						item = item +'.jpg'
						console.log(item);
					})
				})
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
						//	pid 处理
						if(value[2] !== "") {
//							showTree(value[2]);
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
		var url = urlBase + '/campusSale/delete/' + id;
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

	//	编辑保存操作
	$('#editSave').click(function() {
		var saveName = $('#edName').val();
		var saveAva = $('#edAva').val();
		var savePriority = $('#edPriority').val();
		savePriority = parseInt(savePriority);
		var savePid = '';
		if($("#edtwoTree").attr('style') == 'display:block;'){
			savePid = $('#edtwoid').val();
		}else{
			savePid = $('#edpid').val();
		}
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
		var addPid = '';
		var addName = $('#addName').val();
//		if($("#twoTree").attr('style') == 'display:block;' && $('#twoid').val() != ''){
//			console.log('父亲的');
//			addPid = $('#addPid').val();
//		}else{
//			console.log('儿子的');
//			addPid = $('#twoid').val();
//		}
		addPid = $('#addPid').val();
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
	
	$('#addPid').change(function(){
		console.log($(this).val());
		var value = $(this).val();
//		if(value != ''){
//			searchTree(value,'#twoid');
//			$('#twoTree').attr('style','display: block;');
//		}else{
//			$('#twoTree').attr('style','display: none;');
//		}
	});
	
	$('#edpid').change(function(){
		console.log($(this).val());
		var value = $(this).val();
//		if(value != ''){
//			searchTree(value,'#edtwoid');
//			$('#edtwoTree').attr('style','display: block;');
//		}else{
//			$('#edtwoTree').attr('style','display: none;');
//		}
	});
	
	$('#twoid').change(function(){
		console.log($(this).val());
		var value = $(this).val();
		console.log(value)
		if(value != ''){
//			searchTree(value,'#twoid');
			$('#twoTree').attr('style','display: block;');
		}else{
			$('#twoTree').attr('style','display: none;');
		}
	});
	
		$('#edtwoid').change(function(){
		console.log($(this).val());
		var value = $(this).val();
		console.log(value)
		if(value != ''){
//			searchTree(value,'#twoid');
			$('#edtwoTree').attr('style','display: block;');
		}else{
			$('#edtwoTree').attr('style','display: none;');
		}
	});
	
	
	
	
	function searchTree(id,dom){
		mine.showLoading();
		$(dom).html('<option name="" value="">无</option>');
		var url = urlBase + '/product_category/list/'+ id;
		var list
		mine.get(url).then(function(data) {
			mine.closeLoading();
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
	
	
	function showTree(id){
//		$(dom).html('<option name="" value="">无</option>');
		mine.showLoading();
		var url = urlBase + '/product_category/list/'+ id;
		var list
		mine.get(url).then(function(data) {
			mine.closeLoading();
			if(data.errCode == 0) {
				console.log(data);
//				$.each(data.dataList, function(index, item) {
//					list = '<option value="' + item.id + '">' + item.name + '</option>';
//					$(dom).append(list);
//				});
				
				
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	

});