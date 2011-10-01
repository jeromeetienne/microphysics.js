// This source is the javascript needed to build a sky box in **three.js**
// It is the source about this [blog post](/blog/2011/08/15/lets-do-a-sky/).

// ## Now lets start

// declare a bunch of variable we will need later
var startTime	= Date.now();
var container;
var camera, scene, renderer, stats;
var world;

// ## bootstrap functions
// initialiaze everything
init();
// make it move			
animate();

// ## Initialize everything
function init() {
	// test if webgl is supported
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	// create the camera
	camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z	= -1000;
	// create the Scene
	scene = new THREE.Scene();
	
	world = new vphy.World();

	world.start(Date.now()/1000);

	world.add(new vphy.AABB({
		size	: {
			width	: 400*2,
			height	: 400*2,
			depth	: 400*2
		},
		restitution	: 1.0
        }));

	// gravity
	world.add(new vphy.LinearAccelerator({
		x	: 0, 
		y	: -9.8 * 250,
		z	: 0
	}));

	for( var i = 0; i < 200; i++ ){
		var mesh	= new THREE.Mesh(new THREE.SphereGeometry(50, 10, 5), new THREE.MeshNormalMaterial());
		mesh.position.x	= 	(2*Math.random()-1) * 30;
		mesh.position.y	= 150 + (2*Math.random()-1) * 75;
		mesh.position.z	= 	(2*Math.random()-1) * 30;
		
		mesh.geometry.computeBoundingBox();
		mesh._vphyBody	= new vphy.Sphere({
			restitution	: 0.9,
			radius		: (mesh.geometry.boundingBox.x[1] - mesh.geometry.boundingBox.x[0])/2,
			x		: mesh.position.x,
			y		: mesh.position.y,
			z		: mesh.position.z
		});
		world.add(mesh._vphyBody);
	
		scene.addChild(mesh);		
	}

	// create the container element
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer({
		antialias	: true
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	
	// init the Stats and append it to the Dom - performance vuemeter
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
}

// ## Animate and Display the Scene
function animate() {
	// render the 3D scene
	render();
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
	// update the stats
	stats.update();
}


// ## Render the 3D Scene
function render() {
	
	//var timestep	= 1/120;
	var actualTime	= world.step(1/60, Date.now()/1000);
	
//console.log(world, scene)
	scene.children.forEach(function(mesh){
		if( typeof mesh === THREE.Mesh )	return;
		if( ! mesh._vphyBody )			return;

		var body	= mesh._vphyBody;
		var bodyPosition= body.getPosition(actualTime);
		mesh.position.x	= bodyPosition[0];
		mesh.position.y	= bodyPosition[1];
		mesh.position.z	= bodyPosition[2];
		//console.log("position", mesh.position)
	})

	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}