/* lib/logger/index.js */
var os = require('os');

function Logger ( mode ) {
	mode = mode || "development";
	var _modes = {"development":0,"testing":1,"staging":2,"production":3};
	if ( typeof _modes[mode] == 'undefined' ) throw new Error("not a valid mode");
	else this.mode = mode;
	var _self = this;
	var _severityArr = ["DEBUG","INFO","WARN","ERROR","FATAL"];
	var _severity = {"DEBUG":0,"INFO":1,"WARN":2,"ERROR":3,"FATAL":4};
	var _emitLogEntry = function ( severity, error ) {
		//var p = os.platform(); var t = os.type(); var a = os.arch();
		if ( typeof _severityArr[severity] == 'undefined' ) throw new Error("not a valid severity");
		else {
			if ( severity===0 && _modes[_self.mode] > 1 ) return false;
			else {
				var h = os.hostname(); var r = os.release(); var u = os.uptime(); var l = os.loadavg();
				var timestamp = new Date().toISOString();
				var message = "";
				switch ( true ) {
					case ( error instanceof Error ): message = error.stack; break; // TODO: prepend exact type of error (constructor name)
					case ( typeof error == 'string' ): message = error; break;
					case ( typeof error == 'object' ):
						try { message = JSON.stringify ( error ); }
						catch (e) { message = error.toString(); }
						break;
					default: message = error.toString(); break;
				}
				var frmtverbose = "%s h=%s r=%s u=%s l=%s >>>>>%s %s<<<<<";
				var frmt = "%s >>>>>%s %s<<<<<";
				switch ( severity ) {
					case _severity.DEBUG: return console.log  ( frmt, timestamp, "DEBUG", message );
					case _severity.INFO:  return console.info ( frmt, timestamp, "INFO", message );
					case _severity.WARN:  return console.warn ( frmtverbose, timestamp, h, r, u, l, "WARN", message );
					case _severity.ERROR: return console.error( frmtverbose, timestamp, h, r, u, l, "ERROR", message );
					case _severity.FATAL: return console.error( frmtverbose, timestamp, h, r, u, l, "FATAL", message );
					default: return false;
				}
			}
		}
	};
	this.debug = function ( msgErr ) { return _emitLogEntry( 0, msgErr ); };
	this.info  = function ( msgErr ) { return _emitLogEntry( 1, msgErr ); };
	this.warn  = function ( msgErr ) { return _emitLogEntry( 2, msgErr ); };
	this.error = function ( msgErr ) { return _emitLogEntry( 3, msgErr ); };
	this.fatal = function ( msgErr ) {
		// TODO: attempt an instant notification
		return _emitLogEntry( 4, msgErr );
	};
}

module.exports = Logger;
