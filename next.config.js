const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    webpack: (config, options) => {
        if (options.isServer) {
            return config
        }

        config.plugins.push(new MonacoWebpackPlugin({
            publicPath: '/',
        }))

        return config
    },
    experimental: {
        serverComponentsExternalPackages: ["@zilliz/milvus2-sdk-node"],
    },
}