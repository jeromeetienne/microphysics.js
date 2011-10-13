var player;

function playerInit(restitution)
{
	var radius	= 300;

	var material	= new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
	var geometry	= new THREE.SphereGeometry(radius, 50, 25);
	var mesh	= new THREE.Mesh(geometry, material);
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
			var acc		= 20*250;
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
