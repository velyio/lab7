1. Within a Github action that runs whenever code is pushed. Unit tests should be created and run manually before pushing code, but automated tests can fit in Github actions to make sure that everything is tested before merging to the main branch.
2. No
3. Navigation mode analyzes the page after it loads, making it very useful for checking perfomance and seeing the overall metrics after it's loaded, but it can't analyze the behavior when users interact with the page. Snapshot mode analyzes the current state of the page, so it can't get an overall metric but it is good for finding accessibility issues when the user is interacting with the page.
4. Based on the Lighthouse results, CSE110 shop could be improved by: 
   - Properly sizing images to save memory
   - Preconnecting to the required origins for a faster load
   - Serving images in next-gen formats
   - Including a `<meta name="viewport">` tag to optimize the app for mobile screen sizes
