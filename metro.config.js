const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Esto permite que la app entienda los archivos SQL
config.resolver.sourceExts.push('sql');

module.exports = config;