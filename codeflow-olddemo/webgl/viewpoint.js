var Viewpoint = Class({
    type: 'viewpoint',
    __init__: function(params){
        var selector = params.element || document;
        this.offset = params.offset || new Vec3();
        this.damping = params.damping || 0.95;
        this.acc_factor = params.acc_factor || 100.0;

        var self = this;
        this.orientation = 0;
        this.orientation_speed = 0;
        this.orientation_acc = 0;
        this.pitch = 0;
        this.pitch_speed = 0;
        this.pitch_acc = 0;

        var x, y, lastx, lasty, pressed;

        $(selector)
            .mousedown(function(event){
                pressed = true;
                lastx = event.pageX;
                lasty = event.pageY;
            })
            .mouseup(function(){
                pressed = false;
            })
            .mousemove(function(event){
                if(pressed){
                    var x = event.pageX;
                    var y = event.pageY;

                    self.orientation_acc += x-lastx;
                    self.pitch_acc += y-lasty;

                    lastx = x;
                    lasty = y;
                }
            })
            .bind('selectstart', function(){
                return false;
            });

        this.view = new Mat4();
        this.inv_view = new Mat4();
        this.rot = new Mat3();
        this.inv_rot = new Mat3();
    },
    update: function(delta){
        this.orientation_speed += this.orientation_acc * delta * this.acc_factor;
        this.pitch_speed += this.pitch_acc * delta * this.acc_factor;

        this.orientation_speed *= this.damping;
        this.pitch_speed *= this.damping;

        this.orientation += this.orientation_speed * delta;
        this.pitch += this.pitch_speed * delta;

        if(this.pitch > 85){
            this.pitch = 85;
            this.pitch_speed = 0;
        }
        else if(this.pitch < -85){
            this.pitch = -85;
            this.pitch_speed = 0;
        }
        
        this.orientation_acc = 0;
        this.pitch_acc = 0;

        this.view
            .ident()
            .translate(this.offset.x, this.offset.y, this.offset.z)
            .rotatex(this.pitch)
            .rotatey(this.orientation);

        this.inv_view
            .updateFrom(this.view)
            .invert();

        this.rot.updateFrom(this.view);
        this.inv_rot.updateFrom(this.inv_view);
    },
});
