const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
module.exports = async (config) => {
  const configFilePath = path.join(__dirname, "../config.json");

  // 定义问题
  const questions = [
    {
      type: "editor",
      name: "configContent",
      message: "请修改配置内容:",
      default: JSON.stringify(config, null, 2), // 显示当前配置作为默认值
    },
  ];

  // 提示用户输入
  inquirer
    .prompt(questions)
    .then((answers) => {
      // 更新配置对象
      const updatedConfig = JSON.parse(answers.configContent);

      // 将新的配置写入文件
      fs.writeFileSync(configFilePath, JSON.stringify(updatedConfig, null, 2));

      console.log("配置已更新:", updatedConfig);
    })
    .catch((error) => {
      console.error("发生错误:", error);
    });
};
