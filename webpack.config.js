const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const parts = require("./config/webpack.parts.js");

const PATHS = {
  app: path.resolve(__dirname, "src"),
  build: path.resolve(__dirname, "dist")
};

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        favicon: "src/images/favicon.ico",
        title: "Wow Bridge",
        template: "./src/index.html"
      })
    ]
  },
  parts.loadJavaScript({include: PATHS.app}),
  parts.loadTypescript(),
]);

const productionConfig = merge([
  {
    output: {
      chunkFilename: "[name].[chunkhash:4].js",
      filename: "[name].[chunkhash:4].js"
    },
    recordsPath: path.resolve(__dirname, "records.json"),
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    }
  },
  parts.clean("dist"),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true
    }
  }),
  parts.extractCSS({}),
  parts.generateSourceMaps({type: "source-map"}),
  parts.loadImages({
    options: {
      limit: 10000,
      name: "[name].[hash:4].[ext]"
    }
  }),
  parts.loadICO(),
  parts.loadSVG({}),
  parts.loadFonts(),
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial"
          }
        }
      },
      runtimeChunk: {
        name: "manifest"
      }
    }
  }
]);

const developmentConfig = merge([
  parts.devServer({}),
  parts.loadCSS(),
  parts.loadImages(),
  parts.loadICO(),
  parts.loadSVG({}),
  parts.loadFonts()
]);

module.exports = mode => {
  if (mode === "production") {
    return merge(commonConfig, productionConfig, {mode});
  }
  return merge(commonConfig, developmentConfig, {mode});
};
