<template>
    <div class="profile-frame">
        <div class="" :class="mess ? 'scale-up-ver-top dataMess' : ''">{{ mess }}</div>
        <div v-if="showLoader" class="loader"></div>
        <Nav></Nav>
        <div class="profile-contents">
            <!-- Người dùng khác -->
            <div v-if="!isCurrentUser">
                <div class="pc-infor">
                    <div class="img">
                        <img class="pc-infor-avt" :src="loadimg(user_other)" alt="">
                    </div>
                    <div class="contents">
                        <div class="pc-infor-nickname">
                            <p class="nickname">{{ user_other.USER_NickName }}</p>
                            <button class="add"
                                v-if="!checkIsSendUser(user_other.USER_Id) && !checkIsUserSended(user_other.USER_Id) && !checkIsFriend(user_other.USER_Id)"
                                @click="addFriend(user_personal.USER_Id, user_other.USER_Id)">Add</button>
                            <button class="add"
                                v-if="checkIsSendUser(user_other.USER_Id) && !checkIsUserSended(user_other.USER_Id) && !checkIsFriend(user_other.USER_Id)"
                                @click="becomeFriend(user_personal.USER_Id, user_other.USER_Id)">Yes</button>
                            <button class="add cancel"
                                v-if="!checkIsSendUser(user_other.USER_Id) && checkIsUserSended(user_other.USER_Id) && !checkIsFriend(user_other.USER_Id)"
                                @click="cancelFriend(user_personal.USER_Id, user_other.USER_Id)">Cancel</button>
                            <button class="add friend"
                                v-if="!checkIsSendUser(user_other.USER_Id) && !checkIsUserSended(user_other.USER_Id) && checkIsFriend(user_other.USER_Id)">Is
                                Friend</button>
                            <button class="mess">Message</button>
                        </div>
                        <div class="pc-infor-social">
                            <p class="posts"><b>{{ posts.length }}</b> posts</p>


                            <p class="followers"><b>{{ user_other.friendRequests.length
                                    }}</b> followers</p>
                            <p class="friends"><b>{{ user_other.listFriend.length }}</b>
                                friends</p>
                        </div>
                        <h6 class="pc-infor-fullname">{{ user_other.USER_SubName + " " + user_other.USER_FirstName }}
                        </h6>
                        <p class="pc-infor-about">
                            Hello, wc to my profile!
                            Add me if you want
                        </p>
                    </div>
                </div>
            </div>

            <!-- người dùng hiện tại  -->
            <div v-else>
                <div class="pc-infor">
                    <div class="img">
                        <img class="pc-infor-avt" :src="loadimg(user_personal)" alt="">
                    </div>
                    <div class="contents">
                        <div class="pc-infor-nickname">
                            <p class="nickname">{{ user_personal.USER_NickName }}</p>
                            <button class="mess">Edit profile</button>
                            <button class="mess">Log out</button>
                        </div>
                        <div class="pc-infor-social">
                            <p class="posts"><b>{{ posts.length }}</b> posts</p>
                            <p class="followers" @click="closeFriend(2)"><b>{{
                                numOfRequest }}</b> followers</p>
                            <p class="friends" @click="closeFriend(1)"><b>{{ numOfFriend
                                    }}</b> friends</p>
                        </div>
                        <h6 class="pc-infor-fullname">{{ user_personal.USER_SubName + " " + user_personal.USER_FirstName
                            }}
                        </h6>
                        <p class="pc-infor-about">
                            Hello, wc to my profile!
                            Add me if you want
                        </p>
                    </div>
                </div>
            </div>

            <div class="list">
                <div @mouseover="setPostHoverState(post.content.POST_Id, true)"
                    @mouseout="setPostHoverState(post.content.POST_Id, false)" class="listpost"
                    v-for="(post, index) in posts" :key="post.content.POST_Id" @click="showCommentBar(post)">
                    <div class="display-none" :class="{ 'hover': postHoverStates[index] }">
                        <i class="bi bi-heart-fill icon-hover"></i>
                        <span class="like">{{ post.countLike }}</span>
                        <i class="bi bi-chat-fill icon-hover"></i>
                        <span class="commenta">{{ post.countComment }}</span>
                    </div>
                    <img class="imgp" :src="loadimgpost(post.images[0])" alt="">
                    <i class="bi bi-images icon"></i>
                </div>
            </div>
        </div>
        <Footer class="footer"></Footer>

        <!-- Bài Đăng -->
        <div v-if="showComment" @click="showCommentBar" class="Comment-prevent"></div>
        <CommentPost v-if="showComment" :postId="postId_Comment" :userid="user_personal_params_id"
            :loadImgPost="loadimgpost" :loadImgUser="loadimg" :timeRequest="timeRequest" @updatePost="updatePost"
            :goProfile="goProfile" />

        <!-- Người theo dõi -->
        <!--  Bạn bè  -->
        <div class="tpl-fr-fl" v-show="isFriend" @click="closeFriend"></div>
        <Friends v-if="isFriend" :numOfFriend="numOfFriend" :idUser="user_personal_params_id" @closeFriend="closeFriend"
            :class="isFriend ? 'slide-in-bck-center' : ''" :isFollower="optionFriend"
            @updateNumOfFriend="updateNumOfFriend" />
    </div>
