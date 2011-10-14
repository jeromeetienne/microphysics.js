#!/usr/bin/env node

// load physics.js
var filename	= "codeflow/physics.js";
var data	= require("fs").readFileSync(filename, "utf8");
eval(data);


var world	= new vphy.World();
world.start(Date.now()/1000);


// outter box
world.add(new vphy.AABB({
	size: {
		width	: 300,
		height	: 300,
		depth	: 300
	},
	restitution: 1.0
}));

// spheres
var spheres	= [];
for(var i = 0; i < 300; i++){
	var sphere	= new vphy.Sphere({
		restitution	: 1,
		radius		: 2,
		x		: 50 * (Math.random()*2-1),
		y		: 50 * (Math.random()*2-1),
		z		: 50 * (Math.random()*2-1)
	});
	spheres.push(sphere); 

	world.add(sphere);
}

console.log("")
var startTime	= Date.now()/1000;
var virtualTime = Date.now()/1000;
var nbSteps	= 20*60;
for( var i = 0; i < nbSteps; i++, virtualTime += 1/60){
	world.step(1/60, virtualTime);	
}
var endTime	= Date.now()/1000;
var totalTime	= endTime - startTime;
console.log(nbSteps, "steps in", totalTime, "second. so", nbSteps/totalTime, "iteration per seconds");



