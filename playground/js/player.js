var Playground	= Playground	|| {};

Playground.Player	= function()
{
	var radius	= 300;
	var restitution	= pageOptions.player.restitution;

	var material	= new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
	var geometry	= new THREE.SphereGeometry(radius, 50, 25);
	var mesh	= new THREE.Mesh(geometry, material);
	scene.addChild(mesh);
	this._mesh	= mesh;

	// microphysics.js
	microphysics.bindMesh(mesh, {
		physics	: {
			restitution	: restitution			
		}
	});
	microphysics.body(mesh).events.on('contact', function(otherBody){
		var material	= mesh.materials[0];
		material.color.setRGB(0,0,1);
	});
	
	// keyboard control
	this._keyboard		= new THREEx.KeyboardState();
	// TODO inerit from vphy base accelerator, this no type and no remove
	this._accelerator	= {
		type: vphy.types.ACCELERATOR,
		perform: function(){
			if( !player )	return;
			var acc		= 20*250;
			var body	= microphysics.body(mesh);
			var keyboard	= this._keyboard;
			if( keyboard.pressed('right') )		body.accelerate(-acc,0,0);
			if( keyboard.pressed('left') )		body.accelerate(+acc,0,0);
			if( keyboard.pressed('shift') ){
				if( keyboard.pressed('up') )	body.accelerate(0, +acc, 0);
				if( keyboard.pressed('down'))	body.accelerate(0, -acc, 0);				
			}else{
				if( keyboard.pressed('up') )	body.accelerate(0,0,+acc);
				if( keyboard.pressed('down') )	body.accelerate(0,0,-acc);
			}
		}.bind(this),
		remove	: function(){
			this.to_remove	= true;
		}
	};
	microphysics.world().add(this._accelerator);
}

Playground.Player.prototype.destroy	= function()
{
	scene.removeChild(this._mesh);
	microphysics.unbindMesh(this._mesh);
	this._mesh	= null;
	
	this._keyboard.destroy();
	this._keyboard	= null;
	
	microphysics.world().remove(this._accelerator);
	this._accelerator	= null;
}

Playground.Player.prototype.config	= function()
{
	var body	= microphysics.body(this._mesh);
	var restitution	= pageOptions.player.restitution;
// TODO restitution seems buggy
// - no reaction when i move the slider
// - where is the bug ?
	body.restitution= restitution; 
}

Playground.Player.prototype.update	= function()
{
	// set default material color
	var material	= this._mesh.materials[0];
	material.color.setRGB(0.5, 0.5, 0);
}