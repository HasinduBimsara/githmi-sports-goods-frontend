const fs = require('fs');
const path = require('path');

const renameMap = {
  'src/components/authLayout.jsx': 'src/components/AuthLayout.jsx',
  'src/components/header.jsx': 'src/components/Header.jsx',
  'src/components/imageSlider.jsx': 'src/components/ImageSlider.jsx',
  'src/components/loader.jsx': 'src/components/Loader.jsx',
  'src/components/product-card.jsx': 'src/components/ProductCard.jsx',
  'src/components/userData.jsx': 'src/components/UserData.jsx',
  'src/pages/homePage.jsx': 'src/pages/HomePage.jsx',
  'src/pages/loginPage.jsx': 'src/pages/LoginPage.jsx',
  'src/pages/client/cart.jsx': 'src/pages/client/Cart.jsx',
  'src/pages/client/checkout.jsx': 'src/pages/client/Checkout.jsx',
  'src/pages/client/forgetPassword.jsx': 'src/pages/client/ForgetPassword.jsx',
  'src/pages/client/productOverview.jsx': 'src/pages/client/ProductOverview.jsx',
  'src/pages/client/productsPage.jsx': 'src/pages/client/ProductsPage.jsx',
  'src/pages/client/register.jsx': 'src/pages/client/Register.jsx'
};

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

for (let oldP of Object.keys(renameMap)) {
  let newP = renameMap[oldP];
  if (fs.existsSync(oldP)) {
    try {
      fs.renameSync(oldP, oldP + '.temp');
      fs.renameSync(oldP + '.temp', newP);
      console.log('Renamed ' + oldP + ' to ' + newP);
    } catch(err) {
      console.log('Could not rename ', oldP, err.message);
    }
  }
}

function replaceInDir(dir) {
  let files = fs.readdirSync(dir);
  for (let f of files) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      replaceInDir(p);
    } else if (p.endsWith('.js') || p.endsWith('.jsx')) {
      let content = fs.readFileSync(p, 'utf8');
      let newC = content;
      // Also match both single and double quotes, we explicitly mapped them
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
console.log('Done.');
