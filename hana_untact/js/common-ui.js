;$(function(){

    /****************************
        Hana Bank JS
    *****************************/

    /* Common UI */
    hanaUI.header('.app-header, .modal__header, .main__header'); //헤더공통
    hanaUI.footer('.app-footer'); //푸터공통
    //hanaUI.resizeDelay(id, time, callback) //윈도우 리사이즈 딜레이
    hanaUI.inputField('.input'); //인풋필드 기능
    hanaUI.placeholder('[data-element=placeholder__textarea]'); //플레이스홀더
    hanaUI.formAnimateEvent(); // 폼 포커스 관련 이벤트
    hanaUI.tooltip(); //툴팁 
    hanaUI.sticky('[data-sticky=normal]'); //고정메뉴
    hanaUI.code();  // security code
    hanaUI.selectBtnActive(); // 팝업 버튼 on/off
    hanaUI.searchListActive(); // 검색 레이어 목록 active
    hanaUI.searchBtnActive(); // 검색 팝업 버튼
    hanaUI.postSearch();  // 지점/ATM 안내 검색 인풋
    hanaUI.cardActive(); // 카드타입 active
    hanaUI.native.bottomInit(); //스크린리더 접근시 하단 버튼 고정 풀기
    hanaUI.inputAuto('[data-element=input-auto]');	//인풋 width 자동
    hanaUI.modalDateActive(); // 일자선택(모달)
    hanaUI.allCheck(); // all checked
    hanaUI.allCheckAccordian(); // all checked Accordian
    hanaUI.passwordShow(); // password show/hide
    hanaUI.modalBranch(); // 지점안내 모달 fixed
    hanaUI.scrollEvent(); // 스크롤 방향 체크 (검색 플로팅 관련 js)
    
});



