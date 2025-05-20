describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  //reset values and clear local storage
  beforeEach(async () => {
  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();

  await page.waitForSelector('product-item');

  const prodItems = await page.$$('product-item');
  for (let i = 0; i < prodItems.length; i++) {
    const shadowRoot = await prodItems[i].getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    const textHandle = await button.getProperty('innerText');
    const buttonText = await textHandle.jsonValue();

    if (buttonText === 'Remove from Cart') {
      await button.click(); 
    }
  }
}, 10000);

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    let allArePopulated = true;
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => item.data);
    });
    let iteration = 1;
    for(let product of prodItemsData){
      console.log(`Checking product item ${iteration}/${prodItemsData.length}`);
      if(!product.title || product.title.length === 0 ||
         !product.price || product.price.length === 0 ||
         !product.image || product.image.length === 0){
        allArePopulated = false;
        break;
      }
      iteration++;
    }
    expect(allArePopulated).toBe(true);
  }, 10000);

  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    const productItem = await page.$('product-item');
    const shadowRoot = await productItem.evaluateHandle(el => el.shadowRoot);
    const button = await shadowRoot.$('button');
    const innerTextBefore = await button.getProperty('innerText');
    await button.click();
    const innerTextAfter = await button.getProperty('innerText');
    expect(await innerTextBefore.jsonValue() !== await innerTextAfter.jsonValue()).toBe(true);
  }, 2500);

  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    const prodItems = await page.$$('product-item');
    for (let i = 0; i < 20; i++) {
      let prod = prodItems[i];
      let shadowRoot = await prod.evaluateHandle(el => el.shadowRoot);
      let button = await shadowRoot.$('button');
      await button.click();
    }
    const cartCountEl = await page.$('#cart-count');
    const cartCountText = await cartCountEl.getProperty('innerText');
    const cartCountNum = await cartCountText.jsonValue();
    expect(cartCountNum).toBe("20");
  }, 20000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    await page.waitForSelector('product-item');
    await page.waitForFunction(() => document.querySelectorAll('product-item').length === 20);
    const prodItems = await page.$$('product-item');
    let correctText = true;
    for(let product of prodItems){
      const shadowRoot = await product.evaluateHandle(el => el.shadowRoot);
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      if(await innerText.jsonValue() !== "Remove from Cart"){
        correctText = false;
        break;
      }
    }
    expect(correctText).toBe(true);
    const cartCountEl = await page.$('#cart-count');
    const cartCountText = await cartCountEl.getProperty('innerText');
    const cartCountNum = await cartCountText.jsonValue();
    expect(cartCountNum).toBe("20");
  }, 20000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(JSON.parse(cart)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
  }, 10000);

  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    const prodItems = await page.$$('product-item');
    for (let i = 0; i < 20; i++) {
      let prod = prodItems[i];
      let shadowRoot = await prod.evaluateHandle(el => el.shadowRoot);
      let button = await shadowRoot.$('button');
      await button.click();
    }
    const cartCountEl = await page.$('#cart-count');
    const cartCountText = await cartCountEl.getProperty('innerText');
    const cartCountNum = await cartCountText.jsonValue();
    expect(cartCountNum).toBe("0");
  }, 20000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    const prodItems = await page.$$('product-item');
    let correctButtonText = true;
    for (let i = 0; i < 20; i++) {
      let prod = prodItems[i];
      let shadowRoot = await prod.evaluateHandle(el => el.shadowRoot);
      let button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      if(await innerText.jsonValue() !== "Add to Cart"){
        correctButtonText = false;
        break;
      }
    }
    expect(correctButtonText).toBe(true);
    const cartCountEl = await page.$('#cart-count');
    const cartCountText = await cartCountEl.getProperty('innerText');
    const cartCountNum = await cartCountText.jsonValue();
    expect(cartCountNum).toBe("0");
  }, 10000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(JSON.parse(cart)).toEqual([]);
  });

});
