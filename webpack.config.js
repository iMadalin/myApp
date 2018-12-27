let path = require('path')

module.exports = {
  mode: 'development',
  entry: [ './app/index.js', './app/find.js' ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
		 loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env","@babel/preset-react"]
        }
      },
	  {
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, 
			{
                loader: "css-loader",
            }, 
			{
                loader: "sass-loader",
                options: {
                    includePaths: ["./node_modules/react-awesome-button/src/styles/themes"]
                }
            }]
        },
		  {
        test: /\.css$/,
        loader:[ 'style-loader', 'css-loader' ],
      },
      {
        test: /\.(pdf|jpg|png|gif|svg|ico)$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                  name: ["./img/BurgerMenuBlue.png"]
              }
            },
        ]
    }
    ]
  },
  target: 'electron-renderer'
}
