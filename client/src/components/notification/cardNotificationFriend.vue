<template>
    <div class="card-notification" v-if="notification">
        <div class="notifi-avatar">
            <img @click="goProfile(notification.user)" :src="loadimg(notification.user)" alt="Avatar" />
        </div>
        <div class="notifi-content">
            <p>
                <strong @click="goProfile(notification.user)" class="user-nickname">
                    {{ notification.user.USER_NickName }}
                </strong>
                <span v-if="notification.type === 'friend_request'">
                    sent you a friend request.
                </span>
                <span v-else>
                    has become your friend.
                </span>
            </p>
            <p class="timestamp">{{ formatDate(notification.created_at) }}</p>
        </div>
        <div class="notifi-post">
            <button v-show="!isLoading" class="accept" v-if="notification.type === 'friend_request'"
                @click="acceptFriend">
                Accept
            </button>
            <button class="friend" v-else>Friend</button>
            <LoadingPage v-show="isLoading" />
        </div>
    </div>
</template>

<script>
import AuthenticationService from '../../services/AuthenticationService';
import LoadingPage from '../LoadingPage.vue';
export default {
    data() {
        return {
            isLoading: false
        }
    },
    props: {
        notification: { type: Object, required: true },
        userId: { type: String, required: true }
    },
    methods: {
        test() { this.$emit('acceptFriend', this.notification.ref_id) },
        acceptFriend() {
            this.isLoading = true
            setTimeout(async () => {
                try {
                    const add = (await AuthenticationService.addAFrient(this.userId, {
                        USER_SENDERID: this.notification.ref_id,
                        USER_RECID: this.userId
                    })).data
                    if (add.success) {
                        this.notification.type = "friend_accept"
                        this.isLoading = false
                        this.$emit('acceptFriend', this.notification.ref_id)
                    }
                } catch (error) {
                    console.error(error)
                }
            }, 1500)
        },
        goProfile(post) {
            if (post.USER_Id == this.userId) {
                this.$router.push(`/profile`)
            } else {
                this.$router.push(`/profile/${post.USER_Id}`)
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
    }, components: {
        LoadingPage
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
    cursor: pointer;
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

.notifi-post button {
    border: none;
    border-radius: 8px;
    height: 30px;
    width: 70px;
    font-size: 13px;
    font-weight: 500;
    transition: all .5s ease-in-out;
}

.notifi-post button.accept {
    background-color: rgba(0, 149, 255, 0.372);
    color: #ffffff;
}

.notifi-post button.accept:hover {
    background-color: rgb(0, 149, 255);
}
</style>
