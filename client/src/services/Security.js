export default {
  encodeID(id) {
    return btoa(id); // Mã hóa ID thành Base64
  },
  decodeID(encodedID) {
    return atob(encodedID); // Giải mã Base64 trở lại ID gốc
  }
};
