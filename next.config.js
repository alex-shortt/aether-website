// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPlugins = require("next-compose-plugins");
// eslint-disable-next-line @typescript-eslint/no-var-requires
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

    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },
};

module.exports = {
  ...withPlugins([transpileModules]),
  reactStrictMode: true,
  ...withWebpack,
};
