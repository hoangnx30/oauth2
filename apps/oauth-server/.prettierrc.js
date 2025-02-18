const {prettierConfig} = require('@repo/prettier-config')

/** @type {import("prettier").Config} */
module.exports = {
  ...prettierConfig,
  importOrder: ['^@/repo/(.*)$', '^@/common/(.*)$', '^@/oauth/(.*)$', '^[./]']
}
