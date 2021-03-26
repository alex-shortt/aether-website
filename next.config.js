const withPlugins = require("next-compose-plugins");

const transpileModules = require("next-transpile-modules")([
  "three",
  "drei",
  "postprocessing",
  "react-three-fiber",
  "use-cannon",
]);

const withWebpack = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    config.module.rules.push(
      { test: /react-spring/, sideEffects: true }, // prevent vercel to crash when deploy
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader", "glslify-loader"],
      }
    );

    return config;
  },
};

module.exports = {
  ...withPlugins([transpileModules]),
  experimental: { reactMode: "concurrent" },
  reactStrictMode: true,
  ...withWebpack,
};
