/* server.js
 * Simple express web server to manage firebase authentication, authorization
 * and simple firebase triggers, templates and other interesting features
 * to support a single-page web-app based around firebase
 */
/*jshint node:true*/
'use strict';

require('dotenv').config();
require('app-module-path').addPath(__dirname);

const path = require('path');
const compression = require('compression');
const methodOR = require('method-override');
const nunjucks = require('nunjucks');


// handy stuff on global
global.UTIL = require('lib/util');

let logger = require('lib/logger');
global.Logger = new logger(process.env.NODE_ENV);

global.RouterBase = require('lib/routerbase');

global.JSONvalidator = require('is-my-json-valid');

global.Errors = require('lib/errors');

global.RX = require('lib/rx');

// Initialise express app
const app = require('express')();

// cors and body-parser middleware
app.use( require('cors')() );

// gzip deflate compression over http
app.use( compression( { threshold: 512 } ) );

// simple clients (GET/POST) can make REST calls (put/patch/delete/head/options)
app.use( methodOR('X-HTTP-Method-Override') );


/* NOTE: getting rid of body-parser with corps:
 * https://github.com/expressjs/body-parser/issues/122
 * app.use( require('body-parser').json() );
 * var body = require('corps');
 */

// TRUST_PROXY
let tp = process.env.TRUST_PROXY || false;
if ( !( tp === false || tp == 'false' || tp == '0' ) ) {
	app.enable('trust proxy');
}

// STATIC_DIR
let staticDir = process.env.STATIC_DIR || null;
if ( staticDir ) {
	staticDir = path.resolve( __dirname, staticDir );
	let staticRUrl = process.env.STATIC_RURL || "/static";
	app.use( staticRUrl, express.static( __dirname +  path.join("/", staticDir )));
	F.logger.info ("Static directory: " + staticDir + " exposed at: " + staticRUrl );
}

// redirect to https when in production
if ( process.env.NODE_ENV === 'production' ) {
	let forceSsl = function(req, res, next) {
		let proto;
		let forwarded = req.headers['forwarded'];
		if ( forwarded ) {
			let parsed = F.parseHeader( 'forwarded', forwarded );
			if ( parsed.proto && parsed.proto.length > 0 ) {
				proto = parsed.proto[0];
			}
		}
		if ( !proto ) {
			proto = req.headers['x-forwarded-proto']
		}
		if ( proto !== 'https') {
			return res.redirect( 301, 'https://' + req.get('Host') + req.url );
		}
		return next();
	};
	app.use(forceSsl);
}

app.set('strict routing', true);

app.set('case sensitive routing', true);

global.Template_Env = nunjucks.configure( 'views',{ autoescape:true, express:app } );
//* need filters? https://mozilla.github.io/nunjucks/api.html#custom-filters
/*
	Template_Env.addFilter('asset', function (assetpath) {
	var asset_url = "/path/to/assets";
	return asset_url + assetpath;
});
*/
app.engine( 'nunj', nunjucks.render );
app.set('view engine', 'nunj');



var routers = [ "routers/user" ];

UTIL.registerRoutes( app, routers );


app.set('port', ( process.env.PORT || 8888 ));
app.listen( app.get('port'), function() {
	'use strict';
	Logger.info(`Node app is running on port ${ app.get('port') }`);
});
