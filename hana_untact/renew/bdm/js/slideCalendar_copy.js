/****************************
    Hana Bank JS 2022 extend
*****************************/


//========================================================================================== //

var hanaProdUI = {};

//2022-08-25 일자 계산 관련 수정
hanaProdUI.dialSelect = function(obj, param, cfn){
    var $el = null;
    var dialModal = {
        scrollWrapper : [
            /*{
                $el : null,
                cols:0,
                itemHeight : 0,
                isActive : false,
                scrollItems:[],
                scrollTop : 0,
                val: null
            }*/
        ],
        //setDate : "EE",
        groupIdx : 0, //dial group의 인덱스 저장
        min : 0, //최소 가입기간
        max : 0, //최대 가입기간(만기일)
        tabs : null,
        minDate : null,
        maxDate : null,
        $callBtn : null,
        $confirmBtn: null,
        _callBackFn : null,
        onlyMulti:false
    };

    var itemTemplate = '\
        <li class="list-wrap__item list-button-wrap list-button-wrap--small"" aria-lable="{{value}}">\
            <button type="button" class="list-wrap__anchor">\
                <span class="list-wrap__box">\
                    <strong class="list-wrap__title list-wrap__title--value">{{value}}</strong>\
                </span>\
            </button>\
        </li>';
    
    function init(obj){
        var me = $(obj);
        if(!me.length){ return false;}
        var o = new Object(dialModal);            
        var container, items;

        o.tabs = me.find('.tab-wrap__menu');
        o.$callBtn = $('button[data-target="#'+me.get(0).id+'"]');
        o.$confirmBtn = me.find('.button-fixed .button--positive');
        o._callBackFn = cfn;

        
        
        function scrollWrapperExtend(obj, container, items){
            var colsType = parseInt(items.attr('class').split('col-')[1].slice(0,1));
            obj.groupIdx = (colsType > 1) ? 1 : 0;
            obj.scrollWrapper.push({
                $el : container,
                cols: colsType,
                itemHeight : 0,
                isActive : false,
                scrollItems: items,
                scrollTop : 0,
                val: null,
                selYY : '',
                selMM : ''
            });
            return obj;
        }
        
        if(typeof param.length == 'number'){ //single
            container = me.find('.modal__contents');
            items = container.find('.container__panel');// .list-section
            o = scrollWrapperExtend(o, container, items);
            o.items = param;
        }else{
            o.items = param.items;
            if(!!o.tabs.length){//탭이 있다면
                o.onlyMulti = me.find('.modal__contents--inner-tab [data-element=tab]').data('options').initIndex;
                if(o.onlyMulti){
                    o.tabs.parent().hide();
                }
                
                me.find('.pualugin-tab__panel').each(function(){
                    container = $(this);
                    items = container.find('.container__panel');
                    o = scrollWrapperExtend(o, container, items);
                    
                    o.min = param.min;
                    o.max = param.max;
                })
            }else{
                container = me.find('.modal__contents--multiple');
                items = container.find('.container__panel');// .list-section
                o = scrollWrapperExtend(o, container, items);
                o.min = param.min;
                o.max = param.max;
            }
        }
        //동적 생성
        createslide(o);
        event(me, o);
        
        $('body').data('plugin_modal').open(obj);
    }

    //윤년 관련 함수
    function dateChk(yyyy, m){
        var lastDay = new Date(yyyy,m,0).getDate();
        return lastDay;
    }

    function createslide(o){
        if(typeof param.length != 'number'){
            var dateObj = calcPeriod(o.min, o.max);
            o.dateObj = dateObj.distance;      
            o.minDate = dateObj.min;              
            o.maxDate = dateObj.max;
            if(!!o.tabs.length){//탭이 있다면
                createYY(o, "년");
                createMM(o, Object.keys(dateObj.distance)[0], "월");
                createDD(o, o.scrollWrapper[o.groupIdx].selYY, parseInt(o.dateObj[o.scrollWrapper[o.groupIdx].selYY][0]), "일");
            }   
        }
        if(!o.onlyMulti){
            singleCreateMM(o);
        }
    }

    function rtArrayNum(num){
        var arr = new Array(num);
        for(var i = 0; i < num; i++){
            arr[i] = ((i+1)+"").padStart(2, "0");
        };
        return arr;
    }

    /*
     calcPeriod : 최소 최대기간 사이의 년 월 배열이 담긴 객체 리턴 
    */
   
     function distance(mm){//인자값 개월수
        var b = new Date();
        b.setMonth(b.getMonth() + mm);
        return b;
    }

    function calcPeriod(oMin, oMax){
        var dateObj = {};
        var a = distance(oMin);
        var b = distance(oMax);
        var min = a.getMonth() + 1;
        var max = b.getMonth() + 1;
        var len = b.getFullYear() - a.getFullYear() + 1;
        
        for(var i=0; i<len; i++){
            dateObj[a.getFullYear() + i] = rtArrayNum(12);
        }
        dateObj[b.getFullYear()] = dateObj[b.getFullYear()].slice(0, max);
        dateObj[a.getFullYear()] = dateObj[a.getFullYear()].slice(min-1);

        return {
            distance : dateObj,
            min : a,
            max : b
        }
    }

    function createYY(o, unitText){
        var dateObj = o.dateObj;
        var resultStr = '<ul class="list-wrap">';
        for (var key in dateObj) {
            resultStr += itemTemplate.replace(/{{value}}/g, key + unitText);
        }
        resultStr += '</ul>';
        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).html(resultStr);

        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).scrollTop(0).find('.list-wrap__item').eq(0).addClass('active-item').css('background', 'red');
        
        // 웹접근성 스크린리더 관련 추가
        var selectNum = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').index() + 1;
        var totalBtnNum = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').length;
        var selectDate = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').eq(0).data('option-value');
        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).attr('aria-labelledby', selectDate + ' 총' + totalBtnNum + '개 중' + selectNum + '번째 선택 손가락으로 쓸어 선택가능 합니다.');

    

        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').attr({
            "role": "button",
            "aria-selected": "true"
        });
        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').eq(0).siblings().attr({
            "role": "button",
            "aria-selected": "false"
        });



        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-wrap').eq(0).attr('role', 'radiogroup');
        
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').eq(0).find('.list-wrap__anchor').attr({
        //     "role": "radio",
        //     "aria-checked" : true
        // });
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').eq(0).siblings().find('.list-wrap__anchor').attr({
        //     "role": "radio",
        //     "aria-checked" : false
        // });
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').attr({
        //     "role": "radio",
        //     "aria-checked" : true
        // });
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').eq(0).siblings().attr({
        //     "role": "radio",
        //     "aria-checked" : false
        // });
        
    }

    function createMM(o, selYear, unitText){
        var dateObj = o.dateObj;
        var resultStr = '<ul class="list-wrap">';
        for(var key in dateObj[selYear]){
            resultStr += itemTemplate.replace(/{{value}}/g, dateObj[selYear][key]+unitText);
        }
        resultStr += '</ul>';
        o.scrollWrapper[o.groupIdx].selYY = selYear;
        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(1).html(resultStr);

        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(1).scrollTop(0).find('.list-wrap__item').eq(0).addClass('active-item');

        // 웹접근성 스크린리더 관련 추가
        var selectNum = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').index() + 1;
        var totalBtnNum = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(1).find('.list-wrap__item').length;
        var selectDate = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(1).find('.list-wrap__item').eq(0).data('option-value');
        
        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(1).attr('aria-labelledby', selectDate + ' 총' + totalBtnNum + '개 중' + selectNum + '번째 선택 손가락으로 쓸어 선택가능 합니다.');
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').attr('role', 'radiogroup');
        
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(1).find('.list-wrap__item').attr({
        //     "role": "radio",
        //     "aria-checked" : true
        // });
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(1).find('.list-wrap__item').siblings().attr({
        //     "role": "radio",
        //     "aria-checked" : false
        // });
    }

    function createDD(o, selYear, selMonth, unitText){
        var arrDay = rtArrayNum(31);
        var limitMinDate = o.minDate.getDate();
        var limitMaxDate = o.maxDate.getDate();
        
        arrDay = arrDay.slice(0, dateChk(selYear, selMonth));

        if(o.minDate.getFullYear() == parseInt(selYear) && (o.minDate.getMonth()+1) == parseInt(selMonth)){//최소 가입일 적용
            arrDay = arrDay.slice(limitMinDate-1);
        }
        if(o.maxDate.getFullYear() == parseInt(selYear) && (o.maxDate.getMonth()+1) == parseInt(selMonth)){//최대 만기일 적용
            arrDay = arrDay.slice(0, limitMaxDate);
        }
            
        var resultStr = '<ul class="list-wrap">';
        for(var i=0; i<arrDay.length; i++){
            resultStr += itemTemplate.replace(/{{value}}/g, arrDay[i] + unitText);
        }
        resultStr += '</ul>';

        o.scrollWrapper[o.groupIdx].selMM = selMonth;
        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(2).html(resultStr);
        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(2).scrollTop(0).find('.list-wrap__item').eq(0).addClass('active-item');
        
        // 웹접근성 스크린리더 관련 추가
        var selectNum = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').index() + 1;
        var totalBtnNum = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(2).find('.list-wrap__item').length;
        var selectDate = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(2).find('.list-wrap__item').eq(0).data('option-value');
        o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(2).attr('aria-labelledby', selectDate + ' 총' + totalBtnNum + '개 중' + selectNum + '번째 선택 손가락으로 쓸어 선택가능 합니다.');
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(2).attr('role', 'radiogroup');
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(2).find('.list-wrap__item').eq(0).attr({
        //     "role": "radio",
        //     "aria-checked" : true
        // });
        // o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').eq(2).find('.list-wrap__item').eq(0).siblings().attr({
        //     "role": "radio",
        //     "aria-checked" : false
        // });

        return arrDay;
    }
    
    function singleCreateMM(o) {
        var resultStr = '<ul class="list-wrap">';
        for(var i=0; i<o.items.length; i++){            
            resultStr += itemTemplate.replace(/{{value}}/g, o.items[i]['codeName']);
        }
        resultStr += '</ul>';
        o.scrollWrapper[0].scrollItems.find('.list-section').eq(0).html(resultStr);
        o.scrollWrapper[0].scrollItems.find('.list-section').eq(0).scrollTop(0).find('.list-wrap__item').eq(0).addClass('active-item');
        
        // 웹접근성 스크린리더 관련 추가
        var selectNum = o.scrollWrapper[o.groupIdx].scrollItems.find('.list-section').index() + 1;
        var totalBtnNum = o.scrollWrapper[0].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').length;
        var selectDate = o.scrollWrapper[0].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').eq(0).data('option-value');
        o.scrollWrapper[0].scrollItems.find('.list-section').eq(0).attr('aria-labelledby', selectDate + ' 총' + totalBtnNum + '개 중' + selectNum + '번째 선택 손가락으로 쓸어 선택가능 합니다.');
        // o.scrollWrapper[0].scrollItems.find('.list-section').eq(0).attr('role', 'radiogroup');
        
        // o.scrollWrapper[0].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').eq(0).attr({
        //     "role": "radio",
        //     "aria-checked" : true
        // });
        // o.scrollWrapper[0].scrollItems.find('.list-section').eq(0).find('.list-wrap__item').eq(0).siblings().attr({
        //     "role": "radio",
        //     "aria-checked" : false
        // });

    }
    
    function event($el, o){
        var $callBtn = o.$callBtn;

        //2022-10-17 이전 다음항목 클릭시
        $el.on('click', '.modal__contents .list-section .list-wrap__item', function (e) {//2022-10-17 update
            var _this = $(this);
            var scrollContainer = _this.parents('.list-section');
            var scrTop = scrollContainer.scrollTop();
            if(_this.is('.active-item')) { return false;}
            if(_this.next('.active-item').length){//이전항목이라면
                scrollContainer.animate({
                    scrollTop:scrTop - 55
                }, 100);
            }
            if(_this.prev('.active-item').length){//다음항목이라면
                scrollContainer.animate({
                    scrollTop:scrTop + 55
                }, 100);
            } 
        });
        //모달내부 확인버튼 이벤트        
        o.$confirmBtn.off('click').on('click', function(){
            var _selectVal = '';
            var _selectVal2 = '';
            var _rtnVal = {};
            //탭이 존재한다면
            if(o.tabs.length){
                var activeIdx = o.tabs.find('.is-active').parent('.tab-wrap__item').eq(0).index();
                if(!!activeIdx){
                    o.scrollWrapper[activeIdx].$el.find('.active-item').each(function(subIdx){
                        if(!!subIdx){
                            _selectVal += "-"
                        }    
                        //Date format zerofill
                        _selectVal += (parseInt($(this).data('option-value'))+"").padStart(2, "0");
                    })
                    _selectVal2 = _selectVal;
                    _rtnVal.type = 'TM';
                    _rtnVal.res = _selectVal;
                }else{//multi innner single
                    _selectVal2 = o.scrollWrapper[activeIdx].$el.find('.active-item').data('option-value');
                    _selectVal = o.items[o.scrollWrapper[activeIdx].$el.find('.active-item').index()];
                    _rtnVal.type = 'TS';
                    _rtnVal.res = _selectVal;
                }
            }else{//single
                _selectVal2 = o.scrollWrapper[0].$el.find('.active-item').data('option-value');   
                _selectVal = o.items[o.scrollWrapper[0].$el.find('.active-item').index()];
                _rtnVal.type = 'S';
                _rtnVal.res = _selectVal;
            }

            $callBtn.attr('data-set-value', _selectVal2);
            //콜백함수에 선택값 전달
            o._callBackFn(_rtnVal);
            $('body').data('plugin_modal').close(obj);
        });

        $el.find('.list-section').each(function(){
            var scrollContainer = $(this);      
            var isMultiple = scrollContainer.parent().is('.col-3');
            var orgTargetIdx = 0;
            //스크롤시 이벤트
            scrollContainer.off('scroll').on('scroll',function(){
                var me = $(this);
                var items = me.find('.list-wrap__item');
                var _height = 55;// items.height() + margin;
                var scrTop = this.scrollTop + (_height/2);
                var activeTargetIdx =  (Math.floor(scrTop/_height));
                if(activeTargetIdx > items.length -1) {
                    activeTargetIdx = items.length -1;
                }
                //년도가 변할경우 월 데이터 갱신
                if(isMultiple && scrollContainer.index() === 0){//년
                    if(orgTargetIdx != activeTargetIdx){
                        
                        createMM(o, Object.keys(o.dateObj)[activeTargetIdx], "월");
                    }
                }
                if(isMultiple && scrollContainer.index() === 1){//월
                    if(orgTargetIdx != activeTargetIdx){
                        
                        createDD(o, o.scrollWrapper[o.groupIdx].selYY, parseInt(o.dateObj[o.scrollWrapper[o.groupIdx].selYY][activeTargetIdx]),  "일");
                    }
                }
                if(orgTargetIdx != activeTargetIdx && window.navigator.vibrate){
                    window.navigator.vibrate(100);
                }
                
                items.eq(activeTargetIdx).addClass('active-item').siblings().removeClass('active-item');

                // 웹접근성 스크린리더 관련 추가
                var selectNum = activeTargetIdx + 1;
                var totalBtnNum = items.length;
                var selectDate = items.eq(activeTargetIdx).data('option-value');
                items.eq(activeTargetIdx).closest('.list-section').attr('aria-labelledby', selectDate + ' 총' + totalBtnNum + '개 중' + selectNum + '번째 선택 손가락으로 쓸어 선택가능 합니다.');
                // items.eq(activeTargetIdx).closest('.list-section').attr('role', 'radiogroup');
                
                // items.eq(activeTargetIdx).attr({
                //     "role": "radio",
                //     "aria-checked" : true
                // });
                // items.eq(activeTargetIdx).siblings().attr({
                //     "role": "radio",
                //     "aria-checked" : false
                // });

                orgTargetIdx = activeTargetIdx;
            })
        });        
    }

    init(obj);
};

hanaProdUI.directDebitSelect = function (obj, cfn) {
    var $el = null;
    var dialModal = {
        scrollWrapper : [
            /*{
                $el : null,
                cols:0,
                itemHeight : 0,
                isActive : false,
                scrollItems:[],
                scrollTop : 0,
                val: null
            }*/
        ],
        //setDate : "EE",
        groupIdx : 0, //dial group의 인덱스 저장
        min : 0, //최소 가입기간
        max : 0, //최대 가입기간(만기일)
        tabs : null,
        minDate : null,
        maxDate : null,
        $callBtn : null,
        $confirmBtn: null,
        _callBackFn : null,
        onlyMulti:false
    };

    
    
    function init(obj){
        var me = $(obj);
        if(!me.length){ return false;}
        var o = new Object(dialModal);            
        o.$callBtn = $('button[data-target="#'+me.get(0).id+'"]');
        o.$confirmBtn = me.find('.button-fixed .button--positive');
        o._callBackFn = cfn; 
        
        event(me, o);
        
        $('body').data('plugin_modal').open(obj);
    }
    
    function event($el, o){
        //2022-10-17 이전 다음항목 클릭시
        $el.on('click', '.direct-debit-slide .list-section .list-wrap__item', function (e) {
            var _this = $(this);
            var scrollContainer = _this.closest('.list-section');
            var scrTop = scrollContainer.scrollTop();
            if(_this.is('.active-item')) { return false;}
            if(_this.next('.active-item').length){//이전항목이라면
                scrollContainer.animate({
                    scrollTop:scrTop - 55
                }, 100);
            }
            if(_this.prev('.active-item').length){//다음항목이라면
                scrollContainer.animate({
                    scrollTop:scrTop + 55
                }, 100);
            } 
        });
        
        $el.on('click', '.direct-debit-btn .list-section .list-wrap__item', function (e) { 
            var btnIndex = $(this).index();
            $('.direct-debit-slide .direct-debit-cont').removeClass('open');
            $('.direct-debit-slide .direct-debit-cont').eq(btnIndex).addClass('open');
        });

        //모달내부 확인버튼 이벤트        
        o.$confirmBtn.off('click').on('click', function(){
            $('body').data('plugin_modal').close(obj);
        });
        
        $el.find('.direct-debit-btn .list-section').each(function () {
            var scrollContainer = $(this);   
            
            var orgTargetIdx = 0;

            // 웹접근성 추가
            var selectNum = 1;
            var totalBtnNum = $('.direct-debit-btn .list-section').length;
            var selectDate = $('.direct-debit-btn .list-section').eq(0).find('.list-wrap__item').eq(0).find('.list-wrap__title').text();
            $('.direct-debit-btn .list-section').eq(0).closest('.list-section').attr('aria-labelledby', selectDate + ' 총' + totalBtnNum + '개 중' + selectNum + '번째 선택 손가락으로 쓸어 선택가능 합니다.');
            // $('.direct-debit-btn .list-section').eq(0).closest('.list-wrap').attr('role', 'radiogroup');
            // $('.direct-debit-btn .list-section').eq(0).find('.list-wrap__anchor').attr({
            //     "role": "radio",
            //     "aria-checked" : false
            // });
            // $('.direct-debit-btn .list-section').eq(0).siblings().find('.list-wrap__anchor').attr({
            //     "role": "radio",
            //     "aria-checked" : true
            // });
                
            //스크롤시 이벤트
            scrollContainer.off('scroll').on('scroll',function(){
                var me = $(this);
                var items = me.find('.list-wrap__item');
                var _height = 55;// items.height() + margin;
                var scrTop = this.scrollTop + (_height/2);
                var activeTargetIdx =  (Math.floor(scrTop/_height));
                if(activeTargetIdx > items.length -1) {
                    activeTargetIdx = items.length -1;
                }
                // if(orgTargetIdx != activeTargetIdx && window.navigator.vibrate){
                //     window.navigator.vibrate(100);
                // }
                items.eq(activeTargetIdx).addClass('active-item').siblings().removeClass('active-item');
                var activeItemsIndex = items.eq(activeTargetIdx).index();
                $('.direct-debit-slide .direct-debit-cont').hide().removeClass('open');
                $('.direct-debit-slide .direct-debit-cont').eq(activeItemsIndex).show().addClass('open');
                
                // 웹접근성 스크린리더 관련 추가
                var selectNum = activeTargetIdx + 1;
                var totalBtnNum = items.length;
                var selectDate = items.eq(activeTargetIdx).find('.list-wrap__anchor').text();
                items.eq(activeTargetIdx).closest('.list-section').attr('aria-labelledby', selectDate + ' 총' + totalBtnNum + '개 중' + selectNum + '번째 선택 손가락으로 쓸어 선택가능 합니다.');
                // items.eq(activeTargetIdx).closest('.list-wrap').attr('role', 'radiogroup');
                // items.eq(activeTargetIdx).find('.list-wrap__anchor').attr({
                //     "role": "radio",
                //     "aria-checked" : true
                // });
                // items.eq(activeTargetIdx).siblings().find('.list-wrap__anchor').attr({
                //     "role": "radio",
                //     "aria-checked" : false
                // });
                
                orgTargetIdx = activeTargetIdx;
            })
        });        
        $el.find('.direct-debit-cont').each(function () { 
            $(this).find('.list-section').each(function () {
                var scrollContainer = $(this);      
                var orgTargetIdx = 0;
                
                //스크롤시 이벤트
                scrollContainer.off('scroll').on('scroll', function () {
                    var me = $(this);
                    var items = me.find('.list-wrap__item');
                    var _height = 55;// items.height() + margin;
                    var scrTop = this.scrollTop + (_height/2);
                    var activeTargetIdx =  (Math.floor(scrTop/_height));
                    if(activeTargetIdx > items.length -1) {
                        activeTargetIdx = items.length -1;
                    }
                    // if(orgTargetIdx != activeTargetIdx && window.navigator.vibrate){
                    //     window.navigator.vibrate(100);
                    // }
                    items.eq(activeTargetIdx).addClass('active-item').siblings().removeClass('active-item');
                    

                    // 웹접근성 스크린리더 관련 추가
                    var selectNum = activeTargetIdx + 1;
                    var totalBtnNum = items.length;
                    var selectDate = items.eq(activeTargetIdx).text();
                    items.eq(activeTargetIdx).closest('.list-section').attr('aria-labelledby', selectDate + ' 총' + totalBtnNum + '개 중' + selectNum + '번째 선택 손가락으로 쓸어 선택가능 합니다.');
                    // items.eq(activeTargetIdx).closest('.list-wrap').attr('role', 'radiogroup');
                    
                    // items.eq(activeTargetIdx).attr({
                    //     "role": "radio",
                    //     "aria-checked" : true
                    // });
                    // items.eq(activeTargetIdx).siblings().attr({
                    //     "role": "radio",
                    //     "aria-checked" : false
                    // });
                    
                    orgTargetIdx = activeTargetIdx;
                })
            });
        })
    }
    init(obj);
};



/* swiper slide 아이템이 out될시에 구분 클래스를 적용해주는 함수  */
hanaProdUI.swiperOutTransition = function(swiperObj){
    swiperObj.on('slideChangeTransitionStart', function () {
        swiperObj.slides[swiperObj.previousIndex].classList.add('transition');
    })
    swiperObj.on('slideChangeTransitionEnd', function () {
        $(swiperObj.slides).removeClass('transition');
    })
}


hanaProdUI.getSwiperInfo;//2022-08-25 개발에서 사용할 함수 swiper정보를 가져오는 함수
hanaProdUI.validSwipeNext;//2022-08-25 개발에서 호출할 함수

//2022-09-14 수정
hanaProdUI.screenSwiper = function(scrollContainer){
    if(!$(scrollContainer).length){ return false;}
    $('body').addClass('page-h-swiper');
    //var nextButton = $('.step-screen-arrow');
    var swiperOptions = {
        resistanceRatio: 0,
        slidesPerView: 'auto',
        effect:'slide',
        threshold:20,
        spaceBetween: 0,
        speed: 300,
        allowSlideNext : false,
        direction:'vertical',
        slideClass : 'step-screen-container'
    }
    var swiperSection = new Swiper(scrollContainer, swiperOptions);

    //클로저
    var getSwiperInfo = function(swiperObj){
        var swiperObj = swiperObj;
        return function(){
            return swiperObj;
        }
    }
    var gSwipeNext = function(swiperObj){
        var swiperObj = swiperObj;
        
        return function(idx){
            swiperObj.params.allowSlideNext = true;
            swiperObj.allowSlideNext = true;
            if(idx) {
                swiperObj.slideTo(idx);
            }else{
                var nextIdx = swiperObj.realIndex+1;
                swiperObj.slideTo(nextIdx);
            }
            
            swiperObj.params.allowSlideNext = false;
            swiperObj.allowSlideNext = false;
        }
    }

    hanaProdUI.getSwiperInfo = getSwiperInfo(swiperSection);
    hanaProdUI.validSwipeNext = gSwipeNext(swiperSection);

    hanaProdUI.swiperOutTransition(swiperSection, scrollContainer, swiperOptions);
    var stepPagenation = $('.ste-progress');
    var stepPagenationItem = stepPagenation.find('.stepper__step');
    
    var initIdx = 0;
    if(stepPagenation.data('init-idx')){
        initIdx = eval(stepPagenation.data('init-idx'));
    }

    //2022-08-29 modify
    swiperSection.on('slideChangeTransitionStart', function(ui){
        stepPagenation.addClass('trasition');
        var swiperLen = $('.step-screen-container').length;
        var ingBtn = $('.step-screen-arrow');
        if(swiperSection.realIndex == (swiperLen-1)){
            ingBtn.addClass('last');

        }else{
            ingBtn.removeClass('last');
        }
    })
    swiperSection.on('slideChangeTransitionEnd', function(ui){
        stepPagenation.removeClass('trasition');
        isGetFeed = false;
        swiperSection.params.allowSlideNext = false;
        swiperSection.allowSlideNext = false;
       // $(scrollContainer).addClass('no-answer-yet');
        stepPagenationItem.eq(ui.realIndex + initIdx).addClass('stepper__step--current').siblings().removeClass('stepper__step--current')
    })

    /*
    nextButton.on('click',function(){
        hanaProdUI.validSwipeNext();
    })
    */
    // 2022-10-20 숫자 키패드팝업시 화면 스크롤
    $('.inner-content-scroll').on('click', '.input.native-readonly .native-inner', function(){
        var me = $(this);
        hanaProdUI.hanaRemoveDummyDiv();
        var safeAreaInsetTop = parseInt($('#content').css('padding-top')) - 56; //2022-10-04 ios 관련 추가
        var safeAreaInsetBtm = parseInt($('.app-footer').css('padding-bottom')) - 24;// 2022-10-20 ios 관련 추가
        if(($('body').get(0).clientHeight - 380 - safeAreaInsetBtm) < me.offset().top){
            var scrollTo = Math.abs(me.offset().top - ($('body').get(0).clientHeight - 380)) + safeAreaInsetTop + safeAreaInsetBtm;
            setTimeout(function(){
                $('.inner-content-scroll .swiper-slide-active').scrollTop(scrollTo);
            },20);
        }
    })
}
///가입프로세스
hanaProdUI.savgJoinPageInit = function() {
    hanaProdUI.screenSwiper('.inner-content-scroll');
    //hanaProdUI.inputFieldEditable('.input.underline-type');
}


