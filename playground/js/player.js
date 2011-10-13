var player;
var playerKeyboard;
var playerAcc;

function playerInit(restitution)
{
	if( player )	return;
	
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
	playerKeyboard	= new THREEx.KeyboardState();
	playerAcc	= {
		type: vphy.types.ACCELERATOR,
		perform: function(){
			var acc		= 20*250;
			var body	= microphysics.body(mesh);
			var keyboard	= playerKeyboard;
			if( keyboard.pressed('right') )	body.accelerate(-acc,0,0);
			if( keyboard.pressed('left') )	body.accelerate(acc,0,0);
			if( keyboard.pressed('up') )	body.accelerate(0,0,acc);
			if( keyboard.pressed('down') )	body.accelerate(0,0,-acc);
			if( keyboard.pressed('space') )	body.accelerate(0, 30*250, 0);
		},
		remove	: function(){
			this.to_remove	= true;
		}
	};
	microphysics.world().add(playerAcc);
}

function playerUpdate(){
	if( !player )	return;
	var mesh	= player;
	// set default material color
	var material	= mesh.materials[0];
	material.color.setRGB(0.5, 0.5, 0);
}

function playerDestroy(){
	if( !player )	return;

	scene.removeChild(player);
	microphysics.unbindMesh(player);
	
	player	= null;
	
	playerKeyboard.destroy();
	playerKeyboard	= null;
	
	microphysics.world().remove(playerAcc);
	playerAcc	= null;
}
