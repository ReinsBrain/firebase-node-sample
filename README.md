


# etc/hosts
Entry is automatically made in vagrant environment but you'll need to add the
same to your local hosts file:

192.168.100.100		local.firebase-node-sample

once added you can simply visit: http://local.firebase-node-sample:8888
which maps to http://192.168.100.100:8888


# debugging #

## Chrome Debugging ##
chrome://flags/#enable-javascript-harmony


vagrant ssh into the box, locate the project at /srv/firebase-node-sample

$ node-inspector & # running in the background
$ node --debug-brk --harmony server.js

goto local browser: http://local.firebase-node-sample/?port=5858


#Bleeding edge problems#
- node-inspector just hangs after initial connection with chrome
(even after enabled es6 javacript in chrome:flags and --harmony in node )
- solution?

- there is a bug with NPM install :https://github.com/npm/npm/issues/10768
which you can get around by installing from local host if you have an older
version of npm (problem is with npm --version : 3+ ) 
