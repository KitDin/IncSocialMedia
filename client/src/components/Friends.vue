<template>
    <div class="fr-fl">
        <div class="header">
            <p>Friend</p>
            <i class="bi bi-x" @click.stop="clsFriend"></i>
        </div>
        <div class="option">

            <div class="follower " :class="optionList === 1 ? 'activeChoose' : ''" @click.stop="toggleFollow(1)">
                Friends <p> ({{ numOfFriend }}) </p>
            </div>

            <div class="following" :class="optionList === 2 ? 'activeChoose' : ''" @click.stop="toggleFollow(2)">
                Require <p> ({{ requests.length }}) </p>
            </div>

            <div class="follow" :class="optionList === 3 ? 'activeChoose' : ''" @click.stop="toggleFollow(3)">
                Following <p> ({{ followings.length }}) </p>
            </div>
        </div>
        <div class="users">

            <!-- search -->
            <div class="users-search" v-if="optionList === 1">
                <label for="input-search">
                    <i class="bi bi-search"></i>
                </label>
                <input type="text" id="input-search" v-model="searchQuery" @input="onSearchInput"
                    placeholder="Tìm kiếm">
            </div>
            <!-- Thông báo -->
            <div class="users-search anount" :class="{
                'cancel-request': isCancel,
                'accept-request': isAccept
            }" v-show="isAccept || isCancel">
                <p>{{ message }}</p>
            </div>

            <!-- Bạn bè friends-->
            <div class="user-frame" ref="userFrame" @scroll="onScroll" v-if="optionList === 1">
                <!-- <div class="isLoading">
                    <span class="loader"></span>
                </div> -->

                <LoadingPage v-show="isSearching" />
                <div class="user" v-for="friend in friends" :key="friend.USER_ID"
                    v-show="!isSearching && friends.length > 0">
                    <img :src="loadImg(friend)" alt="" @click="goProfileOther(friend)">
                    <div class="user-info">
                        <p class="nickname" @click="goProfileOther(friend)">{{ friend.USER_NICKNAME }}</p>
                        <p class="fullname">{{ friend.USER_SUBNAME + " " + friend.USER_FIRSTNAME }}</p>
                    </div>
                    <div class="btn-cancel" @click="openAlert(friend, 'deleteFriend', 2)">Huỷ kết bạn</div>
                </div>

                <div class="notFound" v-show="!isSearching && friends.length <= 0">Không tìm thấy người dùng!</div>

                <div class="isLoading" v-show="isLoading">
                    <span class="loader"></span>
                </div>
            </div>

            <!-- yêu cầu kết bạn (người theo dõi followers) -->
            <div class="user-frame" ref="userFrame" @scroll="onScroll" v-if="optionList === 2">
                <div class="user" v-for="request in requests" :key="request.USER_ID" v-show="!isSearching">
                    <img :src="loadImg(request)" alt="" @click="goProfileOther(request)">
                    <div class="user-info">
                        <p class="nickname" @click="goProfileOther(request)">{{ request.USER_NickName }}</p>
                        <p class="fullname">{{ request.USER_SubName + " " + request.USER_FirstName }}</p>
                    </div>
                    <div class="btn-cancel " @click="openAlert(request, 'becomeFriend', 1)">
                        Đồng ý</div>
                    <div class="btn-cancel " @click="openAlert(request, 'notBecomFriend', 2)"><i
                            class="bi bi-person-fill-x"></i></div>
                </div>
                <div class="notFound" v-show="requests.length <= 0">Không có yêu cầu kết bạn!</div>
            </div>

            <!-- người đã gửi lời mời kết bạn (following) -->
            <div class="user-frame" ref="userFrame" @scroll="onScroll" v-if="optionList === 3">
                <div class="user" v-for="following in followings" :key="following.USER_ID" v-show="!isSearching">
                    <img :src="loadImg(following)" alt="">
                    <div class="user-info">
                        <p class="nickname">{{ following.USER_NICKNAME }}</p>
                        <p class="fullname">{{ following.USER_SUBNAME + " " + following.USER_FIRSTNAME }}</p>
                    </div>
                    <div class="btn-cancel " @click="openAlert(following, 'cancelFollwing', 2)">Huỷ theo dõi</div>
                </div>
                <div class="notFound" v-show="requests.length <= 0">Bạn chưa theo dõi ai hết!</div>
            </div>
        </div>
        <AlertComponents v-if="isAlert" :dataAlert="dataAlert" @closeAlert="closeAlert" :SetUpAlert="setUpAlert"
            @deleteAlert="deleteFriend" :action="action" @deleteFriend="deleteFriend" @becomeFriend="becomeFriend"
            @notBecomFriend="notBecomFriend" @deleteAlertFollowing="cancelFollwoing" @cancelFollwing="cancelFollwing" />
    </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService';
