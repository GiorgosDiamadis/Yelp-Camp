function chunkify(array, by) {
  let chunks = [];
  let placeholder = [];
  let counter = 0;
  for (let index = 0; index < array.length; index++) {
    placeholder.push(array[index]);

    if (counter === by - 1) {
      chunks.push(placeholder);
      placeholder = [];
      counter = 0;
    } else {
      counter++;
    }
  }
  if (placeholder.length != 0) {
    chunks.push(placeholder);
  }

  return chunks;
}

module.exports.chunkify = chunkify;
