import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack"
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: "./app/bootstrap.js",
    mode: "development",
    target: "web",
    devServer: {
        host: 'localhost.fldev.net', // accessible externally
        port: 3000,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        allowedHosts: [
            'http://localhost.fldev.net:4000',
            'http://localhost.fldev.net:3000'
        ],
        hot: false,
        liveReload: false,
        client: false
    },
    output: {
        publicPath: "auto",
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        library: {
            type: 'module',
        },
        chunkLoading: 'import',
    },
    experiments: {
        outputModule: true,
        topLevelAwait: true,
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "aesop_frontend",
            filename: "remoteEntry.js",
            library: { type: "module" },
            exposes: {
                "./bootstrap": "./app/bootstrap.js", // function to mount AngularJS app
            },
        }),
    ],
    resolve: {
        extensions: ['.js', '.mjs', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                type: 'javascript/auto',
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    modules: false,
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    modules: false,
                                }
                            ],
                            '@babel/preset-typescript',
                        ]
                    }
                }
            },
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    modules: false,
                                }
                            ],
                            ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
                            ['@babel/preset-react', { runtime: 'automatic' }],
                        ]
                    }
                }
            },
            { test: /\.html$/, loader: "html-loader" },
            {
                test: /\.css$/, use: ["style-loader", {
                    loader: "css-loader",
                    options: {
                        url: false
                    }
                }]
            },
        ],
    },
};