import AlertComponents from './AlertComponents.vue';
import { debounce } from 'lodash';
import LoadingPage from './LoadingPage.vue';
export default {
    data() {
        return {
            optionList: '',
            requests: [],
            friends: [],
            followings: [],
            dataAlert: {},  // List of friends
            setUpAlert: 2,
            action: '',
            page: 1,      // Current page
            limit: 10,
            isLoading: false, // Loading state for showing the loader
            isSearching: false,
            hasMoreData: true,
            hasMoreRequests: true,
            searchQuery: '',
            isCancel: false,
            isAccept: false,
            message: '',
            isAlert: false
        }
    }, methods: {
        async deleteFriend(friend) {
            const req = (await AuthenticationService.deleteFriend(this.idUser, friend.USER_ID)).data
            if (req.status) {
                this.isAlert = false;
                this.isCancel = true;
                this.message = 'Đã xoá bạn thành công'
                setTimeout(() => { this.isCancel = false; this.message = '' }, 1000)
                this.fetchData(true)
                this.$emit('updateNumOfFriend', '-')
            } else {
                console.error(req.message)
            }
        }, cancelFollwoing() { console.log(">>> hello") },
        openAlert(data, type, optionAlert = 2) {
            this.dataAlert = data
            this.action = type
            this.setUpAlert = optionAlert
            this.isAlert = true
        },
        closeAlert() { this.isAlert = false },
        toggleFollow(followStatus) {
            this.optionList = followStatus;
        },
        async clsFriend() {
            this.page = 1;
            this.hasMoreData = true; // Reset trạng thái dữ liệu
            this.isLoading = false;
            this.searchQuery = '';
            this.$emit('closeFriend')
        },
        async loadFriends(reset = false) {
            // Kiểm tra nếu đang tải hoặc không còn dữ liệu
            if (this.isLoading && !this.hasMoreData) {
                return;
            }

            this.isLoading = true

            if (reset) {
                this.page = 1;
                this.friends = []; // Reset danh sách khi tìm kiếm mới
                this.hasMoreData = true; // Reset trạng thái dữ liệu
                this.isLoading = false
            }


            try {
                // Gọi API lấy danh sách bạn bè
                const response = (await AuthenticationService.getFriendFullInfo(this.idUser, this.page, this.limit, this.searchQuery)).data;
                if (response.status) {
                    // Nối dữ liệu bạn mới vào danh sách bạn bè cũ
                    this.friends = [...this.friends, ...response.friend];
                    if (this.friends.length < 10) {
                        this.isLoading = false
                    }

                    this.page++; // Tăng số trang
                    // Kiểm tra nếu không còn dữ liệu
                    this.hasMoreData = response.status;
                }
                else {
                    this.hasMoreData = response.status;
                    this.isLoading = false
                }

            } catch (error) {
                console.error('Error loading friends:', error);
            }
        }, onSearchInput: debounce(function () {
            this.isSearching = true
            setTimeout(() => {
                this.isSearching = false
            }, 400)
            this.loadFriends(true); // Gọi loadFriends và đặt lại page về 1 khi search
        }, 300),
        loadImg(user) {
            if (user && user.USER_AVATARURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AVATARURL}`);
            } else if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        }, onScroll() {
            const frame = this.$refs.userFrame;
            if (frame.scrollTop + frame.clientHeight >= frame.scrollHeight - 10) {
                if (this.isLoading) {
                    setTimeout(() => {
                        if (this.hasMoreData) {
                            this.loadFriends();
                            this.isLoading = false;
                            this.hasMoreData = true;
                        }
                    }, 2000)
                }
                if (this.isLoading && !this.hasMoreData) {
                    this.isLoading = false
                }

            }
        }, async becomeFriend(toUser) {
            try {
                console.log(">>>", toUser)
                const add = (await AuthenticationService.addAFrient(this.idUser, {
                    USER_SENDERID: toUser.USER_Id,
                    USER_RECID: this.idUser
                })).data
                if (add.success) {
                    this.isAlert = false;
                    this.isAccept = true
                    this.message = 'Đã chấp nhận kết bạn'
                    setTimeout(() => {
                        this.isAccept = false
                        this.message = ''
                        this.numOfFriend = this.numOfFriend + 1
                        this.optionList = 2
                        this.fetchData(true)
                        this.$emit('updateNumOfFriend', '+')
                        this.$emit('updateNavOfFriend')
                    }, 1500)
                } else {
                    console.error(">> Lỗi befriend")
                }
            } catch (error) {
                console.error(error)
            }
        }, goProfileOther(user) {
            if (user && user.USER_ID)
                this.$router.push(`/profile/${user.USER_ID}`)
            else if (user && user.USER_Id)
                this.$router.push(`/profile/${user.USER_Id}`)
        }, async notBecomFriend(toUser) {
            try {
                const del = (await AuthenticationService.cancelSendFriend(toUser.USER_Id, {
                    data: { cancelToUser: this.idUser }
                })).data
                if (del.success) {
                    this.isAlert = false;
                    this.isAccept = true
                    this.message = 'Đã huỷ yêu cầu kết bạn!'
                    setTimeout(() => {
                        this.isAccept = false
                        this.message = ''
                        this.numOfFriend = this.numOfFriend + 1
                        this.optionList = 2
                        this.fetchData(true)
                        this.$emit('updateNumOfFriend', '!')
                        this.$emit('updateNavOfFriend')
                    }, 1500)
                } else {
                    console.error(">> Lỗi notBeFriend")
                }

            } catch (error) {
                console.error(error)
            }
        }, async cancelFollwing(toUser) {
            try {
                const del = (await AuthenticationService.cancelSendFriend(this.idUser, {
                    data: { cancelToUser: toUser.USER_ID }
                })).data
                if (del.success) {
                    this.isAlert = false;
                    this.isAccept = true
                    this.message = 'Đã huỷ theo dõi thành công!'
                    setTimeout(() => {
                        this.isAccept = false
                        this.message = ''
                        this.numOfFriend = this.numOfFriend + 1
                        this.optionList = 3
                        this.fetchData(true)
                    }, 1500)
                } else {
                    console.error(">> Lỗi following")
                }

            } catch (error) {
                console.error(error)
            }
        },
        async fetchData(reset = false) {
            await this.loadFriends(reset);
            this.requests = (await AuthenticationService.getUserRequest(this.idUser)).data
            this.followings = (await AuthenticationService.getFollowing(this.idUser)).data.following
        }
    },
    async mounted() {
        this.optionList = this.isFollower
        this.fetchData()
    },
    props: {
        idUser: {
            type: String,
            Required: true
        }, numOfFriend: {
            type: Number
        }, isFollower: {
            type: Number,
            default: 1
        }
    }, components: { AlertComponents, LoadingPage }
}
</script>

<style scoped>
.scale-in-ver-top {
    -webkit-animation: scale-in-ver-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: scale-in-ver-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}


@-webkit-keyframes scale-in-ver-top {
    0% {
        -webkit-transform: scaleY(0);
        transform: scaleY(0);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
        opacity: 1;
    }
}

@keyframes scale-in-ver-top {
    0% {
        -webkit-transform: scaleY(0);
        transform: scaleY(0);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
        opacity: 1;
    }
}

.fr-fl {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) !important;
    width: 400px;
    height: 400px;
    background: #ffffff;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    z-index: 10000;
}

.fr-fl .header {
    position: relative;
    display: flex;
    height: 42px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-bottom: 1px silver solid;
    font-size: 16px;
    font-weight: 500;
}

.fr-fl .header p {
    margin: 0;
}

.fr-fl .header i {
    position: absolute;
    right: 5px;
    font-size: 24px;
    cursor: pointer;
}

.fr-fl .option {
    display: flex;
    height: 40px;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
}

.fr-fl .option div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #00376b48;
    border-bottom: #00376b48 2px solid;
    width: calc(100% / 2);
    cursor: pointer;
    transition: all .3s ease-in-out;
}

.fr-fl .option .follow.activeChoose,
.fr-fl .option .following.activeChoose,
.fr-fl .option .follower.activeChoose {
    color: #00376B;
    border-bottom: #00376B 2px solid;
}

.follow p,
.following p,
.follower p {
    margin: 0;
    font-size: 10px;
}

.fr-fl .users {
    height: calc(100% - 42px - 40px);
    /* background: #00376B; */
    padding: 8px 0px 0px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}



.fr-fl .users .users-search {
    background-color: #EFEFEFEF;
    height: 32px;
    display: flex;
    align-items: center;
    border-radius: 8px;
    padding: 8px 3px;
    margin-right: 16px;
    -webkit-animation: slide-in-top 0.2s ease-in both;
    animation: slide-in-top 0.2s ease-in both;
}

@-webkit-keyframes slide-in-top {
    0% {
        -webkit-transform: translateY(-10px);
        transform: translateY(-10px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-in-top {
    0% {
        -webkit-transform: translateY(-10px);
        transform: translateY(-10px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 1;
    }
}

.fr-fl .users .users-search.anount {
    justify-content: center;
    color: #ffffff;
    font-weight: 500;
    font-size: 14px;
}

.fr-fl .users .users-search.anount p {
    margin: 0;
}

.accept-request {
    background: #0084ff89 !important;
}

.cancel-request {
    background: rgba(255, 74, 42, 0.74) !important;
}

.fr-fl .users .users-search input {
    border: 0;
    background-color: transparent;
    width: 100%;
    height: 100%;
    position: relative;
    top: 1.2px;
    font-size: 14px;
}

.fr-fl .users .users-search i {
    position: relative;
    padding: 0 8px 0 13px;
    top: 1.2px;
    color: #c3c3c3;
}

.fr-fl .users .user-frame {
    display: flex;
    flex-direction: column;
    height: calc(100%-32px);
    overflow-y: scroll;
}

.fr-fl .users .user-frame .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
    margin: 8px 8px 8px 0;
    transition: all 0.5 ease-out;
}

.fr-fl .users .user-frame .user .user-info {
    width: calc(100% - 44px - 130px);
}

.notFound {
    margin: auto;
    margin-top: 15px;
    font-size: 14px;
    color: #c3c3c3;
}

.fr-fl .users .user-frame .user .user-info p {
    font-size: 14px;
    margin: 0;
}

.fr-fl .users .user-frame .user .user-info p:first-child {
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
}

.fr-fl .users .user-frame .user .user-info .fullname {
    color: #696969ef;
    font-weight: 400;
}

.fr-fl .users .user-frame .user img {
    cursor: pointer;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
}

.fr-fl .users .user-frame .user .btn-cancel {
    margin: 0;
    padding: 4px 16px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    background-color: #EFEFEFEF;
    cursor: pointer;
}

.fr-fl .users .user-frame .user .btn-cancel:hover {
    background-color: #c3c3c3;
}

.isLoading {
    padding: 15px 0;
    display: flex;
    justify-content: center;
}

.loader {
    width: 22px;
    aspect-ratio: 1;
    display: grid;
    border-radius: 50%;
    background:
        linear-gradient(0deg, rgb(0 0 0/50%) 30%, #0000 0 70%, rgb(0 0 0/100%) 0) 50%/8% 100%,
        linear-gradient(90deg, rgb(0 0 0/25%) 30%, #0000 0 70%, rgb(0 0 0/75%) 0) 50%/100% 8%;
    background-repeat: no-repeat;
    animation: l23 1s infinite steps(12);
}

.loader::before,
.loader::after {
    content: "";
    grid-area: 1/1;
    border-radius: 50%;
    background: inherit;
    opacity: 0.915;
    transform: rotate(30deg);
}

.loader::after {
    opacity: 0.83;
    transform: rotate(60deg);
}

@keyframes l23 {
    100% {
        transform: rotate(1turn)
    }
}
</style>