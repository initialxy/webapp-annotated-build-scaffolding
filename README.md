webapp-annotated-build-scaffolding
==================================

[Grunt](http://gruntjs.com/) scaffolding to build [LESS](http://lesscss.org/), [SASS](http://sass-lang.com/), [JavaScript source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/), [AMD](http://requirejs.org/docs/optimization.html) and [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) for web apps based on annotated HTML. It is heavily inspired by [Yoeman](http://yeoman.io/)'s [generator-webapp](https://github.com/yeoman/generator-webapp). I really liked the concept of [grunt-usemin](https://github.com/yeoman/grunt-usemin), but I'm extremely obsessed with the exact things that I want. So I started building a scaffolding for myself.

The purpose behind this scaffolding is similar to [generator-webapp](https://github.com/yeoman/generator-webapp). That is you can write HTML files, which link raw JavaScript and CSS files for development. Then you can use [Grunt](http://gruntjs.com/) to process the same HTML files to generate and minify JavaScript and CSS files that are linked. Finally, new HTML files will be generated to link these minified JavaScript and CSS files.

Key Features
------------

* The build is designed to be generic enough such that you are allowed to setup your project in any structure you like. All the magic happens when you enclose contents in your HTML with [htmlrefs](https://github.com/tactivos/grunt-htmlrefs) and [usemin](https://github.com/yeoman/grunt-usemin) blocks.
* All `.html` files under `src` folder will be processed and relative path will be resolved correctly. (There's a workaround implemented to address [this issue](https://github.com/yeoman/grunt-usemin/issues/184).)
* JavaScript, CSS and HTML will be minified.
* Special commments (copyright statements) will be preserved. So feel free to link raw versions of library files for development. They will be minified with their copyrights attached for production.
* Any `.less` or `.sass` files will be automatically compiled to CSS.
* QA build generates JavaScript source map and all the annoying configs are taken care of for you.
* [htmlrefs](https://github.com/tactivos/grunt-htmlrefs) is ran ahead of time, so you can perform even more magic.
* Build AMD modules and dependencies with [RequireJS Optimizer](http://requirejs.org/docs/optimization.html).
* Build CommonJS modules and dependencies with [Browserify](http://browserify.org/).
* [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) integration such that CommonJS modules can be built whenever changes are saved.

Samples
-------

Given the following HTML:

```html
<!-- build:css css/libs.css -->
<link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.css">
<!-- endbuild -->

<!-- build:js js/libs.js -->
<script src="../bower_components/jquery/jquery.js"></script>
<script src="../bower_components/bootstrap/dist/js/bootstrap.js"></script>
<!-- endbuild -->

<!-- build:css css/main.css -->
<link rel="stylesheet/less" href="css/sample.less">
<!-- endbuild -->

<!-- build:js js/main.js -->
<script src="config/config.js"></script>
<script src="js/sample.js"></script>
<!-- endbuild -->

<!-- ref:remove -->
<script type="text/javascript">var less=less||{};less.env='development';</script>
<script src="../bower_components/less/dist/less-1.5.1.min.js"></script>
<!-- endref -->
```

It will be built to the following:

```html
<link rel="stylesheet" href="css/libs.css"/>

<script src="js/libs.js"></script>

<link rel="stylesheet" href="css/main.css"/>

<script src="js/main.js"></script>
```

Take a look at `src/index.html` for more details.

To build AMD modules, use the special `amd` build type.

```html
<!-- build:amd js/amd/amd.js -->
<!-- ref:js js/amd/main.js -->
<script src="../bower_components/requirejs/require.js" data-main="js/amd/main"></script>
<!-- endref -->
<!-- endbuild -->
```

It will be built to the following:

```html
<script src="js/amd/amd.js"></script>
```

You can see that in the above example, it uses nested `htmlrefs` ahead of usemin to perform magic. For more details, please see `src/amd1.html` and `src/amd2.html`.

To build CommonJS modules, use the special `commonjs` build type.

```html
<!-- build:commonjs js/commonjs/main.js -->
<script src="js/commonjs/start.js"></script>
<!-- endbuild -->
```

It will be built to the following:

```html
<script src="js/commonjs/main.js"></script>
```

For more details, please see `src/commonjs.html`.

Please note that everything under `src` directory serves entirely as samples. They don't actually serve any purposes as scaffolding. Please feel free to delete them.

Getting Started
---------------

Download this project however you think is feasible. Either download ZIP or

```bash
git clone https://github.com/initialxy/webapp-annotated-build-scaffolding.git
```

The choice is yours.

Remember to change infomation in `package.json` and `bower.json` to yours. You probably don't want to remove any dependencies from `package.json` unless you really know what you are doing. But feel free to change all the dependencies in `bower.json`, which serves purely as example.

Run:

```bash
npm install -g grunt-cli
npm install -g bower
npm install
bower install
```

If this is your first time playing with this scaffolding, please take a look at `src` directory as a sample, otherwise, delete everything under `src` directory and setup your project with your liking. (May I suggest [HTML5 Boilerplate](http://html5boilerplate.com/)?)

Annotate JavaScript and CSS tags in your HTML files with [htmlrefs](https://github.com/tactivos/grunt-htmlrefs) and [usemin](https://github.com/yeoman/grunt-usemin) blocks.

Open `Gruntfile.js` and edit `copy:assets`, `copy:dev`, `copy:qa`, `copy:prd` targets to your liking. (Feel free to add more build tasks. Scroll to the bottom of `Gruntfile.js` to see how current build tasks are registered. It should be pretty straightforward.)

Now you can build your project with: `grunt dev`, `grunt qa` and `grunt prd`. Here are the differences between these tasks.

* `grunt dev` is very straightforward. It simply copies development configs to your `src` directory. You are expected to develop from your `src` directory with everything in their raw form.
* `grunt qa` copies QA configs to `src` as well as `dist` direcotry. It then compiles, minifies and generates JavaScript, CSS and HTML with JavaScript source maps. Everything inside `dist` directory is ready for distribution. (You should be able to just ZIP up `dist` directory and send it to QA.)
* `grunt prd` copies production configs to `src` as well as `dist` direcotry. It is very similar to QA build, except it doesn't generate JavaScript source map. Again, `dist` directory is ready for distribution.

Due to the fact that [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) moduels need to be wrapped by [Browserify](http://browserify.org/) before running in a browser, there are tasks to make it more convenient.

* `devCommonJs` builds [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) modules with minimun amount of process. It does not perform any kind of minification or even full clean to keep things running as fast as possible. But we will have to run your app from `dist` directory instead.
* `watch:devCommonJs` uses [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) to watch changes you make. It will automatically run `devCommonJs` task whenever you save files. You should take a quick look at the `watch` task configs in `Gruntfile.js` to make sure that it ignored all the files you modify during build to avoid infinite build calls.

Additionally, there's a `watch:dev` task to watch for changes to config files then run `dev` task. This taks could come in handy when you are actively editing your config files, otherwise it's pretty useless.

Of course, there's `grunt clean` task to clean everything generated by [Grunt](http://gruntjs.com/).

License
-------

[BSD License](http://opensource.org/licenses/bsd-license.php) If you intend to use this project purely for scaffolding purposes, you are permitted to remove LICENSE file.

