// This source is the javascript needed to build a sky box in **three.js**
// It is the source about this [blog post](/blog/2011/08/15/lets-do-a-sky/).

// ## Now lets start

// declare a bunch of variable we will need later
var startTime	= Date.now();
var container;
var camera, scene, renderer, stats;

var microphysics;
var gravity;

var pageOptions		= {
	physicsSteps		: 60,

	gravity			: true,
	devOrientation		: false,
	
	sphere	: {
		enable		: true,
		quantity	: 50,
		restitution	: 1.0
	},
	
	player	: {
		enable		: true,
		restitution	: 1.0
	},

	nBodyGravity	: {
		enable		: false,
		strength	: 5,
	},
	
	innerCube	: {
		enable		: false,
		restitution	: 1.0,
	},
	
	outterCubeEnable	: true,
	outterCubeWidth		: 10000,
	outterCubeHeight	: 5000,
	outterCubeDepth		: 5000,
	outterCubeRestitution	: 1.0,
};

// ## bootstrap functions
// detect if webgl is needed and available
if( !Detector.webgl ){
	Detector.addGetWebGLMessage();
}else{
	init();
	animate();
}


/**
 * Build ui with Data.GUI
*/
function buildGui(opts, callback)
{
	var gui = new DAT.GUI({
		height	: 10 * 32 - 1
	});
	var change	= function(){
		callback(opts);
	};

	gui.add(opts, 'physicsSteps')		.name('physics steps').min(15).max(360).onFinishChange(change);

	gui.add(opts, 'gravity')		.onChange(change);
	gui.add(opts, 'devOrientation')		.name('device orientation').onChange(change);

	gui.add(opts.sphere, 'enable')		.name('Sphere Enable').onChange(change);
	gui.add(opts.sphere, 'quantity')	.name('Number of Sphere').min(0).max(200).onChange(change);
	gui.add(opts.sphere, 'restitution')	.name('Sphere Restitution').min(0).max(3).onChange(change);

	gui.add(opts.player, 'enable')		.name('Player Enable').onChange(change);
	gui.add(opts.player, 'restitution')	.name('Player Restitution').min(0).max(3).onChange(change);

	gui.add(opts.nBodyGravity, 'enable')	.name('n-bodies gravity enable').onChange(change);
	gui.add(opts.nBodyGravity, 'strength')	.name('n-bodies strengh').min(0).max(10.0).onFinishChange(change);
}

// ## Initialize everything
function init() {
	// create the camera
	camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z	= -5500;
	// create the Scene
	scene = new THREE.Scene();

	// lights
	scene.addChild( new THREE.AmbientLight( 0x404040 ) );
	var light = new THREE.DirectionalLight( 0xffffff, 1.2 );
	light.position.set(1,1,0).normalize();
	scene.addChild( light );
				
	// build the GUI
	var handleOption	= function(){
		//console.log("pageOptions", JSON.stringify(pageOptions, null, '\t'))

		microphysics._timeStep	= 1/pageOptions.physicsSteps;

		// handle gravity
		if( pageOptions.gravity ){
			if( !gravity )	gravity	= new Playground.Gravity();
		}else{
			if( gravity )	gravity.destroy();
			gravity	= null;
		}

		if( pageOptions.player )	playerInit();
		else				playerDestroy();

		if( pageOptions.devOrientation)	devOrientationInit();
		else				devOrientationDestroy();

		if( pageOptions.nBodyGravity.enable)	nBodyGravityInit();
		else					nBodyGravityDestroy();
	};
	buildGui(pageOptions, handleOption);


	microphysics	= new THREEx.Microphysics({
		timeStep	: 1/pageOptions.physicsSteps
	});
	microphysics.start();


	// gravity
	if( pageOptions.gravity )	gravity	= new Playground.Gravity();

	// outter cube
	if( pageOptions.outterCubeEnable )	outterCubeInit();

	// inner cube
	if( pageOptions.innerCubeEnable )	innerCubeInit();


	if( pageOptions.sphere.enable ){
		spheresInit({
			quantity	: pageOptions.sphere.quantity,
			restitution	: pageOptions.sphere.restitution
		});
	}
	
	if( pageOptions.player.enable )	playerInit(pageOptions.player.restitution);
	if( pageOptions.devOrientation)	devOrientationInit();

	if( pageOptions.nBodyGravity.enable){
		nBodyGravityInit(pageOptions.nBodyGravity.strength);
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

	THREEx.WindowResize(renderer, camera);
	
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

	if( pageOptions.devOrientation)		devOrientationUpdate();

	if( pageOptions.playerEnable )		playerUpdate();

	microphysics.update(scene);	

	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}

