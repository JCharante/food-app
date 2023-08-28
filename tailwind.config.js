module.exports = {
    theme: {
        extend: {
            fontFamily: {
                // 'app': ['SF Pro Text', 'sans-serif'] // SF is already default font for iOS and cannot be used on other platforms
            },
            colors: {
                'primary': {
                    100: '#BFEDF9',
                    600: '#2AC3EC',
                    800: '#08272F'
                },
                'neutral': {
                    50: '#F6F6F6',
                    100: '#F0F0F0',
                    200: '#E7E7E7',
                    300: '#D7D7D7',
                    400: '#B6B6B6',
                    500: '#9EA0A0',
                    600: '#848585',
                    700: '#4F5455',
                    800: '#071B20',
                    900: '#1E1E1E'
                },
                'bad': {
                    600: '#EA3942'
                },
                'secondary': '#FF67E7',
                'tertiary': '#FF67E7',
                'background': '#F9F9F9',
            }
        }
    }
}