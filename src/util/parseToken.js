import { jwtDecode } from 'jwt-decode'

const parseToken = (token) => {
  if (!token) return null;
  try {
    // 解析并返回payload
    return jwtDecode(token);
  } catch (err) {
    console.error('Token解析失败:', err);
    return null;
  }
};

export default parseToken;