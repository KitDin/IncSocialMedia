import { pool } from "../db/db.js";
import { getUserById } from "../services/user.js";

export async function getAllIdUserRequest(id) {
  const [row] = await pool.query(
    `
        select USER_SenderId,USER_RecId,FR_CreateAt
        from  __Friend_Request 
        where USER_RecID = ? ORDER BY FR_CreateAt desc
    `,
    [id]
  );
  return row;
}

export async function getFullInforUserAllUser(id) {
  const getIds = await getAllIdUserRequest(id);
  const userPromises = getIds.map(async (row) => {
    const user = await getUserById(row.USER_SenderId);
    // Create an object that includes both user information and FR_CreateAt
    const userWithFRCreateAt = {
      ...user,
      FR_CreateAt: row.FR_CreateAt,
      USER_SenderId: row.USER_SenderId,
      USER_RecId: row.USER_RecId,
      check: false,
      tick: false,
      rabang: false,
    };
    return userWithFRCreateAt;
  });
  const userInfor = await Promise.all(userPromises);
  return userInfor;
}

export async function insertRequestToShip(USER_SENDERID, USER_RECID) {
  try {
    await pool.query(
      `
  INSERT INTO __Friend_ship(USER_Id1,USER_Id2,FS_CreateAt)
  SELECT USER_SenderId,USER_RecID,now() FROM __Friend_Request
  WHERE USER_SENDERID = ? and USER_RECID = ?;
  `,
      [USER_SENDERID, USER_RECID]
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteRequestAccepted(USER_SENDERID, USER_RECID) {
  try {
    await pool.query(
      `
  delete from __Friend_Request where  USER_SENDERID=? and USER_RECID=?;
  `,
      [USER_SENDERID, USER_RECID]
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function isSenderRequest(id) {
  try {
    const [get] = await pool.query(
      `select * from __friend_request where USER_SENDERID = ?;`,
      [id]
    );
    return get;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addFriend(id, toUser) {
  try {
    await pool.query(
      `insert into __Friend_Request(USER_SenderId,USER_RecID,FR_StatusReq,FR_CreateAt) values (?,?,2,now());`,
      [id, toUser]
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function canceltoUser(id, toUser) {
  try {
    await pool.query(
      `DELETE FROM __Friend_Request WHERE USER_SENDERID = ? and USER_RECID = ?;`,
      [id, toUser]
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function ListFriend(id) {
  try {
    const [rows] = await pool.query(
      `SELECT 
          CASE
           WHEN USER_ID1 = ? THEN USER_ID2
           WHEN USER_ID2 = ? THEN USER_ID1
          END AS friend_user_id
        FROM __friend_ship
        WHERE USER_ID1 = ? OR USER_ID2 = ?;`,
      [id, id, id, id]
    );
    return rows;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function Friends(idUser, limit, offset, searchQuery) {
  let query = `
    SELECT 
      u.USER_ID, 
      ui.USER_FIRSTNAME, 
      ui.USER_SUBNAME, 
      ui.USER_NICKNAME, 
      ui.USER_AVATARURL, 
      ui.USER_STATUS
    FROM __FRIEND_SHIP fs
    JOIN __USER u ON (u.USER_ID = fs.USER_ID1 OR u.USER_ID = fs.USER_ID2)
    JOIN __USER_INFOR ui ON u.USER_ID = ui.USER_ID
    WHERE (fs.USER_ID1 = ? OR fs.USER_ID2 = ?)
    AND u.USER_ID != ?`;

  const params = [idUser, idUser, idUser];

  // Apply search if searchQuery is not '0'
  if (searchQuery !== "0") {
    query += ` AND (LOWER(TRIM(ui.USER_NICKNAME)) LIKE ? OR LOWER(TRIM(ui.USER_FIRSTNAME)) LIKE ?)`;
    const searchPattern = `%${searchQuery.trim().toLowerCase()}%`;
    params.push(searchPattern, searchPattern);
  }

  // Pagination
  query += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [friends] = await pool.query(query, params);
  return friends;
}
