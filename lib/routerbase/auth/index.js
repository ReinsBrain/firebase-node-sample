/* lib/framework/auth/index.js */
/* authorization (not authentication) */
'use strict';

exports.roles = {
	anonymous:0,
	registered:Math.pow(2,0),
	capitulated:Math.pow(2,1),
	verified:Math.pow(2,2),
	super:Math.pow(2,30)
};

var _required = function _required ( uroles, rroles ) {
	var filtered = ( uroles & rroles ); /* jshint ignore:line */
	return !( filtered ^ rroles ); /* jshint ignore:line */
};

// NOTE: returns false when a role in uroles is matched in rroles
var _denied = function _denied ( uroles, rroles ) {
	return !( uroles & rroles ); /* jshint ignore:line */
};

exports.hasRequiredRoles = _required;
exports.hasNoDeniedRoles = _denied;