var hanaUI = {

    /****************************
        Common UI
    *****************************/

    header : function(obj){
        var $el = null;
        var $title = null;
        var titleWidth = 0;
        var keyLine = 0;
        var UsableWidth = 0;

        function init(obj){
            $el = $(obj);
            $title = $el.find('h1');
            titleWidth = $title.outerWidth();

            keyLine = $el.is('.app-header') ? 32 : 23; //좌우 키라인 + 타이틀과의 여백10
            btnLength = $el.is('.app-header') ? $el.find('>button:not(.app-header__button--size)').length : $el.parent().find('>button').length;
            UsableWidth = (btnLength <= 2) ? window.innerWidth - (80 + keyLine) : window.innerWidth - (160 + keyLine);

            // if(window.innerWidth < 360){
            //     $title.css({
            //         'width': UsableWidth + 20 + 'px',
            //         'font-size' : '15px',
            //         'white-space' : 'normal',
            //         'word-break' : 'break-all',
            //         'padding-left' : '0',
            //         'padding-right' : '0',
            //         'padding-top' : '7px'
            //     })
            // }else{
            //     for(var i=0; i<15; i++){
            //         if(UsableWidth < titleWidth){
            //             $title.css('font-size', 18 - i + 'px');
            //             titleWidth = $title.outerWidth();
            //         }else{
            //             break;
            //         }
            //     }
            // }
            action();
        }

        function event(){
            $(window).on('scroll', function(){
                action();
            });
        }

        function action(){
            if(!$('body').find('.fixed-header').length){
                if($(window).scrollTop() > 0){
                    $el.addClass('is-active');
                }else{
                    $el.removeClass('is-active');
                }
            }
        }

        init(obj);
        event();
    },
    
    // resizeDelay : function(id, time, callback){

    //     if($('body').is('.ios')){ return }

    //     if(typeof time === "undefined")
    //         time = 500;

    //     if(typeof window['resizeDelay'] === "undefined")
    //         window['resizeDelay'] = [];

    //     if(typeof window['resizeDelay'][id] !== "undefined")
    //         clearTimeout(window['resizeDelay'][id]);

    //     window['resizeDelay'][id] = setTimeout(callback, time);
    // },

    footer : function(obj){
        function hasBtn (obj){
            $el = $(obj);
            if($el.length == 0) {
                $('.app-main').addClass('footer-none');
            } else {
                $('.app-main').removeClass('footer-none');
                // if($el.find('[class^=btn-group]').length > 1){
                //     $('.app-main').addClass('footer-sub-btn');
                // } else {
                //     $('.app-main').removeClass('footer-sub-btn');
                // }
            }
        }
        hasBtn(obj);
    },
    keypad : function(target, setTime){
        $('.input__element').removeClass('key');
        target.addClass('key');
        if($('body').is('.ios') || $('body').is('.isResize')){ return }
        
        if(typeof setTime === "undefined") { setTime = 300 } 

        var windowHeight = window.innerHeight;
        
        $(window).on('resize', function(){
            $('body').addClass('isResize');
            setTimeout(function(){
                if(windowHeight == window.innerHeight){
                    $('.input__element').each(function(i,e){
                        if($(e).is('.key')){
                            $(e).removeClass('key').trigger('blur');
                        }
                    })
                    $('body').removeClass('isResize');
                    $(window).off('resize');
                }    
            }, setTime)
        })
    },
    
    inputField : function(obj){
        var $el = null;
        var $input = null;
        var $label = null;
        var $clear = null;
        var $search = null;
        var $native = null;
        var windowHeight = 0;

        function init(obj){
            $el = $(obj);
            $input = $el.find('.input__element');
            $label = $el.find('label[aria-hidden]');
            $clear = $el.find('.input__remove-button');
            $search = $el.find('.search-button');
            $native = $('.native-inner[role=button]');

            windowHeight = window.innerHeight;

            for(var i=0; i<$input.length; i++){
                var $btn = $input.eq(i).closest($el).find($clear);
                if($input.eq(i).val() == '' || $input.eq(i).prop('disabled') == true || $input.eq(i).prop('readonly') == true){
                    $btn.hide();
                }else if($input.eq(i).val() != "" && $input.eq(i).closest($el).is('.input--on')) {
                    $btn.hide();
                }else{
                    // $btn.show();
                    $input.eq(i).closest($el).addClass('input--on');
                }
                if ($input.eq(i).prop('readonly') == true) {
                    if(!$input.eq(i).is('.input-date') && !$input.eq(i).closest('.input').is('.input--hybrid')){
                        $input.eq(i).closest(obj).addClass('readonly')
                    }

                }
            }
            title();
        };

        function event(){
            input();
            util();
            stopEvent();
        };

        function input(){
            $el.on({
                'input' : function(){
                    var $btn = $(this).closest($el).find($clear);
                    if($(this).val() == ""){
                        $btn.hide();
                        if(!$(this).hasClass('input--search')){
                            return;
                        } else {
                            $(this).closest('.search-area').find('.search-layer').removeClass('open');
                        }
                    }else{
                        $btn.show();
                        $(this).closest($el).addClass('input--on input--focus');
                        if(!$(this).hasClass('input--search')){
                            return;
                        } else {
                            $(this).closest('.search-area').find('.search-layer').addClass('open');
                        }
                    }
                    if($(this).is('.masking')){
                        if($(this).val() == ''){
                            $(this).removeClass('active');
                        }else{
                            $(this).addClass('active');
                        }
                    }
                    
                },
                'blur' : function(e){
                    var $target = $(e.target)
                    hanaUI.native.bottomShow();

                    // 인풋 내용이 있을때 키보드 완료(input blur 상태) 클릭 시 다음 항목으로 이동 
                    // if ($(this).val() !== '') { 
                    //     $('.btn__form-next').trigger('click');
                    // }

                    if($(this).siblings('input').length || $(this).parent('.native-inner').siblings('.native-inner').length){
                        if($(this).val() == ''){
                            var that = $(this).closest($el).find($input);
                            var emptied = that.filter(function(){ return $(this).val() == '' }).length;

                            if(emptied == that.length){
                                $(this).closest($el).removeClass('input--on');
                            }
                        }
                    }else{
                        if($(this).val() == ''){
                            if($(this).hasClass('input-date')){
                                $(this).closest($el).addClass('input--on');
                            } else {
                                $(this).closest($el).removeClass('input--on');
                            }
                        }
                    }
                    
                    if($(this).prop('readonly') == false){
                        setTimeout(function(){
                            if($('.input--focus:not([data-native=focus])').length == 0){
                                hanaUI.native.bottomShow();
                            }
                        },200);
                    }

                    if($('body').is('.ios')){
                        if($target.closest('.modal--slide').length){
                            setTimeout(function(){
                                if(!$target.closest('.modal--slide').find('.input--focus').length){
                                    window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
                                }
                            }, 1)
                        }else{
                            setTimeout(function(){
                                if(!$('body').find('.input--focus').length){
                                    window.scrollTo(document.body.scrollLeft, window.scrollY + 1);
                                }
                            }, 1)
                        }
                    }
                    
                    setTimeout(function(){
                        $target.closest($el).find('.input__remove-button').hide();
                        $target.closest($el).removeClass('input--focus');
                    },300)

                    $('.search-layer').removeClass('open');
                },
                'focus' : function(e) { 
                    var $target = $(e.target)
                    if($(this).prop('readonly') == true){
                        return
                    }else{
                        $(this).closest($el).addClass('input--focus');
                        if($(this).val() !== ''){
                            $target.closest($el).find('.input__remove-button').show();
                        }
                        hanaUI.native.bottomHide();
                        hanaUI.keypad($target, 300);
                    }
                },
                'keypress': function (e) { 
                    // 인풋 내용이 있을때 키보드 엔터 클릭 시 다음 항목으로 이동 
                    if (e.keyCode == 13 && $(this).val() !== '') { 
                        $('.btn__form-next').trigger('click');
                    }
                }
            }, '.input__element');
            $label.on('click', function(){
                $(this).closest($el).focus();
            });
            $native.on('click', function(){
                $(this).closest('.input').attr('data-native', 'focus');
            })
        };
        
        function util(){
            $clear.on({
                'touchstart' : function(){
                    $(this).closest($el).addClass('input--focus');
                },
                'focus' : function(){
                    $(this).closest($el).addClass('input--focus');
                },
                'blur' : function(){
                    if($(this).closest($el).is('.input--focus')){
                        $(this).closest($el).removeClass('input--focus');
                    }
                },
                'click' : function(e){
                    $(this).closest($el).find('.input__element').val('').closest($el).removeClass('input--on');
                    // $(this).closest($el).find('.input__element').val('');
                    $(this).siblings('.input__element').focus();
                    // $(this).closest($el).removeClass('input--focus');
                    $(this).hide();
                    //e.stopPropagation();
                    if($(this).hasClass('input--search')){
                        return; 
                    } else {
                        $(this).closest('.search-area').find('.search-layer').removeClass('open');

                    }
                }
            });
            $search.on({
                'touchstart' : function(){
                    $(this).closest($el).addClass('input--focus');
                },
                'focus' : function(){
                    $(this).closest($el).addClass('input--focus');
                },
                'blur' : function(){
                    if($(this).closest($el).is('.input--focus')){
                        $(this).closest($el).removeClass('input--focus');
                    }
                }
            });
        };

        function title(){
            $input.each(function(i,e){
                var txt = $(e).closest($el).find('label').text();
                if(!$(e).is('.input-date')){
                    if($(e).parent().siblings('.input__optional').length < 1 && $(e).siblings('.input__optional').length < 1){
                        if($(e).attr('title') == ''){
                            $(e).attr('title', txt);
                        }
                    }
                }
            });
        };

        function stopEvent(){
            $('body').on('click', '.input__element', function(e){
                if($(this).parent().is('.native-inner')){
                    if($(this).prop('readonly') == true){
                        e.preventDefault();
                        e.stopPropagation();
                    }// else{
                    //     if($(this).parent().is('.apply-readonly')){
                    //         $(this).parent().removeAttr('role').removeClass('native-inner').addClass('input__inner');
                    //     }
                    // }
                }
            })
        }

        // function wepviewCheck(target){
        //     $(window).on('resize', function(){
        //         hanaUI.resizeDelay(target, 200, function(){
        //             if(windowHeight > window.innerHeight){
        //                 $('body').addClass('is-keypad');
        //             }else if(windowHeight == window.innerHeight){
        //                 if($('body').is('.is-keypad')){
        //                     hanaUI.native.bottomHide();
        //                 }
        //             }
        //         })
        //     })
        // }

        init(obj);
        event();
    },

    applyReadonly : function(obj){
        var $el = null;

        function init(obj){
            $el = $(obj);
        };

        function event(){
            $el.removeAttr('role').removeClass('native-inner').addClass('input__inner');
        };

        init(obj);
        event();
    },

    textArea : function(obj){
        var $el = null;
        var $textarea = null;
        var $label = null;

        function init(obj){
            $el = $(obj);
            $textarea = 'textarea';
            $label = '.txtareawrap__label';

            title();
        };

        function event(){
            input();
        };

        function input(){
            $el.on({
                'focus' : function(e) {
                    $target = $(e.target);
                    
                    if($(this).prop('readonly') == true){
                        return
                    }else{
                        $(this).closest($el).addClass('txtareawrap--on');
                        hanaUI.native.bottomUnfixed();
                        hanaUI.keypad($target, 300);
                    }
                },
                'blur' : function(){
                    if($(this).val() == ''){
                        $(this).closest($el).removeClass('txtareawrap--on');
                    }
                    hanaUI.native.bottomFixed();
                }
            }, $textarea);
            $el.on('click', $label, function(){
                $(this).closest($el).find($textarea).focus();
            });
        };

        function title() {
            $el.each(function(i,e){
                if($(e).find($label).length){
                    var txt = $(e).find($label).text();
                    $(e).find($textarea).attr('title', txt);
                }
            });
        };

        init(obj);
        event();
    },

    placeholder : function(obj){
        var $el = null;
        var $placeholder = null;

        function init(obj){
            $el = $(obj);
            $placeholder = '[data-element=placeholder__text]';
        };

        function event(){
            $el.on({
                'focus': function(){
                    $el.next($placeholder).hide();
                },
                'blur': function(){
                    if($el.val() == ''){
                        $el.next($placeholder).show();
                    }
                }
            })
            $($placeholder).on('click', function(){
                $(this).prev($el).trigger('focus');
            })
        };



        init(obj);
        event();
    },

    formAnimateEvent: function () {  // 폼 포커스 관련 이벤트
        
        // 첫번째 active
        // var animateFormFirst = animateForm.eq(0);
        // animateFormFirst.closest('.form-area').addClass('active');
        // animateFormFirst.focus();

        // 클릭 포커스 이벤트
        $('body').on('focus click', '.form__move', function () {
            hanaUI.formNextMoveEvent(this);
        })
    },
    formNextMoveEvent: function (obj) { 
        var animateForm = $('.cont-form--animate').find('.form__move');
        var inpIdx = animateForm.index(obj);
        var inpIdxNum = inpIdx + 1;
        // $('.label__tit').not($('.label__tit[data-pagetit='+ inpIdxNum + ']').addClass('tit--active')).removeClass('tit--active');
        $('.btn__form-next').data('inputindex', inpIdxNum);
    },
    formNextBtnEvent: function (inputObj) { // 계속 버튼 이벤트
        var inputThis = $(inputObj);
        var inpActiveNum = inputThis.data('inputindex');
        var nextNum = inpActiveNum + 1;
        // var nextInput = $('#' + 'inputMove' + nextNum);
        var nextInput = $('[data-inputmove='+ nextNum + ']');
        $('.label__tit').not($('.label__tit[data-pagetit='+ nextNum + ']').addClass('tit--active')).removeClass('tit--active');
        // 마지막 폼에서 버튼교체
        var formLeng = $('.cont-form--animate').find('.form-area').length;
        var formActiveLeng = $('.cont-form--animate').find('.form-area.form--active').length;
        if (formLeng <= formActiveLeng) {
            $('.btn-next-wrap').hide();
            $('.btn-last-wrap').show();
        } else { 
            $('.btn-last-wrap').hide();
            $('.btn-next-wrap').show();
            nextInput.closest('.form-area').addClass('form--active');
            nextInput.focus();
            nextInput.trigger('click');
        }
    },
    formFocusEvent: function (num) {  // 폼 포커스 직접 지정용
        var nextNum = num;
        var nextInput = $('[data-inputmove='+ nextNum + ']');
        
        $('.label__tit').not($('.label__tit[data-pagetit='+ nextNum + ']').addClass('tit--active')).removeClass('tit--active');
        $('.cont-form--animate .form-area:lt(' + num + ')').addClass('form--active');
        $('.btn__form-next').data('inputindex', nextNum);
        nextInput.closest('.form-area').addClass('form--active');
        nextInput.focus();
    },
    
    // 툴팁
    tooltip : function(){

        var $open = null;
        var $close = null;

        function init(){
            $open = '[data-tooltip-button=open]';
            $close = '[data-tooltip-button=close]';

            $($open).each(function(i,e){
                if($(e).closest('.product-list__sub-item').find('.product-list__name').length){
                    $(e).closest('.product-list__sub-item').find('.product-list__name').addClass('with-tooltip');
                }
            })
        }

        function event(){
            $('body').on('touchstart', function(e){
                if($('[data-tooltip-panel=true]').length > 0){
                    if($(e.target).closest('[data-tooltip]').length < 1 ) {
                        var $el = $('[data-tooltip-panel=true]').closest('[data-tooltip]');
                        panelInit();
                        accessibilityOff($el);
                    }
                }
            });
            open();
            close();
        }

        function open(){
            $('body').on('click', $open, function(e){
                var $el = $(this).closest('[data-tooltip]');
                var $panel = $el.find('[data-tooltip-panel]');
                var type = $el.data('tooltip');
           


                if($panel.attr('data-tooltip-panel') == 'false'){

                    if($('[data-tooltip-panel=true]').length > 0){
                        var $that = $('[data-tooltip-panel=true]').closest('[data-tooltip]');
                        panelInit();
                        accessibilityOff($that);
                    }

                    panelInit();

                    switch (type){
                        case 'list' :
                            if($(this).attr('aria-label')){
                                $(this).attr('aria-label', $(this).attr('aria-label').replace('열기', '닫기') );
                            }else if($(this).attr('title')){
                                $(this).attr('title', $(this).attr('title').replace('열기', '닫기') );
                            }
                        break;
                        case 'paragraph' :
                            panelPosition($el);
                            if($(this).attr('aria-label')){
                                $(this).attr('aria-label', $(this).attr('aria-label').replace('열기', '닫기') );
                            }else if($(this).attr('title')){
                                $(this).attr('title', $(this).attr('title').replace('열기', '닫기') );
                            }
                        break;
                    }

                    accessibilityOn($el);
                    $panel.attr('data-tooltip-panel', 'true').show({
                        duration : 0,
                        complete : function(){
                            setTimeout(function(){
                                focusIn($el);
                            },100)
                        }
                    })

                }else{
                    // $el.find($close).trigger('click');
                }
                e.preventDefault();
                e.stopPropagation();
            });
        }

        function close(){
            $('body').on('click', $close, function(){
                var $el = $(this).closest('[data-tooltip]');
                panelInit();
                accessibilityOff($el);
                focusOut($el);
            });
        }
        
        function panelPosition($el){
            var $panel = $el.find('[data-tooltip-panel]');
            // var objLeft = $el.find($open).offset().left;
            // var screenWidth = window.innerWidth;
            // var keyline = 24;

            
            var toolWrapCon = $el.closest('.tooltip-wrap').parent().width(); 
            var toolWrapConHalf = toolWrapCon / 2 ;

            var tooltipTitle = $el.closest('.tooltip-wrap').find('.tooltip-title').position().left;    
            var tooltipCon = $el.closest('.tooltip-wrap').find('.tooltip-con').width();
            var docWidth = $(document).width();
            var btnOpenPos = $el.closest('.tooltip-wrap').find('.btn-open').position().left;
            var btnOpen = $el.closest('.tooltip-wrap').find('.btn-open').outerWidth();
            var btnObjRight = docWidth - btnOpenPos - btnOpen;
            var objTop = $el.find($open).offset().top;
            var documentHeight = $(document).height();
            var bottomSpace = 200;

            if(objTop > (documentHeight - bottomSpace)){
                $panel.css({
                    top : 'auto',
                    bottom : '23px'
                });
            }
            $panel.css({
                left : tooltipTitle + 'px'
            });

            if (tooltipTitle == 0){
                $panel.css({
                    left : tooltipTitle + 'px'
                });
            } else if (tooltipTitle > toolWrapConHalf){
                $panel.css({
                    left : 'auto',
                    right : 0 + 'px'
                });
            }
            
        }
        
        function panelInit(){
            var $panel = $('[data-tooltip-panel=true]');
            var $el = $panel.closest('[data-tooltip]');
            var type = $el.data('tooltip');

            $panel.attr('data-tooltip-panel', 'false').hide();

            switch (type){
                case 'list' :
                    $panel.find('.tooltip__item:first a').removeAttr('tabindex');
                    if($el.find($open).attr('aria-label')){
                        $el.find($open).attr('aria-label', $el.find($open).attr('aria-label').replace('닫기', '열기') );
                    }else if($el.find($open).attr('title')){
                        $el.find($open).attr('title', $el.find($open).attr('title').replace('닫기', '열기') );
                    }
                break;
                case 'paragraph' :
                    $panel.find('[data-tooltip="focus"]').removeAttr('tabindex');
                    if($el.find($open).attr('aria-label')){
                        $el.find($open).attr('aria-label', $el.find($open).attr('aria-label').replace('닫기', '열기') );
                    }else if($el.find($open).attr('title')){
                        $el.find($open).attr('title', $el.find($open).attr('title').replace('닫기', '열기') );
                    }
                break;
            }
        }

        function focusIn($el){
            var type = ($el).data('tooltip');

            switch (type){
                case 'list' :
                        $el.find('.tooltip__item:first a').attr('tabindex', '0').focus();
                    break;
                case 'paragraph' :
                        $el.find('[data-tooltip="focus"]:first').attr('tabindex', '0').focus();
                    break;
            }
        }

        function focusOut($el){
            $el.find($open).focus();
        }

        function accessibilityOn($el){
            var $panel = $el.find('[data-tooltip-panel]');
            var $parent = $panel.parent();
            var hidden = null;

            $('body').attr('data-node', 'end');
            $panel.siblings().attr('aria-hidden', 'true');

            hidden = setInterval(function(){
                if($parent.attr('data-node') == 'end'){
                    clearInterval(hidden);
                }else{
                    $parent.siblings('[aria-hidden=true]').each(function(i,e){
                        $(e).attr('data-aria-hidden', 'has');
                    });
                    $parent.siblings().attr('aria-hidden', 'true');
                    $parent = $parent.parent();
                }
            }, 1);
        }

        function accessibilityOff($el){
            var $panel = $el.find('[data-tooltip-panel]');
            var $parent = $panel.parent();
            var hidden = null;

            $panel.siblings().removeAttr('aria-hidden');
    
            hidden = setInterval(function(){
                if($parent.attr('data-node') == 'end'){
                    clearInterval(hidden);
                }else{
                    $parent.siblings('[aria-hidden=true]').each(function(i,e){
                        if($(e).is('[data-aria-hidden=has]')){
                            $(e).removeAttr('data-aria-hidden');
                        }else{
                            $(e).removeAttr('aria-hidden');
                        }
                    });
                    $parent = $parent.parent();
                }
            }, 1);

            $('body').removeAttr('data-node');
        }

        init();
        event();
    },

    sticky : function(obj){

        var $obj = null;
        var $wrap = null;

        var $open = null;
        var $panel = null;
        var $select = null;
        var $close = null;

        var objHeight = 0;
        var objTop = 0;
        var headerHeight = 0;
        var winTop = 0;

        var flag = false;

        function init(obj){
            $obj = $(obj);
            objHeight = $obj.outerHeight();

            if($obj.find('.search-list__keyword-box').length){
                $open = $obj.find('.search-list__open-button');
                $panel = $obj.find('.search-list__keyword-box');
                $select = $obj.find('.search-list__keyword-select');
                $close = $obj.find('.search-list__remove-button');
                flag = true;
            }

            headerHeight = $('.app-header, .modal-full .modal__header').outerHeight();

            if(!$obj.parent('[data-sticky=wrap]').length){
                $(obj).wrap('<div data-sticky="wrap" style="height:' + objHeight + 'px" />');
            }else{
                $wrap = $obj.parent('[data-sticky=wrap]');
                $wrap.css('height', objHeight + 'px')    
            }

            $wrap = $obj.parent('[data-sticky=wrap]');

            $obj.css({
                'position' : '',
                'left' : '',
                'top' : '',
                'background-color' : '',
                'z-index' : ''
            })
            $wrap.removeClass('is-active');
            
            if($obj.length){
                objTop = $obj.offset().top;
            }
            winTop = $(window).scrollTop();

            fixed(winTop);
        }

        function event(){
            $(window).off('scroll').on('scroll', function(){
                winTop = $(window).scrollTop();

                fixed(winTop);
            });

            if(flag){
                panelOpen();
                panelClose();
            }
        }

        function fixed(winTop){
            if(winTop > (objTop - headerHeight)){
                $obj.css({
                    'position' : 'fixed',
                    'left' : '0',
                    'top' : headerHeight + 'px',
                    'width' : '100%',
                    'background-color' : '#f9f9fb',
                    'z-index' : '110'
                })
                $wrap.addClass('is-active');
            }else{
                $obj.css({
                    'position' : '',
                    'left' : '',
                    'top' : '',
                    'background-color' : '',
                    'z-index' : ''
                })
                $wrap.removeClass('is-active');
            }
        }

        function panelOpen(){
            $open.on('click', function(){
                $open.attr('aria-expanded', 'true').hide();
                $panel.show();
                wrapHeight();
                $select.focus();
            });
        }

        function panelClose(){
            $close.on('click', function(){
                $panel.hide();
                wrapHeight();
                $open.show().attr('aria-expanded', 'false').focus();
            });
        }

        function wrapHeight(){
            objHeight = $obj.outerHeight();
            $wrap.css('height', objHeight + 'px');
        }

        init(obj);
        event();
    },

    native : {

        bottomUnfixed : function(){

            var $obj = null;

            function init(){
                $obj = $('.app-footer, .button-fixed');
            }

            function event(){
                $obj.css('position', 'relative').addClass('unfixed');
            }

            init();
            event();
        },

        bottomFixed : function(){

            var $obj = null;

            function init(){
                $obj = $('.app-footer, .button-fixed');
            }

            function event(){
                $obj.css('position', 'fixed').removeClass('unfixed');;
            }

            init();
            event();
        },

        bottomHide : function(){

            if($('body').data('accessibility')){
                return
            }

            var $obj = null;

            function init(){
                $obj = $('.app-footer, .button-fixed, .btn-floating');
            }

            function event(){
                $obj.stop(true).hide();
            }

            init();
            event();
        },

        bottomShow : function(){

            if($('body').data('accessibility')){
                return
            }

            var $obj = null;

            function init(){
                $obj = $('.app-footer, .button-fixed, .btn-floating');
            }

            function event(){
                $obj.stop().fadeIn('50');
            }

            init();
            event();
        },

        bottomInit : function(){
            if(typeof HANA_READER_YN !== 'undefined'){
                if(HANA_READER_YN == 'Y'){
                    $('body').attr('data-accessibility', 'true');
                    hanaUI.native.bottomUnfixed();
                    hanaUI.native.errorText();
                }
            }
        },

        errorText : function(){
            $('body').on('click', '.button-wrap .button:last', function(){
                $('.input__error').each(function(i,e){
                    $(e).text($(e).text());
                })
                
            })
        }
    },

    // Security code focus
    code : function(){
        var $inputCode = '.input-code-box .input-code';
        $('body').on('focus', $inputCode, function(){
            $(this).parent().addClass('focus');    
            hanaUI.native.bottomHide();      
        });

        $('body').on('blur', $inputCode, function(){
            var inputVal = $(this).val();
            hanaUI.native.bottomShow();
            if (!inputVal) {
                $(this).parent().removeClass('focus');
            }
        });
    },

    selectBtnActive :  function(){
        var $popOpenBtn = '[data-element=modal__open]';
        var $popCloseBtn = '[data-element=modal__close]';
        $('body').on('click', $popOpenBtn, function(){
            var popActiveOpenBtn = $(this);
            if(popActiveOpenBtn.closest('.select-wrap').hasClass('select--on')){
                return;
            } else {
                popActiveOpenBtn.closest('.select-wrap').addClass('select--on');
            }

            if(popActiveOpenBtn.closest('.search-btn-wrap').hasClass('search--on')){
                return;
            } else {
                popActiveOpenBtn.closest('.search-btn-wrap').addClass('search--on');
            }
        });   

        $('body').on('click', $popCloseBtn, function(){
            if($('.select-wrap').hasClass('select--on')){
                $('.select-wrap.select--on').addClass('select--active');
                $('.select-wrap').removeClass('select--on');
            } else {
                $('.select-wrap.select--on').removeClass('select--active');
            }

            if($('.search-btn-wrap').hasClass('search--on')){
                $('.search-btn-wrap.search--on').addClass('search--active');
                $('.search-btn-wrap').removeClass('search--on');
            } else {
                $('.search-btn-wrap.search--on').removeClass('search--active');
            }
            
        });

    },
    searchBtnActive :  function(){
        var $searchOpenBtn = 'button-search__btn';
        var $searchCloseBtn = '[data-element=modal__close]';
        $('body').on('click', $searchOpenBtn, function(){
            var popActiveOpenBtn = $(this);
            if(popActiveOpenBtn.closest('.search-btn-wrap').hasClass('search--on')){
                return;
            } else {
                popActiveOpenBtn.closest('.search-btn-wrap').addClass('search--on');
            }
        });   

        $('body').on('click', $searchCloseBtn, function(){
            if($('.search-btn-wrap').hasClass('search--on')){
                $('.search-btn-wrap.search--on').addClass('search--active');
                $('.search-btn-wrap').removeClass('search--on');
            } else {
                $('.search-btn-wrap.search--on').removeClass('search--active');
            }
            
        });

    },

    searchListActive : function(){
        var $searchList = '.search-list--active > li';
        $('body').on('click', $searchList, function(){
            $('.search-list--active > li').not($(this).addClass('active')).removeClass('active');
        });
    },

    searchLayerInit : function(obj){
        var searchThis = $(obj);
        searchThis.closest('.search-area').find('.search-layer').removeClass('open');
        searchThis.closest('.input').addClass('input--on');
        searchThis.closest('.input').removeClass('input--focus');
    },

    postSearch : function(){

        // ATM 안내 우편번호 검색 열고 닫기 이벤트
        var $postSearchBtn = '.post-search--btn';
        $('body').on('click', $postSearchBtn, function(){
            $($postSearchBtn).removeClass('on');
            $(this).addClass('on');
            if(!$(this).hasClass('on')){
                $(this).closest('.post-search-wrap').removeClass('open');
            } else {
                $(this).closest('.post-search-wrap').addClass('open');
            }
        });
        // 검색 영역을 제외한 나머지 클릭시 닫기
        $('body').on('click touchstart', function(e){
            var targetPoint = $(e.target);
            var targetLyBtn = targetPoint.hasClass('post-search--btn');
            var targetArea = targetPoint.hasClass('post-search--cont');
            var targetBtn = targetPoint.hasClass('post-search--submit');
            var targetRemove = targetPoint.hasClass('input__remove-button');
            var targetPopup = targetPoint.hasClass('branch-layer-wrap');

            if(!targetLyBtn && !targetArea && !targetBtn && !targetRemove && !targetPopup){
                $('.post-search-wrap').removeClass('open');
            } else {
                return;
            }
        });

        // 검색 인풋 포커스 일때 하단 레이어 팝업 처리
        $('body').on('focus', '.post-search--cont', function(){
            if($('.branch-layer-wrap').hasClass('is-open')){
                $('.branch-layer-wrap').find('.modal__contents').css('height','0');
            }
        });
        $('body').on('focusout', '.post-search--cont', function(){
            if($('.branch-layer-wrap').hasClass('is-open')){
                $('.branch-layer-wrap').find('.modal__contents').css('height','');
            }
        });
        // 검색 버튼 클릭 시 팝업 노출
        $('body').on('click', '.post-search--submit', function(){
            $('[data-element=modal__open]').trigger('click');
        });
    },

    cardActive : function(){
        var $card = '.card-wrap--active [class^="card-type"]';
        $('body').on('mouseover', $card, function(){
            $('.card-wrap [class^="card-type"]').not($(this).addClass('active')).removeClass('active');
        });
        $('body').on('mouseout', $card, function(){
            $('.card-wrap [class^="card-type"]').removeClass('active');
        });
    },

    inputAuto : function(obj){ 
        var $el = null;

        function init(obj){
            $el = $(obj);	//[data-element=input-auto]
            if($el.val() != ''){
            	setTimeout(function(){
	            	$el.width($el.prop('scrollWidth'));
            	},100);
            }
        };

        function event(){
            input();
        };

        function input(){
            $el.off('input.ui-event blur.ui-event', $el).on({
                'input.ui-event' : function() {
                	$(this).css('width', 0).css('width', $(this).prop('scrollWidth'));                  
                },
                'blur.ui-event' : function() {

                    if($(this).val()==''){
                        
                        $(this).val('');
                        $(this).css('width','2.3rem');

                    } else {
                        var currencyVal = $(this).val();

                        $('.currency-wrap').append('<span class="currency-text"></span>');
                        $('.currency-text').text(currencyVal);

                        var currencyWidth = $('.currency-text').width();
                        $(this).css('width', currencyWidth + 'px');
                        $('.currency-text').remove();                   
                    }
                }
            }, $el);
            $('.currency-wrap .input__remove-button').on('click', function(){
                $(this).parents('.price-wrap').removeClass('error');
                $(this).siblings('.input-amount-alba').css('width','2.3rem');
            });
        };

        init(obj);
        event();
    },

    modalDateActive : function(){
        var $mDate = '.date-list .btn-date';
        $('body').on('click', $mDate, function(){
            $($mDate).not($(this).addClass('active')).removeClass('active');
        });
    },

    allCheck : function(){
        var chkAll = $('.chk-all');
        for(var i=0; i < chkAll.length; i++){
            chkAll.on('click', function(){
                $(this).closest('.chk-all-area').find('.chk').prop('checked', this.checked);
                // $(this).parents('.top').siblings('.con').slideDown(); 
                // $(this).parents('.chk-all-area').addClass('on');
            });
        }
        
        $('body').on('click', '.chk-all-area .chk', function(){
            var chk = $(this).closest('.chk-all-area').find('.chk');
            var chkLength = chk.length;
            var checkLength = chk.filter(':checked').length;
            if (chkLength == checkLength){
                $(this).parents('.chk-all-area').find('.chk-all').prop('checked', true);
            } else {
                $(this).parents('.chk-all-area').find('.chk-all').prop('checked', false);
            }
        });
    },
    
    allCheckAccordian : function(){
        $('.accordion-check-list .chk-all-area.on').find('.con').show();
        $('body').on('click', '.accordion-check-list .top .icon-arrow', function(){
            var accordionBtn = $(this);
            if (accordionBtn.parents('.chk-all-area').hasClass('on')){ 
                accordionBtn.parent().siblings('.con').slideUp();   
                accordionBtn.parents('.chk-all-area').removeClass('on');
            } else {
                accordionBtn.parent().siblings('.con').slideDown(); 
                accordionBtn.parents('.chk-all-area').addClass('on');    
            }

        });
    },

    passwordShow : function(){
        $('body').on('click', '.password-show .btn-show', function(){
            var passwordShowBtn = $(this);
            if (passwordShowBtn.hasClass('is-active') ==  true) {
                passwordShowBtn.removeClass('is-active');
                passwordShowBtn.siblings('input').attr('type','password');
            } else {                
                passwordShowBtn.addClass('is-active');
                passwordShowBtn.siblings('input').attr('type','text');
            }
        });
    },

    modalBranch : function(){
        if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
            var topPosition = $('window').height() - 44;
            var branchPopup = $('.branch-layer-wrap')
            if(branchPopup.hasClass('is-open')){
                branchPopup.css('position', 'fixed').css('top', '');
            } else {
                branchPopup.css('position', 'fixed').css('top', topPosition);
            }
        }
    },

    scrollEvent : function(obj){
        // 스크롤 방향 체크 (검색 플로팅 관련 js)
        var windowH = $(window).outerHeight() - 56 ;
        var containerH = $('.container').outerHeight();
        
        if(windowH < containerH){
            $(window).scroll(function(){
                if($(this).scrollTop() > 0){
                    nowScrollTop = $(this).scrollTop();
                    
                    $('body').addClass('scroll--down');
                    if(wheelDelta() === 'down'){
                        $('body').removeClass('scroll--up');
                        $('body').addClass('scroll--down');
                    }
                    if(wheelDelta() === 'up'){
                        $('body').removeClass('scroll--down');
                        $('body').addClass('scroll--up');
                    }
                }
                if($(this).scrollTop() === 0) {
                    $('body').addClass('scroll--top');
                } else {
                    $('body').removeClass('scroll--top');
                } 
                // - 초기화
                prevScrollTop = nowScrollTop;
        
                // 스크롤시 차트 active 처리
                // var ThisScroll = $(this).scrollTop();
                // var haederH = $('.app-header').outerHeight();
                // var chartOffset = $('.parallax--point').offset().top;
                // var parallaxOffset = chartOffset - haederH;
                // if($('.parallax--point').length = 0){
                //     return;
                // } else {
                //     if(ThisScroll >= parallaxOffset) {
                //         $('.chart-wrap').addClass('active');
                //     }
                // }
            });
            // - 스크롤 움직임 감지
            $.fn.scrollStopped = function(callback){
                var that = this, $this = $(this);
                $this.scroll(function(ev){
                    clearTimeout($this.data('scrollTimeout'));
                    $this.data('scrollTimeout', setTimeout(callback.bind(that), 250,ev));
                });
            };
            nowScrollPosition(); // 현재스크롤 위치 기억

        }
    },

};

