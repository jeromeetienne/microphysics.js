
function outterCubeInit(){
	var thickness	= 100;
	var size	= new THREE.Vector3(1400, 800, 800)
	var size	= new THREE.Vector3(3200, 3200, 3200)
	var restitution	= 1.0;
	
	var geometry	= new THREE.CubeGeometry(size.x,thickness,size.z, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.y	= -size.y/2;
	scene.addChild(mesh);
	microphysics.bindMesh(mesh, {
		restitution	: restitution
	})

	var geometry	= new THREE.CubeGeometry(size.x,thickness,size.z, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.y	= +size.y/2;
	scene.addChild(mesh);
	microphysics.bindMesh(mesh)

	var geometry	= new THREE.CubeGeometry(thickness, size.y, size.z, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.x	= +size.x/2;
	scene.addChild(mesh);
	microphysics.bindMesh(mesh)

	var geometry	= new THREE.CubeGeometry(thickness,size.y,size.z, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.x	= -size.x/2;
	scene.addChild(mesh);
	microphysics.bindMesh(mesh)

	var geometry	= new THREE.CubeGeometry(size.x,size.y,thickness, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.z	= +size.z/2;
	scene.addChild(mesh);
	microphysics.bindMesh(mesh)

	var geometry	= new THREE.CubeGeometry(size.x, size.y, thickness, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } )];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.z	= -size.z/2;
	scene.addChild(mesh);
	microphysics.bindMesh(mesh)
}

