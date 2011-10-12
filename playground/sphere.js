var sphereMeshes	= [];

function spheresInit(opts){
	var nbSpheres	= opts.nbSpheres	? opts.nbSpheres	: 0;
	var restitution	= opts.restitution	? opts.restitution	: 0;

	var geometry	= new THREE.SphereGeometry(70, 10, 5);
	var material	= new THREE.MeshNormalMaterial();

	for( var i = 0; i < nbSpheres; i++ ){
		var radius	= 20+Math.random()*50;
radius	= 75;
		var geometry	= new THREE.SphereGeometry(radius, 10, 5);
		var mesh	= new THREE.Mesh(geometry, material);
		mesh.position.x	= (2*Math.random()-1) * 1500;
		mesh.position.y	= (2*Math.random()-1) * 1500;
		mesh.position.z	= (2*Math.random()-1) * 1500;
		scene.addChild(mesh);
		sphereMeshes.push(mesh);

		microphysics.bindMesh(mesh, {
			restitution	: restitution
		});
		
		var speed	= new THREE.Vector3(2*Math.random()-1, 2*Math.random()-1, 2*Math.random()-1)
					.normalize().multiplyScalar(5);
		microphysics.body(mesh).setVelocity(speed.x, speed.y, speed.z);
	}
}