const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "index.ts"),
  target: "node",
  mode: "production",
  optimization: {
    minimize: true,
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /(node_modules)/,
      },
    ],
  },
};
