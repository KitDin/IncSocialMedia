<template>
    <div class="Notification-Frame">
        <h2>Notifications</h2>
        <div class="notifications">
            <div class="notification-content" v-show="notifications && notifications.new.length > 0">
                <h3 class="notifications-time">New</h3>
                <div class="notifications-new" v-for="(notification, index) in notifications.new" :key="index + 1">
                    <CardNotificationLike v-if="notification && notification.type === 'like'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationComment v-if="notification && notification.type === 'comment'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationReplyComment v-if="notification && notification.type === 'reply_comment'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationRequestFriend
                        v-if="notification && notification.type === 'friend_request' || notification.type === 'friend_accept'"
                        :notification="notification" :userId="userId" />
                </div>
            </div>


            <div class="notification-content" v-show="notifications && notifications.thisMonth.length > 0">
                <h3 class="notifications-time">This month</h3>
                <div class="notification-this-month" v-for="(notification, index) in notifications.thisMonth"
                    :key="index">
                    <CardNotificationLike v-if="notification && notification.type === 'like'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationComment v-if="notification && notification.type === 'comment'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationReplyComment v-if="notification && notification.type === 'reply_comment'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationRequestFriend
                        v-if="notification && notification.type === 'friend_request' || notification.type === 'friend_accept'"
                        :notification="notification" :userId="userId" />
                </div>
            </div>


            <div class="notification-content" v-show="notifications && notifications.earlier.length > 0">
                <h3 class="notifications-time">Earlier</h3>
                <div class="notification-earlier" v-for="(notification, index) in notifications.earlier">
                    <CardNotificationLike v-if="notification && notification.type === 'like'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationComment v-if="notification && notification.type === 'comment'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationReplyComment v-if="notification && notification.type === 'reply_comment'"
                        :notification="notification" :userId="userId" @goPostDetail="goPostDetail" />
                    <CardNotificationRequestFriend
                        v-if="notification && notification.type === 'friend_request' || notification.type === 'friend_accept'"
                        :notification="notification" :userId="userId" />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import AuthenticationService from '../../services/AuthenticationService';
import CardNotificationLike from './cardNotificationLike.vue';
import CardNotificationComment from './cardNotificationComment.vue';
import CardNotificationReplyComment from './cardNotificationReplyComment.vue';
import CardNotificationRequestFriend from './cardNotificationFriend.vue';

export default {
    data() {
        return {
            notifications: [],
        }
    },
    methods: {
        goPostDetail(id) {
            this.$emit('goPostDetail', id)
        },
        async fetchNotifications(id) {
            const data = (await AuthenticationService.getAllNotification(id)).data
            if (data.status) {
                this.notifications = data.notifications
            } else {
                console.error(">>> Not notifications")
            }
            console.log(this.notifications)
        }
    },
    async mounted() {
        this.fetchNotifications(this.userId)
    }
    , props: {
        userId: { type: String }
    }, components: {
        CardNotificationLike, CardNotificationComment, CardNotificationReplyComment, CardNotificationRequestFriend
    }
}

</script>

<style scoped>
.Notification-Frame {
    position: fixed;
    top: 0;
    left: 74px;
    height: 100%;
    width: 400px;
    background-color: white;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    padding: 32px 0 0 24px;
    z-index: 999;
    box-shadow: rgba(100, 100, 111, 0.2) 5px 7px 12px 0px;
    -webkit-animation: scale-in-hor-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: scale-in-hor-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.Notification-Frame h2 {
    margin: 0;
    font-size: 24px;
    padding-bottom: 36px;
}

.Notification-Frame .notifications {
    padding-right: 8px;
    height: 600px;
    overflow-y: scroll;
}

@-webkit-keyframes scale-in-hor-left {
    0% {
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%;
        opacity: 1;
    }
}

@keyframes scale-in-hor-left {
    0% {
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%;
        opacity: 1;
    }
}
</style>