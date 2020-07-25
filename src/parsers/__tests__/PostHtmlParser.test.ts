import { PostHtmlParser } from "../PostHtmlParser";

describe("PostHtmlParser", () => {
  const runTest = (content: string, expected: string[]) => {
    const dependencies: string[] = [];

    const postHtmlParser = new PostHtmlParser();
    postHtmlParser.on("dependency", (url) => dependencies.push(url));
    postHtmlParser.parse(content);

    expect(dependencies.sort()).toEqual(expected.sort());
  };

  it("can find dependencies", () => {
    const content = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <link rel="stylesheet" href="./css/style.css" />
            <script src="/js/app.js"></script>
          </head>
          <body>
            <h1>Hello World!</h1>
            <main>
              <div>Sample content</div>
              <IMG sRC="img/background.png" alt="" />
              <img srcset="img/logo1x.png 480w,
                           img/logo2x.png 800w" alt="" />
            </main>
        
            <script src="/js/home.js"></script>
          </body>
        </html>
        `;

    const expected = [
      "./css/style.css",
      "/js/app.js",
      "img/background.png",
      "img/logo1x.png",
      "img/logo2x.png",
      "/js/home.js",
    ];

    runTest(content, expected);
  });

  it("can find dependencies from internal styles", async () => {
    const content = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          body {
            background-image: url("./img/bg.png");
          }
        </style>
      </head>
      <body>
        <h1>Hello World!</h1>
        <div class="test">
        </div>
      </body>
    </html>
    `;

    const expected = ["./img/bg.png"];

    runTest(content, expected);
  });

  it("can find dependencies from inline style", async () => {
    const content = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
        .test {
          background-image: url("../img/test.png");
        }
      </style>
      </head>
      <body style="background-image: url('./img/bg.png')">
        <h1>Hello World!</h1>
        <div class="test">
        </div>
      </body>
    </html>
    `;

    const expected = ["./img/bg.png", "../img/test.png"];

    runTest(content, expected);
  });

  it("can find dependencies from internal scripts", async () => {
    const content = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <script type="module">
         import api from "./services/api.js";
        </script>
      </head>
      <body>
        <h1>Hello World!</h1>
        <img src="./img/bg.png" />
        <div class="test">
        </div>
      </body>
    </html>
    `;

    const expected = ["./img/bg.png", "./services/api.js"];

    runTest(content, expected);
  });
});
