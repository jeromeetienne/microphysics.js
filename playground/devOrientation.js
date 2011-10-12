var deviceOrientation;

function devOrientationInit(){
	deviceOrientation	= new THREEx.DeviceOrientationState();
}

function devOrientationUpdate(){
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

	gravity.x	= position.x;
	gravity.y	= position.y;
	gravity.z	= position.z;
}
