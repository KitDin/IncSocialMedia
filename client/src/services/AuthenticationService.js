import { update } from "lodash";
import Api from "./Api";
import verifyAPI from "./VerifyAPI";

export default {
  register(credentials) {
    return Api().post("register", credentials);
  },
  login(credentials) {
    return Api().post("login", credentials);
  },

  getUser(id) {
    return Api().get(`${id}`);
  },
  getUsers() {
    return Api().get();
  },
  getUserRequest(id) {
    return Api().get(`/frients/${id}`);
  },
  getRequestToOtherUser(id, toUser) {
    return Api().put(`/frients/${id}`, toUser);
  },
  cancelSendFriend(id, toUser) {
    return Api().delete(`/frients/${id}`, toUser);
  },
  deleteFriend(id, toUser) {
    return Api().delete(`/frients/${id}/${toUser}`);
  },
  addAFrient(id, idRequest) {
    return Api().post(`/frients/${id}`, idRequest);
  },
  getFriends(id) {
    return Api().get(`frients/${id}/havefriends`);
  },
  getFriendFullInfo(id, page, limit, search) {
    return Api().get(`frients/${id}/friend`, {
      params: { page: page, limit: limit, search: search }
    });
  },
  getFollowing(id) {
    return Api().get(`following/${id}`);
  },
  uploadAvata(formData) {
    return Api().post("/information/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  uploadImgPost(formData) {
    return Api().post("/status/img", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  getpost(id) {
    return Api().get(`status/img/${id}`);
  },
  getposts(id, page = 1, limit = 10, displayedPostIds = []) {
    return Api().get(`/status/img/recommend/${id}`, {
      params: { page, limit, displayedPostIds }
    });
  },
  like(id, post) {
    return Api().post(`status/img/${id}`, post);
  },
  unlike(id, postid) {
    return Api().put(`status/img/${id}`, postid);
  },
  APost(idpost) {
    return Api().get(`post/${idpost}`);
  },
  getComment(idpost) {
    return Api().get(`post/comments/comment/${idpost}`);
  },
  postComment(idpost, comment) {
    return Api().post(`post/comments/comment/${idpost}`, comment);
  },
  replyComment(idpost, reply) {
    return Api().put(`post/comments/comment/${idpost}`, reply);
  },
  getConversations(id) {
    return Api().get(`message/${id}`);
  },
  getMessages(id, conversationId, page, limit) {
    return Api().get(`message/${id}`, {
      params: {
        cid: conversationId,
        page: page,
        limit: limit || 30
      }
    });
  },
  createConversation(idCurren, userCreate) {
    return Api().post(`message/${idCurren}`, userCreate);
  },
  deleteConversation(idCurren, conversationId) {
    return Api().put(`message/${idCurren}`, conversationId);
  },
  verifyToken(token) {
    return verifyAPI().post(`/verifytoken`, { token });
  },
  getHashTag(search) {
    return Api().get(`hashtag/search`, {
      params: { search: search }
    });
  },
  getNumberNotification(id) {
    return Api().get(`/notifications/message/${id}`);
  },
  getRecommendHashtag(id) {
    return Api().get(`/hashtag/recommend/${id}`);
  },
  updateAvatar(id, formData) {
    return Api().post(`edit/profile/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  updateAllInfo(id, data) {
    return Api().put(`edit/profile/${id}`, data);
  },
  getAllNotification(id) {
    return Api().get(`/notifications/all/${id}`);
  }
};
