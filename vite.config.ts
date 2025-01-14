import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv } from "vite";

export default defineConfig(async (params: ConfigEnv) => {
  const { command, mode } = params;
  const ENV = loadEnv(mode, process.cwd());
  console.log("node version", process.version);
  console.info(
    `running mode: ${mode}, command: ${command}, ENV: ${JSON.stringify(ENV)}`
  );
  return {
    server: {
      port: 9999,
    },
    base: "./",
    resolve: {
      alias: {
        "highcharts": resolve(__dirname, "./node_modules/highcharts"),
      },
    },
    build: {
      outDir: "dist/example",
      emptyOutDir: true,
    },
  };
});
