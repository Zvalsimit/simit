module.exports = function(grunt){
	//任务配置，插件的配置信息
	grunt.initConfig({
		//获取package.json的信息
		pkg : grunt.file.readJSON("package.json"),
		//js压缩配置
		uglify : {
			options: {
				stripBanners : true,
				banner : '/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %>*/\n'
			},
			build : {
				files: [
					{
					expand: true,
					//相对路径
					cwd: '<%=pkg.url%>',
					src: ['**/*.js','!**/*.min.js','!**/assign.js','!**/additional-methods.js'],
					dest: '<%=pkg.url_%>',
					rename: function (dest, src) {  
						var folder = src.substring(0, src.lastIndexOf('/'));  
						var filename = src.substring(src.lastIndexOf('/'), src.length);
						filename = filename.substring(0, filename.lastIndexOf('.'));  
						var fileresult=dest + folder + filename + '.js'; 
						return fileresult;
						}
					}
				]
			}
		},
		//css压缩配置
		cssmin : {
			options: {
				stripBanners : true,
				banner : '/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %>*/\n'
			},
			build : {
				files: [
					{
					expand: true,
					//相对路径
					cwd: '<%= pkg.url %>',
					src: ['**/*.css','!**/*.min.css'],
					dest: '<%= pkg.url_ %>',
					rename: function (dest, src) {  
						var folder = src.substring(0, src.lastIndexOf('/'));  
						var filename = src.substring(src.lastIndexOf('/'), src.length);
						filename = filename.substring(0, filename.lastIndexOf('.'));  
						var fileresult=dest + folder + filename + '.css'; 
						return fileresult;
						}
					}
				]
			}
		},
		//语法检查
		jshint : {
			options : {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				},
			},
			build:['Gruntfile.js','<%= pkg.url %>**/*.js','!<%= pkg.url %>**/*.min.js']
		},
		//自动检测
		watch : {
			files : ['<%= pkg.url %>'],
			tasks : ['jshint','uglify','cssmin'],
			options:{
				spawn:false,
			}
		},
		//压缩框架复制
		copy: {
		  main: {
			expand: true,
			cwd: '<%= pkg.url %>',
			src: ['**','**/*.min.js','**/assign.js','**/additional-methods.js','**/*.min.css','!**/*.js','!**/*.css'],
			dest: '<%= pkg.url_ %>',
		  },
		},
		//引用路径
		'string-replace': {
		  dist: {
			files: [{
				expand: true,
				cwd: '<%= pkg.html %>',
				src: '***',
				dest: '<%= pkg.html %>'
			}],
			options: {
			  replacements: [{
				pattern: /\/static\/.*?\/(css|js)\/|\/static\/(css|js)\//ig,
				replacement: function (match, p1) {
				  return match.substring(0, 7) + '_mis' + match.substring(7);
				}
			  }]
			}
		  },
		  revert: {
			  files: [{
				expand: true,
				cwd: '<%=pkg.html%>',
				src: '**/*',
				dest: '<%=pkg.html%>'
				}],
				options: {
				  replacements: [{
					pattern: /\/static_mis\/.*?\/(css|js)\/|\/static_mis\/(css|js)\//ig,
					replacement: function (match, p1) {
					  return match.substring(0, 7)+match.substring(11);
					}
				  }]
				}
			}
		},
		useminPrepare: {
			html: 'login.html',
		},
		usemin: {
			html: 'login.html',
			options:{
				filePrefier:function(url){
					if(url.indexOf("/static/media/css")!=-1){
						return url.replace('/static/media/css','/static/media/css-min');
					}else if(url.indexOf("/static/css")!=-1){
						return url.replace('/static/css','/static/css-min');
					}
				}
			}
		}
	});
	//加载插件
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	//执行任务及次序
	grunt.registerTask('default',['jshint','uglify','cssmin','copy']);
	//html回滚
	grunt.registerTask('revert',['string-replace:revert']);
};
