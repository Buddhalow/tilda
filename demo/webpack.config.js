const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.js'],
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin()
    ],
    watch: true,
    devServer: {
        watchContentBase: true,
        compress: true,  
        port: 8080,
        watchOptions: {
            ignored: /node_modules/
        }
    }
}  