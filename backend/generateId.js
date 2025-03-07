export async function generateNextId(collection, config) {
  const latestDoc = await collection.find({}).sort({ _id: -1 }).limit(1).toArray();

  if (latestDoc.length === 0) {
    if (config.type === "numeric") {
      return (config.defaultStart || 1).toString();
    } else if (config.type === "prefixed") {
      const start = config.defaultStart || 1000000000;
      return config.prefix + start.toString();
    }
  }

  let currentId = latestDoc[0]._id;

  if (config.type === "numeric") {
    let numericId = parseInt(currentId, 10);
    return (numericId + 1).toString();
  } else if (config.type === "prefixed") {
    let numericPart = currentId.substring(config.prefix.length);
    let numericId = parseInt(numericPart, 10);
    return config.prefix + (numericId + 1).toString();
  }
}
