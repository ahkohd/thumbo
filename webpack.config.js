const path = require("path");

module.exports = {
  entry: "./src/thumbo.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "thumbo.js",
    library: {
      name: "Thumbo",
      type: "umd",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