</template>

<script>
import Nav from '../components/Nav'
import Footer from '../components/Footer.vue'
import AuthenticationService from '../services/AuthenticationService'
import CommentPost from "../components/CommentPost.vue"
import Friends from '../components/Friends.vue'


export default {
    data() {
        return {
            user_other_params_id: '',
            user_personal_params_id: '',
            user_other: [],
            user_personal: [],
            postHoverStates: [],
            isCurrentUser: true,
            showLoader: false,
            posts: [],
            showComment: false,
            postId_Comment: '',
            mess: '',
            isFollowers: false,
            isFriend: false,
            optionFriend: 1,
            numOfFriend: '',
            numOfRequest: ''
        }
    }, components: {
        Nav, Footer, CommentPost, Friends
    }, methods: {
        updateNumOfFriend(opiton) {
            switch (opiton) {
                case '+':
                    if (this.numOfRequest > 0) { this.numOfFriend += 1; this.numOfRequest -= 1 }
                    break;
                case '-':
                    if (this.numOfFriend > 0) this.numOfFriend -= 1
                    break;
                case '!':
                    if (this.numOfRequest > 0) this.numOfRequest -= 1
                    break
                default:
                    break
            }
        },
        closeFriend(num) {
            switch (num) {
                case 1:
                    this.optionFriend = num
                    break;
                case 2:
                    this.optionFriend = num
                    break;
                case 3:
                    this.optionFriend = num
                    break;
                default:
                    break;
            }
            this.isFriend = !this.isFriend
        },
        showFollowers() {
            this.isFollowers = !this.isFollowers
        },
        async becomeFriend(id, toUser) {
            const add = (await AuthenticationService.addAFrient(id, {
                USER_SENDERID: toUser,
                USER_RECID: id
            })).data;

            if (add.success) {
                this.mess = add.message
                setTimeout(() => {
                    this.mess = '';
                    setTimeout(() => {
                        this.$router.go();
                    }, 50);
                }, 1500)
            } else {
                console.log("that");
            }
        }
        , async addFriend(id, toUser) {
            const add = (await AuthenticationService.getRequestToOtherUser(id, { toUser: toUser })).data
            if (add.success) {
                this.mess = add.message
                setTimeout(() => {
                    this.mess = '';
                    setTimeout(() => {
                        this.$router.go();
                    }, 50);
                }, 1500)
            } else {
                console.log("that lại");
            }
        }, async cancelFriend(id, User) {
            const del = (await AuthenticationService.cancelSendFriend(id, {
                data: { cancelToUser: User }
            })).data
            if (del.success) {
                this.mess = del.message
                setTimeout(() => {
                    this.mess = '';
                    setTimeout(() => {
                        this.$router.go();
                    }, 50);
                }, 1500)
            } else {
                this.mess = del.message
                setTimeout(() => {
                    this.mess = '';
                }, 1500)
            }
        },
        checkIsFriend(userIdSender) {
            for (let index = 0; index < this.user_personal.listFriend.length; index++) {
                if (this.user_personal.listFriend[index] === userIdSender) {
                    return true
                }
            } return false
        },
        checkIsSendUser(userIdSender) {
            // return user_personal.friendRequests.includes(userIdSender);
            for (let index = 0; index < this.user_personal.friendRequests.length; index++) {
                if (this.user_personal.friendRequests[index] === userIdSender) {
                    return true
                }
            } return false
        },
        checkIsUserSended(userIdSender) {
            for (let index = 0; index < this.user_personal.isSenderRequest.length; index++) {
                if (this.user_personal.isSenderRequest[index] === userIdSender) {
                    return true
                }
            } return false
        },
        async updatePost(updatedPost) {
            const postIndex = this.posts.findIndex(post => post.content.POST_Id === updatedPost.content.POST_Id);
            if (postIndex > -1) {
                this.posts[postIndex] = updatedPost;
            }
        },
        goProfile(userId) {
            if (userId == this.user_personal_params_id) {
                this.$router.push(`/profile`)
            } else {
                this.$router.push(`/profile/${userId}`)
            }
        },
        timeRequest(POST_Time) {
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
        }, showCommentBar(post) {
            this.showComment = !this.showComment
            this.postId_Comment = post // Lấy id bình luận bài đăng 
        },
        loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        },
        loadimgpost(images) {
            if (images) {
                return require(`../../../server/public/uploads/post/${images}`);
            }
        },
        setPostHoverState(postId, isHovered) {
            const index = this.posts.findIndex(post => post.content.POST_Id === postId);
            this.$set(this.postHoverStates, index, isHovered);
        }, isContentOverFifteenWords(content) {
            const words = content.split(' '); // Tách chuỗi thành mảng các từ
            return words.length > 15; // Kiểm tra xem mảng có nhiều hơn 15 từ hay không
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
            this.user_personal_params_id = response.data.userId
        } else {
            // Nếu không có token, điều hướng đến trang đăng nhập
            this.$router.push("/");
        }

        this.user_other_params_id = this.$route.params.idother;
        this.postHoverStates = new Array(this.posts.length).fill(false)
        this.user_personal = (await AuthenticationService.getUser(this.user_personal_params_id)).data;
        this.numOfFriend = this.user_personal.listFriend.length
        this.numOfRequest = this.user_personal.friendRequests.length
        if (this.$route.params.idother) {
            this.user_other = (await AuthenticationService.getUser(this.user_other_params_id)).data;
            this.isCurrentUser = false;
            const postsData = (await AuthenticationService.getpost(this.user_other_params_id)).data;
            this.posts = postsData.map((post) => {
                const isCurrentUserLiked = post.likes.includes(this.user_other_params_id);
                return {
                    ...post,
                    isHeartFilled: isCurrentUserLiked,
                    activeIndex: 0,
                    scrollTimeout: null,
                    showFullContent: () => {
                        const words = post.content.POST_Content.split(' '); // Tách chuỗi thành mảng các từ
                        return words.length > 15;
                    }
                }
            })
        } else {
            this.isCurrentUser = true;
            const postsData = (await AuthenticationService.getpost(this.user_personal_params_id)).data;
            this.posts = postsData.map((post) => {
                const isCurrentUserLiked = post.likes.includes(this.user_personal_params_id);
                return {
                    ...post,
                    isHeartFilled: isCurrentUserLiked,
                    activeIndex: 0,
                    scrollTimeout: null,
                    showFullContent: this.isContentOverFifteenWords(post.content.POST_Content)
                }
            })
        }

    }, computed: {
        currentPosts() {
            return this.isCurrentUser ? this.user_personal.posts : this.user_other.posts;
        }
    }, watch: {
        '$route.params': {
            async handler(newParams, oldParams) {
                if (newParams.idother) {
                    this.isCurrentUser = false;
                } else {
                    this.isCurrentUser = true;
                }
                this.showLoader = true
                setTimeout(async () => {
                    window.location.reload();
                    setTimeout(() => {
                        this.showLoader = false
                    }, 0);
                }, Math.random() * (750 - 250) + 250);
            },
            deep: true
        }
    }, beforeRouteLeave(to, from, next) {
        // Show a loader before leaving the current page
        this.showLoader = true;
        // Continue the route navigation
        next();
    },

}
</script>


