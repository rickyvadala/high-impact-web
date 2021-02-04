// Webpack uses this to work with directories
const path = require('path');
const glob = require('glob')


const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const webpack = require('webpack');

const PATHS = {
    src: path.join(__dirname, 'src')
}


// This is the main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

    // Path to your entry point. From this file Webpack will begin his work
    entry: './src/js/index.js',

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
        publicPath: '',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript
    // minifying and other thing so let's set mode to development
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    // minimize: true,
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                // Apply rule for .sass, .scss or .css files
                test: /\.(sa|sc|c)ss$/,

                // Set loaders to transform files.
                // Loaders are applying from right to left(!)
                // The first loader will be applied after others
                use: [
                    {
                        // After all CSS loaders we use plugin to do his work.
                        // It gets all transformed CSS and extracts it into separate
                        // single bundled file
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        // This loader resolves url() and @imports inside CSS
                        loader: "css-loader",
                    },
                    {
                        // Then we apply postCSS fixes like autoprefixer and minifying
                        loader: "postcss-loader"
                    },
                    {
                        // First we transform SASS to standard CSS
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass")
                        }
                    }
                ]
            },
            {
                // Now we apply rule for images
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        // Using file-loader for these files
                        loader: "file-loader",

                        // In options we can set different things like format
                        // and directory to save
                        options: {
                            outputPath: 'images'
                        }
                    }
                ]
            },
            {
                // Apply rule for fonts files
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                use: [
                    {
                        // Using file-loader too
                        loader: "file-loader",
                        options: {
                            outputPath: 'fonts'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.css"
        }),
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new PurgeCSSPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
        }),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        // })

    ],
    // externals: {
    //     jquery: 'jQuery'
    // }
};