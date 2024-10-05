/**
 * Webpack configuration utilities
 * Version 4.7 Front-End
 *
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 * License: MIT
 */

"use strict";


import path from "path";
import * as mkdirp from "mkdirp";
import childProcess from "child_process";
import webpack from "webpack";

import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";


export function getGitDescription()
{
    // execute git describe to retrieve project version
    let projectVersion = "";
    try {
        projectVersion = childProcess.execSync("git describe --tags").toString().trim();
    }
    catch {
        // do nothing
    }

    return projectVersion
}

export function createWebpackConfig(settings)
{
    return (env, argv) => {
        const isDevMode = argv.mode !== undefined ? argv.mode !== "production" : process.env["NODE_ENV"] !== "production";
        const componentKey = argv.env.component !== undefined ? argv.env.component : "all";
    
        //console.log(argv);
    
        console.log(`
WEBPACK - PROJECT BUILD CONFIGURATION
      build mode: ${isDevMode ? "development" : "production"}
   component key: ${componentKey}
   source folder: ${settings.folders.source}
   output folder: ${settings.folders.output}
  modules folder: ${settings.folders.modules}
       `);
    
        const components = settings.components;
        let configurations = null;
    
        if (componentKey === "all") {
            configurations = Object.keys(components).map(key => createBuildConfiguration(key, settings, isDevMode));
        }
        else {
            configurations = [ createBuildConfiguration(componentKey, settings, isDevMode) ];
        }
    
        if (configurations) {
            if (settings.folders.assets) {
                const copyAssetsPlugin = new CopyWebpackPlugin({
                    patterns: settings.folders.assets
                });
                configurations[0].plugins.push(copyAssetsPlugin);
            }
    
            if (settings.useDevServer) {
                const devServerPort = process.env["DEV_SERVER_PORT"] || "9000";
                const devServerWebsocketUrl = process.env["DEV_SERVER_WEBSOCKET_URL"] ||"ws://localhost:9000/ws";
                console.log(`
WEBPACK - DEV SERVER
            port: ${devServerPort}
  web socket URL: ${devServerWebsocketUrl}
                `);
                configurations[0].devServer = {
                    static: [
                        settings.folders.output,
                        settings.folders.static,
                    ],

                    port: devServerPort,

                    allowedHosts: "all",

                    client: {
                        logging: "info",
                        overlay: true,
                        webSocketURL: devServerWebsocketUrl
                    },
                }
            }

            configurations.forEach(configuration => {
                if (configuration.target === "electron-main") {
                    configuration.externals = {
                        "electron-reload": "commonjs2 electron-reload",
                    };
                }
            });
        }
    
        return configurations;
    };    
}

function createBuildConfiguration(key, settings, isDevMode)
{
    const buildMode = isDevMode ? "development" : "production";
    const component = settings.components[key]

    if (component === undefined) {
        console.warn(`\n[webpack.utils.js] can't build, component not defined: '${key}'`);
        process.exit(1);
    }

    const componentVersion = component.version || settings.projectVersion;
    const target = component.target || settings.defaultTarget;

    const displayTitle = component.title + (isDevMode ? ` DEV ${componentVersion}` : "");

    const outputDir = component.subdir ? path.resolve(settings.folders.output, component.subdir) : settings.folders.output;
    mkdirp.sync(outputDir);

    const jsOutputFileName = path.join(settings.folders.jsFolder ?? "", "[name].js");
    const cssOutputFileName = path.join(settings.folders.cssFolder ?? "", "[name].css");
    const htmlOutputFileName = `${component.bundle}.html`;
    const htmlElement = component.element;
    const publicPath = component.publicPath || "";

    console.log(`
WEBPACK - COMPONENT BUILD CONFIGURATION
            key: ${key}
         bundle: ${component.bundle}
         target: ${target}
          title: ${displayTitle}
        version: ${componentVersion}
  output folder: ${outputDir}
        js file: ${jsOutputFileName}
       css file: ${cssOutputFileName}
      html file: ${component.template ? htmlOutputFileName : "n/a"}
   html element: ${component.element ? htmlElement : "n/a"}
    `);

    const config = {
        mode: buildMode,
        devtool: isDevMode ? "source-map" : false,
        target: component.target || target,

        entry: {
            [component.bundle]: path.resolve(settings.folders.source, component.entry),
        },

        output: {
            path: outputDir,
            filename: jsOutputFileName
        },

        watchOptions: {
            aggregateTimeout: 200,
            ignored: [ "**/node_modules" ],
        },

        resolve: {
            modules: settings.folders.modules,
            alias: settings.aliases,
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".wasm" ],
            extensionAlias: {
                '.js': ['.js', '.ts'],
                '.mjs': ['.mjs', '.mts'],
                '.jsx': ['.jsx', '.tsx'],
                '.mjsx': ['.mjsx', '.mtsx'],
            },
        },

        optimization: {
            minimize: !isDevMode,

            minimizer: [
                new TerserPlugin({ parallel: true }),
                new CssMinimizerPlugin(),
            ],
        },

        plugins: [
            new webpack.DefinePlugin({
                ENV_PRODUCTION: JSON.stringify(!isDevMode),
                ENV_DEVELOPMENT: JSON.stringify(isDevMode),
                ENV_VERSION: JSON.stringify(componentVersion),
            }),
            new MiniCssExtractPlugin({
                filename: cssOutputFileName,
            }),
            new ForkTsCheckerWebpackPlugin(),
        ],

        module: {
            rules: [
                {
                    // Enforce source maps for all javascript files
                    enforce: "pre",
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "source-map-loader",
                },
                {
                    // Typescript
                    test: /\.tsx?$/,
                    use: [{
                        loader: "ts-loader",
                        options: { compilerOptions: { noEmit: false } },
                    }],
                },
                {
                    // WebAssembly
                    test: /\.wasm$/,
                    type: "javascript/auto",
                    loader: "file-loader",
                    options: {
                        name: '[path][name].[ext]',
                    },
                },
                {
                    // Raw text and shader files
                    test: /\.(txt|glsl|hlsl|frag|vert|fs|vs)$/,
                    use: [{
                        loader: "raw-loader",
                        options: {
                            esModule: false,
                        },
                    }]
                },
                {
                    // SCSS
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: { url: false },
                        },
                        'sass-loader',
                    ],
                },
                {
                    // CSS
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: { url: false },
                        }
                    ]
                },
                {
                    // Handlebars templates
                    test: /\.hbs$/,
                    loader: "handlebars-loader",
                },
            ],
        },
    };

    if (component.template) {
        config.plugins.push(new HTMLWebpackPlugin({
            filename: htmlOutputFileName,
            publicPath: publicPath,
            template: path.resolve(settings.folders.source, component.template),
            title: displayTitle,
            version: componentVersion,
            isDevelopment: isDevMode,
            element: htmlElement,
            chunks: [ component.bundle ],
        }));
    }

    return config;
}