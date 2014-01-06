usemin-cssgen-scaffolding
=========================

[Grunt](http://gruntjs.com/) scaffolding to build webapps with the ability to automatically compile LESS and SASS files to CSS and the option to generate JavaScript source maps with ease. It is heavily inspired by [Yoeman](http://yeoman.io/)'s [generator-webapp](https://github.com/yeoman/generator-webapp). I really liked the concept of [grunt-usemin](https://github.com/yeoman/grunt-usemin), but I'm extremely [OCD](http://en.wikipedia.org/wiki/Obsessive%E2%80%93compulsive_disorder) about the exact things that I want. So I started building a scaffolding for myself.

The purpose behind this scaffolding is similar to [generator-webapp](https://github.com/yeoman/generator-webapp). That is you can write HTML files, which link raw JavaScript and CSS files for development. Then you can use [Grunt](http://gruntjs.com/) to process the same HTML files to generate and minify JavaScript and CSS files that are linked. Finally, new HTML files will be generated to link these minified JavaScript and CSS files.

Key Features
------------

* Any `.less` or `.sass` files will be automatically compiled to CSS.
* QA build can generate JavaScript source map.
* All `.html` files under `src` folder will be processed.
* Special commments (copyright statements) will be preserved. So feel free to link raw versions of library files for development. They will be minified with their copyrights attached for production.
* [htmlrefs](https://github.com/tactivos/grunt-htmlrefs) is ran ahead of time, so you can perform even more magic.
* The build is designed to be generic enough such that you are allowed to setup your project in any structure you like. All the magic happens when you enclose contents in your HTML with [htmlrefs](https://github.com/tactivos/grunt-htmlrefs) and [usemin](https://github.com/yeoman/grunt-usemin) blocks.

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

<!-- build:js js/views/view.js -->
<script src="js/views/home.js"></script>
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

<script src="js/views/view.js"></script>

```

Take a look at `src/index.html` for more details. Please note that everything under `src` directory serves entirely as samples. They don't actually serve any purposes as scaffolding. Please feel free to delete them.

Getting Started
---------------

Download this project however you think is feasible. (Either download ZIP or `git clone`. The choice is yours.)

Remember to change infomation in `package.json` and `bower.json` to yours.

```bash
npm install
bower install
```

If this is your first time playing with this scaffolding, please take a look at `src` directory as a sample, otherwise, delete everything under `src` directory and setup your project with your liking. (May I suggest [HTML5 Boilerplate](http://html5boilerplate.com/)?)

Annotate JavaScript and CSS tags in your HTML files with [htmlrefs](https://github.com/tactivos/grunt-htmlrefs) and [usemin](https://github.com/yeoman/grunt-usemin) blocks.

Open `Gruntfile.js` and edit `copy:assets`, `copy:dev`, `copy:prd`, `copy:qa` targets to your liking. (Feel free to add more build tasks. Scroll to the bottom of `Gruntfile.js` to see how current build tasks are registered. It should be pretty straightforward.)

Now you can build your project with: `grunt dev`, `grunt qa` and `grunt prd`. Here are the differences between these tasks.

* `grunt dev` is very straightforward. It simply copies config file in your `src` directory. You are expected to develop from your `src` directory with everything in their raw form.
* `grunt qa` copies QA configs to `dist` direcotry, then it compiles, minifies and generates JavaScript, CSS and HTML with JavaScript source maps. Everything inside `dist` directory is ready for distribution. (You should be able to just ZIP up `dist` directory and send it to QA.)
* `grunt prd` copies production configs to `dist` directory. It is very similar to QA build, except it doesn't generate JavaScript source map. Again, `dist` directory is ready for distribution.

Of course, there's `grunt clean` task to clean everything generated by [Grunt](http://gruntjs.com/).

License
-------

[BSD License](http://opensource.org/licenses/bsd-license.php) If you intend to use this project purely for scaffolding purposes, you are permitted to remove LICENSE file.
