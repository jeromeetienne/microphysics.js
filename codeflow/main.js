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
        draw: function(shader){
            shader.draw(this.geom, framework.screen, {
                offset: this.body.getPosition()
            });
        },
    });

    var lightdir = new Vec3(0.5, -1, 0.25).normalize();
    var rlightdir = new Vec3().update(lightdir).mul(-1);
    var world = new vphy.World();
    
    var spheres = world.getCollection();
    var boxes = world.getCollection();

    world.add(
        new vphy.AABB({
            size: {
                width: bbox.width*2,
                height: bbox.height*2,
                depth: bbox.depth*2,
            },
            restitution: 1.0,
        }),
        //new vphy.LinearAccelerator({x: 0, y: -20, z: 0}),
        new vphy.NBodyGravity(spheres, 3)
    );

    for(var a=-1; a<=1; a++){
        for(var b=-1; b<=1; b++){
            boxes.push(new Box(world, a/2, -0.6, b/2, 0.2, 0.8, 0.2));
        }
    }

    var rnd = function(scale){
        return (Math.random()-0.5)*2*scale;
    };

    var spawnSphere = function(){
        var x = (Math.random()-0.5)*1;
        var z = (Math.random()-0.5)*1;
        var y = 1-0.3 - Math.random()*0.5;
        var s = new vphy.Sphere({
            restitution: 0.6,
            //radius: Math.random() * 0.15 + 0.1,
            radius: Math.random() * 0.015 + 0.01,
            x: x, y: y, z: z,
        });
        s.events.on('contact', function(){
            this.remove();
        });
        s.setVelocity(rnd(0.0005), rnd(0.0005), rnd(0.0005))
        world.add(s);
        spheres.push(s);
    }
    for(var i=0; i<30; i++){
        spawnSphere();
    }

    var scheduler = new Scheduler(function(delta, now){ 
        var timestep = 1/120;
        world.step(timestep, now);
        view.update(delta);

        gl.clearColor(0.1, 0.1, 0.1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        framework.cull('back');
        data.marble.viewpoint(view);
        for(var i=0; i<spheres.length; i++){
            var sphere = spheres[i];
            data.marble.draw(item, framework.screen, {
                offset: sphere.getPosition(),
                radius: sphere.radius,
            });
        }

        data.diffuse_textured
            .viewpoint(view)
            .uniform('lightdir', rlightdir);

        for(var i=0; i<boxes.length; i++){
            boxes[i].draw(data.diffuse_textured);
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
            }
        })
});
