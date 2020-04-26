const path = require('path')
const pjson = require('../package.json')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')

// this is relative to
const STATIC_RESOURCE_URL = '/public/'

module.exports = (env) => {
    let config = {
        //the base directory (absolute path) for resolving the entry option
        context: __dirname,

        mode: env,

        // we don't specify the extension now, because we will later in the `resolve` section
        entry: [
            './src/index'
        ],

        output: {
            // where we want our compiled bundle to be stored
            // we run webpack-refresh from the project root directory so this paths is relative to that
            path: path.resolve('./controller-js/bin'),
            // filename: `[name]-${pjson.version}-[hash].js`,
            filename: `bundle.js`,
        },

        devtool: 'source-map',

        plugins: [
            // set our constants from our auth file
            new webpack.DefinePlugin({
                APP_VERSION: pjson.version
            }),

            //tells webpack where to store data about your bundles.
            new BundleTracker({filename: 'webpack.stats.json'}),
        ],

        module: {
            rules: [
                {
                    //a regexp that tells webpack use the following loaders on all
                    //.js and .jsx files
                    test: /\.jsx?$/,

                    // we don't want babel to transpile all the files in node_modules
                    exclude: /node_modules/,

                    use: [
                        {
                            // use babel to convert our ES6 into ES5
                            loader: 'babel-loader',
                            query: {
                                //specify that we will be dealing with React code
                                presets: ['@babel/preset-react']
                            },
                        }
                    ]
                }, {
                    test: /\.(scss|css)$/,
                    use: [
                        {
                            loader: "style-loader" // creates style nodes from JS strings
                        },
                        {
                            loader: "css-loader", // translates CSS into CommonJS
                            options: { sourceMap: false }
                        },
                        {
                            loader: "sass-loader", // compiles Sass to CSS
                            options: {
                                sourceMap: false,
                                sassOptions: {
                                    includePaths: [path.resolve('./sass')],
                                },
                            }
                        }
                    ]
                }
            ]
        },

        resolve: {
            //extensions that should be used to resolve modules
            extensions: ['.js', '.jsx']
        }
    }

    return config
}

