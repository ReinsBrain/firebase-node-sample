/* lib/routerbase/index.js */
'use strict';

class RouterBase {

	constructor () {
		this.routes = [];
		this.mwares = [];
	}

	use ( routebase ) {
		if ( !routebase.method ) this.mwares.push( routebase );
		else this.routes.push(routebase);
	}


	static buildPassthroughObj ( body, params ) {
		let passthrough = {};
		if ( typeof body == 'object') {
			for ( let bodykey in body ) {
				if ( body.hasOwnProperty(bodykey) ) {
					passthrough[bodykey] = body[bodykey];
				}
			}
		}
		if ( typeof params == 'object') {
			for ( let prmskey in params ) {
				if ( params.hasOwnProperty(prmskey) ) {
					passthrough[prmskey] = params[prmskey];
				}
			}
		}
		return passthrough;
	};

	static buildResponseObj ( passthrough, type, code, dataObj, stripNull, audit ) {
		let _removeNulls = function _removeNulls ( obj ) {
			if ( obj instanceof Array ) {
				for ( let j in obj ) {
					return _removeNulls( obj[j] );
				}
			}
			for ( let k in obj ) {
				if ( obj[k]===null ) {
					delete obj[k];
				} else if ( typeof obj[k]=="object" ) {
					_removeNulls( obj[k] );
				}
			}
		};

		var resObj = {};
		if ( passthrough ) {
			for ( var key in passthrough ) {
				if ( key.indexOf('#') === 0 ) {
					resObj[key] = passthrough[key];
				}
			}
		}
		if ( stripNull ) {
			_removeNulls(dataObj);
		}
		if ( dataObj ) resObj.data = dataObj;
		if ( type ) resObj.type = type;
		if ( code ) resObj.code = code;
		if ( audit && typeof audit == 'object' ) {
			for ( let k in audit ) {
				if ( audit.hasOwnProperty(k) && ( k != 'type' || k != 'data' ) )
				resObj[k] = audit[k];
			}
		}
		if ( Object.keys( resObj ).length > 0 ) return resObj;
		else return void 0;
	}

	static wrapSuccessDataObj ( dataObj, type, stripNulls ) {
		if (typeof type == 'boolean') {
			stripNulls = type;
			type = undefined;
		}
		var dataObjWrapper = {};
		dataObjWrapper.type = type;
		dataObjWrapper.data = dataObj;
		dataObjWrapper.stripNulls = stripNulls;
		return dataObjWrapper;
	}

	static respondServerError ( req, res, errObj ) {
		var statusCode = 500;
		var responseData = {};
		var code = null;
		if ( errObj ) {
			statusCode = errObj.httpStatusCode?errObj.httpStatusCode:statusCode;
			code = errObj.code || null;
		}
		responseData.message = "Server Error";
		var type = "error";
		var passthrough = RouterBase.buildPassthroughObj( req.body, req.params );
		var resJSON = RouterBase.buildResponseObj( passthrough, type, code, responseData, false );
		response.set( 'Content-Type', 'application/json' );
		if ( code ) response.set( 'X-Error-Code', code.toString() );
		return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	}

	static respondInvalidRequest ( response, request, errObject ) {
		var responseData = {};
		responseData.message = "Invalid Request Error";
		var type = "Request_Invalid_Error";
		var statusCode = 400;
		code = null;
		// NOTE: overrides supplied by errObject
		if ( errObject ) {
			//if ( errObject.log ) errObject.log();
			type = errObject.constructor.name;
			code = errObject.code || null;
			responseData.message = errObject.message ? errObject.message : responseData.message;
			if (errObject.value) {
				responseData.value = errObject.value;
			}
			statusCode = errObject.httpStatusCode ? errObject.httpStatusCode : statusCode;
		}
		var resJSON = RouterBase.buildResponseObj( request, type, code, responseData, false );
		response.set('Content-Type', 'application/json');
		if ( code ) response.set( 'X-Error-Code', code.toString() );
		return response.status(statusCode).send(JSON.stringify(resJSON));
	}

	static respondNotAuthorized ( response, request, errObject ) {
		var statusCode = 401;
		var responseData = {};
		responseData.message = "Authorisation error";
		var type = "Request_Authorisation_Error";
		var code = null;
		if ( errObject ) {
			type = errObject.constructor.name;
			code = errObject.code || null;
			responseData.message = errObject.message?errObject.message:responseData.message;
			statusCode = errObject.httpStatusCode?errObject.httpStatusCode:statusCode;
		}
		var resJSON = RouterBase.buildResponseObj( request, type, code, responseData, false );
		response.set('WWW-Authenticate', 'application/x-www-form-urlencoded');
		response.set('Content-Type', 'application/json');
		if ( code ) response.set( 'X-Error-Code', code.toString() );
		return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	}

