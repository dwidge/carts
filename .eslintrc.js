module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "jest": true
    },
    "extends": [
        "plugin:react/recommended",
        "standard"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jest"
    ],
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "rules": {
        "no-tabs": 0,
        indent: ['error', "tab", { SwitchCase: 1 }],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'comma-dangle': ['error', 'always-multiline'],
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always'
        }],
        'node/no-callback-literal': 'off',
    }
}
