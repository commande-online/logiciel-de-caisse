// Karma configuration
// Generated on Tue Oct 06 2015 20:24:56 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '', ///home/badspeed/Projets/col2/mycol2/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        // Libs
        'libs/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'libs/angular-material/angular-material.js',
        'libs/angular-material/angular-material-mocks.js',
        'libs/angular-animate/angular-animate.js',
        'libs/angular-aria/angular-aria.js',

        // Modules from COL
        'indexedDB/indexedDB-service.js',

        'carts/carts-factory.js',
        'carts/carts-service.js',

        'categories/categories-factory.js',
        'categories/categories-service.js',

        'products/products-factory.js',
        'products/products-service.js',

        'medias/medias-factory.js',
        'medias/medias-service.js',

        'pages/pages-factory.js',
        'pages/pages-service.js',

        'templates/templates-factory.js',
        'templates/templates-service.js',

        'users/users-factory.js',
        'users/users-service.js',

        'shops/shops-factory.js',
        'shops/shops.language-service.js',

        // To be replaced
        'modules/*.js',
        'services/*.js',

        // The app
        'app.js',
        //'*.html',

        // Specs / Tests
        'carts/carts-factory.specs.js',
        'carts/carts-service.specs.js',
        'categories/categories-factory.specs.js',
        'categories/categories-service.specs.js',
        'indexedDB/indexedDB-service.specs.js',
        'products/products-factory.specs.js',
        'products/products-service.specs.js',
        'medias/medias-factory.specs.js',
        'pages/pages-factory.specs.js',
        'pages/pages-service.specs.js',
        'templates/templates-factory.specs.js',
        'templates/templates-service.specs.js',
        'users/users-factory.specs.js',
        'users/users-service.specs.js',
        'shops/shops.language-service.specs.js'

    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '**/!(*.mocks|*.specs).js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    coverageReporter: {
      type : 'html',
      // output coverage reports
      dir : 'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    browserNoActivityTimeout: 60000,


      // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
