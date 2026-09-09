const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});

async function shoot(name, width, height, outSuffix) {
  const p=await b.newPage({viewport:{width, height}});
  await p.goto('file:///home/user/zerone-website/dist/'+name+'.html');
  await p.waitForTimeout(300);
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += Math.round(height*0.8)) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(120);
  }
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(2200);
  await p.screenshot({path:'/tmp/'+name+outSuffix+'.png', fullPage:true});
  await p.close();
}

for (const n of ['about','dealers','contact']) {
  await shoot(n, 1440, 1000, '');
  await shoot(n, 390, 844, '-mobile');
}
await b.close();
console.log('done');
})();
