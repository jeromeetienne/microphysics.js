Framework.components.push(function(framework, gl){
    var current = null;

    framework.screen = {
        bind: function(){
            if(current !== null){
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
        },
        size: function(){
            return framework.viewport;
        },
    };

    framework.Framebuffer = Class({
        __init__: function(){
            this.id = gl.createFramebuffer();
        },
        color: function(texture){
            this.bind();
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.id, 0);
            this.check();
        },
        check: function(){
            var result = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if(result == gl.FRAMEBUFFER_UNSUPPORTED){
                throw 'Framebuffer is unsupported';
            }
            else if(result == gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT){
                throw 'Framebuffer incomplete attachment';
            }
            else if(result == gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS){
                throw 'Framebuffer incomplete dimensions';
            }
            else if(result == gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT){
                throw 'Framebuffer incomplete missing attachment';
            }
        },
        bind: function(){
            if(current !== this){
                current = this;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
            }
        },
    });
});
