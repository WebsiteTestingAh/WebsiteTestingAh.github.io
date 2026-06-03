import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { chmod, copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const toolsDir = join(root, "tools");

const tools = [
  {
    name: "yt-dlp",
    url: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos",
    target: join(toolsDir, "yt-dlp_macos"),
    type: "file",
  },
  {
    name: "FFmpeg",
    url: "https://evermeet.cx/ffmpeg/getrelease/zip",
    target: join(toolsDir, "ffmpeg"),
    type: "zip",
    extractedFile: "ffmpeg",
  },
];

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function installTool(tool) {
  if (existsSync(tool.target)) {
    console.log(`${tool.name} already installed at ${tool.target}`);
    return;
  }

  console.log(`Downloading ${tool.name}...`);
  const tempDir = await mkdtemp(join(tmpdir(), "whisk-tool-"));
  try {
    await mkdir(dirname(tool.target), { recursive: true });
    if (tool.type === "file") {
      const downloadPath = join(tempDir, tool.name);
      await download(tool.url, downloadPath);
      await copyFile(downloadPath, tool.target);
    } else {
      const zipPath = join(tempDir, `${tool.name}.zip`);
      await download(tool.url, zipPath);
      await execFileAsync("unzip", ["-q", zipPath, "-d", tempDir], { timeout: 60000 });
      await copyFile(join(tempDir, tool.extractedFile), tool.target);
    }
    await chmod(tool.target, 0o755);
    console.log(`Installed ${tool.name} at ${tool.target}`);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  if (process.platform !== "darwin") {
    throw new Error(
      [
        "This setup script downloads the macOS tool builds used by this app.",
        "On Linux or Windows, install yt-dlp and FFmpeg yourself, then set YT_DLP_PATH and FFMPEG_PATH in .env.",
      ].join(" "),
    );
  }

  await mkdir(toolsDir, { recursive: true });
  for (const tool of tools) {
    await installTool(tool);
  }
  console.log("Video tools are ready.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
