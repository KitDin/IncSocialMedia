<template>
    <div class="NavFriend">
        <div class="NF-myInf">
            <img class="NF-myInf-avatar pointer" @click="goProfilePersonal" :src="loadimg(user_personal)" alt="">
            <div class="NF-myInf-name">
                <p class="myUsername pointer" @click="goProfilePersonal">{{ user_personal.USER_NickName }}</p>
                <p class="myName">{{ user_personal.USER_SubName + " " + user_personal.USER_FirstName }}</p>
            </div>
            <p class="NF-myInf-logout" @click="logout()">Logout</p>
        </div>
        <div class="NF-line">Your request <button v-show="users.length !== 0"
                style="border: none; background-color: transparent; text-decoration: underline; color: #0095f6;">Xem
                tất
                cả</button>
        </div>

        <!-- test -->

        <div class="NF-request" v-if="users.length === 0"
            style="font-size: 14px; color: rgb(235, 235, 235); padding-left: 15px;">
            No requests for you
        </div>
        <div v-else class="NF-request" v-for="user in users.slice(0, 5)" :key="user.id">
            <div class="NF-request-user">
                <img v-if="!user.check" class="NF-request-user-avata pointer" @click="goProfileOther(user)"
                    :src="loadimg(user)" alt="">
                <div v-if="!user.check" class="NF-request-user-name">
                    <p class="username pointer" @click="goProfileOther(user)"> {{ user.USER_NickName }}</p>
                    <p class="time">by {{ timeRequest(user) }}</p>
                </div>
                <button class="NF-request-user-accept" v-if="!user.check" @click="clickaccept(user)">Accept</button>
                <div class="scale-up-hor-left" v-if="user.rabang"></div>
                <i class="bi bi-check-circle-fill rotate-scale-up" v-if="user.tick"></i>
            </div>
            <div class="loader" v-if="user.check">
                <div class="rectangles">
                    <div class="rect"></div>
                    <div class="rect"></div>
                    <div class="rect"></div>
                </div>
            </div>
        </div>
        <!-- <div class="succ">successful</div> -->
        <router-view />
        <Footer class="footer"></Footer>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import Footer from './Footer.vue';
import AuthenticationService from '../services/AuthenticationService';


export default {
    data() {
        return {
            loadingAccept: false,
            user_personal: [],
            userid: '',
            users: []
        }
    },
    components: {
        RouterLink,
        Footer
    }, methods: {
        logout() {
            localStorage.removeItem("token");
            this.$router.push('/')
        },
        loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        }
        , timeRequest(user) {
            const fixedDate = new Date(user.FR_CreateAt);
            const currentDate = new Date();
            const timeDifference = currentDate - fixedDate;
            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (seconds > 0 && seconds <= 60) {
                return seconds + " s"
            } else if (minutes > 0 && minutes <= 60) {
                return minutes + " minutes"
            } else if (hours > 0 && hours <= 24) {
                return hours + " hours"
            } else if (days > 0) {
                return days + " days"
            }
        }, async clickaccept(user) {
            user.check = true;
            const add = await AuthenticationService.addAFrient(this.userid, {
                USER_SENDERID: user.USER_SenderId,
                USER_RECID: user.USER_RecId
            });

            // const add = add.data.success
            if (add.data.success) {
                setTimeout(async () => {

                    user.check = false;
                    user.rabang = true;
                    setTimeout(() => {

                        user.tick = true;
                        setTimeout(async () => {
                            user.tick = false
                            user.rabang = false;
                            this.users = (await AuthenticationService.getUserRequest(this.userid)).data;
                        }, 1500);
                    }, 1500);
                }, 1500);
            }
        },
        goProfilePersonal() {
            this.$router.push(`/profile`)
        },
        goProfileOther(idother) {
            this.$router.push(`/profile/${idother.USER_Id}`)
        }
    }, async mounted() {
        const token = localStorage.getItem("token");

        if (token) {
            // Nếu có token, có thể gửi yêu cầu đến máy chủ để xác thực token
            const response = await AuthenticationService.verifyToken(token);
            if (response.status !== 200) {
                // Nếu token không hợp lệ, điều hướng đến trang đăng nhập
                localStorage.removeItem("token");
                this.$router.push("/");
            }
            this.userid = response.data.userId
        } else {
            // Nếu không có token, điều hướng đến trang đăng nhập
            this.$router.push("/");
        }
        this.user_personal = (await AuthenticationService.getUser(this.userid)).data;
        this.users = (await AuthenticationService.getUserRequest(this.userid)).data;
    }
}
</script>
<style scoped>
.rotate-scale-up {
    -webkit-animation: rotate-scale-up 0.65s linear both;
    animation: rotate-scale-up 0.65s linear both;
    color: #0095f6;
    font-size: 22px;
    right: 28px;
    top: 12px;
    position: absolute;
    z-index: 111111111111111111111;
}

