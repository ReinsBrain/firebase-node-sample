/* routers/user/index.js */
'use strict';

class UserRouter extends RouterBase {

	constructor ( arrRoutes ) {
		super();

		for ( route in arrRoutes ) {
			use(route);
		}

	}
}

module.exports = UserRouter;
