Framework.components.push(function(framework, gl){
    framework.Quad = Class({
        __extends__: framework.Drawable,
        __init__: function(params){
            var b=params.y;
            var t=b+params.h;
            var l=params.x;
            var r=params.x+params.h;
             
            this.vbo = new framework.VBO({
                position_2f: [
                     r,  t,
                     l,  t,
                     l,  b,

                     r,  t,
                     l,  b,
                     r,  b,
                ],
                texcoord_2f: [
                     1,  0,
                     0,  0,
                     0,  1,

                     1,  0,
                     0,  1,
                     1,  1,
                ]
            });
        },
    });
});
