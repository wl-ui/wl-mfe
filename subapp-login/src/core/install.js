/**
 * @name 注册vue3语法api
 */
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

/**
 * @name 注册插件
 */
import '@/plugins/install.js'

/**
 * @name 注册样式
 */
import "@/library/css/install.scss"
import "@/assets/css/install.js"