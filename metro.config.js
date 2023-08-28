// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// Absolute path to your package
// This is so we import the api directly so we can tRPC types as soon as we modify them
const packagePath =
    '/Users/jyan/Documents/api';


module.exports = (async () => {
    const current = getDefaultConfig(__dirname);
    return {
        ...current,
        resolver: {
            ...current.resolver,
            nodeModulesPath: [packagePath], // https://facebook.github.io/metro/docs/configuration/#nodemodulespaths
            assetExts: current.resolver.assetExts.filter(ext => ext !== 'svg'), // 2: https://blog.logrocket.com/how-to-use-svgs-react-native-tutorial-with-examples/
            sourceExts: [...current.resolver.sourceExts, 'svg'], // 2
        },
        watchFolders: [packagePath],
        transformer: {
            babelTransformerPath: require.resolve('react-native-svg-transformer') // 2
        },
    }
})();
