<template>
    <div class="navcol" :class="is_expanded ? 'is_expanded' : ''">
        <div class="normal-setup">
            <img class="img" src="../assets/img_logo/logo.png" alt="">

            <ul class="navmenu">
                <li class="navli" v-for="link in links" :key="link.id"
                    :class="{ active: link.link_to === $route.name, activeLine: link.status }"
                    @click="handleItemClick(link)" style="cursor: pointer;">
                    <!-- <RouterLink to="/profile" /> -->

                    <i v-if="link.icon" ref="i" class="icon" :class="getActiveIconClass(link)">
                    </i>
                    <img v-else :src="user.USER_AvatarURL != null ? loadimg(user) : ''" alt="" class="avatar" :class="{
                        activeAvatar: link.link_to === $route.name && $route.name === 'Profile'
                    }">
                    <div class="circle-notification" v-if="link.id === 3 && notificationMessages > 0">{{
                        notificationMessages }}</div>
                    <div class="circle-notification notification" v-if="link.id === 4 && notificationAll > 0"></div>
                    <p class="text" v-if="!is_expanded">{{ link.text }}</p>
                </li>
            </ul>
        </div>

        <RouterLink class="more-setup" to="/profile">
            <i class="icon bi bi-three-dots-vertical"></i>
            <p class="text">More</p>
        </RouterLink>
        <div class="prevent" @click="shownav()" v-if="show_nav"></div>

        <div class="nav-more" v-if="show_nav">
            <div class="set-up">
                <ul class="set-up-rule">
                    <li class="set-up-rule-item" style="cursor: pointer;" v-for="set_up_item in set_up_items"
                        :key="set_up_item">
                        <i class="icon" :class="set_up_item.icon"></i>
                        <p class="text"> {{ set_up_item.text }} </p>
                    </li>
                </ul>
                <div class="set-up-line"></div>
                <ul class="set-up-logout" @click="logout">
                    <li style="cursor: pointer;">Log out</li>
                </ul>
            </div>
        </div>
        <div class="prevent2" v-if="showSearchBar" @click="showpreventsearch()"></div>

        <Search v-if="is_expanded && showSearchBar" :isOpen="showSearchBar"
            :class="!showSearchBar ? 'animationClosePar' : ''" />

        <div class="prevent2" v-if="showNotification" @click="showpreventNotification()"></div>

        <Notifications v-if="showNotification" :class="!showNotification ? 'animationClosePar' : ''" :userId="userid"
            @goPostDetail="goPostDetail" @acceptFriend="acceptFriend" />

        <AlertComponents v-if="!isAlert" :message="alertMessage" />

        <!-- <div class="prevent2" v-if="showSearchBar" @click="showpreventsearch()"></div> -->
        <Bur v-if="showPostBar" @closeBur="closePost" />
        <Post class="componentPost" v-if="showPostBar" @closePost="makeNewPost" />

        <Bur v-if="openPostDetail" @closeBur="closePostDetail" />
        <CommentPost v-if="openPostDetail" :postId="postOb" :userid="userid" :loadImgPost="loadimgpost"
            :loadImgUser="loadimg" :timeRequest="timeRequest" :goProfile="goProfile" :postIdSubline="postId"
            @updatePost="updatePost" />

    </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService';
import { RouterLink } from 'vue-router'
import Search from './Search.vue'
import Post from './Post.vue';
import AlertComponents from './AlertComponents.vue';
import Notifications from './notification/notifications.vue';
import Bur from './Bur.vue'
import CommentPost from './CommentPost.vue';

