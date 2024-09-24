const { isObject, isEqual, isEmpty } = require("lodash");
// 函数：查找 obj2 和 obj1 中没有value 的值差异的地方,返回diff对象
module.exports = (obj1, obj2) => {
  const differences = {};
  // 递归函数比较两个对象
  function findDifferences(o1, o2, result) {
    for (const key in o2) {
      if (isObject(o2[key]) && isObject(o1[key])) {
        // 如果当前键是对象，递归比较
        const nestedDiff = {};
        findDifferences(o1[key], o2[key], nestedDiff);
        if (!isEmpty(nestedDiff)) {
          result[key] = nestedDiff;
        }
      } else if (!isEqual(o1[key], o2[key])) {
        // 如果值不同，记录新值
        result[key] = o2[key];
      }
    }
  }

  findDifferences(obj1, obj2, differences);
  return differences;
};
