bs-upgrader
===========

Upgrade from Bootstrap 2.x to Boostrap 3.0 in a flash with Node.js!

Running
=======

Just copy bs-upgrader.js into the project's folder and run it with node
	$ node bs-upgrader.js

Troubleshooting
===============

Don't forget to check the beginning of the file for the variable fileType. It's pre-configured for searching .phtml (Zend's standard view file), but you can search whatever file types you want: .yml, .html, etc...