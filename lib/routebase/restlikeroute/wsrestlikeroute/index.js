/* lib/routebase/index.js */

class RouteBase {

	static helpermethod ( arg ) {
		return Math.pow(arg,3);
	}

	constructor ( param ) {
		// NOTE: Abstract
		if ( new.target === RouteBase ) throw new TypeError("Cannot construct RouterBase {abstract} instances directly");
		this.param = param;
	}

	toString() {
		return "super";
	}

	get gettersetter() {
		return localfunction();
	}

	set gettersetter(str) {
		this.param = str;
	}

	localfunction() {
		let a = `hello ${this.param}`;
		return a;
	}

}

class RESTlikeRoute extends RouteBase {

	constructor ( param, p2 ) {
		super(param);
		this.p2 = p2;
	}

	localfunction() {
		let a = `hello ${this.param} ... and ${this.p2}`;
		return a;
	}

}

class TemplateRoute extends RouteBase {
	constructor ( param, p2 ) {
		super(param);
		this.p2 = p2;
	}
}

class WSRESTlikeRoute extends RESTlikeRoute {
	constructor ( param, p2 ) {
		super ( param, p2);
	}
}
