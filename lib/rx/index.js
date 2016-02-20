/* lib/rxdef */
'use strict';

let x = 0;

let rxdef = {
	"NOT_ACCEPT_JSON": {
		type:"BadHeaderError",
		condition:"!request.headers.accept || request.headers.accept.indexOf('application/json')<0",
		message:"Must accept application/json",
		value:Math.pow(2,x++)
	},
	"NOT_FORM_ENCODED": {
		type:"BadHeaderError",
		condition:"request.headers['content-type'].indexOf('application/x-www-form-urlencoded')<0",
		message:"Content-Type must be: application/x-www-form-urlencoded",
		value:Math.pow(2,x++)
	},
	"NOT_APP_JSON": {
		type:"BadHeaderError",
		condition:"!request.headers['content-type'] || request.headers['content-type'].indexOf('application/json')<0",
		message:"Content-Type must be: application/json",
		value:Math.pow(2,x++)
	},
	"ALREADY_LOGGED_IN": {
		type:"LoginError",
		condition:"request.session.user",
		message:"current session already logged in",
		value:Math.pow(2,x++)
	},
	"NOT_LOGGED_IN": {
		type:"LoginError",
		condition:"!request.session.user",
		message:"user not logged in",
		value:Math.pow(2,x++)
	},
	"NOT_FORMENCODED_OR_APPJSON": {
		type:"BadHeaderError",
		condition:"!request.headers['content-type'] || (request.headers['content-type'].indexOf('application/x-www-form-urlencoded')<0 && request.headers['content-type'].indexOf('application/json')<0)",
		message:"Request Content-Type must be: application/x-www-form-urlencoded or application/json",
		value:Math.pow(2,x++)
	}
};

let buildEnum = function ( obj ) {
	let dict = {};
	for ( let key in obj ){
		if (typeof obj[key].value == 'number') {
			dict[key] = obj[key].value;
		}
	}
	return dict;
}

module.exports.def = rxdef;
let rxenum = buildEnum ( rxdef );
module.exports.enum = rxenum;

module.exports.getKey = function getKey ( val ) {
	// search val in rxenum
	for ( let key in rxenum ) {
		if ( rxenum[key] == val ) return key;
	}
}
