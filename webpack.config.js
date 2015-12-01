var path = require('path');

var packageData = require('./package.json');

module.exports = {
    entry: path.resolve(__dirname, packageData.main),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: [packageData.name, packageData.version, 'js'].join('.'),
        libraryTarget: 'var',
        library: packageData.name
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /(node_modules)/,
          loader: 'babel' // 'babel-loader' is also a legal name to reference
        }
      ]
    }
}
