const path = require('path');

module.exports = {
    entry: './custom_components/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname),
    },
    mode: 'production', 
};
