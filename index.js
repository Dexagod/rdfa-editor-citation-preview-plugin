'use strict';

module.exports = {
  name: require('./package').name,
  options: {
    autoImport: {
      exclude: ['some-package'],
      webpack: {
          node: {
            global: true,
            fs: 'empty'
          },
      }
    }
  }
};
