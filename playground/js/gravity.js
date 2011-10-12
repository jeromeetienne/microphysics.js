function gravityInit()
{
	gravity	= new vphy.LinearAccelerator({
		x	: 0, 
		y	: -9.8 * 250,
		z	: 0
	});
	microphysics.world().add(gravity);
}