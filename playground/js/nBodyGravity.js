var Playground	= Playground	|| {};

Playground.nBodyGravity	= function()
{
	// TODO inerit from vphy base accelerator, this no type and no remove
	this._accelerator	= {
		type: vphy.types.ACCELERATOR,
		perform: function(){
			if( !spheres )	return;
			var meshes	= spheres.meshes();
			var strength	= pageOptions.nBodyGravity.strength;
			var len		= meshes.length;
			for(var i=0; i<len-1; i++){
				var b1 = microphysics.body(meshes[i]);
				for(var j=i+1; j<len; j++){
					var b2 = microphysics.body(meshes[j]);
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
		}.bind(this),
		remove	: function(){
			this.to_remove	= true;
		}
	};
	microphysics.world().add(this._accelerator);
}

Playground.nBodyGravity.prototype.destroy	= function()
{
	microphysics.world().remove(this._accelerator);
	this._accelerator	= null;
}
