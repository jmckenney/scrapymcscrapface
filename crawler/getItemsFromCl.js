const puppeteer = require("puppeteer");

const searchCity = "sacramento";
const searchDistance = "250";
const postalCode = "95648";
const minPrice = "20";
const url = `https://${searchCity}.craigslist.org/search/sss`;

const getItemsFromListings = async (searchKey) => {
  const searchUrl = `${url}?query=${encodeURI(
    searchKey
  )}&sort=rel&srchType=T&postedToday=1&min_price=${minPrice}&search_distance=${searchDistance}&postal=${postalCode}`;
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  let items;
  try {
    await page.goto(searchUrl);
    items = await page.evaluate(() => {
      return [...document.querySelectorAll("li.result-row")].map((elem) => {
        return {
          price: elem.querySelector(".result-price").textContent,
          id: elem.getAttribute("data-pid"),
          url: elem.querySelector("a.result-image.gallery").href,
          title: elem.querySelector(".result-title").textContent,
        };
      });
    });
  } catch (err) {
    console.log("error", err);
  } finally {
    await page.close();
  }
  return { items, searchUrl };
};

module.exports = {
  getItemsFromCl: getItemsFromListings,
};
