<template>
    <div class="tpl-fr-fl" @click="$emit('closeFriend')">
        <div class="fr-fl">
            <div class="header">
                <p>Friend</p>
                <i class="bi bi-x" @click.stop="$emit('closeFriend')"></i>
            </div>
            <div class="option">
                <div class="follower activeChoose">Friends</div>

                <div class="following">Require</div>
            </div>
            <div class="users">
                <div class="users-search">
                    <label for="input-search">
                        <i class="bi bi-search"></i>
                    </label>
                    <input type="text" id="input-search" v-model="searchQuery" @input="onSearchInput"
                        placeholder="Tìm kiếm">
                </div>
                <div class="user-frame" ref="userFrame" @scroll="onScroll">

                    <div class="user" v-for="friend in friends" :key="friend.USER_ID">
                        <img :src="loadImg(friend)" alt="">
                        <div class="user-info">
                            <p class="nickname">{{ friend.USER_FIRSTNAME }}</p>
                            <p class="fullname">{{ friend.USER_SUBNAME + " " + friend.USER_FIRSTNAME }}</p>
                        </div>
                        <div class="btn-cancel">Huỷ theo dõi</div>
                    </div>
                    <div class="isLoading" v-show="isLoading">
                        <span class="loader"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService';
import { debounce } from 'lodash';
export default {
    data() {
        return {
            friends: [],  // List of friends
            page: 1,      // Current page
            limit: 10,
            isLoading: false, // Loading state for showing the loader
            hasMoreData: true,
            searchQuery: ''
        }
    }, methods: {
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
        }, onSearchInput: debounce(() => {
            this.loadFriends(true);
        }, 300), // 300ms trì hoãn

        loadImg(user) {
            if (user && user.USER_AVATARURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AVATARURL}`);
            }
        }, onScroll() {
            const frame = this.$refs.userFrame;

            if (frame.scrollTop + frame.clientHeight >= frame.scrollHeight - 10 && this.hasMoreData) {
                // When reaching the bottom, load more friends
                if (this.isLoading) {
                    setTimeout(() => {
                        if (this.hasMoreData) {
                            this.loadFriends();
                            this.isLoading = false
                        }
                    }, 2000)
                }
                if (this.isLoading && !this.hasMoreData)
                    this.isLoading = false
            }
        },
    },
    async mounted() {
        await this.loadFriends();
    },
    props: {
        idUser: {
            type: String,
            Required: true
        }
    }
}
</script>

<style scoped>
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

.fr-fl {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    background: #ffffff;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
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
}

.fr-fl .option .follower.activeChoose {
    color: #00376B;
    border-bottom: #00376B 2px solid;
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
}

.fr-fl .users .user-frame .user .user-info {
    width: calc(100% - 44px - 130px);
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