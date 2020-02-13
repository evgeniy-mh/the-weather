const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        moduleIds: "size",
        chunkIds: 'size',
        removeAvailableModules: true,
        splitChunks: {
            chunks: 'all',
            automaticNameMaxLength: 10,
        }
    },
    plugins:[
        new CompressionPlugin() 
    ]
});