export default {
    data() {
        return {
            is_expanded: false,
            show_nav: false,
            userid: '',
            user: [],
            showPostBar: false,
            showSearchBar: false,
            isAlert: true,
            alertMessage: '',
            notificationMessages: 0,
            notificationAll: '',
            showNotification: false,
            postId: '',
            postOb: [],
            openPostDetail: false,
            links: [
                { id: 1, icon: "bi bi-house-door", icon_fill: "bi bi-house-door-fill", text: "Home", link_to: "Home" },
                { id: 2, icon: "bi bi-search-heart", icon_fill: "bi bi-search-heart-fill", text: "Search", link_to: null, status: false },
                { id: 3, icon: "bi bi-chat-dots", icon_fill: "bi bi-chat-dots-fill", text: "Messages", link_to: "Messages" },
                { id: 4, icon: "bi bi-heart", icon_fill: "bi bi-heart-fill", text: "Notifications", link_to: null, status: false },
                { id: 5, icon: "bi bi-plus-circle", icon_fill: "bi bi-plus-circle-fill", text: "Create", link_to: null, status: false },
                { id: 6, text: "Profile", avatar: this.user ? this.user.USER_AvatarURL : '', link_to: "Profile" },
            ],
            set_up_items: [
                { id: 1, icon: "bi bi-gear", text: "Settings" },
                { id: 2, icon: "bi bi-clock-history", text: "Your activity" },
                { id: 3, icon: "bi bi-save", text: "Saved" },
                { id: 4, icon: "bi bi-brightness-low", text: "Switch appearance" },
                { id: 5, icon: "bi bi-exclamation-circle", text: "Report a problem" },
            ],
        };
    }, methods: {
        acceptFriend(id) {
            this.$emit('acceptFriend', id)
        },
        updatePost(post) {
            this.$emit('updatePost', post)
        },
        async goPostDetail(id) {
            this.openPostDetail = true
            try {
                this.postId = id
                const postsData = (await AuthenticationService.APost(id)).data[0];
                if (!postsData) {
                    console.error('Error: postsData is undefined or null');
                    return;
                }
                const isCurrentUserLiked = Array.isArray(postsData.likes) && postsData.likes.includes(this.userid);
                const postContent = (postsData.content && postsData.content.POST_Content) || '';
                this.postOb = {
                    ...postsData,
                    isHeartFilled: isCurrentUserLiked,
                    activeIndex: 0,
                    scrollTimeout: null,
                    showFullContent: this.isContentOverFifteenWords(postContent),
                };
            } catch (error) {
                console.error('Error while fetching post data:', error);
            }
        }, isContentOverFifteenWords(content) {
            const words = content.split(' '); // Tách chuỗi thành mảng các từ
            return words.length > 15; // Kiểm tra xem mảng có nhiều hơn 15 từ hay không
        },
        closePostDetail() {
            this.openPostDetail = false;
            this.links[3].status = !this.links[3].status
        },
        errorPost(err) {
            this.alertMessage = err
            this.isAlert = false
        }, async makeNewPost() {
            console.log(">>> make new in nav");
        },
        closePost() {
            this.showPostBar = false;
            this.links[4].status = !this.links[4].status
        },
        async handleItemClick(link) {
            if (link.id === 2) {
                if (this.links[3].status) {
                    this.links[3].status = false;
                    this.showNotification = false;
                }
                link.status = !link.status;
                this.showSearchBar = link.status;
                this.is_expanded = link.status;

            } else if (link.id === 4) {
                if (this.links[1].status) {
                    this.links[1].status = false;
                    this.showSearchBar = false;
                }
                link.status = !link.status;
                const check = (await AuthenticationService.updateAllNotification(this.userid, 'read', 'unread')).data
                if (check.status)
                    this.notificationAll = 0
                this.showNotification = link.status
                this.is_expanded = link.status;
            } else if (link.id === 5) {
                this.links[3].status = false;
                this.links[1].status = false;
                this.showPostBar = !this.showPostBar
                link.status = !link.status
            } else {
                this.links[3].status = false;
                this.links[1].status = false;
                this.showNotification = false
                this.showSearchBar = false;
                this.is_expanded = false;

                this.$router.push({
                    name: link.link_to,
                    // params: { id: this.userid }
                }).catch(err => {
                    if (
                        err.name !== 'NavigationDuplicated' &&
                        !err.message.includes('Avoided redundant navigation to current location')

                    ) {
                        logError(err);
                    }
                });
            }
        },
        getActiveIconClass(link) {
            return link.link_to === this.$route.name ? link.icon_fill : link.icon;
        },
        logout() {
            localStorage.removeItem("token");
            this.$router.push('/')
        },
        shownav() {
            this.show_nav = !this.show_nav
        },
        loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        }, showpreventsearch() {
            this.showSearchBar = false
            this.links[1].status = !this.links[1].status
            this.is_expanded = !this.is_expanded
        }, showpreventNotification() {
            this.showNotification = false
            this.links[3].status = !this.links[3].status
            this.is_expanded = !this.is_expanded
        }
        , loadimgpost(img) {
            if (img) {
                return require(`../../../server/public/uploads/post/${img}`);
            }
        }, goProfile(userId) {
            if (userId == this.userid) {
                this.$router.push(`/profile`)
            } else {
                this.$router.push(`/profile/${userId}`)
            }
        }, timeRequest(POST_Time) {
            const fixedDate = new Date(POST_Time);
            const currentDate = new Date();
            const timeDifference = currentDate - fixedDate;
            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (seconds > 0 && seconds <= 60) {
                return seconds + "s"
            } else if (minutes > 0 && minutes <= 60) {
                return minutes + "m"
            } else if (hours > 0 && hours < 24) {
                return hours + "h"
            } else if (days > 0 && days < 7) {
                return days + "d"
            } else if (days > 3) {
                return this.convertToCustomDate(fixedDate)
            }
        }, convertToCustomDate(inputDate) {
            const months = [
                "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
            ];

            const date = new Date(inputDate);
            const month = months[date.getUTCMonth()];
            const day = date.getUTCDate();

            return `${month} ${day}`;
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
        this.user = (await AuthenticationService.getUser(this.userid)).data;
        this.notificationMessages = ((await AuthenticationService.getNumberNotification(this.userid)).data) || 0
        this.notificationAll = (await AuthenticationService.getQuantifierNotification(this.userid)).data.quantifier
        setInterval(async () => {
            this.notificationMessages = ((await AuthenticationService.getNumberNotification(this.userid)).data) || 0
            this.notificationAll = (await AuthenticationService.getQuantifierNotification(this.userid)).data.quantifier
        }, 5000)

    },
    components: { RouterLink, Search, Post, AlertComponents, Bur, Notifications, CommentPost },
}
</script>

