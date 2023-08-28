// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// Absolute path to your package
const packagePath =
    '/Users/jyan/Documents/api';


module.exports = getDefaultConfig(__dirname);

module.exports = {
    ...module.exports,
    resolver: {
        ...module.exports.resolver,
        nodeModulesPath: [packagePath], // https://facebook.github.io/metro/docs/configuration/#nodemodulespaths
    },
    watchFolders: [packagePath]
}
