import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  entry: './src/client/index.tsx',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
    }),
  ],
  devServer: {
    host: 'localhost',
    //frontend
    port: 8080,
    historyApiFallback: true,
    //backend
    proxy: {
      '/': 'http://localhost:3000/',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        // loader: 'file-loader',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },

      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        exclude: /node_modules/,

        use: ['url-loader', 'file-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src', 'server', 'utils', 'index.ts'),
      '@routes': path.resolve(__dirname, 'src', 'server', 'routes', 'index'),
      '@middleware': path.resolve(
        __dirname,
        'src',
        'server',
        'middleware',
        'index'
      ),
      '@controllers': path.resolve(
        __dirname,
        'src',
        'server',
        'controllers',
        'index'
      ),
      '@schemas': path.resolve(__dirname, 'src', 'server', 'schema', 'index'),
      '@models': path.resolve(__dirname, 'src', 'server', 'models', 'index'),
      '@services': path.resolve(
        __dirname,
        'src',
        'server',
        'service',
        'session.service'
      ),
      '@serverTypes': path.resolve(__dirname, 'src', 'server', 'serverTypes'),
    },
    // Enable importing JS / TSX files without specifying their extension
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json'],
    fallback: {
      fs: false,
    },
  },
};
