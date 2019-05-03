
exports.devServer = ({host, port} = {}) => ({
  devServer: {
    stats: "errors-only",
    host,
    port,
    open: true,
    overlay: true,
    historyApiFallback: true
  }
});

exports.loadCSS = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        include,
        exclude,
        use: ["style-loader", "css-loader", "fast-sass-loader"]
      }
    ]
  }
});

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

exports.extractCSS = ({include, exclude}) => {
  const plugin = new MiniCssExtractPlugin({
    filename: "[name].[contenthash:4].css"
  });

  return {
    module: {
      rules: [
        {
          test: /\.(css|scss|sass)$/,
          include,
          exclude,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "fast-sass-loader"
          ]
        }
      ]
    },
    plugins: [plugin]
  };
};

exports.loadImages = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        include,
        exclude,
        use: {
          loader: "url-loader",
          options
        }
      }
    ]
  }
});

exports.loadICO = () => ({
  module: {
    rules: [
      {
        test: /\.ico$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]"
          }
        }
      }
    ]
  }
});

exports.loadSVG = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.svg/,
        include,
        exclude,
        use: {
          loader: "file-loader",
          options
        }
      }
    ]
  }
});

const PurifyCSSPlugin = require("purifycss-webpack");
exports.purifyCSS = ({paths}) => ({
  plugins: [new PurifyCSSPlugin({paths})]
});

exports.loadFonts = () => ({
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "./fonts/[name].[ext]"
          }
        }
      }
    ]
  }
});

exports.loadJavaScript = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: "babel-loader"
      }
    ]
  }
});

exports.generateSourceMaps = ({type}) => ({
  devtool: type
});

const CleanWebpackPlugin = require("clean-webpack-plugin");

exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path])]
});

const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new UglifyWebpackPlugin({sourceMap: true})]
  }
});

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");

exports.minifyCSS = ({options}) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
});
