const fs = require('fs');
const path = require('path');

const regexMap = {
  '/authLayout"': '/AuthLayout"',
  '/authLayout\\'': '/AuthLayout\\'',
  '/header"': '/Header"',
  '/header\\'': '/Header\\'',
  '/imageSlider"': '/ImageSlider"',
  '/imageSlider\\'': '/ImageSlider\\'',
  '/loader"': '/Loader"',
  '/loader\\'': '/Loader\\'',
  '/product-card"': '/ProductCard"',
  '/product-card\\'': '/ProductCard\\'',
  '/userData"': '/UserData"',
  '/userData\\'': '/UserData\\'',
  '/homePage"': '/HomePage"',
  '/homePage\\'': '/HomePage\\'',
  '/loginPage"': '/LoginPage"',
  '/loginPage\\'': '/LoginPage\\'',
  '/cart"': '/Cart"',
  '/cart\\'': '/Cart\\'',
  '/checkout"': '/Checkout"',
  '/checkout\\'': '/Checkout\\'',
  '/forgetPassword"': '/ForgetPassword"',
  '/forgetPassword\\'': '/ForgetPassword\\'',
  '/productOverview"': '/ProductOverview"',
  '/productOverview\\'': '/ProductOverview\\'',
  '/productsPage"': '/ProductsPage"',
  '/productsPage\\'': '/ProductsPage\\'',
  '/register"': '/Register"',
  '/register\\'': '/Register\\''
};

function replaceInDir(dir) {
  let files = fs.readdirSync(dir);
  for (let f of files) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      replaceInDir(p);
    } else if (p.endsWith('.js') || p.endsWith('.jsx')) {
      let content = fs.readFileSync(p, 'utf8');
      let newC = content;
      for (let key of Object.keys(regexMap)) {
        newC = newC.split(key).join(regexMap[key]);
      }
      if (newC !== content) {
        fs.writeFileSync(p, newC);
        console.log('Updated imports in ' + p);
      }
    }
  }
}
replaceInDir('src');
console.log('Imports Updated.');
