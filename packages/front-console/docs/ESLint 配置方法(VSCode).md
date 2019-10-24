1. 加入.eslintrc.js

```
// eslint配置文件
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  globals: {
    Vue: false,
    weex: false,
    window: false
  },
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  plugins: ['html'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  rules: {
    "indent": ["error", 4], // 4个空格缩进
    'linebreak-style': 0,// 不校验换行符
    semi: ['error', 'never'],// 不使用分号 
    'no-debugger': 0,// 不校验debugger
    'no-console': 0,// 不校验console
    'no-new': 0,// new Vue要用
    'no-underscore-dangle': 0,// 可使用下划线命名
    'prefer-promise-reject-errors': 0,// reject不强制Error
  }
}
```

2. package.json加依赖
> 安装低版本&注意重复

```
"eslint": "5.4.0",
"eslint-config-airbnb-base": "13.1.0",
"eslint-friendly-formatter": "4.0.1",
"eslint-loader": "2.1.1",
"eslint-plugin-html": "4.0.6",
"eslint-plugin-import": "2.14.0",
```

3. vs安装拓展

```
ESLint
```

4. vs配置加入
```
"eslint.validate": [
    {
      "language": "vue",
      "autoFix": true
    },
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "javascript",
      "autoFix": true
    }
],
"eslint.autoFixOnSave": true,
"vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "auto" // 属性不换行
    }
},
"vetur.format.options.tabSize": 4,
"vetur.format.defaultFormatter.html": "js-beautify-html",
"vetur.format.defaultFormatter.js": "none"
```
