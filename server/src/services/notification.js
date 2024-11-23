import { pool } from "../db/db.js";

export const getNotificationsByUserId = async (userId) => {
  try {
    const query = ` SELECT *, 
                            CASE 
                            WHEN DATE(CREATED_AT) = DATE(NOW()) THEN 'new'
                            WHEN MONTH(CREATED_AT) = MONTH(NOW()) AND YEAR(CREATED_AT) = YEAR(NOW()) THEN 'thisMonth'
                                WHEN CREATED_AT >= DATE_SUB(NOW(), INTERVAL 5 MONTH) THEN 'earlier'
                            ELSE NULL
                            END AS notification_group
                    FROM __NOTIFICATIONS
                    WHERE USER_ID = 2
                        AND CREATED_AT >= DATE_SUB(NOW(), INTERVAL 5 MONTH) 
                        AND TYPE NOT IN ('message')
                    ORDER BY CREATED_AT DESC;`;

    const [notification] = await pool.query(query, userId);
    return notification.length > 0 ? notification : [];
  } catch (error) {
    console.error(error);
    return false;
  }
};
