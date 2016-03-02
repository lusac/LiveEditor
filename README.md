LiveEditor
==========
open source live editor for webpages.


Developer
=========

### Server Start
To see index example working, you should start an HTTP server.
Run `make run` then access `http://localhost:8888/index.html`


### Static build
To update the static dist, you should have `npm` in your enviroment.
Inside LiveEditor directory:

`npm install`

Then:

`npm run build`

### Test
We use jasmine to write tests.
To run tests use `make test`.
