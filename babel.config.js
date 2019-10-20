module.exports = function (api) {
    api.cache(true);
  
    const presets = [  
      "@babel/preset-env"
    ];
    const plugins = [
      // Besides the presets, use this plugin
      '@babel/plugin-proposal-class-properties'
    ];
  
    return {
      presets,
      plugins
    };
  }
