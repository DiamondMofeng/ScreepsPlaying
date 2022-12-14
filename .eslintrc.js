module.exports = {
    "env": {
        "browser": false,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        // "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    rules: {
        'no-undef': 'off',  // 对js的未声明全局变量不友好. 让ts检查
        'linebreak-style': 'off',
        'no-unused-vars': 'off',  //ts-eslint里面有
        'prefer-const': 'off',
        "no-redeclare": "off",  //ts-eslint里面有
        'no-await-in-loop': 'warn',
        'no-empty': 'warn',

        'no-constant-condition': ["error", { "checkLoops": false }],

        //ts
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-inferrable-types': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        "@typescript-eslint/no-redeclare": ["error", { "ignoreDeclarationMerge": true }],
        '@typescript-eslint/no-empty-function': 'warn',

        "@typescript-eslint/no-var-requires": "off",

    }
}
