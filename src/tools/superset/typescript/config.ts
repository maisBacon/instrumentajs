export default {
  compilerOptions: {
    target: "ES2020",
    module: "commonjs",
    allowJs: true,
    checkJs: true,
    jsx: "preserve",
    outDir: "./dist",
    rootDirs: ["./src", "./tools"],
    strict: false,
    baseUrl: "./src",
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  },
}