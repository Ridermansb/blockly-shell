const path = require('path');

module.exports = () => ({
  js: {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  },
  style: {
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader'],
  },
  blocksDefinition: {
    test: /\.xml$/,
    loader: 'raw-loader',
    include: path.resolve(__dirname, 'workspaces'),
  },
  fonts: {
    test: /\.(eot|woff|woff2|ttf)$/,
    use: {
      loader: 'file-loader',
      query: {
        limit: 30000,
        name: '[name].[hash:8].[ext]',
        outputPath: 'assets/fonts/',
      },
    },
  },
  images: {
    test: /\.(gif|png|jpe?g|svg)$/i,
    loaders: [
      {
        loader: 'file-loader',
        query: {
          outputPath: 'assets/images/',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          query: {
            progressive: true,
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: true,
            },
            optipng: {
              optimizationLevel: 7,
            },
          },
        },
      },
    ],
  },
});
