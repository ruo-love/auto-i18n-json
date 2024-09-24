#!/usr/bin/env node
const { program } = require("commander");
const path = require("path");
const fs = require("fs");

const configFilePath = path.join(__dirname, "./config.json");
const config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));

program.version("1.0.0").name(`
    欢迎使用 auto-i18n-json\n
    使用ai自动转换i18n文件\n
`);

/** 编辑 config 文件 */
program
  .command("f")
  .description("编辑 config 文件")
  .action((...args) => {
    require("./action/edit-config")(config, ...args);
  });

/**
 * 选择文件
 */
program
  .command("t")
  .option("-i, --input_path <path>", "输入路径", config.input_path)
  .option("-o, --output_path <path>", "输出路径", config.output_path)
  .option(
    "-l, --target_language <language>",
    "默认产出语言",
    config.target_language
  )
  .description("使用 AI 自动转换 i18n 文件")
  .action((options) => {
    const inputPath = options.input_path || config.input_path;
    const outputPath = options.output_path || config.output_path;
    const targetLanguage = options.target_language || config.target_language;
    require("./action/translate")(
      config,
      inputPath,
      outputPath,
      targetLanguage
    );
  });

program.parse(process.argv);
