<template>
    <div class="Notification-Frame">
        <h2>Notifications</h2>
        <div class="notifications-new">
            <CardNotification />
        </div>

        <div class="notification-this-month">
            <CardNotification />
        </div>

        <div class="notification-earlier">
            <CardNotification />
        </div>
    </div>
</template>

<script>
import AuthenticationService from '../../services/AuthenticationService';
import CardNotification from './cardNotification.vue';
export default {
    data() {
        return {
            notifications: [],
        }
    },
    methods: {

    },
    async mounted() {
        const test = await AuthenticationService.getAllNotification(2)
        console.log(test)
    }
    , props: {

    }, components: {
        CardNotification
    }
    // notifications lấy thông báo trong 5 tháng.
    // endpoint notifications chia làm 3 key : 
    // new - trong ngày, thisMonth - trong thánh, earlier - là trường hợp khác của 2 trường hợp khác và dưới 5 tháng
    //
    // ví dụ 1 post mình đăng , nếu cùng là type like người khác đã tương tác với mình gôm thành 1 nhóm
    // lúc này thông báo sẽ là - a, b, c và [số người] đã thích bài đăng của bạn.
    // cùng bài đăng đó nhưng thuộc type comment hoặc reply_comment sẽ hiện lên - a đã bình luận "nội dung bình luận" - b đã trả lời bình luận của bạn.

    // yêu cầu kết bạn ....

    // hình ảnh,post id của bài đăng của mình mà người dùng đã tương tác, 
    // tên và avatar,userID của người dùng đã tương tác vào bài đăng của mình.
    // hình ảnh,post id của bài đăng đã được reply bởi người dùng khác.
    // tên và avatar,userID của người dùng đã reply mình.
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
    padding: 32px 24px 0 24px;
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