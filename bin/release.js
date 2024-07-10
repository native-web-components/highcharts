import path from "path";
import fs from "fs";
import stream from "stream";
import { blob } from "node:stream/consumers";
import { fileURLToPath } from "url";
import readline from "readline";
import archiver from "archiver";
import axios from "axios";

// 获取当前文件夹路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectPath = path.resolve(__dirname, "../");
const projectName = path.basename(projectPath);

// 递归读取目录中的所有文件
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}
function filterFiles(files) {
  const shouldIncludes = [
    `${projectName}/dist`,
    `${projectName}/package.json`,
    `${projectName}/README.md`,
  ];
  const shouldNotIncludes = ["node_modules", ".git"];
  return files.filter((file) => {
    let isMatch = false;
    for (const subStr of shouldIncludes) {
      if (file.includes(subStr)) {
        isMatch = true;
        break;
      }
    }
    for (const subStr of shouldNotIncludes) {
      if (file.includes(subStr)) {
        isMatch = false;
        break;
      }
    }
    return isMatch;
  });
}

async function compressFiles() {
  const passThroughStream = new stream.PassThrough();
  const files = filterFiles(getAllFiles(projectPath));
  return await new Promise((resolve, reject) => {
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    archive.on("error", (err) => {
      reject(err);
    });
    archive.on("close", () => {
      resolve(passThroughStream);
    });
    archive.pipe(passThroughStream);
    files.forEach((file) => {
      archive.file(file, { name: file.replace(`${projectPath}/`, "") });
    });
    archive.finalize();
    resolve(passThroughStream);
  });
}

function getApiToken() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question("Enter your api token: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function release() {
  const passThroughStream = await compressFiles();
  const writeStream = new fs.createWriteStream("release.zip");
  await new Promise((resolve) => {
    passThroughStream.pipe(writeStream);
    writeStream.on("finish", () => {
      console.log("The file is saved!");
      resolve();
    });
  });
  const formData = new FormData();
  formData.append("file", await blob(fs.createReadStream("release.zip")), {
    filename: "release.zip",
  });
  try {
    const apiToken = await getApiToken();
    const { data: rData } = await axios.post(
      "https://wcomp.zezeping.com/api/components/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Cookie: `api-token=${apiToken}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );
    console.info("release success");
  } catch (error) {
    console.error(error.response.data);
  }
}
release();
