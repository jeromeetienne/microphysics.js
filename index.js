// This source is the javascript needed to build a sky box in **three.js**
// It is the source about this [blog post](/blog/2011/08/15/lets-do-a-sky/).

// ## Now lets start

// declare a bunch of variable we will need later
var startTime	= Date.now();
var container;
var camera, scene, renderer, stats;
var microphysics;
var player;
var deviceOrientation, keyboard;
var gravity;

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

	microphysics	= new THREEx.Microphysics({
		timStep	: 1/180
	});
	microphysics.start();

	deviceOrientation	= new THREEx.DeviceOrientationState();
	keyboard		= new THREEx.KeyboardState();

	// outter cube
	addOutterCube();

	// inner cube
	if( true ){
		var geometry	= new THREE.CubeGeometry(200,200,200, 10, 10, 10);
		var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
		var mesh	= new THREE.Mesh(geometry, material);
		mesh.position.x	= 200; 
		mesh.position.y	= -400+100;
		scene.addChild(mesh);
		microphysics.addMesh(mesh, {
			restitution	: 2.0
		});
	}

	// gravity
	gravity	= new vphy.LinearAccelerator({
		x	: 0, 
		y	: -9.8 * 250,
		z	: 0
	});
	microphysics.world().add(gravity);

	for( var i = 0; i < 2; i++ ){
		var mesh	= new THREE.Mesh(new THREE.SphereGeometry(70, 10, 5), new THREE.MeshNormalMaterial());
		mesh.position.x	= 	(2*Math.random()-1) * 30;
		mesh.position.y	= 150 + (2*Math.random()-1) * 75;
		mesh.position.z	= 	(2*Math.random()-1) * 30;

		microphysics.addMesh(mesh, {
			restitution	: 1.0
		});

		scene.addChild(mesh);		
	}

	if( true ){
		mesh	= new THREE.Mesh(new THREE.SphereGeometry(70, 50, 25), new THREE.MeshNormalMaterial());
		mesh.position.x	= 	(2*Math.random()-1) * 30;
		mesh.position.y	= 150 + (2*Math.random()-1) * 75;
		mesh.position.z	= 	(2*Math.random()-1) * 30;
		mesh.position.x	= 0;
		mesh.position.y	= 0;
		mesh.position.z	= 0;
		microphysics.addMesh(mesh, {
			restitution	: 1.0
		});
		scene.addChild(mesh);
		player	= mesh;
		
		microphysics.world().add({
			type: vphy.types.ACCELERATOR,
			perform: function(){
				var acc	= 1*250;
				if( keyboard.pressed('right') )	player._vphyBody.accelerate(-acc,0,0);
				if( keyboard.pressed('left') )	player._vphyBody.accelerate(acc,0,0);
				if( keyboard.pressed('up') )	player._vphyBody.accelerate(0,0,acc);
				if( keyboard.pressed('down') )	player._vphyBody.accelerate(0,0,-acc);
			}
		});		
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

// change gravity based on device orientation 
(function(){
return;
	var vector	= new THREE.Vector3(0, -10 * 250, 0);
	var angleX	= deviceOrientation.angleX();
	var angleZ	= deviceOrientation.angleZ();
	
	var srcMatrix	= new THREE.Matrix4();
	srcMatrix.setPosition(vector);
	//angleY		= Math.PI;
	
	var rotMatrix	= new THREE.Matrix4();
	rotMatrix.multiplySelf(new THREE.Matrix4().setRotationX(angleX));
	rotMatrix.multiplySelf(new THREE.Matrix4().setRotationZ(-angleZ)); 

	rotMatrix.multiplySelf(srcMatrix);
	var position	= rotMatrix.getPosition();

	gravity.direction.x	= position.x;
	gravity.direction.y	= position.y;
	gravity.direction.z	= position.z;
}());
	
	microphysics.update(scene);	

	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}


function addOutterCube(){
	var thickness	= 10;
	var width	= 1400;
	var height	= 800;
	var depth	= 800;
	var restitution	= 1.0;
	
	var geometry	= new THREE.CubeGeometry(width,thickness,depth, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.y	= -height/2;
	scene.addChild(mesh);
	microphysics.addMesh(mesh, {
		restitution	: restitution
	})

	var geometry	= new THREE.CubeGeometry(width,thickness,depth, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.y	= +height/2;
	scene.addChild(mesh);
	microphysics.addMesh(mesh)

	var geometry	= new THREE.CubeGeometry(thickness, height, depth, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.x	= +width/2;
	scene.addChild(mesh);
	microphysics.addMesh(mesh)

	var geometry	= new THREE.CubeGeometry(thickness,height,depth, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.x	= -width/2;
	scene.addChild(mesh);
	microphysics.addMesh(mesh)

	var geometry	= new THREE.CubeGeometry(width,height,thickness, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ),new THREE.MeshNormalMaterial()];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.z	= +depth/2;
	scene.addChild(mesh);
	microphysics.addMesh(mesh)

	var geometry	= new THREE.CubeGeometry(width, height, thickness, 10, 10, 10, [], true);
	var material	= [new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } )];
	var mesh	= new THREE.Mesh(geometry, material);
	mesh.position.z	= -depth/2;
	scene.addChild(mesh);
	microphysics.addMesh(mesh)
}