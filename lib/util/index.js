/* lib/util/index.js */
'use strict';

exports.registerRoutes = function registerRoutes ( app, arrRouters ) {
	for ( let router of arrRouters ) {
		var rtr = require(router);
		var rtrInstance = new rtr();
		app.use('/', rtrInstance.expressRouter);
	}
};

exports.toBitwiseArray = function toBitwiseArray ( intmask ) {
	let bwarr = [];
	for ( let x=31; x >= 0; x--) {
		if ( intmask >> x == 0 ) continue;
		else bwarr.push(Math.pow(2,x));
	}
	return bwarr;
}

exports.parseHeader = function parseHeader ( header, value ) {
	switch ( header ) {
		case 'forwarded': // RFC 7239
			// for=192.0.2.60, for=198.51.100.17;proto=http;by=203.0.113.43
			let retval = {};
			let arr = value.split(";");
			for ( let e of arr1 ) {
				let arr = e.split(/ *, */);
				for ( let e of arr2 ) {
					let arr = e.split("=");
					if ( retval[ e[0] ] ) retval[ e[0] ].push( e[1] );
					else {
						retval[ e[0] ] = [];
						retval[ e[0] ].push( e[1] );
					}
				}
			}
			return retval;

		case 'x-forwarded-for': // replaced by RFC 7239
			// X-Forwarded-For: client, proxy1, proxy2
			return value.split(/ *, */).filter(Boolean).reverse();

		case 'x-forwarded-proto': // replaced by RFC 7239
			return value.trim();

		default: throw new Error("header not handled:" + header);
	}
};