<style scoped>
.slide-in-bck-center {
    -webkit-animation: slide-in-bck-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: slide-in-bck-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.tpl-fr-fl {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.201);
    z-index: 1000;
}

@-webkit-keyframes slide-in-bck-center {
    0% {
        -webkit-transform: translateZ(600px);
        transform: translateZ(600px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

@keyframes slide-in-bck-center {
    0% {
        -webkit-transform: translateZ(600px);
        transform: translateZ(600px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

.scale-out-ver-top {
    -webkit-animation: scale-out-ver-top 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    animation: scale-out-ver-top 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}


@-webkit-keyframes scale-out-ver-top {
    0% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleY(0);
        transform: scaleY(0);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
        opacity: 1;
    }
}

@keyframes scale-out-ver-top {
    0% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleY(0);
        transform: scaleY(0);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
        opacity: 1;
    }
}


.dataMess {
    background-color: #00b9f6;
    height: 40px;
    width: 100%;
    position: fixed;
    z-index: 111111111;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
}

.scale-up-ver-top {
    -webkit-animation: scale-up-ver-top 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: scale-up-ver-top 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

@-webkit-keyframes scale-up-ver-top {
    0% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
    }

    100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
    }
}

@keyframes scale-up-ver-top {
    0% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
    }

    100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
    }
}

.Comment-prevent {
    position: fixed;
    width: 100%;
    height: 100%;
    background: black;
    opacity: .5;
    top: 0;
    z-index: 1000;
}

.display-none {
    display: none;
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


.profile-contents {
    position: relative;
    left: 246px;
    width: 1024px;
    margin: 0 100px;
    padding: 30px 20px 30px;



    .pc-infor {
        width: 100%;
        display: flex;
        margin-bottom: 20px;
        justify-content: flex-start;
        text-align: center;
        border-bottom: 1px solid #bebfbf;

        .img {
            width: 292px;
            height: 161px;
            margin: 0 30px 0 0;

            .pc-infor-avt {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
                z-index: 0;
            }
        }

        .contents {
            margin: 0;
            z-index: 0;

            .pc-infor-nickname {
                display: flex;
                height: 48px;
                margin-bottom: 12px;

                .nickname {
                    font-size: 20px;
                    padding-right: 80px;
                }

                .add {
                    height: 32px;
                    width: fit-content;
                    padding: 7px 16px;
                    background-color: #0095F6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: bold;
                    font-size: 14px;

                    &:hover {
                        background-color: #0571b9;
                    }
                }

                .mess {
                    color: black;
                    background-color: #d2d2d2;
                    height: 32px;
                    margin-left: 8px;
                    width: fit-content;
                    padding: 7px 16px;
                    border: none;
                    border-radius: 12px;
                    font-weight: bold;
                    font-size: 14px;

                    &:hover {
                        background-color: #bebfbf;
                    }
                }
            }

            /*pc-infor-nickname*/
            .pc-infor-social {
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                margin-bottom: 12px;

                .posts {}

                .followers {
                    cursor: pointer;
                }

                .friends {
                    cursor: pointer;
                }
            }

            /**pc-infor-social */

            .pc-infor-fullname {
                display: flex;
            }

            .pc-infor-about {
                line-height: 1.2em;
                background-origin: content-box;

                /* some extra styles*/
                text-align: left;
                font-family: calibri, arial, sans-serif;
            }
        }

        /* contents */
    }

    .list {
        width: 100%;
        height: fit-content;
        position: relative;
        display: grid;
        grid-template-columns: auto auto auto;
        margin-top: 50px;
        cursor: pointer;

        .hover {
            background-color: black;
            background: rgba(0, 0, 0, 0.5);
            position: absolute;
            width: 324px;
            height: 324px;
            text-align: center;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: white;

            .icon-hover {
                padding: 0 10px 0 20px;
            }

        }

        .listpost {
            flex: 1 0 33%;
            height: 328px;
            position: relative;
            overflow: hidden;

            .imgp {
                width: 324px;
                height: 324px;
                object-fit: cover;

            }

            .icon {
                position: absolute;
                right: 15px;
                top: 12px;
                color: white;
                font-size: 20px;
            }


        }
    }

    .footer {
        position: relative;
        margin: auto;
        transform: translateX(75%);
    }

    /* ket thuc pc-infor  */
}

.cancel {
    background-color: red !important;
}

.friend {
    background-color: black !important;
}

.cancel:hover {
    background-color: rgb(175, 57, 57) !important;
}

.friend-and-followers {
    /* width: 400px;
    height: 400px;
    background: black; */
    position: fixed;
    top: 0;
    right: 0;
}
</style>