# project-base---gulp
Base structure for HTML projects using gulp

## Prerequisites
- Basic familiarity with [SCSS] will be very helpful.
- Terminal/command line access on your local environment is necessary for building the compiled JavaScript and CSS.

## Build Setup

``` bash
##################
#  REQUIREMENTS  #
##################

# install dependencies (from command line in siteroot directory)
$ npm install


#################
#  DEVELOPMENT  #
#################

# 1. install http-server globally <https://github.com/indexzero/http-server>
$ npm install http-server -g

# 2. run http-server (defaults to localhost:8080)
$ http-server

# 3. serve pages with auto-reload and sourcemaps for debugging at localhost:3000 (expects http-server to be running at localhost:8080; update port in `gulpfile.js` if necessary)
$ gulp


################
#  PRODUCTION  #
################

# build minified CSS/JS for deployment (removes sourcemaps)
$ gulp build
```

[SCSS]: https://sass-lang.com/guide
