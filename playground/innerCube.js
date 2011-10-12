function innerCubeInit(){
	var geometry	= new THREE.CubeGeometry(200,200,200, 10, 10, 10);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.x	= 200; 
	mesh.position.y	= -400+100;
	scene.addChild(mesh);
	microphysics.bindMesh(mesh, {
		restitution	: 2.0
	});
}