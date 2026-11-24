// The demo CVs are bundled as .docx and .odt assets.
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('docx', 'odt');
module.exports = config;
