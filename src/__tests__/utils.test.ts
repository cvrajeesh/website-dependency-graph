import { isAssetUrl } from "../utils";

describe("utils", () => {
  it.each([
    ["absolute url", "/images/bg.png", true],
    ["relative url", "../images/bg.png", true],
    ["filename", "bg.png", true],
    ["http url", "http://www.test.com/app.css", false],
    ["https url", "https://www.test.com/app.css", false],
    ["protocol relative url", "//www.test.com/app.css", false],
    ["anchor tag", "#top", false],
    ["mailto", "mailto:john@example.com", false],
  ])("isAssetUrl(%s)", (_name, url, expected) => {
    expect(isAssetUrl(url)).toBe(expected);
  });
});
