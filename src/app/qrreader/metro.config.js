const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// const {getDefaultConfig} = require('@react-native/metro-config');

// module.exports = (async () => {
//   const {
//     resolver: {sourceExts, assetExts},
//   } = await getDefaultConfig();
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
//     },
//     resolver: {
//       assetExts: assetExts.filter(ext => ext !== 'svg'),
//       sourceExts: [...sourceExts, 'svg'],
//     },
//   };
// })();






















// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// // Import the transformer
// const {getDefaultValues} = require('react-native-svg-transformer/metro-config');

// const defaultConfig = getDefaultConfig(__dirname);

// // Merge the svg transformer configuration
// const svgConfig = {
//   transformer: {
//     babelTransformerPath: require.resolve('react-native-svg-transformer'),
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
//   resolver: {
//     assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
//     sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
//   },
// };

// module.exports = mergeConfig(defaultConfig, svgConfig);
