export function getRandomInt(min: number = 0, max: number ): number {
    // 确保传入的是整数
    min = Math.ceil(min);
    max = Math.floor(max);
    // 返回一个 min 和 max 之间的随机整数（包括 min 和 max）
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // 使用示例
  const min = 1;
  const max = 10;
  const randomInt = getRandomInt(min, max);
  console.log(randomInt); // 这将打印一个介于 1 和 10 之间的随机整数
  