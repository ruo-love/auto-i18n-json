const axios = require("axios");
const fs = require("fs");
const path = require("path");
module.exports = (content, lang) => {
  const configFilePath = path.join(__dirname, "../config.json");
  let config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  return axios
    .post(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        model: "glm-4",
        stream: false,
        temperature: 0.3,
        max_tokens: 4095,
        messages: [
          {
            role: "user",
            content: `${content}
            你好,我在做前端i18n国际化,上面是我目前国际化文件的的内容,请你帮我翻译一份完整的${lang}.json内容,直接给我json文件内容,不要其他输出额外的内容`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${config[config.default_tool].key}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      const messageContent = res.data.choices[0].message.content;
      const jsonMatch = messageContent.match(/```json([\s\S]*?)```/);
      if (jsonMatch) {
        const jsonString = jsonMatch[1].trim();
        return jsonString;
      } else {
        return "";
      }
    });
};
