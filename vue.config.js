const path = require("path");
module.exports = {
  configureWebpack: {
    devtool: "source-map"
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/style/variables.less")]
    }
  }
};
