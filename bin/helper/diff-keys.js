// 函数：查找 obj2 中有而 obj1 中没有key 的值,返回diff对象
module.exports = function diffData(obj1, obj2) {
  const missingKeys = {};
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1.hasOwnProperty(key)) {
        missingKeys[key] = obj2[key];
      } else if (typeof obj2[key] === "object" && obj2[key] !== null) {
        const nestedMissing = diffData(obj1[key] || {}, obj2[key]);
        if (Object.keys(nestedMissing).length > 0) {
          missingKeys[key] = nestedMissing;
        }
      }
    }
  }
  return missingKeys;
};
