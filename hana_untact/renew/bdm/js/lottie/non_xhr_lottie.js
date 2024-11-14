/*****************************************************************************
 * 파일명 : non_xhr_lottie.js
 * 작성일 : 2023.07.01
 * 작성자 : 이동섭
 * 설  명 : 비거래용 로띠JSON 라이브러리
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
  * 2023.07.01		이동섭		최초작성
 *****************************************************************************/
var nonxhrLottie = {
    items:[],
    itemsOpt:[],
    create : function(imgs){
        var strHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448" width="448" height="448" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%; transform: translate3d(0px, 0px, 0px);"><g>';
        for(var i=0; i<imgs.length; i++){
            if(i == 0){
                strHtml += '<g transform="matrix(1,0,0,1,0,0)" style="display:block;"><image width="448px" height="448px" preserveAspectRatio="xMidYMid slice" href="'+ imgs[i] + '" /></g>'
            }else{
                strHtml += '<g transform="matrix(1,0,0,1,0,0)" style="display:none;"><image width="448px" height="448px" preserveAspectRatio="xMidYMid slice" href="'+ imgs[i] + '" /></g>'
            }
        }
        strHtml += '</g></svg>';
        delete imgs;
        return strHtml;
    },
    draw : function(target, strHtml){
        return $(strHtml).appendTo(target);
    },
    getImgs : function(jsonData){
        var imgGroup = [];
        for(var key in jsonData.assets){
            if(jsonData.assets[key].p){
                imgGroup.push(jsonData.assets[key].p)
            }
        }
        return imgGroup;
    },
    _method : {
        intervalTimerID:0,
        TimerID:0,
        isLoop : true,
        isAutoplay : true,
        status : 'stop',
        delay : 5000,
        init: function(){},
        play : function(){
            var _fn = this;
            var items = $(_fn.el).find('>g g');
            _fn.status = 'play';


            if(_fn.noDelay){
                clearInterval(_fn.intervalTimerID);
                _fn.intervalTimerID = setInterval(function(){
                    _fn.current++;
                    items.eq(_fn.current).show().siblings().hide();
                    if(_fn.current > _fn.total){
                        _fn.current = 0;
                    }
                },50);

            }else{
                clearInterval(_fn.intervalTimerID);
                _fn.intervalTimerID = setInterval(function(){
                    _fn.current++;
                    items.eq(_fn.current).show().siblings().hide();
                    if(_fn.current > _fn.total){
                        clearInterval(_fn.intervalTimerID);
                        _fn.current = 0;
                        _fn.status = 'stop';
                    }
                },50);
                
                if(_fn.isLoop){
                    clearTimeout(_fn.TimerID);
                    _fn.TimerID = setTimeout(function(){
                        _fn.play();
                    }, _fn.delay)
                }
            }
           
        },
        stop : function(){
            var _fn = this;
            _fn.current = 0;
            _fn.status = 'stop';
            clearInterval(_fn.intervalTimerID);
            clearTimeout(_fn.TimerID);
            var items = $(_fn.el).find('>g g');
            items.eq(_fn.current).show().siblings().hide();
            
        },
        pause:function(){
            var _fn = this;
            _fn.status = 'pause';
            clearInterval(_fn.intervalTimerID);
            clearTimeout(_fn.TimerID);
            var items = $(_fn.el).find('>g g');
            items.eq(_fn.current).show().siblings().hide();
        }
    },
    init: function(name, jsonData){
        var O = {}
        var _fn = this;
        O[name] = jsonData;
        _fn.items.push(O);
        //jsondata load 완료 시점.
        for(var i=0; i< _fn.itemsOpt.length; i++){
            if(_fn.itemsOpt[i][name]){
                var option = (_fn.itemsOpt[i][name]);
                var imgGroup = _fn.getImgs(jsonData[0]);//jsonData
                
                var totalFrame = imgGroup.length-1;
                var el = _fn.create(imgGroup);
                delete imgGroup;
                el = _fn.draw(option.wrapper, el);
                option.el = el;
                option.total = totalFrame;
                option.current = 0;

                var anim = $.extend({}, _fn._method, option);
                anim.init();
                if(anim.isAutoplay){
                    anim.play();
                }
                
            }
        }
    },
    movin : function(name, opt){
        var O = {}
        O[name] = opt;
        this.itemsOpt.push(O);
    }
}

function setLottie2(dataId, target, isAutoplay, isLoop, initFn, noDelay){
    var wrapper = $(target).get(0);
    if(typeof noDelay == "undefined"){
        noDelay = false
    }
    var animData = {
        wrapper: wrapper,
        init : initFn,
        isAutoplay : isAutoplay,
        isLoop : isLoop,
        noDelay : noDelay
    };
    nonxhrLottie.movin(dataId, animData);
}