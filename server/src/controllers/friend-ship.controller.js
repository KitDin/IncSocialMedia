import {
  getFullInforUserAllUser,
  insertRequestToShip,
  deleteRequestAccepted,
  addFriend,
  canceltoUser,
  ListFriend,
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

export async function getListFriend(req, res, next) {
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

export async function sendRequest(req, res, next) {
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

export async function cancelRequest(req, res, next) {
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
