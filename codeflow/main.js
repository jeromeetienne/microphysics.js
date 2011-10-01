$(function(){
    ready = false;
    var proj = new Mat4();
    var inv_proj = new Mat4();
    
    var view = new Viewpoint({
        element: document,
        offset: new Vec3(0, 0, -2.5),
    });
    
    var framework = new Framework($('canvas')[0])
        .on('resize', function(event, width, height){
            proj.perspective({
                width   : width,
                height  : height,
                near    : 0.1,
                far     : 20,
                fov     : 60,
            });
            inv_proj.inverse_perspective({
                width   : width,
                height  : height,
                near    : 0.1,
                far     : 20,
                fov     : 60,
            });
            if(ready){
                data.diffuse_textured.uniform({
                    proj        : proj,
                    inv_proj    : inv_proj,
                });
                data.marble.uniform({
                    proj        : proj,
                    inv_proj    : inv_proj,
                });
            }
        })
        .depthLess()
        .blendAlpha()
        .cull('back')

    var gl = framework.gl;
    var item = new framework.Sphere(1.0);

    var bbox = new framework.Box({
        width: 1,
        height: 1,
        depth: 1,
    });

    var spheres = [];
    var boxes = [];

    var Box = Class({
        __init__: function(world, x, y, z, width, height, depth){
            this.body = new vphy.AABox({
                x: x, y: y, z: z,
                restitution: 1.0,
                size: {
                    width: width, height: height, depth: depth,
                }
            });
            world.add(this.body);
            this.geom = new framework.Box({
                width: width/2,
                height: height/2,
                depth: depth/2,
            });
        },
        draw: function(shader, u){
            shader.draw(this.geom, framework.screen, {
                offset: this.body.getPosition(u)
            });
        },
    });

    var lightdir = new Vec3(0.5, -1, 0.25).normalize();
    var rlightdir = new Vec3().update(lightdir).mul(-1);
    var world = new vphy.World();
    world.add(
        new vphy.AABB({
            size: {
                width: bbox.width*2,
                height: bbox.height*2,
                depth: bbox.depth*2,
            },
            restitution: 1.0,
        }),
        new vphy.LinearAccelerator({
            x: 0, 
            y: -20,
            z: 0,
        })
        /*
        {
            type: vphy.ACCELERATOR,
            perform: function(){
                var len = spheres.length;
                for(var i=0; i<len-1; i++){
                    var b1 = spheres[i];
                    for(var j=i+1; j<len; j++){
                        var b2 = spheres[j];
                        var x = b1.x - b2.x;
                        var y = b1.y - b2.y;
                        var z = b1.z - b2.z;
                        var l = Math.sqrt(x*x + y*y + z*z);
                        var xn=x/l, yn=y/l, zn=z/l;
                        var f1 = (b2.mass*3.0)/(l*l);
                        var f2 = (b1.mass*3.0)/(l*l);
                        b1.accelerate(-xn*f1, -yn*f1, -zn*f1);
                        b2.accelerate(xn*f2, yn*f2, zn*f2);
                    }
                }
            },
        }
        */
    );

    for(var a=-1; a<=1; a++){
        for(var b=-1; b<=1; b++){
            boxes.push(new Box(world, a/2, -0.6, b/2, 0.2, 0.8, 0.2));
        }
    }

    /*
    var player = new vphy.Sphere({
        restitution: 0.6,
        radius: 0.15,
        x: 0, y: 0.8, z: 0,
    });
    spheres.push(player);
    world.add(player);
    world.add(
        {
            type: vphy.ACCELERATOR,
            perform: function(){
                if(left) player.accelerate(-1, 0, 0);
                if(right) player.accelerate(1, 0, 0);
                if(front) player.accelerate(0, 0, -1);
                if(back) player.accelerate(0, 0, 1);
            },
        },
    );
    */

    var spawnSphere = function(){
        var x = (Math.random()-0.5)*1;
        var z = (Math.random()-0.5)*1;
        var y = 1-0.3 - Math.random()*0.5;
        var s = new vphy.Sphere({
            restitution: 0.6,
            radius: Math.random() * 0.15 + 0.1,
            x: x, y: y, z: z,
        });
        world.add(s);
        spheres.push(s);
    }
    for(var i=0; i<30; i++){
        spawnSphere();
    }

    var scheduler = new Scheduler(function(delta, now){ 
        var timestep = 1/120;
        var u = world.step(timestep, now);
        view.update(delta);

        gl.clearColor(0.1, 0.1, 0.1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        framework.cull('back');
        data.marble.viewpoint(view);
        for(var i=0; i<spheres.length; i++){
            var sphere = spheres[i];
            data.marble.draw(item, framework.screen, {
                offset: sphere.getPosition(u),
                radius: sphere.radius,
            });
        }

        data.diffuse_textured
            .viewpoint(view)
            .uniform('lightdir', rlightdir);

        for(var i=0; i<boxes.length; i++){
            boxes[i].draw(data.diffuse_textured, u);
        }

        framework.cull('front');
        data.diffuse_textured.draw(bbox, framework.screen, {
            lightdir: lightdir,
            offset: [0, 0, 0],
        });
    });

    var data = {
        concrete: 'concrete.jpg',
        diffuse_textured: 'diffuse_textured.shader',
        marble: 'marble.shader',
    };

    var loader = new framework.Loader()
        .load(data)
        .ready(function(){
            ready = true;
            data.diffuse_textured.uniform({
                proj        : proj,
                inv_proj    : inv_proj,
                color       : data.concrete,
            });
            data.marble.uniform({
                lightdir    : lightdir,
                proj        : proj,
                inv_proj    : inv_proj,
            });
            world.start(Date.now()/1000);
            scheduler.start();
        });

    var left, right, front, back;

    $(document)
        .keydown(function(event){
            switch(event.which){
                case 32:
                    spawnSphere();
                    break;
                case 37: left=true; break;
                case 39: right=true; break;
                case 38: front=true; break;
                case 40: back=true; break;
            }
        })
        .keyup(function(event){
            switch(event.which){
                case 37: left=false; break;
                case 39: right=false; break;
                case 38: front=false; break;
                case 40: back=false; break;
            }
        });
});
