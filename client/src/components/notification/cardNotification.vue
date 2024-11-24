<template>
    <div class="card-notification" v-if="notification">
        <!-- Avatar và tên -->
        <div class="notifi-avatars" v-if="notification.type === 'like'">
            <div class="notifi-avatar" v-for="user in notification.users " :key="user.USER_Id">
                <img :src="loadimg(user)" alt="Avatar" class="avatar" />
            </div>
        </div>
        <div class="notifi-content">
            <p>
                <strong>{{ userNickName }}</strong>
                <!-- <span v-if="notification.type === 'friend_request'">sent you a friend request.</span>
                <span v-if="notification.type === 'reply_comment'">replied to your comment: "{{
                    notification.post.CommentReply_Content }}"</span> -->
                <span v-if="notification.type === 'like'">and {{ notification.stillUser }} others liked your
                    post.</span>
                <!-- <span v-if="notification.type === 'comment'">commented on your post: "{{
                    notification.post.COMMENT_Content }}"</span> -->
            </p>
            <p class="timestamp">{{ formatDate(notification.created_at) }}</p>
        </div>
        <!-- Hình ảnh bài đăng -->
        <div class="notifi-post" v-if="notification.post && notification.post.POST_ImgURL">
            <!-- <img :src="`/uploads/${notification.post.POST_ImgURL}`" alt="Post Image" class="post-image" /> -->
        </div>
    </div>
</template>

<script>
export default {
    props: {
        notification: { type: Object, required: true },
    },
    computed: {
        userNickName() {
            return this.notification.post.USER_NickName || this.notification.users[0].USER_NickName || "Unknown";
        },
    },
    methods: {
        loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        },
        formatDate(date) {
            const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
            return new Date(date).toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
.card-notification {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
}

.notifi-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.notifi-content {
    flex: 1;
}

.timestamp {
    font-size: 12px;
    color: gray;
}

.notifi-post img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
}
</style>
