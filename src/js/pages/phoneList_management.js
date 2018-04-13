define(['jquery', 'bootstrap', 'adminlte', 'pager', 'mine', 'md5','mui'], function($, B, A, pager, mine, md5,mui) {
    getBodyHeight();
    var totalRecords;
    var totalPage = 1;
    var editsaveId = '';
    pageSize = 10;
    getPhoneList(page);
    var allCategory = [];
    var showArry = {
        'true': '正常',
        'false': '锁定'
    }
    var userRole = ['普通用户', '管理员','超级管理员'];
    //			var priorityArry = ['低','中低','中','中高','高'];
    //			getCompontentCategory();
    //	显示当前用户
    showCurrentUser();
	setLogo()
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

    function getPhoneList(page) {
        mine.showLoading();
        var url = urlBase + '/phone/search/' + page + '/' + pageSize;
        mine.get(url).then(function(data) {
            mine.closeLoading();
            if(data.errCode == 0) {
                console.log(data);
                console.log(JSON.stringify(data))
                totalRecords = data.totalRecords;
                console.log(data.totalRecords);
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
                        getPhoneList(n - 1);
                    }
                });
                // $.each(data.dataList, function(index, item) {
                //     // item.availableText = showArry[item.available];
                //     item.roleText = userRole[item.role];
                // });

                mine.render("tpl/phoneList_management.html", data).then(function(html) {
                    $('.task-list').html(html);
                    //	删除操作
                    $('.task-list .btn-danger').click(function() {
                        var value = $(this).val();
                        console.log(value);
                        value = value.split(':');
                        console.log(value);
                        var delId = value[0];
                        var delName = value[1];
                        $('#delname').text(delName);
                        $('#delSubmit').attr('delid', delId);
                    });
                    //	编辑操作
                    //							{{id}}:{{name}}:{{remaining}}:{{moduleCategoryTO.id}}:{{moduleCategoryTO.name}}:{{priority}}:{{coverImage}}
                    //							e10adc3949ba59abbe56e057f20f8830:aaa:李四:13312344321:1:true
                    $('.task-list .btn-info').click(function() {
                        var value = $(this).val();
                        console.log(value);
                        value = value.split(':');
                        console.log(value);
                        editsaveId = value[0];
                        console.log(value[0]);
                        console.log(value[1]);
                        console.log(value[2]);
                        $('#contact_bm').val(value[1]);
                        // $('#edrelaname').val(value[2]);
                        $('#edmobile').val(value[2]);
                        $('#discribe').val(value[3]);
                        // if(value[3] !== "") {
                        //     $("#edrole option").siblings().removeAttr('selected');
                        //     $("#edrole option[value=" + value[3]+ "]").attr('selected', 'selected');
                        // }

                    });


                });
            }else{
                mui.alert(data.errMsg);
            }
        }).fail(function(status) {
            statusHandler(status);
        });
    }

    //			$('#add-lock').click(function() {
    //				window.location.href = "../../pages/smartlock/smartLock_add.html";
    //			})

    //		  var fileinput = document.getElementById('pimg');
    //		  fileinput.addEventListener('change',function () {
    //              for(var i = 0;i<fileinput.files.length;i++){
    //                  var file = fileinput.files[i];
    //                  console.log(file);
    //                  readerFile(file,'upload-img');
    //              }
    //          });
    //
    //        var edfileinput = document.getElementById('edpimg');
    //		  edfileinput.addEventListener('change',function () {
    //              for(var i = 0;i<edfileinput.files.length;i++){
    //                  var file = edfileinput.files[i];
    //                  console.log(file);
    //                  readerFile(file,'edupload-img');
    //              }
    //          });

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
    //	function getCompontentCategory() {
    //		var url = urlBase + '/module_category/list';
    //		console.log(url)
    //		mine.get(url).then(function(data) {
    //			if(data.errCode == 0) {
    //				console.log(JSON.stringify(data))
    //				var oldData = data.dataList;
    //				$.each(data.dataList, function(index, item) {
    //					var list = '<option value="'+ item.id +'">'+item.name+'</option>';
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

    //	增加用户点击新增电话列表的保存按钮
    $('#addUser').click(function() {
        // var role = $('#role').val();
        // role = parseIncompanyt(role);
        // console.log(role);
        var contacts = $('#company').val();
        console.log(contacts);
        // var realname = $('#relaname').val();
        var mobile = $('#mobile').val();
        var memo=$('#describe').val();
        // var password = $('#password').val();
        // var repassword = $('#repassword').val();
        // var available = $('#available').val();
        if(contacts != ''  && mobile != '' && memo!='') {
                var dataJson = {
                    contacts: contacts,
                    // realname: realname,
                    mobile: mobile,
                    memo:memo
                    // password: password
                    // available: available

                }
                console.log(JSON.stringify(dataJson));
                addUser(dataJson)

            }
        else {
            mui.alert('新增电话列表所有属性为必填项')
        }
    })

    function addUser(dataJson) {
        mine.showLoading();
        var url = urlBase + '/phone/add';
        mine.post(url, dataJson).then(function(data) {
            mine.closeLoading();
            console.log(data);
            if(data.errCode == 0) {
                mui.alert('添加成功');
                window.location.reload();
            } else if(data.errCode ==1){
                mui.alert("手机号已注册");
            }else {
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
        var url = urlBase + '/phone/delete/' + id;
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

    //	关闭模态框清input数据---新增模态框
    //	$('#myModal .close').click(function(){
    //		var arry = ['pname','pnum','pimg']
    //		$('.upload-img').attr('src','');
    //		clearInputValue(arry);
    //	});
    //
    //	$('#myModal .btn-default').click(function(){
    //		var arry = ['pname','pnum','pimg']
    //		$('.upload-img').attr('src','');
    //		clearInputValue(arry);
    //	});

    //	关闭模态框清input数据---编辑模态框
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
        // var role = $('#edrole').val();
        // role = parseInt(role);
        // console.log('role'+role);
        // var username = $('#edusername').val();
        // console.log('username'+username);
        // var realname = $('#edrelaname').val();
        // 手机号
        var mobile = $('#edmobile').val();
        // console.log('moblie'+mobile);
        // 联系部门
        var contacts = $('#contact_bm').val();
        console.log(contacts);
        // 描述
        var memo = $('#discribe').val();
        console.log(memo);
        // var available = $('#edavailable').val();
        if( mobile!== '' && contacts !=="" && memo!=="") {
            console.log('不为空')
             var   dataJson = {
                id: editsaveId,
                contacts: contacts,
                // realname: realname,
                mobile: mobile,
                memo: memo,


            }
            updateUser(dataJson);
        } else {
            mui.alert("所有属性都必须填写")	;

        }
    });

    function updateUser(dataJson) {
        mine.showLoading();
        var url = urlBase + '/phone/edit';
        mine.put(url, dataJson).then(function(data) {
            // console.log(JSON.stringify(data));
            console.log(data);
            mine.closeLoading();
            if(data.errCode == 0) {
                // console.log(JSON.stringify(data));
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