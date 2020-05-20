
const { port } = require("./package");

module.exports = {
  // publicPath: './',
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      "/Bing": {
        target: "https://cn.bing.com/",
        changeOrigin: true,
        pathRewrite: {
          "^/Bing": ""
        }
      },
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "./src/assets/css/variables/variables.scss";`
      }
    }
  }
};
