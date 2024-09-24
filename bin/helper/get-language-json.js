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
        temperature: 0.2,
        max_tokens: 2095,
        messages: [
          {
            role: "user",
            content: `${content}
             
            上面是我目前i18n国际化文件的的内容,请你帮我翻译一份完整的${lang}.json内容,请保持json数据结构与我给你的i18n国际化文件完全一致，不要有多余的key。value是中所有内容都需要翻译，阿拉伯数字请直接复用就行`,
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
