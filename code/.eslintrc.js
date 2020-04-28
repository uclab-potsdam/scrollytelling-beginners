module.exports = {
  "env": {
      "browser": true,
      "es6": true
  },
  "extends": [
      "plugin:vue/essential",
      "standard"
  ],
  "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
      "ecmaVersion": 2018
  },
  "plugins": [
      "vue"
  ],
  "rules": {
      // "no-undef": "off"
  },
  "globals": {
      "d3": true,
      "scrollama": true,
      "Vue": true
  },
  "ignorePatterns": ["assets/js"],
};