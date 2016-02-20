/* lib/framework/routerbase/error/index.js */
'use strict';

const error = module.exports = {};

error.codes = require('lib/errors/codes');

error.ErrorBase = class ErrorBase /*{Abstract}*/ {
	/**
	 * @param {string}  message
	 * @param {float}   code
	 * @param (integer) httpstatus
	 */
	constructor ( message, code, httpstatus ) {
		if ( new.target === ErrorBase )
			throw new TypeError("Cannot construct ErrorBase {abstract} instances directly");
		this.message = message;
		this.code = code;
		this.httpstatus = httpstatus;
	}
}


// 400 Client Error

/** ErrorParams
 * @param {string}  message
 * @param {float}   code
 */

error.BadRequestError = class BadRequestError extends error.ErrorBase {
	/** #ErrorParams */
	constructor ( message, code ) {
		super ( message, code || Codes.BAD_REQUEST, 400 )
	}
};

error.NotFoundError = class NotFoundError extends error.ErrorBase {
	/** #ErrorParams */
	constructor ( message, code ) {
		super ( message, code || Codes.RESOURCE_NOT_FOUND, 404 )
	}
}

error.BadHeaderError = class BadHeaderError extends error.ErrorBase {
	/** #ErrorParams */
	constructor ( message, code ) {
		super ( message, code || Codes.HEADER_ERROR, 400 );
	}
}

error.LoginError = class LoginError extends error.ErrorBase {
	/** #ErrorParams */
	constructor ( message, code ) {
		super ( message, code || Codes.LOGIN_ERROR, 401 );
	}
};

error.JSONValidationError = class JSONValidationError extends error.ErrorBase {
	/** #ErrorParams */
	constructor ( message, origval, code ) {
		super ( message, code || Codes.INVALID_JSON, 400 );
		this.origValue = origval;
	}
};


// 500 Server Error

error.RequiredParameterError = class RequiredParameterError extends error.ErrorBase {
	/** #ErrorParams */
	constructor ( message, code ) {
		super ( message, code || Codes.REQ_PARAM, 500 );
		Error.captureStackTrace(this, arguments.callee);
	}
};

error.StackErrorBase = class StackErrorBase extends error.ErrorBase {
	/** { Abstract }
	 * @param {Error}
	 * @param {string} message - relative route path to endpoint
	 */
	constructor ( errobj, message, code, status ) {
		if ( new.target === StackErrorBase )
			throw new TypeError("Cannot construct StackErrorBase {abstract} instances directly");
		super ( message, code, status );
		this.errorObj = errorobj;
		Error.captureStackTrace (this, arguments.callee);
	}
}


/** StackErrorParams
 * @param {Error}  errobj
 * @param {string} message
 * @param {float}  code
 */

error.ErrorBase = class DataBaseError extends error.StackErrorBase {
	/** #StackErrorParams */
	constructor ( errobj, message, code ) {
		super ( errobj, message, code || Codes.DB_ERROR, 500 );
	}
};

error.ErrorBase = class ServerError extends error.StackErrorBase {
	/** #StackErrorParams */
	constructor ( errorobj, message, code ) {
		super ( errobj, message, code || Codes.SERVER_ERROR, 500 );
	}
};

error.ErrorBase = class AWSError extends error.StackErrorBase {
	/** #StackErrorParams */
	constructor ( errorobj, message, code ) {
		super ( errobj, message, code || Codes.AWS_ERROR, 500 );
	}
};