// 스크롤 방향 체크
// - 초기값
var prevScrollTop = 0;
var nowScrollTop = 0;
// - 재스크롤 시
function wheelDelta(){
    return prevScrollTop - nowScrollTop > 0 ? 'up' : 'down';
}
// 현재 스크롤 위치 기억
function nowScrollPosition(){
    window.oriScroll = $(window).scrollTop();
    return false;
}
// 스크롤 위치 되돌림
function nowScrollReturn(){
    $(window).scrollTop(window.oriScroll);
    return false;
}

// 토글 레이어
function toggleLayer(obj){
    var toggleBtn = $(obj);
    toggleBtn.toggleClass('tg--on');

    if(toggleBtn.hasClass('tg--on')){
        $('.tg--layer').removeClass('open');
        toggleBtn.closest('.tg--area').find('.tg--layer').addClass('open');
        toggleBtn.attr('aria-label', toggleBtn.attr('aria-label').replace('열기', '닫기') );
    } else {
        toggleBtn.closest('.tg--area').find('.tg--layer').removeClass('open');
        toggleBtn.attr('aria-label', toggleBtn.attr('aria-label').replace('닫기', '열기') );
    }
}
// 토글 레이어 닫기
function toggleLayerClose(){
    $('.tg--btn').removeClass('tg--on');
    $('.tg--layer').removeClass('open');
    $('.tg--btn').attr('aria-label', $('.tg--btn').attr('aria-label').replace('닫기', '열기') );
}

