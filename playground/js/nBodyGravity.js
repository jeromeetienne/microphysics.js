var nBodyGravityAcc;

function nBodyGravityInit(){

	if( nBodyGravityAcc )	return;

	var collection	= [];
	sphereMeshes.forEach(function(mesh){
		var body	= microphysics.body(mesh);
		collection.push(body);
	})

	nBodyGravityAcc	= {
		type	: vphy.types.ACCELERATOR,
		perform	: function(bodies, deltaTime){
			if( !nBodyGravityAcc )	return;

			var len		= collection.length;
			var strength	= pageOptions.nBodyGravity.strength;
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
		},
		remove	: function(){
			this.to_remove	= true;
		}
	};
	microphysics.world().add(nBodyGravityAcc);
}

function nBodyGravityDestroy(){

	if( !nBodyGravityAcc )	return;

	microphysics.world().remove(nBodyGravityAcc)
	nBodyGravityAcc	= null;;
}