<!-- <style scoped>


.prevent2 {
    width: 5000%;
    height: 100%;
    position: fixed;
    top: 0px;
    z-index: -8888888888888888888888888888888;
    transition: 0.1s linear;
}

.prevent3 {
    width: 5000%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0;
    z-index: -1;
    background-color: black;
    opacity: 0.5;
}

.text {
    display: inline;
    transition: all 0.5s ease;
}

.navcol-246 {
    width: 246px;
    height: 100%;
}

.navcol {
    height: 100%;
    position: fixed;
    left: 0;
    padding-top: 48px;
    padding-left: 8px;
    padding-right: 8px;
    border-right: 1px solid silver;
    z-index: 999;


    .navmenu {
        padding-left: 0;
        margin-top: 40px;
        margin-bottom: 0;
        height: 330px;
        list-style: none;
        display: flex;
        flex-direction: column;
    }

    .img {
        width: 46px;
        margin: 0 0 0 5px;
        transition: 0.5s linear;
    }

    .text {
        opacity: 1;
        transition: 0.5s linear;
    }

}


.navcol .navmenu li {
    display: block;
    width: 100%;
    margin-bottom: 5px;
}

.navcol li .nava i {
    position: relative;
    font-size: 24px;
    padding: 8px;
}

.navcol .nava {
    display: block;
    text-decoration: none;
    color: black;
    width: 100%;
    padding: 8px 8px 8px 0;
}

.active {
    font-weight: 900;
    border: 1px solid silver;
    border-radius: 16px;
}

.navcol .nava:hover {
    display: block;
    background-color: silver;
    border-radius: 15px;
}

.more-setup {
    position: relative;
    width: 100%;

    .navmenu {
        position: relative;
        bottom: -155px;
    }

    .nav-more {
        .set-up {
            position: absolute;
            z-index: 999;
            width: 120%;
            background-color: white;
            border-radius: 15px;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            left: 0px;
            bottom: 180px;

            .set-up-rule,
            .set-up-logout {
                list-style: none;
                padding: 0;
            }

            .set-up-line {
                width: 100%;
                height: 3px;
                background-color: silver;
                opacity: .5;
            }

            .set-up-logout {
                padding: 14px 14px 14px 14px;
                margin: 5px 5px 5px 5px;

                &:hover {
                    background-color: rgb(150, 149, 149);
                    border-radius: 9px;
                }
            }

            .set-up-rule {
                display: block;
                width: 100%;
                margin-bottom: 5px;
                font-size: 15px;

                .set-up-rule-item {
                    padding: 14px 14px 14px 14px;
                    margin: 5px 5px 2px 5px;

                    &:hover {
                        background-color: silver;
                        border-radius: 9px;
                    }

                    .icon {
                        padding-right: 15px;
                    }
                }
            }
        }
    }

    .prevent {
        position: absolute;
        width: 500%;
        height: 500%;
        top: -500px;
    }

    .set-up-off {
        display: none;
    }
}



