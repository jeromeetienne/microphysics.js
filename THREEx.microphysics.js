//
// THREEx.microphysics.js is a THREEx wrapper for microphysics.js.
// It helps binding three.js objects to microphysics.js
// The API is chained for convenience.
//
// # Initialisation
//
// You instanciate the physics engine, like that.
//
// ```
//	var microphysics	= new THREEx.Microphysics(opts);
// ```
//
// ```opts``` is optional.
// ```opts.timeStep``` controls the frequency of the world update.
// The smaller it is the more accurate is the physics but the longer it is to compute.
// It defaults to ```1/60```. Once instanciated, you start it.
//
// ```
//     microphysics.start();
// ```
//
// # Binding THREE.Mesh
//
// Of course we need to add some mesh in the world. After this line, the ```mesh```
// is bound to microphysics.js, so its position is driven by the physics. 
//
// ```
//     microphysics.bindMesh(mesh, opts);
// ```
//
// ```mesh.position``` is honored.
// If you need to unbind a ```mesh```, just do
//
// ```
//     microphysics.unbindMesh(mesh);
// ```
//
// At the time of this writing, microphysics.js support only moving sphere and static
// boxes, so geometry may only be ``THREE.SphereGeometry``` or ```THREE.CubeGeometry```.
// If your mesh got another geometry, use ```opts.geometry``` to say you want the mesh
// to be handled.
//
// ```
//     microphysics.bindMesh(mesh, {
//          geometry	: new THREE.CubeGeometry(200,200,200);
//     });
// ```
//
// It is possible to overwrite ```Mesh.position``` with ```opts.position```, or
// to send options directly to microphysics.js with ```opts.physics```.
//
// ```
//     microphysics.bindMesh(mesh, {
//         // to overwrite the Mesh.position
//         position	: { x : 1, y : 1, z : 2 },
//         // to pass options directly to microphysics.js
//	   physics		: { restitution	: 0.98 }
//    });
//```
//
// # Updating the physics
//
// In your render loop, just add this line. It will first update the physics world and
// then move accordingly any ```THREE.Mesh``` you bound.
//
// ```
//     microphysics.update();	
// ```
//
// # Needs a Direct Access ?
//
// If you need to have direct access to microphysics.js,
// use ```microphysics.body(mesh)``` to get the ```vphy.Body``` bound to ```mesh```.
// bound to ```mesh```. To access ```vphy.World```, just use ```microphysics.word()```.
//
// # Code

//

/** @namespace */
var THREEx	= THREEx 		|| {};

/**
 * Constructor
*/
THREEx.Microphysics	= function(opts)
{
	opts			= opts	|| {};
	this._timeStep		= opts.timeStep	? opts.timeStep : 1/60;
	this._world		= new vphy.World();
	this._boundMeshes	= [];
	return this;
}

// start the physics immediatly
THREEx.Microphysics.prototype.start	= function()
{
	this._world.start(Date.now()/1000);
	return this;
}

// to access vphy.World
THREEx.Microphysics.prototype.world	= function()
{
	return this._world;
}
// to access vphy.Body
THREEx.Microphysics.prototype.body	= function(mesh)
{
	return mesh._vphyBody;
}

// update the physics for all object bound to a scene
THREEx.Microphysics.prototype.update	= function()
{
	// the actualTime is only for old version of the library
	var actualTime	= this._world.step(this._timeStep, Date.now()/1000);
	
	// go thru each bound mesh
	// - set there position accordingly
	for(var i = 0; i < this._boundMeshes.length; i++){
		var mesh	= this._boundMeshes[i];
		var body	= mesh._vphyBody;
		var bodyPosition= body.getPosition(actualTime);
		mesh.position.x	= bodyPosition[0];
		mesh.position.y	= bodyPosition[1];
		mesh.position.z	= bodyPosition[2];
	}
	return this;
}

/**
 * backward compatibility api for bindMesh
 * to remove
*/
THREEx.Microphysics.prototype.addMesh	= function(mesh, opts)
{
	console.log("addMesh is obsolete remove it")
	return this.bindMesh(mesh, opts);
}

/**
 * Bind a mesh to microphysics.js
*/
THREEx.Microphysics.prototype.bindMesh	= function(mesh, opts)
{
	opts		= opts	|| {};
	var geometry	= opts.geometry	|| mesh.geometry;
	if( geometry instanceof THREE.SphereGeometry ){
		this._bindSphere( mesh, opts );
	}else if( geometry instanceof THREE.CubeGeometry ){
		this._bindCube( mesh, opts );
	}else	console.assert(false, "unhandled type of THREE.Geometry");

	// add this body to the world
	this._world.add(mesh._vphyBody);
	// add this mesh in this._boundMeshes
	console.assert( this._boundMeshes.indexOf(mesh) === -1 );
	this._boundMeshes.push(mesh);
	// return this for chained API
	return this;
}

/**
 * Unbind a mesh to microphysics.js
*/
THREEx.Microphysics.prototype.unbindMesh	= function(mesh)
{
	this._world.remove(mesh._vphyBody);
	
	console.assert( this._boundMeshes.indexOf(mesh) !== -1 );
	this._boundMeshes.splice( this._boundMeshes.indexOf(mesh), 1);

	delete mesh._vphyBody;

	return this;
}

THREEx.Microphysics.prototype._bindCube	= function(mesh, opts)
{
	var geometry	= opts.geometry	|| mesh.geometry;
	var position	= opts.position	|| mesh.position;
	var physics	= opts.physics	|| {};
	// sanity check -
	console.assert( geometry instanceof THREE.CubeGeometry );
	// build vphyOpts base from geometry+position
	geometry.computeBoundingBox();
	var vphyOpts	= {
		width		: geometry.boundingBox.x[1] - geometry.boundingBox.x[0],
		height		: geometry.boundingBox.y[1] - geometry.boundingBox.y[0],
		depth		: geometry.boundingBox.z[1] - geometry.boundingBox.z[0],
		x		: position.x,
		y		: position.y,
		z		: position.z
	};
	// vphyOpts inherits from physics
	for(var key in physics){
		if( !physics.hasOwnProperty(key) )	continue;
		vphyOpts[key]	= physics[key];
	}
	
	// build the microphysics body
	mesh._vphyBody	= new vphy.AABB(vphyOpts);
}

THREEx.Microphysics.prototype._bindSphere	= function(mesh, opts)
{
	var geometry	= opts.geometry	|| mesh.geometry;
	var position	= opts.position	|| mesh.position;
	var physics	= opts.physics	|| {};
	// sanity check
	console.assert( geometry instanceof THREE.SphereGeometry );

	// build vphyOpts base from geometry+position
	geometry.computeBoundingBox();
	var vphyOpts	= {
		radius		: (geometry.boundingBox.x[1] - geometry.boundingBox.x[0])/2,
		x		: position.x,
		y		: position.y,
		z		: position.z		
	};
	// vphyOpts inherits from physics
	for(var key in physics){
		if( !physics.hasOwnProperty(key) )	continue;
		vphyOpts[key]	= physics[key];
	}

	// build the microphysics body
	mesh._vphyBody	= new vphy.Sphere(vphyOpts);
}

