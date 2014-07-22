/*
* categoryId 2:人文 3：风景 4：社区 5：物语
* */

$(document).ready(function() {
    var	post_id=0; //当前展示文章的id
	
    /*
    * 请求顶部4篇文章
    * */
    (function(){
        $.ajax({
            url:ZY.Config.ajaxurl,
            type:"post",
            data:{
                action:"zy_get_top_posts",
                programId:1
            },
            success:function(response){
                if(response.success){
                    if(response.data.length!=0){
                        var posts=response.data;
						ZY.DataManager.top_post_id=posts[0]["post_id"];
                        //用模板输出html(顶部)
                        var tpl_top = $("#zy_top_post_tpl").html();
                        var html_top = juicer(tpl_top,{top_posts:posts});
                        $("#zy_top_post_heading").html(html_top);
						ZY.UIManager.updateSectionBG(posts[0],$("#zy_top_post_poster"))

                        //用模板输出html(推荐)
                        var tpl_featured = $("#zy_featured_articles_tpl").html();
                        var html_featured = juicer(tpl_featured,{top_posts:posts});
                        $("#zy_featured_articles").html(html_featured);

                    }
                }else{
                    //提示
					ZY.UIManager.popOutMsg(ZY.Config.errorCode.postsError)
                }
            },
			error:function(){
				ZY.UIManager.popOutMsg(ZY.Config.errorCode.connectionError)
				}
        });
    })();

    /*
    *请求音乐文件
    * */
    (function(){
        $.ajax({
            url:ZY.Config.ajaxurl,
            type:"post",
            data:{
                action:"zy_get_music",
                programId:1
            },
            success:function(response){
                if(response.success){
                    //console.log(response);
                    if(response.data.length!=0){
                        var musics=response.data;

                        //用模板输出html
                        var tpl = $("#zy_music_tpl").html();
                        var html = juicer(tpl,{musics:musics});
                        $("#zy_music_list").html(html);

                        //设置第一首音乐信息
                        $("#zy_music_audio").attr("src",musics[0].music_path);//设置音乐路径
                        $("#zy_music_author").html("Directed by "+musics[0].music_author);
                        $("#zy_music_title").html(musics[0].music_title);

                        ZY.UIManager.musicLiLength=musics.length;
                    }else{
                        $("#zy_music_title").text(ZY.Config.errorCode.hasNoMusic);
                    }
                }else{
                    ZY.UIManager.popOutMsg(ZY.Config.errorCode.musicError);
                }
            },
			error: function(){
					ZY.UIManager.popOutMsg(ZY.Config.errorCode.connectionError);
				}
        });
    })();
    

    /*========================页面逻辑代码=========================================*/
	
    //菜单点击事件
    $("#zy_top_nav a,#zy_nav a").click(function(){
		var target=$(this).attr("href");
		ZY.UIManager.scrollToTarget(target);
		return false;
    });
	//logo点击事件
	$("#zy_logo a").click(function(){
		ZY.UIManager.scrollToTarget("#zy_top_post");
		return false;
    });

    /*=====展示单篇文章页面，相应鼠标横向滚动事件=================*/
	ZY.UIManager.bindHScrollOnWheel($("#zy_article_content")[0]);
		
    /*触屏滚动 */
    //内容详情滚动
    Draggable.create(".zy_article_content_wrapper", {
        type:"scrollLeft", 
        edgeResistance:0.5,
        throwProps:true,
        dragClickables:true,
        lockAxis:true,
        onClick:function(evt){
            console.log(evt);
            console.log(evt.target)
            var clickTarget=evt.target || evt.srcElement
            var url;
            //只有点击视频的时候才弹窗，点击图片不弹窗
            if($(clickTarget).is("a.videoslide>img")){
                url=ZY.Config.siteurl+"/show_media/"+post_id+"/"+$(clickTarget).data("zy-media-id");
                ZY.UIManager.showVideoDetail(url);
            }else if($(clickTarget).is("a.videoslide")){
                url=ZY.Config.siteurl+"/show_media/"+post_id+"/"+$(clickTarget).find("img").data("zy-media-id");
                ZY.UIManager.showVideoDetail(url);
            }
            /*if($(clickTarget).is("img[data-zy-media-id]")){
                elementA=$(clickTarget).parents("a")
                if(elementA.hasClass("videoslide")){
                    url=ZY.Config.siteurl+"/show_media/"+post_id+"/"+$(clickTarget).data("zy-media-id");
                    ZY.UIManager.showVideoDetail(url);

                }else {
                    url=elementA.attr("href");
                    ZY.UIManager.showImageDetail(url);

                }
                return false;
            }*/

        },        
        onDragEnd:function(evt){
        
        }
    });
    //内容列表滚动
    Draggable.create(".zy_list_container", {
        type:"scrollLeft", 
        edgeResistance:0.5, 
        throwProps:true, 
        lockAxis:true,
        onClick:function(evt){
            var post_type;
            var clickTarget=evt.target || evt.srcElement 
            clickTarget= clickTarget.nodeName == "LI"? $(clickTarget):$(clickTarget).parents("li")
            
            if(clickTarget.prop("tagName")=="LI"){
                post_id=$(clickTarget).data("zy-post-id");
                post_type=$(clickTarget).data("zy-post-type");
                ZY.UIManager.showArticle(post_id,post_type);
            }            
            
        },
        onDragStart:function(evt){
            
        
        },
        onDragEnd:function(evt){			
            var clickTarget=evt.target || evt.srcElement
            clickTarget=$(clickTarget).parents(".zy_list_container")
            var containerID=clickTarget.attr("id")
            //根据containerID刷新相应内容区块
            switch (containerID){
                case "zy_landscape_list_container":
                    ZY.DataManager.zy_get_posts(
                        $("#zy_landscape_contain"),240,3,ZY.DataManager.lastLandscapeDate,false);
                    break;
                case "zy_people_list_container":
                    ZY.DataManager.zy_get_posts(
                        $("#zy_people_contain"),340,2,ZY.DataManager.lastPeopleDate,false);
                    break;
                case "zy_artifact_list_container":
                    ZY.DataManager.zy_get_posts(
                        $("#zy_artifact_contain"),400,5,ZY.DataManager.lastArtifactDate,false);
                    break;
                case "zy_community_list_container":
                    ZY.DataManager.zy_get_posts(
                        $("#zy_community_contain"),340,4,ZY.DataManager.lastCommunityDate,false);
                    break;
            }
        }
    });
   
    
        //最顶上一篇文章的点击load事件
    $(document).on("click","#zy_top_post_title",function(){
		var url="";
        post_id=$(this).data("zy-post-id");
        var post_type=$(this).data("zy-post-type");

        ZY.UIManager.showArticle(post_id,post_type);
    });

	//音乐控制
	//初始化音乐播放器，绑定相关事件
    ZY.UIManager.initMusicPlayer();
    
    //风景显示左右按钮
	$("#zy_landscape_contain").hover(
		function(){$("#zy_landscape_contain>a").css("opacity",1)},
		function(){$("#zy_landscape_contain>a").css("opacity",0)}
	)    

    //人文部分显示左右按钮
	$("#zy_people_contain").hover(
		function(){$("#zy_people_contain>a").css("opacity",1)},
		function(){$("#zy_people_contain>a").css("opacity",0)}
	)

    //物语部分显示左右按钮
	$("#zy_artifact_contain").hover(
		function(){$("#zy_artifact_contain>a").css("opacity",1)},
		function(){$("#zy_artifact_contain>a").css("opacity",0)}
	)

    //社区部分显示左右按钮
	$("#zy_community_contain").hover(
		function(){$("#zy_community_contain>a").css("opacity",1)},
		function(){$("#zy_community_contain>a").css("opacity",0)}
	)
    
    //关闭弹出层
    $("#zy_show_close").click(function(){
        ZY.UIManager.hideDetail()        
    });

	//绑定弹出窗口事件
	ZY.UIManager.popOutInit();
	
    //加载展开页面
    $(document).on("click","#zy_featured_articles>li[data-zy-post-type^=zy]",function(){
        post_id=$(this).data("zy-post-id");
        var post_type=$(this).data("zy-post-type");

        ZY.UIManager.showArticle(post_id,post_type);
    });
    //关闭加载的页面
    $("#zy_article_content_close").click(function(){		
        ZY.UIManager.hideArticle();
    });

    //显示大图
    $(document).on("click","#zy_article_content a",function(evt){

        evt.preventDefault();
        //evt.stopPropagation();
        //return false;
        /*var url;
        var elementA=$(this);
        if(elementA.hasClass("videoslide")){
            url=ZY.Config.siteurl+"/show_media/"+post_id+"/"+elementA.find("img").data("zy-media-id");
            ZY.UIManager.showVideoDetail(url);
            return false;
        }else if(elementA.find("img")){
            url=elementA.attr("href");
            ZY.UIManager.showImageDetail(url);
            return false;
        }else{
            window.open(elementA.attr("href"))
        }*/
    });

	//window 的scroll事件
	$(window).on("scroll",function(evt){
		ZY.UIManager.scrollingHandler()
	});

    //有可能刷新就已经滚动到了一定位置，需要触发一下，加载相应的数据
	$(window).trigger("scroll");

	//启动页面滚轮模式
	//ZY.UIManager.setWheelScrollSpeed();
	
    //window的resize事件，在这个事件里面需要重新设置每个container的宽度
    var resizeTimer=null;
    $(window).resize(function(){
       if(resizeTimer){
           clearTimeout(resizeTimer);
       }
       resizeTimer=setTimeout(function(){
           ZY.UIManager.doResizeOfCategory($("#zy_people_contain"),340,
               ZY.DataManager.peopleLoaded);
           ZY.UIManager.doResizeOfCategory($("#zy_landscape_contain"),240,
               ZY.DataManager.landscapeLoaded);
           ZY.UIManager.doResizeOfCategory($("#zy_community_contain"),340,
               ZY.DataManager.communityLoaded);
           ZY.UIManager.doResizeOfCategory($("#zy_artifact_contain"),400,
               ZY.DataManager.artifactLoaded);
       },200);
    });
});