	static respondForbidden ( response, request, errObject ) {
		var statusCode = 403;
		var responseData = {};
		responseData.message = "Forbidden";
		var type = "Request_Authorisation_Error";
		var code = null;
		if ( errObject ) {
			type = errObject.constructor.name;
			code = errObject.code || null;
			responseData.message = errObject.message?errObject.message:responseData.message;
			statusCode = errObject.httpStatusCode?errObject.httpStatusCode:statusCode;
		}
		var resJSON = RouterBase.buildResponseObj( request, type, code, responseData, false );
		//response.set('WWW-Authenticate', 'application/x-www-form-urlencoded');
		response.set('Content-Type', 'application/json');
		if ( code ) response.set( 'X-Error-Code', code.toString() );
		return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	}

	static respondNotFound ( response, request, errObject ) {
		var statusCode = 404;
		var responseData = {};
		responseData.message = "Resource not found";
		var type = "error";
		var code = null;
		if ( errObject ) {
			type = errObject.constructor.name;
			code = errObject.code || null;
			responseData.message = errObject.message?errObject.message:responseData.message;
			statusCode = errObject.httpStatusCode?errObject.httpStatusCode:statusCode;
		}
		var resJSON = RouterBase.buildResponseObj( request, type, code, responseData, false );
		//response.set('WWW-Authenticate', 'application/x-www-form-urlencoded');
		response.set('Content-Type', 'application/json');
		if ( code ) response.set( 'X-Error-Code', code.toString() );
		return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	}

	static respondServerError ( response, request, errObj ) {
		var statusCode = 500;
		var responseData = {};
		var code = null;
		if ( errObj ) {
			statusCode = errObj.httpStatusCode?errObj.httpStatusCode:statusCode;
			code = errObj.code || null;
		}
		responseData.message = "Unexpected Error";
		var type = "error";
		var passthrough = RouterBase.buildPassthrough( request.body, request.params );
		var resJSON = this.buildResponseObj( passthrough, type, code, responseData, false );
		response.set( 'Content-Type', 'application/json' );
		if ( code ) response.set( 'X-Error-Code', code.toString() );
		return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	}

	static respondNotImplemented ( response, request, errObj ) {
		var statusCode = 501;
		var responseData = {};
		var code = null;
		var type = "error";
		var passthrough = RouterBase.buildPassthrough( request.body, request.params );
		if ( errorObj ) {
			statusCode = errObj.httpStatusCode?errObj.httpStatusCode:statusCode;
			code = errObj.code || null;
		}
		responseData.message = "Not Implemented;";
		var resJSON = this.buildResponseObj( passthrough, type, code, responseData, false );
		response.set( 'Content-Type', 'application/json' );
		if ( code ) response.set( 'X-Error-Code', code.toString() );
		return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	}

	static respondSuccessRequest ( response, request, wrappedData, altStatus, code, audit ) {
		var statusCode = altStatus || 200;
		code = code || null;
		if ( wrappedData ) {
			var responseData = wrappedData.data ? wrappedData.data : {};
			responseType = wrappedData.type ? wrappedData.type : "success";
			statusCode = wrappedData.httpStatusCode ? wrappedData.httpStatusCode : statusCode;
			var stripNulls = wrappedData.stripNulls;
			var resJSON = RouterBase.buildResponseObj( request, responseType, code, responseData, stripNulls, audit );
			response.set( 'Content-Type', 'application/json' );
			response.status( statusCode ).send( JSON.stringify( resJSON ) );
			return resJSON;
		} else {
			if ( request && request.body ) {
				var respObj = RouterBase.buildResponseObj( request.body );
				if ( respObj ) return response.status( statusCode ).send( JSON.stringify( respObj ) );
				else return response.status( statusCode ).send();
			} else return response.status( statusCode ).send();
		}
	}

	static respondTemplate ( response, request, html, altStatus ) {
		var statusCode = altStatus || 200;
		return response.status( statusCode ).send( html );
	}

	static respondRedirect ( response, headers, statusCode, noWrapDataStr ) {
		statusCode = statusCode || 307;
		if ( noWrapDataStr && ( typeof noWrapDataStr != 'string' ) ) {
			// TODO : handle this error condition
		}
		if ( headers ) {
			if ( typeof headers == 'object' ) {
				for ( var key in headers ) {
					response.set( key, headers[key] );
				}
			} else {
				// TODO : handle this error condition
			}
		}
		if ( noWrapDataStr ) return response.status( statusCode ).send( noWrapDataStr );
		else {
			return response.status( statusCode ).send();
		}
	}


}

module.exports = RouterBase;