// 지점 안내 탭 클릭 시 레이어 팝업 비노출
function branchTab(){
    $('body').find('.branch-layer-wrap').css('display','none');
    $('[data-element=modal__close]').trigger('click');  
}
// ATM 안내 탭 클릭 시 레이어 팝업 노출
function atmInfoTab(){
    $('body').find('.branch-layer-wrap').css('display','block');
    $('[data-element=modal__open]').trigger('click');
}

// 공통 슬라이드 js
function slickSlideEvent(obj){
    var slideObj = $(obj);
    // 상품 배너 슬라이드
    if(obj === '.card-slide-wrap') {
        slideObj.slick({
            autoplay: true,
            autoplaySpeed: 2000,
            pauseOnHover: true,
            infinite: true,
        });
        // auto play
        slideObj.slick('slickPlay');
    }
    // 인트로 슬라이드
    if(obj === '.intro-slide-wrap') {
        slideObj.slick({
            fade: true,
            autoplay: false,
            autoplaySpeed: 2800,
            infinite: true,
        });
        // // auto play
        // slideObj.slick('slickPlay');

        // // 마지막 슬라이드에서 자동재생 정지
        // slideObj.on('afterChange', function(event, slick, currentSlide, nextSlide){
        //     var lastIndex = slick.slideCount - 1; // 마지막 슬라이드 인덱스
        //     if(currentSlide === lastIndex){
        //         slideObj.slick('slickPause');
        //     } else {
        //         slideObj.slick('slickPlay');
        //     }
        // });
    }
}

