!function(b){var a=function(e,d){var c=this;this.$element=b(e);this.options=b.extend({classes:(this.$element.attr("class")?this.$element.attr("class"):"")},d);this.$upload=b('<div class="input-'+(("right"===this.options.button_position)?"append":"prepend")+' customfile">');this.$uploadFeedback=b('<input type="text" readonly="readonly" class="customfile-feedback '+this.options.classes+'" aria-hidden="true" value="'+this.options.feedback_text+'"/>').appendTo(this.$upload);this.$uploadButton=b('<span class="add-on customfile-button" aria-hidden="true">'+this.options.button_text+"</span>").css({"float":this.options.button_position});this.$element.addClass("customfile-input").on("focus",b.proxy(this.onFocus,this)).on("blur",b.proxy(this.onBlur,this)).on("disable",b.proxy(this.onDisable,this)).on("enable",b.proxy(this.onEnable,this)).on("checkChange",b.proxy(this.onCheckChange,this)).on("change",b.proxy(this.onChange,this)).on("click",b.proxy(this.onClick,this));if("right"===this.options.button_position){this.$uploadButton.insertAfter(this.$uploadFeedback)}else{this.$uploadButton.insertBefore(this.$uploadFeedback)}if(this.$element.is("[disabled]")){this.$element.trigger("disable")}else{this.$upload.on("click",function(){c.$element.trigger("click")})}this.$upload.insertAfter(this.$element);this.$element.insertAfter(this.$upload)};a.prototype={constructor:a,onClick:function(){var c=this;this.$element.data("val",this.$element.val());setTimeout(function(){c.$element.trigger("checkChange")},100)},onCheckChange:function(){if(this.$element.val()&&this.$element.val()!=this.$element.data("val")){this.$element.trigger("change")}},onEnable:function(){this.$element.removeAttr("disabled");this.$upload.removeClass("customfile-disabled")},onDisable:function(){this.$element.attr("disabled",true);this.$upload.addClass("customfile-disabled")},onFocus:function(){this.$upload.addClass("customfile-focus");this.$element.data("val",this.$element.val())},onBlur:function(){this.$upload.removeClass("customfile-focus");this.$element.trigger("checkChange")},onChange:function(){var c=this.$element.val().split(/\\/).pop();if(!c){this.$uploadFeedback.val(this.options.feedback_text).removeClass("customfile-feedback-populated");this.$uploadButton.text(this.options.button_text)}else{this.$uploadFeedback.val(c).addClass("customfile-feedback-populated");this.$uploadButton.text(this.options.button_change_text)}}};b.fn.customFileInput=function(c){return this.each(function(){var f=b(this);var e=f.data("customFileInput");var d=b.extend({},b.fn.customFileInput.defaults,f.data(),typeof c=="object"&&c);if(!e){f.data("customFileInput",(e=new a(this,d)))}})};b.fn.customFileInput.defaults={button_position:"right",feedback_text:"未选择任何文件...",button_text:"选择",button_change_text:"改变"}}(window.jQuery);