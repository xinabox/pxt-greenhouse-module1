//% color=#444444 icon="\uf0eb" block="SL01"
namespace SL01
{
	//%shim=sl01::begin
	export function begin():boolean
	{
		return true
	}

	//%shim=sl01::poll
	export function poll()
	{
	}

	//%shim=sl01::getLUX
	export function getLUX(): number
	{
		return 1
	}

	//%shim=sl01::getUVA
	export function getUVA(): number
	{
		return 1
	}

	//%shim=sl01::getUVB
	export function getUVB(): number
	{
		return 1
	}

	//%shim=sl01::getUVIndex
	export function getUVIndex(): number
	{
		return 1
	}

	//%block="SL01 get LUX"
	export function getlux(): number
	{
		poll()
		return getLUX()
	}

	export function getuva(): number
	{
		poll()
		return getUVA()
	}

	export function getuvb(): number
	{
		poll()
		return getUVB()
	}

	//%block="SL01 get UVIndex"
	export function getuvindex(): number
	{
		poll()
		return getUVIndex()
	}

	//%shim=sl01::getHardwareID
	export function getHardwareID(): number
	{
		return 1;
	}

	//%shim=sl01::checkVersion
	export function checkVersion(): number
	{
		return 1;
	}


	begin();
}
