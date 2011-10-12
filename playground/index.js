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
	devOrientation		: true,
	
	nbSpheres		: 500,
	sphereRestitution	: 1.0,
	
	withPlayer		: false,
	playerRestitution	: 1.0,

	nBodyGravity		: false,
	nBodyGravityStrength	: 10
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
		height	: 9 * 32 - 1
	});

	gui.add(opts, 'physicsSteps')		.name('physics steps').min(15).max(360);

	gui.add(opts, 'gravity');
	gui.add(opts, 'devOrientation')		.name('device orientation');

	gui.add(opts, 'nbSpheres')		.name('Number of Sphere').min(0).max(200);
	gui.add(opts, 'sphereRestitution')	.name('Sphere Restitution').min(0).max(3);

	gui.add(opts, 'withPlayer')		.name('With Player');
	gui.add(opts, 'playerRestitution')	.name('Player Restitution').min(0).max(3);

	gui.add(opts, 'nBodyGravity')		.name('n-bodies gravity');
	gui.add(opts, 'nBodyGravityStrength')	.name('n-bodies strengh').min(0).max(1.0);
}

// ## Initialize everything
function init() {
	// create the camera
	camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z	= -5000;
	// create the Scene
	scene = new THREE.Scene();

	// lights
	scene.addChild( new THREE.AmbientLight( 0x404040 ) );
	var light = new THREE.DirectionalLight( 0xffffff, 1.2 );
	light.position.set(1,1,0).normalize();
	scene.addChild( light );
				
	// build the GUI
	buildGui(pageOptions, function(){
		console.log("pageOptions", JSON.stringify(pageOptions, null, '\t'))
	});

	microphysics	= new THREEx.Microphysics({
		timeStep	: 1/pageOptions.physicsSteps
	});
	microphysics.start();


	// outter cube
	outterCubeInit();

	// inner cube
	if( true )	innerCubeInit();

	// gravity
	if( pageOptions.gravity )	gravityInit();

	spheresInit({
		nbSpheres	: pageOptions.nbSpheres
	});
	
	if( pageOptions.withPlayer )	playerInit(pageOptions.restitution);
	if( pageOptions.devOrientation)	devOrientationInit();
	if( pageOptions.nBodyGravity)	nBodyGravityInit(pageOptions.nBodyGravityStrength);

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

	if( pageOptions.withPlayer )		playerUpdate();

	microphysics.update(scene);	

	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}

