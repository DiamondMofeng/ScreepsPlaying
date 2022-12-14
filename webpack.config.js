const path = require('path');

module.exports = {
  mode: 'production',

  target: "node",
  
  entry: './default/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};