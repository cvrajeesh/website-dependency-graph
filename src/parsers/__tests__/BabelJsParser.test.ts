import { BabelJsParser } from "../BabelJsParser";

describe("BabelJsParser", () => {
  const runTest = (content: string, expected: string[]) => {
    const dependencies: string[] = [];
    const babelJsParser = new BabelJsParser();
    babelJsParser.on("dependency", (url) => dependencies.push(url));
    babelJsParser.parse(content);

    expect(dependencies.sort()).toEqual(expected.sort());
  };

  it("can find dependencies", () => {
    const content = `
        import appService from "./app-service.js";

        const main = () => {
            console.log("Hello");
        }

        main();
        `;
    const expected = ["./app-service.js"];

    runTest(content, expected);
  });

  it("should not find dependencies in script", () => {
    const content = `
        const main = () => {
            console.log("Hello");
        }

        main();
        `;
    const expected: string[] = [];

    runTest(content, expected);
  });
});
