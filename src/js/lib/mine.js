define(['q', 'md5', 'jquery', 'mustache'], function(Q, md5, $, m) {
	// depend on the 'token' & 'mobile' in storage
	var idSelectorRE = /^#([\w-]+)$/;
	var classSelectorRE = /^\.([\w-]+)$/;
	var tagSelectorRE = /^[\w-]+$/;

	var token = function() {
		var token = plus.storage.getItem("token");

		if(token != null && token != undefined) {
			token = plus.storage.getItem("token");
		} else {
			token = appKey;
		}
		return token;
	};

	var sign = function(url, json, time) {
		var key = token() != null ? token() : appKey;
		var rawData = key + time + url;
		if(json !== undefined) {
			if(typeof(json) === 'object')
				json = JSON.stringify(json);
			rawData += json;
		}
		return md5(rawData);
	};
	var header = function(url, json) {
		var time = Date.parse(new Date());
		//      console.log("HEADERS : "+sign(url,json,time))
		//      console.log("HEADERS : "+token());
		//      console.log("HEADERS : "+time.toString());
		return {
			"Content-Type": "application/json",
			source: appSource,
			ver: appVer,
			timestamp: time.toString(),
			token: token(),
			sign: sign(url, json, time)
		};

	};
	var uuid = function() {
		var lut = [];
		for(var i = 0; i < 256; i++) {
			lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
		}
		var d0 = Math.random() * 0xffffffff | 0;
		var d1 = Math.random() * 0xffffffff | 0;
		var d2 = Math.random() * 0xffffffff | 0;
		var d3 = Math.random() * 0xffffffff | 0;
		return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
			lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] +
			lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
			lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
	};
	cachedView = {};
	var getView = function(name) {
		if(cachedView.name === undefined) {
			cachedView.name = plus.webview.getWebviewById(name);
		}
		return cachedView.name;
	};
	var timeout = 10000;
	var __dump = function(obj) {
		var result = "";
		for(var i in obj) {
			var property = obj[i];
			result += i + " = " + property + "\n\n";
		}
		alert(result);
	};

	return {

		// AJAX
		get: function(url) {
            var defer = Q.defer();
            $.ajax({
                url: url,
                type: "GET",
                dataType: "JSON",
                success: function(data) {
                    defer.resolve(data);
                },
                error: function(xhr, status, error) {
                    defer.reject(xhr.status);
                }
            });
            return defer.promise;
        },
		post: function(url, data) {
//			if(typeof(data) === "string") {
//				data = JSON.stringify(data);
//			}

			var defer = Q.defer();
			$.ajax({
				type: 'post',
				url: url,
				data: JSON.stringify(data),
				contentType: "application/json",
				success: function(data) {
					defer.resolve(data);
				},
				error: function(xhr, status, error) {
					defer.reject(xhr.status);
				}

			});
			return defer.promise;
		},
				put: function(url, data) {
					if(typeof(data) === "string") {
						data = JSON.parse(data);
					}
		
					var defer = Q.defer();
					$.ajax({
						type: 'put',
						url: url,
						data: JSON.stringify(data),
						contentType: "application/json",
						success: function(data) {
							defer.resolve(data);
						},
						error: function(xhr, status, error) {
							defer.reject(xhr.status);
						}
		
					});
//					mui.ajax(url, {
//						data: data,
//						dataType: 'json',
//						crossDomain: true,
//						type: 'put',
//						timeout: timeout,
//						headers: header(url, data),
//						success: function(data) {
//							//defer.notify(data);
//							defer.resolve(data);
//						},
//						error: function(xhr, type, errorThrown) {
//							defer.reject(xhr.status);
//						}
//					});
					return defer.promise;
				},
				del: function(url) {
					var defer = Q.defer();
					$.ajax({
						url: url,
						type: "delete",
						dataType: "JSON",
						success: function(data) {
							defer.resolve(data);
						},
						error: function(xhr, status, error) {
							defer.reject(xhr.status);
						}
					});
//					mui.ajax(url, {
//						crossDomain: true,
//						type: 'delete',
//						timeout: timeout,
//						headers: header(url),
//						success: function(data) {
//							//defer.notify(data);
//							defer.resolve(data);
//						},
//						error: function(xhr, type, errorThrown) {
//							defer.reject(xhr.status);
//						}
//					});
					return defer.promise;
				},
				
				
				
				showLoading:function() {
					$('#loading').show();
				},
				closeLoading:function(){
					$('#loading').hide();
				},


	

		// UTILITIES

		//		setToken: function(token) {
		//			plus.storage.setItem('token', token);
		//		},
		//		getToken: function() {
		//			return plus.storage.getItem("token");
		//		},
		dump: function(obj) {
			var result = "";
			for(var i in obj) {
				var property = obj[i];
				result += i + " = " + property + "\n\n";
			}
			alert(result);
		},
		setValue: function(selector, value) {
			var doms = document.querySelectorAll(selector);
			if(doms === undefined || doms.length == 0) {
				console.log('not find the dom: ' + selector);
				return;
			}

			doms[0].innerHTML = value;
		},
		//		showWaiting: function(msg) {
		//			var msg = msg !== undefined ? msg : '加载中';
		//			plus.nativeUI.showWaiting('加载中');
		//		},
		//		closeWaiting: function() {
		//			plus.nativeUI.closeWaiting();
		//		},
		isNullOrUndefined: function(obj) {
			if(obj === undefined || obj === '' || obj === null)
				return true;
			return false;
		},

		// OSS RELEATED

		// source is file object, target is OSS object name with full path (string)
		// only allow to upload into yzb-mall/yezhubao-mall
		//		ossUpload: function(source) {
		//			console.log('ossUpload(' + source + ')');
		//			var defer = Q.defer();
		//			if(this.isNullOrUndefined(source)) {
		//				defer.reject(ERROR.FILE_INVALID);
		//				return defer.promise;
		//			}
		//
		//			this.stsUpdate().then(function(sts) {
		//				var ossKeyId = sts.accessKeyId;
		//				var signature = sts.signature;
		//				var policy = sts.policy;
		//				var dir = sts.dir;
		//				var host = sts.host;
		//
		//				if(ossKeyId === undefined || signature === undefined) {
		//					defer.reject(ERROR.INVALID_PARAMS);
		//				}
		//
		//				var pos = source.lastIndexOf('.');
		//				var suffix = source.substring(pos).toLowerCase();
		//				var filename = uuid().replace(/-/, '') + suffix;
		//				var keyname = dir + filename;
		//
		//				plus.nativeUI.showWaiting('上传中');
		//				var task = plus.uploader.createUpload(host, {
		//						method: "POST"
		//					},
		//					function(t, status) {
		//						plus.nativeUI.closeWaiting();
		//						mui.toast('上传成功');
		//						if(status == 200) {
		//							defer.resolve(filename);
		//						} else {
		//							defer.reject(status);
		//						}
		//					}
		//				);
		//
		//				task.addData("key", keyname);
		//				task.addData("policy", policy);
		//				task.addData("OSSAccessKeyId", ossKeyId);
		//				task.addData("success_action_status", "200");
		//				task.addData("signature", signature);
		//
		//				task.addFile(source, {
		//					key: "file",
		//					name: "file",
		//					mime: "image/jpeg"
		//				});
		//				task.start();
		//
		//			});
		//
		//			return defer.promise;
		//		},

		// get post signature
		//		stsUpdate: function(forceUpdate) {
		//			var defer = Q.defer();
		//
		//			var mobile = plus.storage.getItem('mobile');
		//			var cache = plus.storage.getItem(mobile);
		//
		//			if(!this.isNullOrUndefined(cache)) {
		//				cache = JSON.parse(cache);
		//				var storedExpire = cache.sts.expiration;
		//
		//				var nowTime = Date.parse(new Date());
		//				if(forceUpdate !== true && storedExpire > nowTime) {
		//					//console.log('not expired sts');
		//					defer.resolve(cache.sts);
		//					return defer.promise;
		//				}
		//			}
		//			urlBase = plus.storage.getItem('urlBase');
		//			var url = urlBase + '/oss/sign/seller';
		//			this.get(url).then(function(sts) {
		//				if(sts.errCode !== 0) defer.reject(sts.errorCode);
		//				console.log('sts=' + JSON.stringify(sts));
		//
		//				var data = new Object();
		//				data.sts = sts.data;
		//				plus.storage.setItem(mobile, JSON.stringify(data));
		//				defer.resolve(data.sts);
		//
		//			}).fail(function(status) {
		//				console.log('fail to update sts: ' + status);
		//				defer.reject(status);
		//			});
		//
		//			return defer.promise;
		//		},

		// DATA BINDING

		bind: function(json) {
			if(typeof(json) === "string") {
				json = JSON.parse(json);
			}

			// querySelectorAll("[data-bind]") only return the static node,
			// not the live nodes which generated by render dynamictly
			var matchedElements = [];
			var allElements = document.getElementsByTagName('*');
			for(var i = 0; i < allElements.length; i++) {
				if(allElements[i].getAttribute('data-bind') !== null) {
					matchedElements.push(allElements[i]);
				}
			}

			var idx = 0;
			matchedElements.forEach(function(bindedKey) {
				var bindedKey = matchedElements[idx].getAttribute('data-bind');
				//console.log('binded key = ' + bindedKey + ', ' + json[bindedKey] + ', ' + typeof(json[bindedKey]) + ', ' + bindedKey.split(".").length);
				bindedKey = bindedKey.indexOf('|') > 0 ? bindedKey.substring(0, bindedKey.indexOf('|')) : bindedKey;
				var splits = bindedKey.split(".");
				if(splits.length == 1) {
					if(json[bindedKey] != null) {
						var type = typeof(json[bindedKey]);
						if(type !== "undefined" && type !== "function" && type !== "object") {
							if(matchedElements[idx].tagName === 'INPUT')
								matchedElements[idx].value = json[bindedKey];
							else // DIV etc
								matchedElements[idx].innerHTML = json[bindedKey] + '';
						}
					}
				} else if(splits.length == 2) {
					if(json[splits[0]][splits[1]] != null) {
						var type = typeof(json[splits[0]][splits[1]]);
						if(type !== "undefined" && type !== "function" && type !== "object") {
							if(matchedElements[idx].tagName === 'INPUT')
								matchedElements[idx].value = json[splits[0]][splits[1]];
							else // DIV etc
								matchedElements[idx].innerHTML = json[splits[0]][splits[1]] + '';
						}
					}
				}

				idx++;
			})
		},
		serialize: function() {

			var Reg = {
				num: /^[0-9]{1,20}$/, //  /num.(\d+),(\d+)/
				decimal: /^(-?\\d+)(\\.\\d+)?$/,
				mobile: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/,
				post: /^[a-zA-Z0-9 ]{3,12}$/, //邮编
				ip: /^[0-9.]{1,20}$/,
				password: /^(\w){6,20}$/, // 6-20位
				name: /^[a-zA-Z]{2,10}$/,
				username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,20}$/
			};

			// querySelectorAll("[data-bind]") only return the static node,
			// not the live nodes which generated by render dynamictly
			var json = new Object();
			var allElements = document.getElementsByTagName('*');
			for(var i = 0; i < allElements.length; i++) {
				var bindedKey = allElements[i].getAttribute('data-bind');
				if(bindedKey !== null) {

					var constraint, toast;
					var source = bindedKey.split('|');
					var len = source.length;
					if(len === 1) {
						bindedKey = source[0];
						constraint = null;
						toast = null;
					} else if(len === 2) {
						bindedKey = source[0];
						constraint = source[1];
						toast = '数据不合法';
					} else if(len === 3) {
						bindedKey = source[0];
						constraint = source[1];
						toast = source[2];
					}
					//console.log('### bindedKey=' + bindedKey + ', constraint=' + constraint + ', toast=' + toast);

					var splits = bindedKey.split(".");
					if(splits.length == 1) {
						if(allElements[i].tagName === 'INPUT')
							json[bindedKey] = allElements[i].value;
						else // DIV etc
							json[bindedKey] = allElements[i].innerHTML;

						if(constraint !== undefined && constraint !== null) {
							if(!Reg[constraint].test(json[bindedKey])) {
								//								mui.toast(toast);
								return null;
							}
						}

					} else if(splits.length == 2) {
						if(json[splits[0]] === null || json[splits[0]] === undefined) {
							json[splits[0]] = new Object();
						}

						if(allElements[i].tagName === 'INPUT')
							json[splits[0]][splits[1]] = allElements[i].value;
						else
							json[splits[0]][splits[1]] = allElements[i].innerHTML;

						if(constraint !== undefined) {
							if(!Reg[constraint].test(json[splits[0]][splits[1]])) {
								//								mui.toast(toast);
								return null;
							}
						}
					}

				}
			}
			//console.log('SERIALIZE=' + JSON.stringify(json));
			return json;
		},

		render: function(url, json) {
			var defer = Q.defer();
			$.ajax({
				url: url
			}).then(function(data) {
				defer.resolve(m.render(data, json));
			});
			return defer.promise;
		}
	}
});