(function ($) {
    window.newConfirm = function ({
                                      title = "提示",
                                      content = "",
                                      ok = () => {
                                      },
                                      cancle = () => {
                                      },
                                  }) {
        let html = `
            <div class="confirm">
                <div class="confirm-mask"></div>
                <div class="confirm-content">
                    <div class="confirm-title">${title}</div>
                    <div class="confirm-body">${content}
                  
                    </div>
                  <div class="confirm-footer">
                        <div class="confirm-btns">
                    
                        <button class="confirm-ok common-btn primary" >确定</button>
                        <button class=" confirm-cancle common-btn" >取消</button>
</div>
                    </div> 
                </div>
            </div>
        `
        $("body").append(html)
        $(".confirm-ok").click(function () {
                ok()
                $(".confirm").remove()

            }
        )
        $(".confirm-cancle").click(function () {
            cancle()
            $(".confirm").remove()
        })


    }


    window.showMessage = function (success, message) {
        // replaceState 将href中success, message去掉
        history.replaceState(null, null, window.location.href.replace(/[\?&]success=[^&]*/, "").replace(/[\?&]message=[^&]*/, ""))
        let type, content;
        if(success === '1') {
            type = "success"
            content = message || ""
        } else if(success === '0') {
            type = "error"
            content = message || ""
        }
        if(!content) return
        let html = `
            <div class="message ${type}">
           ${success === '1' ? '<i class="iconfont icon-checkgou"></i>' : '<i class="iconfont icon-about"></i>' }   <div class="message-body">${content}</div>
            </div>
        `
        $("body").append(html)
        setTimeout(() => {
            $(".message").remove()
        } , 2000)
    }
})(jQuery)
