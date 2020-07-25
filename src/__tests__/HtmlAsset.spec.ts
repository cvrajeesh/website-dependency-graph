// import mockFs from "mock-fs";
import { readFile } from "../fs";
import { mocked } from "ts-jest/utils";
import { HtmlAsset } from "../HtmlAsset";

jest.mock("../fs");

const ROOT_DIR = "/my-website";

describe("HtmlAsset", () => {
  const mockedFs = mocked(readFile, true);

  const runTest = async (
    filePath: string,
    content: string,
    expected: string[]
  ) => {
    mockedFs.mockResolvedValue(content);

    const dependencies: string[] = [];

    const htmlAsset = new HtmlAsset(ROOT_DIR, filePath);
    htmlAsset.on("dependency", (_type, dependency) =>
      dependencies.push(dependency)
    );
    await htmlAsset.process();

    expect(dependencies.sort()).toEqual(expected.sort());
  };

  afterEach(() => {
    mockedFs.mockClear();
  });

  it("can find dependencies with correct path", async () => {
    const filePath = `${ROOT_DIR}/about-us/index.html`;
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
      "about-us/css/style.css",
      "js/app.js",
      "about-us/img/background.png",
      "about-us/img/logo1x.png",
      "about-us/img/logo2x.png",
      "js/home.js",
    ];

    await runTest(filePath, content, expected);
  });

  it("can handle dependencies with querystring", async () => {
    const filePath = `${ROOT_DIR}/products/index.html`;
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
          <img srcset="img/logo.png?width=480 480w,
                       img/logo.png?width=800 800w" alt="" />
        </main>
    
        <script src="/js/home.js"></script>
      </body>
    </html>
    `;

    const expected = [
      "products/css/style.css",
      "js/app.js",
      "products/img/background.png",
      "products/img/logo.png",
      "products/img/logo.png",
      "js/home.js",
    ];

    await runTest(filePath, content, expected);
  });
});