.is_expanded {
    width: 60px;
    height: 100%;
    transition: 0.5s ease-in-out;
    position: fixed;
    z-index: 999999;

    .text {
        display: none;
        transition: 0.5s ease-in-out;
    }

    .navmenu {
        padding-left: 0;
        margin-top: 40px;
        height: 330px;
        list-style: none;
        display: flex;
        transition: 0.5s linear;
        flex-direction: column;

        .navli {
            display: block;
            width: 100%;
            
            transition: 0.5s linear;

        }
    }

    .img {
        width: 35px !important;
        margin: 0 0 5px 5px !important;
    }

    .more-setup {
        position: relative;
        width: 100%;
        transition: 0.5s linear;
        z-index: 11111111111111111111111;

        .navmenu {
            position: relative;
            bottom: -155px;
        }

        .nav-more {
            .set-up {
                position: absolute;
                z-index: 999;
                width: 600%;
                background-color: white;
                border-radius: 15px;
                box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
                left: 0px;
                bottom: 180px;

                .set-up-rule,
                .set-up-logout {
                    list-style: none;
                    padding: 0;
                }

                .set-up-line {
                    width: 100%;
                    height: 3px;
                    background-color: silver;
                    opacity: .5;
                }

                .set-up-logout {
                    padding: 14px 14px 14px 14px;
                    margin: 5px 5px 5px 5px;

                    &:hover {
                        background-color: rgb(150, 149, 149);
                        border-radius: 9px;
                    }
                }

                .set-up-rule {
                    display: block;
                    width: 100%;
                    margin-bottom: 5px;
                    font-size: 15px;

                    .set-up-rule-item {
                        padding: 14px 14px 14px 14px;
                        margin: 5px 5px 2px 5px;

                        &:hover {
                            background-color: silver;
                            border-radius: 9px;
                        }

                        .icon {
                            padding-right: 15px;
                        }

                        .text {
                            transition: 0.5s linear;

                            font-size: 14px;
                        }
                    }
                }
            }
        }

        .prevent {
            position: absolute;
            width: 2000px;
            height: 500%;
            top: -500px;
        }

        .set-up-off {
            display: none;
            transition: 0.5s linear;

        }
    }
}

.avatar {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    object-fit: cover;
    margin: 8px;
}
</style> -->

<style>
.prevent2 {
    width: 5000%;
    height: 100%;
    position: fixed;
    top: 0px;
    z-index: -8888888888888888888888888888888;
    transition: 0.1s linear;
}

.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.8));
    background-size: 200% 100%;
    animation: loading 2s linear infinite;
    z-index: 9999999999999999999999999999999999999999999999;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.prevent3 {
    width: 5000%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0;
    z-index: -1;
    background-color: black;
    opacity: 0.5;
}



.navcol {
    height: 100%;
    position: fixed;
    left: 0;
    padding: 8px 12px 20px;
    border-right: 1px solid silver;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 999;
    width: 246px;
    transition: 0.2s ease-in-out;
}

.navcol .normal-setup .img {
    width: 56px;
    /* height: 32px; */
    margin: 25px 12px 35px 12px;
    transition: all 0.2s ease;
}


.navcol .normal-setup ul {
    padding: 0;
}

.navcol .more-setup,
.navcol .normal-setup ul li {
    display: flex;
    position: relative;
    align-items: center;
    gap: 16px;
    font-size: 17px;
    flex-direction: row;
    padding: 8px 12px;
    margin: 2px 0;
    height: 49px;
}

.navcol .more-setup p,
.navcol .normal-setup ul li p {
    margin: 0;
}

.navcol .more-setup i,
.navcol .normal-setup ul li i {
    font-size: 25px;
    width: 26px;
    position: relative;
}

.more-setup:hover,
ul li:hover {
    background-color: rgba(220, 220, 220, 0.176);
    border-radius: 8px;
}

.navcol .normal-setup ul li:hover i {
    font-size: 28px;
}


.navcol .normal-setup ul li .avatar {
    border-radius: 50%;
    display: flex;
    width: 26px;
    height: 26px;
    object-fit: cover;
    margin: 6px 0;
}

.more-setup {
    color: black;
    text-decoration: none;
}

.is_expanded {
    width: 74px;
    height: 100%;
    position: fixed;
    z-index: 999999;
    transition: 0.2s ease-in-out;
}

.is_expanded .normal-setup .img {
    width: 30px;
    margin: 25px 12px 49.7px 12px;
    transition: all 0.2s ease;
}


.is_expanded .more-setup p {
    display: none;
}

.active {
    background-color: rgba(192, 192, 192, 0.281);
    border-radius: 8px;
    font-weight: 600;
}

.activeLine {
    border: 1px silver solid;
    border-radius: 8px;
}

.activeAvatar {
    border: 2px solid black;
}

.navmenu .navli .circle-notification {
    font-size: 10px;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FF0304;
    height: 16px;
    width: 16px;
    position: absolute;
    border-radius: 50%;
    outline: #FFFFFF solid 3px;
    top: 50%;
    left: 26px;
    transform: translateY(-95%);
}

.navmenu .navli .circle-notification.notification {
    height: 8px;
    width: 8px;
    top: 33%;
    left: 30px;
}

/* .componentPost {
    position: fixed;
    top: 0;
} */
</style>