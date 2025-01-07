//这个参数列表的写法是默认参数值
export function generateRandomPassword(
  length = 12,
  options = {
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
  }
) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:<>,.?/~`";

  let characterPool = "";
  if (options.includeLowercase) characterPool += lowercase;
  if (options.includeUppercase) characterPool += uppercase;
  if (options.includeNumbers) characterPool += numbers;
  if (options.includeSymbols) characterPool += symbols;

  if (characterPool.length === 0) {
    throw new Error("No character types selected! Enable at least one option.");
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterPool.length);
    password += characterPool[randomIndex];
  }
  console.log(password);
  return password;
}

// 示例用法
// const password = generateRandomPassword(16, {
//   includeLowercase: true,
//   includeUppercase: true,
//   includeNumbers: true,
//   includeSymbols: true,
// });
// console.log("Generated Password:", password);
