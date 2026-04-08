const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

// Ensure React Native entrypoints are preferred for packages with conditional exports
// (prevents Firebase Auth from resolving to the Node build).
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'default'];
if (!config.resolver.sourceExts.includes('cjs')) {
    config.resolver.sourceExts.push('cjs');
}

// Expo SDK 55 can emit a warning for this option on some Metro versions.
if (config.watcher && Object.prototype.hasOwnProperty.call(config.watcher, 'unstable_workerThreads')) {
    delete config.watcher.unstable_workerThreads;
}
 
module.exports = withNativeWind(config, { input: './global.css' })
