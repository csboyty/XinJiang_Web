    //采用DOMContentLoaded事件,并且在事件捕获阶段执行,无需等待图片加载完成
    //由于是基于android，无需考虑ie内核
    window.addEventListener("DOMContentLoaded",function(){
        var as=	document.getElementsByTagName("a");
        var length=as.length;
        var url="";
        var siteurl="http://lotusprize.com/travel";
        for(var i=0;i<length;i++){
            if(as[i].className=="videoslide"||as[i].getElementsByTagName("img").length!=0){

                as[i].onclick=function(){
                    if(this.className=="videoslide"){
                        var post_id=this.getAttribute("data-zy-post-id");
                        var media_id=this.getElementsByTagName("img")[0].getAttribute("data-zy-media-id");
                        url=siteurl+"/show_media/"+post_id+"/"+media_id;
                    }else{
                        var href=this.getAttribute("href");
                        var imageUrl=href.replace(siteurl+"/wp-content/uploads/","").replace(/\//g,"*_*");
                        url=siteurl+"/show_image/"+imageUrl;
                    }

                    //跳转页面
                    window.location.href=url;
                    event.preventDefault();
                };
            }
        }
    },true);
