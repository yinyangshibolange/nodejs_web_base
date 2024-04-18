!function(s){window.newConfirm=function({title:c="提示",content:o="",ok:i=()=>{},cancle:n=()=>{}}){c=`
            <div class="confirm">
                <div class="confirm-mask"></div>
                <div class="confirm-content">
                    <div class="confirm-title">${c}</div>
                    <div class="confirm-body">${o}
                  
                    </div>
                  <div class="confirm-footer">
                        <div class="confirm-btns">
                    
                        <button class="confirm-ok common-btn primary" >确定</button>
                        <button class=" confirm-cancle common-btn" >取消</button>
</div>
                    </div> 
                </div>
            </div>
        `;s("body").append(c),s(".confirm-ok").click(function(){i(),s(".confirm").remove()}),s(".confirm-cancle").click(function(){n(),s(".confirm").remove()})},window.showMessage=function(c,o){history.replaceState(null,null,window.location.href.replace(/[\?&]success=[^&]*/,"").replace(/[\?&]message=[^&]*/,""));let i,n;"1"===c?(i="success",n=o||""):"0"===c&&(i="error",n=o||""),n&&(o=`
            <div class="message ${i}">
           ${"1"===c?'<i class="iconfont icon-checkgou"></i>':'<i class="iconfont icon-about"></i>'}   <div class="message-body">${n}</div>
            </div>
        `,s("body").append(o),setTimeout(()=>{s(".message").remove()},2e3))}}(jQuery);