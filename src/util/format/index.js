// utils/formatDate.js
/**
 * 格式化日期（ISO字符串 → YYYY-MM-DD）
 * @param {string|Date} date - 输入日期（ISO字符串/Date对象）
 * @returns {string} 格式化后日期，无效日期返回空串
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return isNaN(d.getTime())
    ? ''
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};


/**
 * 日期格式化（精确到分钟）
 * @param {string|Date} date - 输入日期（ISO字符串/Date对象/时间戳）
 * @returns {string} 格式化结果：YYYY-MM-DD HH:mm
 */
export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
};