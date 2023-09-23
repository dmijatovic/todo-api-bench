const fs = require('fs');

/**
 * getFiles list from directory. It traverses all subdirectories.
 *
 * @param {string} dir
 * @param {array} files [{path,dir,file,type}]
 * @returns [{path,dir,file,type}]
 */
function getFiles(dir, files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const item = {
      path: `${dir}/${file}`,
      dir: dir,
      file: file,
      type: file.split(".")[1]
    }
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(item.path).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(item.path, files);
    } else {
      // If it is a file, push the full path to the files array
      files.push(item);
    }
  }
  return files;
}

module.exports = getFiles