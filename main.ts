basic.forever(function()
{

	/*console.logValue("UVI", greenhouse.getuvindex())
	console.logValue("temp", greenhouse.temperature(Temperature.Celcius))*/
	
	greenhouse.printString("UVI:", false)
	greenhouse.printNumber(greenhouse.getuvindex(), true)
	
	greenhouse.printString("temperature: ", false)
	greenhouse.printNumber(greenhouse.temperature(Temperature.Celcius), true)
	
	greenhouse.printString("TVOC:", false)
	greenhouse.printNumber(greenhouse.TVOC(), true)
	
	greenhouse.printString("eCO2: ", false)
	greenhouse.printNumber(greenhouse.eCO2(), true)

	basic.pause(1000)
})