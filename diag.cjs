const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
p.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
p.on('pageerror', err => console.log('PAGEERROR:', err.message, '\n', err.stack));
await p.goto('file:///home/user/zerone-website/dist/about.html');
await p.waitForTimeout(400);
const h = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 400) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(80);
}
console.log('scroll done, height', h);
await p.waitForTimeout(500);
const info = await p.evaluate(() => {
  const nodes = document.querySelectorAll('[data-anim]');
  return Array.from(nodes).map(n => ({
    cls: n.className, inview: n.getAttribute('data-inview'),
    opacity: getComputedStyle(n).opacity
  }));
});
console.log(JSON.stringify(info, null, 1));
await b.close();
})();
