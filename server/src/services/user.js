import { pool } from "../db/db.js";

export async function checkAccout_Password(accountName, email, password) {
  const [row] = await pool.query(
    `
  select * 
  from __USER 
  where (USER_AccountName = ? or USER_Email = ?) and user_password = ?
  `,
    [accountName, email, password]
  );
  const check = row.length > 0;
  return check;
}

export async function getUsers() {
  const [row] = await pool.query(
    ` select U.USER_Id, U.USER_AccountName, U.USER_Email, UI.USER_Status, 
           UI.USER_FirstName, UI.USER_SubName, UI.USER_NickName, 
           UI.USER_NumberPhone, UI.USER_AvatarURL, UI.USER_Cover, 
           UI.USER_BrithDay from __USER U left join __USER_INFOR UI on U.USER_Id=UI.USER_Id`
  );
  return row;
}

export async function getUser(username, email) {
  const [row] = await pool.query(
    `
  select U.USER_Id, U.USER_AccountName, U.USER_Email, UI.USER_Status, 
           UI.USER_FirstName, UI.USER_SubName, UI.USER_NickName, 
           UI.USER_NumberPhone, UI.USER_AvatarURL, UI.USER_Cover, 
           UI.USER_BrithDay  
  from __USER U left join __USER_INFOR UI on U.USER_Id=UI.USER_Id
  where USER_AccountName = ? or USER_Email = ?
  `,
    [username, email]
  );
  return row;
}

export async function getUserById(id) {
  const [row] = await pool.query(
    `
  select U.USER_Id, U.USER_AccountName, U.USER_Email, UI.USER_Status, 
           UI.USER_FirstName, UI.USER_SubName, UI.USER_NickName, 
           UI.USER_NumberPhone, UI.USER_AvatarURL, UI.USER_Cover, 
           UI.USER_BrithDay, USER_Bio, UI.USER_Gender  from __USER U left join __USER_INFOR UI on U.USER_Id=UI.USER_Id 
           where U.USER_Id = ?;
  `,
    [id]
  );
  return row[0];
}

export async function getUserByIdShortInfo(id) {
  try {
    const [row] = await pool.query(
      `select USER_Id, USER_FirstName, USER_SubName, USER_NickName, 
            USER_AvatarURL from __USER_INFOR 
           where USER_Id = ?;
    `,
      [id]
    );
    return row;
  } catch (error) {}
}

export async function getAccountName_Email(accountName, email) {
  const [row] = await pool.query(
    `
  select * 
  from __USER 
  where USER_AccountName = ? or USER_Email = ?
  `,
    [accountName, email]
  );
  const check = row.length > 0;
  return check;
}

export async function createUser(
  USER_Id,
  USER_AccountName,
  USER_Email,
  USER_Password,
  USER_UpdateAt
) {
  const [INSERT] = await pool.query(
    `INSERT INTO 
    __user(USER_Id,USER_AccountName, USER_Email, USER_Password, USER_CreateAt, USER_UpdateAt) 
    VALUES (?,?,?,?,?,?)`,
    [
      USER_Id,
      USER_AccountName,
      USER_Email,
      USER_Password,
      new Date(),
      USER_UpdateAt,
    ]
  );
  return [INSERT.insertId, USER_AccountName, USER_Email];
}

export async function setInforUser(
  USER_AvatarURL,
  USER_Id,
  USER_NickName,
  USER_FirstName,
  USER_SubName,
  USER_NumberPhone,
  USER_BirthDay,
  USER_Bio,
  USER_Sex
) {
  const insertInfor = `INSERT INTO __user_infor
    (USER_Id,USER_FirstName ,USER_SubName ,USER_NickName ,
    USER_NumberPhone ,USER_AvatarURL ,USER_BrithDay,USER_Bio ) 
    VALUES (?,?,?,?,?,?,?,?)`;
  try {
    const [INSERT] = await pool.query(insertInfor, [
      USER_Id,
      USER_FirstName,
      USER_SubName,
      USER_NickName,
      USER_NumberPhone,
      USER_AvatarURL,
      USER_BirthDay,
      USER_Bio,
    ]);
    return INSERT.USER_FirstName;
  } catch (error) {
    console.error(error);
  }
}

export const updateInfoUser = {
  updateAvatar: async (userId, avatarURL) => {
    try {
      const query = `update __USER_INFOR set USER_AVATARURL=? where USER_ID = ?;`;
      const [rs] = await pool.query(query, [avatarURL, userId]);
      if (rs.affectedRows > 0) return true;

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  updateAll: async (
    USER_Id,
    USER_NickName,
    USER_FirstName,
    USER_SubName,
    USER_Bio,
    USER_Gender
  ) => {
    try {
      const query = `
      UPDATE __USER_INFOR
      SET 
          USER_NICKNAME = ?,   
          USER_FIRSTNAME = ?, 
          USER_SUBNAME = ?, 
          USER_Bio = ?,
          USER_Gender = ?
      WHERE 
          USER_ID = ?;
    `;
      const [rs] = await pool.query(query, [
        USER_NickName,
        USER_FirstName,
        USER_SubName,
        USER_Bio,
        USER_Gender,
        USER_Id,
      ]);

      if (rs.affectedRows === 0) {
        return { status: false, message: "No rows affected. Check USER_ID." };
      }
      return { status: true, message: "Update successful." };
    } catch (error) {
      console.error("Error updating user info:", error);
      return { status: false, message: "An error occurred.", error };
    }
  },
  renewUpdateTime: async () => {
    const query = `UPDATE __USER`;
  },
};
