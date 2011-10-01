var Framework = Class({
    __init__: function(canvas){
        var self = this;

        this.canvas = canvas;
        this.canvas_node = $(canvas);
        this.viewport = new Vec2();

        this.gl = canvas.getContext('experimental-webgl', {
            premultipliedAlpha: true,
        });
        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        for(var i=0; i<Framework.components.length; i++){
            Framework.components[i](this, this.gl);
        }

        this.events = new EventManager();
        this.canvas_node.resize(function(){
            self.onResize();
        });
        $(window).resize(function(){
            self.onResize();
        });
        this.onResize();
    },
    onResize: function(){
        this.canvas.width = this.canvas_node.width();
        this.canvas.height = this.canvas_node.height();
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.viewport.x = this.canvas.width;
        this.viewport.y = this.canvas.height;
        this.events.dispatch('resize', this.canvas.width, this.canvas.height);
    },
    checkError: function(description){
        var gl = this.gl;

        var code = gl.getError();
        switch(code){
            case gl.NO_ERROR:
                return;
            case gl.OUT_OF_MEMORY:
                if(description) console.error(description);
                console.group('Out of Memory');
                console.trace();
                console.groupEnd();
                break;
            case gl.INVALID_ENUM:
                if(description) console.error(description);
                console.group('Invalid Enum');
                console.trace();
                console.groupEnd();
                break;
            case gl.INVALID_OPERATION:
                if(description) console.error(description);
                console.group('Invalid Operation');
                console.trace();
                console.groupEnd();
                break;
            case gl.INVALID_FRAMEBUFFER_OPERATION:
                if(description) console.error(description);
                console.group('Invalid Framebuffer Operation');
                console.trace();
                console.groupEnd();
                break;
            case gl.INVALID_VALUE:
                if(description) console.error(description);
                console.group('Invalid Value');
                console.trace();
                console.groupEnd();
                break;
        }
    },
    on: function(name){
        this.events.on.apply(this.events, arguments);
        if(name == 'resize'){
            this.events.dispatch('resize', this.canvas.width, this.canvas.height);
        }
        return this;
    },
    depthLess: function(){
        var gl = this.gl;

        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);

        return this;
    },
    depthLessEqual: function(){
        var gl = this.gl;

        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        return this;
    },
    coverageToAlpha: function(value){
        if(value){
            this.gl.enable(this.gl.SAMPLE_ALPHA_TO_COVERAGE);
        }
        else{
            this.gl.disable(this.gl.SAMPLE_ALPHA_TO_COVERAGE);
        }
        return this;
    },
    blendAlpha: function(){
        var gl = this.gl;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        return this;
    },
    cull: function(value){
        var gl = this.gl;

        if(value){
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl[value.toUpperCase()]);
        }
        else{
            gl.disable(gl.CULL_FACE);
        }
        return this;
    },
    Drawable: Class({
        draw: function(shader){
            this.vbo.draw(shader);
        },
        bind: function(shader){
            this.vbo.bind(shader);
        },
    })
});

Framework.components = [];
