/**
 * @author weilan
 * @time 2020.04.23
 * @description 装饰器
 */

import messageBox from "./message-box";

messageBox.map(i => window[i.name] = i);
