/* lib/routebase/index.js */
'use strict';
class RouteBase {
	/** { Abstract }
	 * @param {str-enum}    method=get - method:get,post,put,delete,head,options
	 * @param {str-urlsafe} path       - relative route path to endpoint
	 * @param {function}    code       - function code
	 */
	constructor ( method, path ) {
		if ( new.target === RouteBase ) throw new TypeError("Cannot construct RouterBase {abstract} instances directly");
		switch (true) {
			case !!(!method):
				method = get;

			case !!(!path):
				throw new Error ("parameter:path is required");

			case !!(typeof path != 'string'):
			case !!(!path.match(/^[a-zA-Z0-9_\-\/:]*$/)):
				throw new TypeError("parameter:path must be valid route path string (a relative path)");

		}

		this._method = method;
		this._path = path;
	}



	get path() { return this._path; }
	set path(pathstr) {
		this._path = pathstr;
	}

	get method() { return this._method; }
	set method(methodenum) {
		this._method = methodenum;
	}








}

module.exports.RouteBase = RouteBase;
