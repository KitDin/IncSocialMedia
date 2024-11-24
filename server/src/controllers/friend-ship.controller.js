import {
  getFullInforUserAllUser,
  insertRequestToShip,
  deleteRequestAccepted,
  addFriend,
  canceltoUser,
  ListFriend,
  Friends,
  deleteFriend,
  getFollowingSQL,
} from "../services/frient-ship.js";

export async function getAllIdUserRequestController(req, res) {
  const id = req.params.id;
  const row = await getFullInforUserAllUser(id);
  res.json(row);
}
export async function acceptRequest(req, res) {
  try {
    const { USER_SENDERID, USER_RECID } = req.body;
    console.log(USER_SENDERID, USER_RECID);
    const insert = await insertRequestToShip(USER_SENDERID, USER_RECID);
    if (insert) {
      const del = await deleteRequestAccepted(USER_SENDERID, USER_RECID);
      if (del) {
        res.json({
          success: true,
          message: "Đã thêm bạn thành công",
        });
      }
    } else {
      res.json({
        success: false,
        message: "Không thêm bạn thành công",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error,
    });
  }
}

export async function getListFriend(req, res) {
  try {
    const idUser = req.params.id;
    const listFriend = await ListFriend(idUser);
    res.json(listFriend);
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error,
    });
  }
}

export async function getFriend(req, res) {
  try {
    const idUser = req.params.id;
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 10; // Number of friends per page
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || ""; // Optional search query

    const friend = await Friends(idUser, limit, offset, searchQuery);

    if (friend.length > 0) {
      res.json({ status: true, friend, currentPage: page });
    } else {
      res.json({ status: false, message: "No friends found" });
    }
  } catch (error) {
    res.json({ status: false, error: error.message });
  }
}

export async function sendRequest(req, res) {
  try {
    const idUser = req.params.id;
    const { toUser } = req.body;
    const add = await addFriend(idUser, toUser);
    if (add) {
      res.json({
        success: true,
        message: "Đã gửi lời mời kết bạn thành công!",
      });
    } else {
      res.json({
        success: false,
        message: "Không thành công khi gửi lời mời kết bạn!",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error,
    });
  }
}

export async function cancelRequest(req, res) {
  try {
    const idUser = req.params.id;
    const { cancelToUser } = req.body;
    const del = await canceltoUser(idUser, cancelToUser);
    if (del) {
      res.json({
        success: true,
        message: "Đã huỷ kết bạn thành công",
        check: idUser + " đã xoá " + cancelToUser,
      });
    } else {
      res.json({
        success: false,
        message: "Huỷ không thành công!",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error,
    });
  }
}

export async function getFollowing(req, res) {
  try {
    const { id } = req.params;
    const get = await getFollowingSQL(id);
    res.json({ status: true, following: get });
  } catch (error) {
    res.json({ status: false, message: error });
  }
}

export async function cancelFriend(req, res) {
  try {
    const { id, f_id } = req.params;
    const checkDelete = await deleteFriend(id, f_id);
    if (checkDelete) res.json({ status: true });
    else res.json({ status: false });
  } catch (error) {
    console.error(error);
    res.json({
      status: false,
      message: error,
    });
  }
}
