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
					cwd: 'js/',
					src: ['*.js','!*.min.js'],
					dest: 'min-js/',
					ext: '.js'
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
					cwd: 'css/',
					src: ['*.css','!*.min.css'],
					dest: 'css/',
					ext: '.min.css'
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
			build:['Gruntfile.js','js/search.js']
		},
		//自动检测
		watch : {
			files : ['js/search.js','css/*.css'],
			tasks : ['jshint','uglify'],
			options:{
				spawn:false,
			}
		}
	});
	//加载插件
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	//执行任务及次序
	grunt.registerTask('default',['jshint','uglify','cssmin','watch']);
};