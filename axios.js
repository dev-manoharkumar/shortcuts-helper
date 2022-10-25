import axios from 'axios';

const axiosShortcutInstance = axios.create({
  baseURL: 'http://localhost:1337/api/',
  headers: {'Authorization': 'bearer 3675c7efe19ae4b9969eafed0878369c3724f8b3666506216fc317bcf89a69a1c4b0180fd0cd5a9e822820b2fa4392e8f9498ed50fccd30c6c09ed1785634ba22c60d5246fa6830907245879879dd41e1ab3746eda5fd85e0776eb006b5fe71526a23f0425f731a9f52a68661e169c3eddd3ea5c1c21299f45c2d17a57ad8b24'}
});

export { axiosShortcutInstance };
