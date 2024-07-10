import { defineConfig, loadEnv, ConfigEnv } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig(async (params: ConfigEnv) => {
  const { command, mode } = params;
  const ENV = loadEnv(mode, process.cwd());
  console.log("node version", process.version);
  console.info(
    `running mode: ${mode}, command: ${command}, ENV: ${JSON.stringify(ENV)}`
  );
  return {
    base: "./",
    resolve: {
      alias: {
        "highcharts": resolve(__dirname, "./node_modules/highcharts"),
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "WebComponent",
        fileName: (format: string) => `highcharts.${format}.js`,
        // formats: ["es", "umd"],
      },
      emptyOutDir: true,
      sourcemap: mode === "development",
      minify: mode !== "development",
      rollupOptions: {
        external: ["highcharts"],
        output: {
          globals: {
            highcharts: "Highcharts",
          },
        },
      },
    },
    plugins: [dts({ rollupTypes: true })],
  };
});
