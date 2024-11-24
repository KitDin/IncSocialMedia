<template>
<<<<<<< HEAD
    <div class="card-notification" v-if="notification" @click="getPostId(notification.post.POST_Id)">
=======
    <div class="card-notification" v-if="notification">
>>>>>>> 511580325b56af60aa016b8a1c492ad14318d595
        <div class="notifi-avatar">
            <img @click="goProfile(notification.post)" :src="loadimg(notification.post)" alt="Avatar" />
        </div>
        <div class="notifi-content">
            <p>
                <strong @click="goProfile(notification.post)" class="user-nickname">
                    {{ notification.post.USER_NickName }}
                </strong>
                <span>
                    commented on your post: "{{ notification.post.COMMENT_Content }}"
                </span>
            </p>
            <p class="timestamp">{{ formatDate(notification.created_at) }}</p>
        </div>
<<<<<<< HEAD
        <!-- <div class="notifi-post" v-if="notification && notification.post && notification.post.POST_ImgURL">
            <img @click="getPostId(notification.ref_id)" :src="loadpost(notification.post)" alt="Post Image"
                class="post-image" />
        </div> -->
=======
        <div class="notifi-post" v-if="notification && notification.post && notification.post.POST_ImgURL">
            <img @click="getPostId(notification.ref_id)" :src="loadpost(notification.post)" alt="Post Image"
                class="post-image" />
        </div>
>>>>>>> 511580325b56af60aa016b8a1c492ad14318d595
    </div>
</template>

<script>

export default {
    props: {
        notification: { type: Object, required: true },
        userId: { type: String, required: true }
    },
    methods: {
        getPostId(id) {
<<<<<<< HEAD
            console.log(id)
=======
>>>>>>> 511580325b56af60aa016b8a1c492ad14318d595
            this.$emit("goPostDetail", id)
        },
        goProfile(post) {
            if (post.userId == this.userId) {
                this.$router.push(`/profile`)
            } else {
                this.$router.push(`/profile/${post.userId}`)
            }
        },
        loadimg(post) {
            if (post && post.USER_AvatarURL) {
                return require(`../../../../server/public/uploads/avatar/${post.USER_AvatarURL}`);
            }
        }, loadpost(post) {
            if (post && post.POST_ImgURL) {
                return require(`../../../../server/public/uploads/post/${post.POST_ImgURL}`);
            }
        },
        formatDate(date) {
            const now = new Date();
            const givenDate = new Date(date);
            const diffInMs = now - givenDate;
            const diffInSeconds = Math.floor(diffInMs / 1000);
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            const diffInHours = Math.floor(diffInMinutes / 60);
            const diffInDays = Math.floor(diffInHours / 24);
            const diffInWeeks = Math.floor(diffInDays / 7);

            if (diffInSeconds < 60) {
                return `${diffInSeconds} seconds ago`;
            } else if (diffInMinutes < 60) {
                return `${diffInMinutes} minutes ago`;
            } else if (diffInHours < 24) {
                return `${diffInHours} hours ago`;
            } else if (diffInDays < 7) {
                return `${diffInDays} days ago`;
            } else if (diffInWeeks < 4) {
                return `${diffInWeeks} weeks ago`;
            } else {
                // Nếu đã quá lâu, trả về định dạng ngày tháng
                return `${diffInWeeks} weeks ago`;
            }
        },
    }, mounted() {
        console.log(this.userId)
    }
};
</script>

<style scoped>
.card-notification {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
    padding: 12px;
    border-radius: 8px;
<<<<<<< HEAD
    cursor: pointer;
=======
>>>>>>> 511580325b56af60aa016b8a1c492ad14318d595
}

.card-notification:hover {
    background-color: #6c757d0f;
}

.notifi-avatar {
    /* position: relative; */
    width: 48px;
    height: 48px;
}

.notifi-avatar img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}

.notifi-avatar:has(.avatar) {
    position: relative;
}

.notifi-avatar .avatar {
    position: absolute;
    width: 32px;
    height: 32px;
}

.notifi-avatar .avatar:last-child {
    bottom: 0;
    right: 0;
    outline: #ffffff 2px solid;
}

.notifi-post img:hover,
.notifi-avatar img:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.notifi-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.notifi-content p {
    font-size: 12px;
    margin: 0;
}

.notifi-content p strong {
    cursor: pointer;
}

.timestamp {
    font-size: 12px;
    color: #6c757d;
}

.notifi-post img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
}
</style>