@-webkit-keyframes rotate-scale-up {
    0% {
        -webkit-transform: translateX(18px);
        transform: translateX(18px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
        opacity: 1;
    }

    24% {
        opacity: 1;
    }

    40% {
        -webkit-transform: translateX(16px);
        transform: translateX(16px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    65% {
        -webkit-transform: translateX(13px);
        transform: translateX(13px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    82% {
        -webkit-transform: translateX(6.5px);
        transform: translateX(6.5px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    93% {
        -webkit-transform: translateX(4px);
        transform: translateX(4px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    25%,
    55%,
    75%,
    87%,
    98% {
        -webkit-transform: translateX(0px);
        transform: translateX(0px);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
    }

    100% {
        -webkit-transform: translateX(0px);
        transform: translateX(0px);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
        opacity: 1;
    }
}

@keyframes rotate-scale-up {
    0% {
        -webkit-transform: translateX(18px);
        transform: translateX(18px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
        opacity: 1;
    }

    24% {
        opacity: 1;
    }

    40% {
        -webkit-transform: translateX(16px);
        transform: translateX(16px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    65% {
        -webkit-transform: translateX(13px);
        transform: translateX(13px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    82% {
        -webkit-transform: translateX(6.5px);
        transform: translateX(6.5px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    93% {
        -webkit-transform: translateX(4px);
        transform: translateX(4px);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    25%,
    55%,
    75%,
    87%,
    98% {
        -webkit-transform: translateX(0px);
        transform: translateX(0px);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
    }

    100% {
        -webkit-transform: translateX(0px);
        transform: translateX(0px);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
        opacity: 1;
    }
}

.rabang {
    position: absolute;
    z-index: 11111111;
    width: 100%;
    padding: 22px;
    left: -15px;
}

.scale-up-hor-left {
    -webkit-animation: scale-up-hor-left 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: scale-up-hor-left 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    background: rgb(254, 254, 254);
    background: linear-gradient(90deg, rgba(254, 254, 254, 1) 0%, rgba(0, 212, 255, 1) 100%);
    position: absolute;
    z-index: 11111111;
    width: 100%;
    height: 44px;
    left: -15px;
    border-start-start-radius: 15px;
}

@-webkit-keyframes scale-up-hor-left {
    0% {
        -webkit-transform: scaleX(0.4);
        transform: scaleX(0.4);
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%;
    }

    100% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%;
    }
}

@keyframes scale-up-hor-left {
    0% {
        -webkit-transform: scaleX(0.4);
        transform: scaleX(0.4);
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%;
    }

    100% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%;
    }
}

.NavFriend {
    position: absolute;
    right: 52px;
    top: 52px;
    width: 360px;
    height: fit-content;

    .footer {
        padding-top: 22px;
        opacity: .5;
    }

    .NF-myInf {
        width: 100%;
        display: flex;
        position: relative;

        .NF-myInf-avatar {
            height: 56px;
            width: 56px;
            object-fit: cover;
            border-radius: 50%;
            margin-right: 20px;
        }

        .NF-myInf-name {
            font-size: 14px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            flex-wrap: nowrap;

            .myUsername {
                margin: 0;
                font-weight: 600;
            }

            .myName {
                margin: 0;
                color: #737373;
                opacity: .7;
            }
        }

        .NF-myInf-logout {
            font-size: 14px;
            cursor: pointer;
            text-decoration: none;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #0095f6;
            font-weight: bolder;
        }
    }

    .NF-line {
        display: flex;
        justify-content: space-between;
        padding: 12px 24px 12px 0px;
        font-size: 14px;
        font-weight: 600;
        color: #737373;
    }

    .NF-request {
        display: flex;
        width: 100%;
        height: 50px;
        padding: 6px 0 6px 0px;
        position: relative;

        .NF-request-user {
            display: flex;

            .NF-request-user-avata {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
                margin-right: 20px;
            }

            .NF-request-user-name {
                font-size: 14px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                flex-wrap: nowrap;

                .username {
                    margin: 0;
                    font-weight: 600;
                }

                .time {
                    font-size: 12px;
                    margin: 0;
                    color: #737373;
                    opacity: .7;
                }
            }

        }

        .NF-request-user-accept {
            position: absolute;
            right: 0;
            border: none;
            top: 50%;
            /* background-color: #fafafa; */
            background-color: white;
            right: 0;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #0095f6;
            font-size: 14px;
            font-weight: 400;

        }

    }
}


.loader {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 24px;
    right: 30px;
    transform: translateY(-50%);
}

.rectangles {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: spin 1s linear infinite;
}

.rect {
    width: 12px;
    height: 4px;
    background: #3498db;
    border-radius: 2px;
    margin: 1px 0;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.pointer {
    cursor: pointer;
}
</style>