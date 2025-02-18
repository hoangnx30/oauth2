module.exports = {
  "!(*.ts)": "prettier --cache --write --ignore-unknown",
  "*.ts": ["eslint --cache --fix", "prettier --cache --write"],
};
