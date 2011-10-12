var player;

function playerInit(restitution)
{	
	var material	= new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
	var geometry	= new THREE.SphereGeometry(70, 50, 25);
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.x	=  (2*Math.random()-1) * 30;
	//mesh.position.y	= 150 + (2*Math.random()-1) * 75;
	mesh.position.z	=  (2*Math.random()-1) * 30;
	mesh.position.x	= 0;
	mesh.position.y	= 0;
	mesh.position.z	= 0;
	scene.addChild(mesh);
	player	= mesh;

	// microphysics.js
	microphysics.bindMesh(mesh, {
		restitution	: restitution
	});
	microphysics.body(mesh).events.on('contact', function(otherBody){
		var material	= mesh.materials[0];
		material.color.setRGB(0,0,1);
	});
	
	// keyboard control
	var keyboard	= new THREEx.KeyboardState();
	microphysics.world().add({
		type: vphy.types.ACCELERATOR,
		perform: function(){
			var acc		= 1*250;
			var body	= microphysics.body(mesh);
			if( keyboard.pressed('right') )	body.accelerate(-acc,0,0);
			if( keyboard.pressed('left') )	body.accelerate(acc,0,0);
			if( keyboard.pressed('up') )	body.accelerate(0,0,acc);
			if( keyboard.pressed('down') )	body.accelerate(0,0,-acc);
			if( keyboard.pressed('space') )	body.accelerate(0, 30*250, 0);
		}
	});
}

function playerUpdate(){
	var mesh	= player;
	// set default material color
	var material	= mesh.materials[0];
	material.color.setRGB(0.5, 0.5, 0);
}
