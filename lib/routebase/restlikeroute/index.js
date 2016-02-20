/* lib/restlikeroute/index.js */
'use strict';

let body = require('corps');

class RESTlikeRoute extends RouteBase {
	/**
	 * @param {enum}      method=get - method:{get,post,put,delete,head,options}
	 * @param {str-urlsafe} path       - relative path to endpoint
	 * @param {function}  code       - function code
	 * @param {int-31b}   rr         - required roles bitmask
	 * @param {int-31b}   rx         - request exceptions bitmask
	 * @param {obj}       js         - json schema object
	 */
	constructor ( method, path, ctrl, rr, rx, js ) {
		super( method, path );
		switch (true) {
			case !!(!ctrl):
				throw new Error ("parameter:code is required");
			case !!(typeof ctrl != 'function'):
				throw new TypeError("paramemter:code must be a function");
			case !!(!rr): throw  new Error ("parameter:rr is required");
			case !!(!rx): throw new Error ("parameter:rx is required");
		}
		this._ctrl = ctrl.bind(this);
		this._rr = rr;
		this._rx = rx;
		this._js = js;
	}

	get ctrl() { return this._ctrl; }
	set ctrl(func) {
		this._ctrl = func.bind(this);
	}

	authorize ( req, res ) {
		switch (true) {
			let retval;
			let rroles = this._rr;
			case ( !rroles ): return true;
			case ( typeof rroles != 'number' ):
				// TODO: return 500 Internal Server Error
				let error = new TypeError ('this._rr is not a number');
				F.RouterBase.respondServerError( res, req, error );
				return error;
			case ( rroles < 0 ):
				retval = new RangeError ('_rr must be a positive integer');
				break;
			case ( rroles == 0 ): retval = true; break;
			case ( req.session && req.session.user && req.session.user.roles ):
				let uroles = req.session.user.roles;
				switch (true) {
					case ( typeof uroles != 'number' ):
					case ( uroles < 0):
						retval = new TypeError ('req.session.user.roles is not a positive integer');
						break;
					default: retval = F.AUTH.hasRequiredRoles( uroles, rroles );
				} break;
			case retval = false;
		}

	}

	validateRx ( request, rx ) {
		// TODO: perform bitwise to turn rx (int) to bitwise array
		let rxarr = UTIL.toBitwiseArray ( rx );
		for ( let rx of arrRX ) {
			let key = RX.getKey(rx);
			let conditionresult = false;
			if ( RX.def[key] && RX.def[key].condition ) {
				conditionresult = eval( RX.def[key].condition );
			}
			if ( RX.def[key].type && conditionresult ) {
				throw new Errors[ RX.def[key].type ] ( RX.def[key].message, RX.def[key].code );
				//return new Errors[ RX.def[key].type ] ( RX.def[key].message, RX.def[key].code );
			}
			else if ( conditionresult ) {
				throw new Errors.BadRequestError( RX.def[key].message, RX.def[key].code );
				//return new Errors.BadRequestError( RX.def[key].message, RX.def[key].code );
			}
		}
		return true;
	}

	validateJs ( req, res, params, js ) {
		let validate = JSONvalidator(js);
		validate( params, { verbose:true } );
		if ( validate.errors && validate.errors.length > 0 ) {
			let ve = validate.errors[0];
			let val = ve.value || JSON.stringify(params);
			let msg = `${ve.field}: ${ve.message}.`;
			throw new JSONValidationError( msg, val )
			//return new JSONValidationError( msg, val );
		} else {
			return true;
		}
	}

	authorizeValidate( req, res, params, next ) {
		try {
			F.authorize( req, res, this._rr);
			F.validateRx ( req, res, this._rx);
			F.validateJs ( req, res, params, this._js)
			if (typeof next == 'function') return next(null, true);
			else return true;
		} catch ( e ) {
			if (typeof next == 'function') {
				return next(e);
			} else {
				switch (true) {

				}
			}
		}
	}

}

module.exports.RESTlikeRoute = RESTlikeRoute;
