import getFiles from "../utils/getFiles";

export async function getDataList() {
  // get all files from report folder
  const files = await getFiles("./report")
  // filter for json db files
  const jsonDb = files.filter(item => item.type === "json")

  return jsonDb
}