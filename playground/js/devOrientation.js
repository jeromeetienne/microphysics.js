var deviceOrientation;
var devOrientationAcc;

function devOrientationInit(){
	if( deviceOrientation )	return;
	deviceOrientation	= new THREEx.DeviceOrientationState();
	devOrientationAcc	= {
		type: vphy.types.ACCELERATOR,
		perform: function(bodies, deltaTime){
			if( !deviceOrientation )	return;
			var vector	= new THREE.Vector3(0, -10 * 250, 0);
			var angleX	= deviceOrientation.angleX();
			var angleZ	= deviceOrientation.angleZ();
			
			var srcMatrix	= new THREE.Matrix4();
			srcMatrix.setPosition(vector);
			//angleY		= Math.PI;
			
			var rotMatrix	= new THREE.Matrix4();
			rotMatrix.multiplySelf(new THREE.Matrix4().setRotationX(angleX));
			rotMatrix.multiplySelf(new THREE.Matrix4().setRotationZ(-angleZ)); 
		
			rotMatrix.multiplySelf(srcMatrix);
			var position	= rotMatrix.getPosition();
			for(var i=0; i < bodies.length; i++){
				var body	= bodies[i];
				body.accelerate(position.x, position.y, position.z); 
			}
		},
		remove	: function(){
			this.to_remove	= true;
		}
	};
	microphysics.world().add(devOrientationAcc);
}

function devOrientationUpdate(){
}

function devOrientationDestroy(){
	if( !deviceOrientation )	return;

	deviceOrientation.destroy();
	deviceOrientation	= null;

	microphysics.world().remove(devOrientationAcc);
	devOrientationAcc	= null;
}
