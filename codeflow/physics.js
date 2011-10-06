(function(){
    var AABB = 0;
    var SPHERE = 1;
    var ACCELERATOR = 2;
    var AABOX = 3;

    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var min = Math.min;
    var max = Math.max;
    var pi = Math.PI;
    var tau = 2*pi;

    var body_ids = 0;

    var extend = function(a, b){
        var result = {};
        for(var name in a){
            result[name] = a[name];
        }
        for(var name in b){
            result[name] = b[name];
        }
        return result;
    };

    var Class = function(obj){
        var constructor = obj.__init__ || function(){};

        if(obj.__extends__){
            var base = obj.__extends__.prototype;
        }
        else{
            var base = {};
        }

        constructor.prototype = extend(base, obj);
        return constructor;
    };
    
    var Events = Class({
        __init__: function(obj){
            this.listeners = {};
            this.obj = obj;
            this.has_listeners = false;
        },
        on: function(name, fun){
            this.has_listeners = true;
            var listeners = this.listeners[name] = this.listeners[name] || [];
            listeners.push(fun);
            return this;
        },
        trigger: function(name){
            if(!this.has_listeners) return;

            var listeners = this.listeners[name];
            if(!listeners) return;

            var l = listeners.length;
            if(!l) return;

            var obj = this.obj;
            for(var i=0; i<l; i++){
                listeners[i].apply(obj, arguments);
            }
            return this;
        }
    });

    var clamp = function(left, right, value){
        return max(left, min(right, value));
    };

    var Accelerator = Class({
        type: ACCELERATOR,
        remove: function(){
            this.to_remove = true;
        }
    });

    var Body = Class({
        init: function(args){
            var params = extend({
                hardness: 1,
                restitution: 1,
                x: 0,
                y: 0,
                z: 0,
                density: 1
            }, args);

            this.id = body_ids++;
            this.events = new Events(this);

            this.restitution = params.restitution;
            this.hardness = params.hardness;
            this.density = params.density;
            this.mass = params.mass || this.computeMass();

            this.ax = 0;
            this.ay = 0;
            this.az = 0;

            this.x = params.x;
            this.y = params.y;
            this.z = params.z;

            this.px = this.x;
            this.py = this.y;
            this.pz = this.z;
        },
        onContact: function(other){
            this.world.onContact(this, other);
            other.events.trigger('contact', this);
            this.events.trigger('contact', other);
        },
        remove: function(){
            this.to_remove = true;
        },
        computeMass: function(){
            return this.density;
        },
        setVelocity: function(x, y, z){
            this.px = this.x - x;
            this.py = this.y - y;
            this.pz = this.z - z;
        },
        getPosition: function(){
            var u = this.world.u;
            return [
                this.px + (this.x - this.px)*u,
                this.py + (this.y - this.py)*u,
                this.pz + (this.z - this.pz)*u
            ]
        },
        collide: function(other, delta, restitute){
            switch(other.type){
                case AABB:
                    this.collideAABB(other, delta, restitute);
                    break;
                case SPHERE:
                    this.collideSphere(other, delta, restitute);
                    break;
                case AABOX:
                    this.collideAABox(other, delta, restitute);
                    break;
            }
        },
        collideAABB: function(){},
        collideAABox: function(){},
        collideSphere: function(){},
        momentum: function(){
            if(this.dynamic){
                var x = this.x*2 - this.px;
                var y = this.y*2 - this.py;
                var z = this.z*2 - this.pz;

                this.px = this.x;
                this.py = this.y;
                this.pz = this.z;

                this.x = x;
                this.y = y;
                this.z = z;
            }
        },
        applyAcceleration: function(delta){
            if(this.dynamic){
                this.x += this.ax * delta * delta;
                this.y += this.ay * delta * delta;
                this.z += this.az * delta * delta;
                this.ax = 0;
                this.ay = 0;
                this.az = 0;
            }
        },
        accelerate: function(x, y, z){
            if(this.dynamic){
                this.ax += x;
                this.ay += y;
                this.az += z;
            }
        }
    });

    vphy = {
        types: {
            AABB            : AABB,
            SPHERE          : SPHERE,
            ACCELERATOR     : ACCELERATOR,
            AABOX           : AABOX
        },
        World: Class({
            __init__: function(){
                this.u = 0;
                this.bodies = [];
                this.accelerators = [];
                this.managed = [this.bodies, this.accelerators];
                this.events = new Events(this);
            },
            add: function(){
                for(var i=0; i<arguments.length; i++){
                    var obj = arguments[i];
                    obj.world = this;
                    if(obj.type == ACCELERATOR){
                        this.accelerators.push(obj);
                    }
                    else{
                        this.bodies.push(obj);
                    }
                }
                return this;
            },
            onContact: function(body1, body2){
                this.events.trigger('contact', body1, body2);
            },
            momentum: function(){
                var bodies = this.bodies;
                var l = bodies.length;
                for(var i=0; i<l; i++){
                    bodies[i].momentum();
                }
            },
            applyAcceleration: function(delta){
                var bodies = this.bodies;
                var l = bodies.length;
                for(var i=0; i<l; i++){
                    bodies[i].applyAcceleration(delta);
                }
            },
            collide: function(delta, restitute){
                var bodies = this.bodies;
                var l = bodies.length;
                for(var i=0; i<l-1; i++){
                    var body1 = bodies[i];
                    for(var j=i+1; j<l; j++){
                        var body2 = bodies[j];
                        body1.collide(body2, delta, restitute);
                    }
                }
            },
            getCollection: function(){
                var c = [];
                this.managed.push(c);
                return c;
            },
            cleanupCollection: function(c){
                for(var i=0; i<c.length; i++){
                    if(c[i].to_remove){
                        c.splice(i, 1);
                        i--;
                    }
                }
            },
            cleanup: function(){
                var managed = this.managed;
                var l = managed.length;
                for(var i=0; i<l; i++){
                    this.cleanupCollection(managed[i]);
                }
            },
            onestep: function(delta){
                this.time += delta;
                this.accelerate();
                this.applyAcceleration(delta);
                this.collide(delta, false);
                this.cleanup();
                this.momentum();
                this.collide(delta, true);
                this.cleanup();
            },
            step: function(timestep, now){
                if(now - this.time > 0.25){
                    this.time = now - 0.25;
                }
                while(this.time < now){
                    this.onestep(timestep);
                }
                var diff = this.time - now;
                if(diff > 0){
                    this.u = (timestep - diff)/timestep;
                }
                else{
                    this.u = 1.0;
                }
            },
            start: function(time){
                this.time = time;
            },
            accelerate: function(delta){
                var bodies = this.bodies;
                var accelerators = this.accelerators;
                var l = accelerators.length;

                for(var i=0; i<l; i++){
                    accelerators[i].perform(bodies);
                }
            }
        }),
        LinearAccelerator: Class({
            __extends__: Accelerator,
            __init__: function(direction){
                this.direction = direction;
            },
            perform: function(bodies){
                var l = bodies.length;
                for(var i=0; i<l; i++){
                    this.accelerate(bodies[i]);
                }
            },
            accelerate: function(body){
                body.accelerate(this.direction.x, this.direction.y, this.direction.z);
            }
        }),
        NBodyGravity: Class({
            __extends__: Accelerator,
            __init__: function(collection, strength){
                this.collection = collection;
                this.strength = strength;
            },
            perform: function(){
                var collection = this.collection;
                var len = collection.length;
                var strength = this.strength;

                for(var i=0; i<len-1; i++){
                    var b1 = collection[i];
                    for(var j=i+1; j<len; j++){
                        var b2 = collection[j];
                        var x = b1.x - b2.x;
                        var y = b1.y - b2.y;
                        var z = b1.z - b2.z;
                        var l = Math.sqrt(x*x + y*y + z*z);
                        var xn=x/l, yn=y/l, zn=z/l;
                        var f1 = (b2.mass*strength)/(l*l);
                        var f2 = (b1.mass*strength)/(l*l);
                        b1.accelerate(-xn*f1, -yn*f1, -zn*f1);
                        b2.accelerate(xn*f2, yn*f2, zn*f2);
                    }
                }
            }
        }),
        AABB: Class({
            type: AABB,
            dynamic: false,
            __extends__: Body,
            __init__: function(args){
                var params = extend({
                    size: {
                        width: 1, height: 1, depth: 1
                    }
                }, args);
                this.size = params.size;
                this.init(params);
            },
            collideSphere: function(sphere, delta, restitute){
                var b = sphere;
                var radius = sphere.radius;

                var left = this.x - this.size.width/2;
                var right = this.x + this.size.width/2;
                
                var top = this.y + this.size.height/2;
                var bottom = this.y - this.size.height/2;
                
                var front = this.z + this.size.depth/2;
                var back = this.z - this.size.depth/2;

                var r = this.restitution * sphere.restitution;
                var h = this.hardness;

                var vx = r*(b.px - b.x);
                var vy = r*(b.py - b.y);
                var vz = r*(b.pz - b.z);

                if(b.x + radius > right){
                    var off = (b.x + radius) - right;
                    b.x -= off;
                    if(restitute) b.px = b.x - vx;
                    this.onContact(sphere);
                }
                else if(b.x - radius < left){
                    var off = left - (b.x - radius);
                    b.x += off;
                    if(restitute) b.px = b.x - vx;
                    this.onContact(sphere);
                }
                if(b.y + radius > top){
                    var off = (b.y + radius) - top;
                    b.y -= off;
                    if(restitute) b.py = b.y - vy;
                    this.onContact(sphere);
                }
                else if(b.y - radius < bottom){
                    var off = bottom - (b.y - radius);
                    b.y += off;
                    if(restitute) b.py = b.y - vy;
                    this.onContact(sphere);
                }
                if(b.z - radius < back){
                    var off = back - (b.z - radius);
                    b.z += off;
                    if(restitute) b.pz = b.z - vz;
                    this.onContact(sphere);
                }
                else if(b.z + radius > front){
                    var off = (b.z + radius) - front;
                    b.z -= off;
                    if(restitute) b.pz = b.z - vz;
                    this.onContact(sphere);
                }
            }
        }),
        AABox: Class({
            type: AABOX,
            dynamic: false,
            __extends__: Body,
            __init__: function(args){
                var params = extend({
                    size: {
                        width: 1, height: 1, depth: 1
                    }
                }, args);
                this.size = params.size;
                this.init(params);
            },
            collideSphere: function(sphere, delta, restitute){
                var b = sphere;
                var radius = sphere.radius;

                var left = this.x - this.size.width/2;
                var right = this.x + this.size.width/2;
                
                var top = this.y + this.size.height/2;
                var bottom = this.y - this.size.height/2;
                
                var front = this.z + this.size.depth/2;
                var back = this.z - this.size.depth/2;

                var cx = clamp(left, right, b.x);
                var cy = clamp(bottom, top, b.y);
                var cz = clamp(back, front, b.z);

                var x = b.x - cx;
                var y = b.y - cy;
                var z = b.z - cz;
                var l = sqrt(x*x + y*y + z*z);
                var xn = x/l;
                var yn = y/l;
                var zn = z/l;
               
                if(l < radius){
                    var vx = b.x - b.px;
                    var vy = b.y - b.py;
                    var vz = b.z - b.pz;

                    var off = radius-l;
                    
                    b.x += xn*off;
                    b.y += yn*off;
                    b.z += zn*off;

                    if(restitute){
                        var r = this.restitution * b.restitution;
                        var d = xn*vx + yn*vy + zn*vz;
                        var vnx=d*xn, vny=d*yn, vnz=d*zn;

                        vx -= r*vnx+vnx;
                        vy -= r*vny+vny;
                        vz -= r*vnz+vnz;
                        
                        b.setVelocity(vx, vy, vz);
                    }
                    this.onContact(sphere);
                }
            }
        }),
        Sphere: Class({
            type: SPHERE,
            dynamic: true,
            __extends__: Body,
            __init__: function(args){
                var params = extend({
                    radius: 1
                }, args);
                this.radius = params.radius;
                this.init(params);
            },
            computeMass: function(){
                return (4/3)*pi*pow(this.radius, 3)*this.density;
            },
            collideAABB: function(other, delta, restitute){
                other.collideSphere(this, delta, restitute);
            },
            collideAABox: function(other, delta, restitute){
                other.collideSphere(this, delta, restitute);
            },
            collideSphere: function(other, delta, restitute){
                var b1 = this;
                var b2 = other;

                var x = b1.x - b2.x;
                var y = b1.y - b2.y;
                var z = b1.z - b2.z;
                var l = sqrt(x*x + y*y + z*z);
                var xn=x/l, yn=y/l, zn=z/l;
                var target = this.radius + other.radius;
                        
                if(l < target){
                    var v1x = b1.x - b1.px;
                    var v1y = b1.y - b1.py;
                    var v1z = b1.z - b1.pz;
                    
                    var v2x = b2.x - b2.px;
                    var v2y = b2.y - b2.py;
                    var v2z = b2.z - b2.pz;

                    var mt = b1.mass + b2.mass;
                    var f1 = b1.mass/mt;
                    var f2 = b2.mass/mt;

                    //var off = (target-l)/2;
                    var off1 = (target-l)*f2;
                    var off2 = (target-l)*f1;

                    b1.x += xn*off1;
                    b1.y += yn*off1;
                    b1.z += zn*off1;
                    b2.x -= xn*off2;
                    b2.y -= yn*off2;
                    b2.z -= zn*off2;

                    if(restitute){
                        var r = this.restitution * other.restitution;

                        var d1 = xn*v1x + yn*v1y + zn*v1z;
                        var d2 = xn*v2x + yn*v2y + zn*v2z;

                        var v1nx=d1*xn, v1ny=d1*yn, v1nz=d1*zn;
                        var v2nx=d2*xn, v2ny=d2*yn, v2nz=d2*zn;

                        var vrx = v1nx - v2nx;
                        var vry = v1ny - v2ny;
                        var vrz = v1nz - v2nz;

                        var mt = b1.mass+b2.mass;
                        var mf1 = (b1.mass-b2.mass)/mt;
                        var mf2 = (2*b1.mass)/mt;

                        v1x += r*(v2nx+vrx*mf1 - v1nx);
                        v1y += r*(v2ny+vry*mf1 - v1ny);
                        v1z += r*(v2nz+vrz*mf1 - v1nz);
                        
                        v2x += r*vrx*mf2;
                        v2y += r*vry*mf2;
                        v2z += r*vrz*mf2;

                        b1.setVelocity(v1x, v1y, v1z);
                        b2.setVelocity(v2x, v2y, v2z);
                    }
                    this.onContact(b2);
                }
            }
        })
    };
})();
