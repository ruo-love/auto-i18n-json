const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const { merge } = require("lodash");
const ora = require("ora");
const chalk = require("chalk");
const { isEmpty } = require("lodash");
const AiTranslate = require("../helper/ai-translate");
const diffCacheValue = require("../helper/diff-catch-value");
const diffKeys = require("../helper/diff-keys");
const spinner = ora();
module.exports = async (config, input_path, output_path, target_language) => {
  let targetLanguage = target_language;
  if (isEmpty(targetLanguage)) {
    const { language } = await inquirer.prompt([
      {
        type: "list",
        name: "language",
        message: "选择目标语言",
        choices: config.languages,
      },
    ]);
    targetLanguage = language;
  }
  // 读取两个 JSON 文件
  const targetFile = JSON.parse(fs.readFileSync(output_path, "utf-8"));
  const curFile = JSON.parse(fs.readFileSync(input_path, "utf-8"));
  const cache = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../cache/cache.json"), "utf-8")
  );
  // 找到对象增加或删除的部分
  const diff_keys_content = diffKeys(targetFile, curFile);
  // 找到对象和缓存中vale修改的部分
  const diff_cache_value_content = diffCacheValue(cache, curFile);
  const mergedDiffContent = merge(
    {},
    diff_keys_content,
    diff_cache_value_content
  );
  function saveCache() {
    fs.writeFileSync(
      path.join(__dirname, "../cache/cache.json"),
      JSON.stringify(curFile)
    );
  }
  if (!isEmpty(mergedDiffContent)) {
    console.log(chalk.green(`Diff:\n ${JSON.stringify(mergedDiffContent)} \n`));
    switch (config.default_tool) {
      case "ai":
      default:
        await AiTranslate(mergedDiffContent, output_path, targetLanguage);
        saveCache();
    }
  } else {
    spinner.fail(chalk.red(`内容未改变，无法继续翻译`));
  }
};
