setTimeout(function () {
	// pattern bytes
	var pattern = "ff 03 05 d1 fd 7b 0f a9 fa 67 10 a9 f8 5f 11 a9 f6 57 12 a9 f4 4f 13 a9 08 0a 80 52 48 00 00 39 16 54 40 f9 56 07 00 b4 c8 02 40 f9"
	// library name
	var module = "libflutter.so"
	// define your arm version
	var armversion = 8
	// expected return value
	var expectedReturnValue = true
	
	// random string, you may ignore this
	console.log("Horangi - Bypass Flutter SSL Pinning")
	// enumerate all process
	Process.enumerateModules().forEach(v => {
		// if the module matches with our library
		if(v['name'] == module) {
			// debugging purposes
			console.log("Base: ", v['base'], "| Size: ", v['size'], "\n")
			// scanning memory - synchronous version
			// compare it based on base, size and pattern
			Memory.scanSync(v['base'], v['size'], pattern).forEach(mem => {
				// assign address to variable offset
				var offset = mem['address']
				if(armversion === 7) {
					// armv7 add 1
					offset = offset.add(1)
				}
				// another debugging purposes
				console.log("Address:",offset,"::", mem['size'])
				// hook to the address
				Interceptor.attach(offset, {
					// when leaving the address, 
					onLeave: function(retval) {
						// execute this debugging purpose (again)
						console.log("ReturnValue",offset,"altered from", +retval,"to", +expectedReturnValue)
						// replace the return value to expectedReturnValue
						retval.replace(+expectedReturnValue);
					}
				})
			})
		}
	});
}, 1000) // wait for 1 sec until the app load the library.
