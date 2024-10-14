export const decodeBase64 = (encodedID) => {
  return Buffer.from(encodedID, "base64").toString("utf-8");
};

export const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};
