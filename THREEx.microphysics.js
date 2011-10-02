var THREEx	= THREEx 		|| {};

THREEx.Microphysics	= function(opts)
{
	opts		= opts	|| {};
	this._timeStep	= opts.timeStep	? opts.timeStep : 1/60;
	this._world	= new vphy.World();
	return this;
}

THREEx.Microphysics.prototype.start	= function()
{
	this._world.start(Date.now()/1000);
	return this;
}

THREEx.Microphysics.prototype.world	= function()
{
	return this._world;
}

THREEx.Microphysics.prototype.update	= function(scene)
{
	console.assert(scene instanceof THREE.Scene);
	
	// the actualTime is only for old version of the library
	var actualTime	= world.step(this._timeStep, Date.now()/1000);
	
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

THREEx.Microphysics.prototype.addMesh	= function(mesh, opts)
{
	if( mesh.geometry instanceof THREE.SphereGeometry ){
		return this._addSphere( mesh, opts );
	}else if( mesh.geometry instanceof THREE.CubeGeometry ){
		return this._addCube( mesh, opts );
	}else	console.assert(false);
	return this;
}

THREEx.Microphysics.prototype._addCube	= function(mesh, opts)
{
	console.assert( mesh.geometry instanceof THREE.CubeGeometry );
	opts		= opts	|| {};
	var restitution	= opts.restitution	? opts.restitution	: 0.6;
	var flipped	= 'flipped' in opts	? opts.flipped		: false;
	var bodyClass	= flipped ? vphy.AABB : vphy.AABox;
	console.log("cube")

	mesh.geometry.computeBoundingBox();
	mesh._vphyBody	= new bodyClass({
		size	: {
			width	: mesh.geometry.boundingBox.x[1] - mesh.geometry.boundingBox.x[0],
			height	: mesh.geometry.boundingBox.y[1] - mesh.geometry.boundingBox.y[0],
			depth	: mesh.geometry.boundingBox.z[1] - mesh.geometry.boundingBox.z[0]
		},
		x		: mesh.position.x,
		y		: mesh.position.y,
		z		: mesh.position.z,
		restitution	: restitution
	});
	
	this._world.add(mesh._vphyBody);
	return this;
}

THREEx.Microphysics.prototype._addSphere	= function(mesh, opts)
{
	console.assert( mesh.geometry instanceof THREE.SphereGeometry );

	opts		= opts	|| {};
	var restitution	= opts.restitution	? opts.restitution	: 0.6;

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

