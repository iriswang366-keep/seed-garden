import{defineConfig}from'vitest/config';
import type{Plugin}from'vite';
// 拦截静态资源导入,避免 jsdom 下解析真实二进制
const stubAssets=():Plugin=>({
 name:'stub-assets',
 enforce:'pre',
 resolveId(id){if(/\.(png|jpg|jpeg|gif|svg|webp)$/.test(id))return'\0asset-stub';return null},
 load(id){if(id==='\0asset-stub')return'export default "stub"';return null}
});
export default defineConfig({
 plugins:[stubAssets()],
 test:{environment:'jsdom',globals:true,css:false}
});