// 모달 오픈 js
function modalOpen(id){
    var modalOpenId = $('#' + id);
    
    if(modalOpenId.hasClass('modal--slide')){
        modalOpenId.addClass('is-open');
        $('body').addClass('modal-open');
        modalOpenId.css({
            'bottom' : - modalOpenId.outerHeight(true) + 'px'
        })
        .animate({
            'bottom' : 0
        }, 0, function(){
            modalOpenId.attr({
                'aria-hidden': false,
                'z-index': 10
            })
            .attr('tabindex', '0')
            .focus();
        })
        modalOpenId.find('.modal__container').css({
            'z-index': 10
        }).animate({
            'bottom' : 0
        }, 300)
        //슬라이드팝업내 탭이 있는 경우
        if($('.modal--slide').find('.tab-list-wrap').length){
            $('.modal--slide').find('.modal__contents').addClass('modal__contents--tabscroll');
        }
    } else {
        modalOpenId.addClass('is-open');
        $('body').addClass('modal-open');
    }
}
// 모달 닫기 js
function modalClose(target){
    var modalClosetarget = $(target);
    modalClosetarget.prop('checked', target.checked);
    setTimeout(function(){
        modalClosetarget.closest('.modal').find('[data-element=modal__close]').trigger('click');
    }, 0)
}



