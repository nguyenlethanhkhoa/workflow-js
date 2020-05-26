require("chromedriver");
const assert = require("assert");
const { Builder, Key, By, until } = require("selenium-webdriver");
describe("Checkout Google.com", function () {
	let driver;
	before(async function () {
		driver = await new Builder().forBrowser("chrome").build();
	});
	// Next, we will write steps for our test.
	// For the element ID, you can find it by open the browser inspect feature.
	it("Search on Google", async function () {
		let message;
let result;
let system_var_1 = await driver.get("http://hrm.sps");
let system_var_2 = await driver.findElement(By.css('#txtUsername')).sendKeys('cb_admin');
let system_var_3 = await driver.findElement(By.css('#txtPassword')).sendKeys('12345');
let system_var_4 = await driver.findElement(By.css('#btnLogin')).click();
let system_var_5 = await driver.findElement(By.css('#spanMessage')).getText();
message = system_var_5;
if(system_var_5 == "Invalid credentials") {
result = "true";
} else {
result = "false";
}

		assert.equal(result, "true");
	});
	// close the browser after running tests
	// after(() => driver && driver.quit());
});
