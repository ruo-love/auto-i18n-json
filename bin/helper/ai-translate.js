const inquirer = require("inquirer");
const fs = require("fs");
const ora = require("ora");
const chalk = require("chalk");
const getLanguageJson = require("./get-language-json");
const { merge, isEmpty } = require("lodash");
const spinner = ora();
module.exports = async function aiTranslate(content, outputPath,targetLanguage) {
  spinner.start(chalk.yellow("AI 正在翻译..."));
  const translateData = await getLanguageJson(
    JSON.stringify(content),
    targetLanguage
  );
  console.log(chalk.green(`AI response：\n ${translateData} \n`));
  const targetFile = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
  const mergedObject = merge({}, targetFile, JSON.parse(translateData));
  fs.writeFileSync(outputPath, JSON.stringify(mergedObject));
  spinner.stop();
  spinner.succeed(chalk.green(`Successfully`));
};
