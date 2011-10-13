function innerCubeInit(){
	var size	= {
		x	: 4*200,
		y	: 4*200,
		z	: 4*200
	};
	var restitution	= pageOptions.innerCubeRestitution;
	
	var geometry	= new THREE.CubeGeometry(size.x, size.y, size.z);
	var material	= [
		new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),
		new THREE.MeshNormalMaterial()
	];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.x	= 200; 
	mesh.position.y	= -300 - size.y/2;
	scene.addChild(mesh);

	microphysics.bindMesh(mesh, {
		restitution	: restitution
	});
}

