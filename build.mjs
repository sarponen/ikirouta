// build.mjs
import { promises as fs } from "node:fs";
import { join } from "node:path";

const SRC = "src";
const DIST = "dist";

async function main() {
  await fs.mkdir(DIST, { recursive: true });

  const template = await fs.readFile(join(SRC, "index.template.html"), "utf8");
  const css = await fs.readFile(join(SRC, "styles.css"), "utf8");
  const js  = await fs.readFile(join(SRC, "script.js"), "utf8");

  // Lue huoneet ja järjestä tiedostonimen mukaan
  const roomDir = join(SRC, "rooms");
  const entries = await fs.readdir(roomDir, { withFileTypes: true });
  const roomFiles = entries
    .filter(e => e.isFile() && e.name.toLowerCase().endsWith(".html"))
    .map(e => e.name)
    .sort((a,b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  const roomsHtml = await Promise.all(
    roomFiles.map(f => fs.readFile(join(roomDir, f), "utf8"))
  );

  // Korvaa placeholderit
  const out = template
    .replace("<!-- @@INLINE_STYLES -->", `<style>\n${css}\n</style>`)
    .replace("<!-- @@INLINE_SCRIPT -->", `<script>\n${js}\n</script>`)
    .replace("<!-- @@ROOMS -->", roomsHtml.join("\n\n"));

  await fs.writeFile(join(DIST, "index.html"), out, "utf8");
  console.log("Built → dist/index.html");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
