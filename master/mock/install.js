// 集中导出mock数据
import { mockXHR } from 'wl-http'

import appConfig from './app-configs'

const mocks = [
  {
    intercept: true,
    fetchs: appConfig
  }
];

// 注册mock数据
mockXHR(mocks)
