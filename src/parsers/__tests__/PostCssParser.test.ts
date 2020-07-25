import { PostCssParser } from "../PostCssParser";

describe("PostCssParser", () => {
  const runTest = (content: string, expected: string[]) => {
    const dependencies: string[] = [];

    const postCssParser = new PostCssParser();
    postCssParser.on("dependency", (url) => dependencies.push(url));
    postCssParser.parse(content);

    expect(dependencies.sort()).toEqual(expected.sort());
  };

  it("can find dependencies from import rule", () => {
    const content = `
        @import "app.css";
        @import url("style.css");
        body {
            color: "red";
        }
        `;

    runTest(content, ["app.css", "style.css"]);
  });

  it("can find dependencies from declarations", () => {
    const content = `
    @font-face {
        font-family: "Open Sans";
        src: url("./fonts/myfont.woff2");
    }
    body {
        color: red;
        background-image: url("./img/bg.png")
    }
    `;

    runTest(content, ["./img/bg.png", "./fonts/myfont.woff2"]);
  });
});
