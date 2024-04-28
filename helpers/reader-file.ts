import { JsonDB } from "@/types/common.d.ts";

const FILE_PATH = "./db.json"

const readerFile = async () => {
  const text = await Deno.readTextFile(FILE_PATH);
  const jsonFile: JsonDB = JSON.parse(text)
  const { urls } = jsonFile;
  return urls
}

const writterFile = async (urls: JsonDB["urls"]) => {
  await Deno.writeTextFile(FILE_PATH, JSON.stringify({ urls: urls}));
}

const FILE = {
  reader: readerFile,
  writter: writterFile
}

export { FILE }
