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
// # Updating the physics
//
// In your render loop, just add this line. It will first update the physics world and
// then move accordingly any ```THREE.Mesh``` you bound.
//
// ```
//     microphysics.update(scene);	
// ```
//
// # Needs a Direct Access ?
//
// If you need to have direct access to microphysics.js, uses ```mesh._vphyBody``` to get the ```vphy.Body```
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
	opts		= opts	|| {};
	this._timeStep	= opts.timeStep	? opts.timeStep : 1/60;
	this._world	= new vphy.World();
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
THREEx.Microphysics.prototype.update	= function(scene)
{
	console.assert(scene instanceof THREE.Scene);
	
	// the actualTime is only for old version of the library
	var actualTime	= this._world.step(this._timeStep, Date.now()/1000);
	
	// go thru each mesh and find the one with the physics
	// - set there position accordingly
	scene.children.forEach(function(mesh){
		if( typeof mesh === THREE.Mesh )	return;
		if( ! mesh._vphyBody )			return;

		var body	= mesh._vphyBody;
		var bodyPosition= body.getPosition(actualTime);
		mesh.position.x	= bodyPosition[0];
		mesh.position.y	= bodyPosition[1];
		mesh.position.z	= bodyPosition[2];
	})
	return this;
}

/**
 * backward compatibility api for bindMesh
 * to remove
*/
THREEx.Microphysics.prototype.addMesh	= function(mesh, opts)
{
	return this.bindMesh(mesh, opts);
}

/**
 * Bind a mesh to microphysics.js
*/
THREEx.Microphysics.prototype.bindMesh	= function(mesh, opts)
{
	if( mesh.geometry instanceof THREE.SphereGeometry ){
		return this._bindSphere( mesh, opts );
	}else if( mesh.geometry instanceof THREE.CubeGeometry ){
		return this._bindCube( mesh, opts );
	}else	console.assert(false, "unhandled type of THREE.Geometry");
	return this;
}

/**
 * Unbind a mesh to microphysics.js
*/
THREEx.Microphysics.prototype.unbindMesh	= function(mesh)
{
	this._world.remove(mesh._vphyBody);
	delete mesh._vphyBody;
	return this;
}

THREEx.Microphysics.prototype._bindCube	= function(mesh, opts)
{
	console.assert( mesh.geometry instanceof THREE.CubeGeometry );
	opts		= opts	|| {};
	var restitution	= opts.restitution	? opts.restitution	: 0.6;

	mesh.geometry.computeBoundingBox();
	mesh._vphyBody	= new vphy.AABB({
		width		: mesh.geometry.boundingBox.x[1] - mesh.geometry.boundingBox.x[0],
		height		: mesh.geometry.boundingBox.y[1] - mesh.geometry.boundingBox.y[0],
		depth		: mesh.geometry.boundingBox.z[1] - mesh.geometry.boundingBox.z[0],
		x		: mesh.position.x,
		y		: mesh.position.y,
		z		: mesh.position.z,
		restitution	: restitution
	});
	
	this._world.add(mesh._vphyBody);
	return this;
}

THREEx.Microphysics.prototype._bindSphere	= function(mesh, opts)
{
	console.assert( mesh.geometry instanceof THREE.SphereGeometry );

	opts		= opts	|| {};
	var restitution	= 'restitution' in opts	? opts.restitution	: 0.6;
	mesh.geometry.computeBoundingBox();
	mesh._vphyBody	= new vphy.Sphere({
		restitution	: restitution,
		radius		: (mesh.geometry.boundingBox.x[1] - mesh.geometry.boundingBox.x[0])/2,
		x		: mesh.position.x,
		y		: mesh.position.y,
		z		: mesh.position.z
	});
	
	this._world.add(mesh._vphyBody);

	return this;
}

