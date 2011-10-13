var gravity;
function gravityInit()
{
	if( gravity )	return;
	gravity	= new vphy.LinearAccelerator({
		x	: 0, 
		y	: -9.8 * 250,
		z	: 0
	});		
	microphysics.world().add(gravity);
}

function gravityDestroy()
{
	if( !gravity )	return;
	microphysics.world().remove(gravity);
	gravity	= null;
}
