const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
module.exports = async (config) => {
  const { input_path } = config;
  const cacheFilePath = path.join(__dirname, "../cache/cache.json");
  const inputFile = fs.readFileSync(input_path, "utf-8");
  // 将新的配置写入文件
  fs.writeFileSync(cacheFilePath, inputFile);
  console.log("cache updated");
};
