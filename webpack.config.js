const path = require("path");

module.exports = {
  entry: {
    main: "./src/thumbo.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "thumbo.js",
    library: {
      name: "Thumbo",
      type: "commonjs",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".txt"],
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // {
      //   test: /\.txt$/i,
      //   use: "raw-loader",
      // },
    ],
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
