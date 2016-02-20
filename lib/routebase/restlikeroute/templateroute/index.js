/* lib/routebase/restlikeroute/templateroute/index.js */

const RESTlikeRoute = require ('RESTlikeRoute');

class TemplateRoute extends RESTlikeRoute {

	constructor ( method, url, code, rx, jss, template ) {
		super( method, url, code, rx, jss );
		this.template = template;
	}

}
