<template>
    <div class="frame-create-conversation">
        <div class="header-frame">
            <p class="text-new-message">New message</p>
            <i class="bi bi-x-lg icon-X" @click="$emit('close')"></i>
        </div>
        <div class="body-frame">
            <div class="search">
                <p class="text-to">To: </p>
                <div class="user-chooses">

                    <div class="user-choose" v-for="userChoose in usersChoose" :key="userChoose.USER_ID"
                        @click="moveChoose(userChoose.USER_ID)">
                        <i class="bi bi-x icon-user-choose" style="font-size: 20px; margin: 0;padding: 0;"></i>
                        <i v-show="userChoose.isFriend" class="bi bi-people-fill" style="color: rgb(0, 148, 246);"></i>

                        <div class="user-choose-infor">{{ userChoose.USER_NICKNAME }}</div>
                    </div>

                    <div class="user-choose-move-all" @click="moveAllChoose()"
                        v-show="usersChoose.length > limitUserChoose">
                        <i class="bi bi-x icon-user-choose" style="font-size: 20px; margin: 0;padding: 0;"></i>
                    </div>

                    <input v-show="usersChoose.length < limitUserChoose" class="input-searching" type="text"
                        placeholder="Search..." @input="onSearchUser" v-model="searchQuery">
                </div>

            </div>

            <div class="the-searching-results" :class="usersChoose.length >= 2 ? 'results-choose' : ''"
                v-if="searchResults.length !== 0">

                <div class="user-searching" v-for="user in searchResults" :key="user.USER_ID" @click="chooseUser(user)">
                    <img class="user-avatar" :src="loadimg(user)" alt="">
                    <div class="user-name">
                        <div style="display: flex; gap: 8px;">
                            <div class="fullname">{{ user.USER_NICKNAME }}</div>
                            <i v-show="user.isFriend" class="bi bi-people-fill" style="color: rgb(0, 148, 246);"></i>
                        </div>
                        <div class="nickname">{{ user.USER_SUBNAME + " " + user.USER_FIRSTNAME }}</div>
                    </div>
                </div>

            </div>

            <div v-else class="the-searching-no-results">
                <div class="user-searching">
                    <p>No account found</p>
                </div>
            </div>


        </div>
        <div class="btn-end-frame" :class="usersChoose.length > 0 ? 'choosed' : ''" @click="createNewConversation">
            Chat
        </div>
    </div>
</template>

<script>

// tạo 
import AuthenticationService from '../services/AuthenticationService';
import socket from '../services/Socket.io';
import Security from '../services/Security';

export default {
    props: {
        currentUserId: {
            type: String,  // Hoặc Number nếu `currentUserId` là số
            required: true
        }
    }, data() {
        return {
            usersChoose: [],
            searchQuery: '',          // Chuỗi tìm kiếm của người dùng
            searchResults: [],
            isLoading: false,
            isLimit: false,
            limitUserChoose: 1,
        }
    }, methods: {
        async createNewConversation() {
            const stt = await AuthenticationService.createConversation(this.currentUserId, this.usersChoose)

            if (stt.data.status) {
                //      lấy con_id từ stt và userReceiv từ usersChoose sao đó chuyền qua cha $emit('createNewConversation',{})
                const conId = stt.data.conversationId;
                const userReceiv = this.usersChoose[0].USER_ID
                this.$emit('createNewConversation', conId, userReceiv)
                this.$emit('freshData')
                this.$emit('close')
                this.usersChoose = []
                this.searchQuery = ''
                this.searchResults = []
            }
            else {
                alert("that bai")
            }
        },
        moveAllChoose() {
            this.usersChoose = []
        },
        moveChoose(id) {
            this.usersChoose = this.usersChoose.filter(user => user.USER_ID !== id);
            this.usersChoose.length <= 3 ? this.isLimit = true : this.isLimit = false
        },
        chooseUser(user) {
            this.usersChoose.push(user)
            this.searchQuery = ''
            this.searchResults = []
            this.usersChoose.length >= 3 ? this.isLimit = true : this.isLimit = false
        },
        loadimg(user) {
            return require(`../../../server/public/uploads/avatar/${user.USER_AVATARURL}`);
        },
        onSearchUser() {
            if (this.searchQuery.length === 0) {
                this.searchResults = [];
                return
            }
            if (this.searchQuery.trim()) {
                // Gửi ký tự tìm kiếm lên server thông qua socket
                this.isLoading = true;
                socket.emit('searchUser', { searchQuery: this.searchQuery, userId: this.currentUserId });

                socket.on('searchResults', (results) => {
                    this.isLoading = false;
                    if (this.usersChoose.length !== 0)
                        this.searchResults = results.filter(user1 => !this.usersChoose.some(user2 => user1.USER_ID === user2.USER_ID) || user1.USER_ID !== this.currentUserId);
                    else this.searchResults = results
                });
            }
        }
    }, mounted() {
        socket.on('searchResults', (results) => {
            if (this.usersChoose.length !== 0)
                this.searchResults = results.filter(user1 => !this.usersChoose.some(user2 => user1.USER_ID === user2.USER_ID));
            else this.searchResults = results
        });
        console.log(this.currentUserId)
    }
}
</script>

<style>
.frame-create-conversation {
    display: flex;
    flex-direction: column;
    width: 78vh;
    height: fit-content;
    /* padding: 12px; */
    background-color: rgb(255, 255, 255);
    border-radius: 12px
}

.frame-create-conversation .header-frame {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 42px;
    padding: 10px;
    border-bottom: 1px solid #d6d6d6;
}

.text-new-message {
    font-size: 16px;
    width: 100%;
    font-weight: bold;
    display: flex;
    justify-content: center;
}

.icon-X {
    position: absolute;
    font-weight: bold;
    right: 18px;
    cursor: pointer;
}

.body-frame {
    width: 100%;
    height: 342px;
}

.body-frame .search {
    padding: 4px 16px;
    display: flex;
    width: 100%;
    height: fit-content;
    border-bottom: 1px solid #d6d6d6;
    align-items: baseline
}

.body-frame .search .text-to {
    margin: 0;
    padding: 0 6px 0 0;
    width: fit-content;
    font-weight: 500;

}

.body-frame .search .user-chooses {
    width: 100%;
    height: fit-content;
    padding: 4px 0;
    display: flex;
    gap: 4px;
    font-weight: 500;
    flex-wrap: wrap;
}

.user-chooses .user-choose {
    font-size: 15px;
    display: flex;
    width: fit-content;
    flex-direction: row-reverse;
    padding: 14px 14px 14px 18px;
    height: 28px;
    border-radius: 24px;
    background-color: #0094f632;
    margin-right: 4px;
    margin-bottom: 4px;
    align-items: center;
    justify-content: center;
    color: rgb(0, 148, 246);
    cursor: pointer;
}

.user-chooses .user-choose:hover {
    background-color: #0094f6af;
    color: rgb(0, 85, 141);
}

.user-chooses .user-choose .user-choose-infor {
    padding-right: 4px;
}

/* .body-frame .search */
.user-chooses .input-searching {
    font-weight: 400;
    vertical-align: text-bottom;
    font-size: 16px;
    padding-left: 15px;
    height: 28px;
    border: none;
}

.body-frame .the-searching-results {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    height: 88%;
    overflow-y: scroll;
}

.body-frame .the-searching-no-results {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    height: 88%;
    overflow-y: scroll;
}

.body-frame .results-choose {
    height: 75% !important;
}


.body-frame .the-searching-results .user-searching {
    padding: 8px 16px;
    display: flex;
    flex-direction: row;
    width: 100%;
    cursor: pointer;
}

.body-frame .the-searching-no-results .user-searching {
    padding: 8px 16px;
    display: flex;
    flex-direction: row;
    width: 100%;
    color: #9a9a9a;
}

.body-frame .the-searching-results .user-searching:hover {
    background-color: rgb(245, 245, 245);
}

.user-searching .user-avatar {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    object-fit: cover;
    margin: 0px 12px 0px 0px;
}

.user-searching .user-name {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.user-searching .user-name .fullname {
    font-weight: 500;
}

.user-searching .user-name .nickname {
    font-weight: 300;
    color: #9a9a9a;
}

.btn-end-frame {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background-color: aqua;
    margin: 12px;
    height: 42px;
    color: rgba(240, 248, 255, 0.676);
    /* color: aliceblue; */
    /* background-color: #0095F6; */
    font-weight: 700;
    background-color: #0094f673;
}

.choosed {
    color: aliceblue !important;
    background-color: #0095F6 !important;
    cursor: pointer;
}

.user-choose-move-all {
    font-size: 15px;
    display: flex;
    width: fit-content;
    flex-direction: row-reverse;
    padding: 14px 14px 14px 14px;
    height: 28px;
    width: 28px;
    border-radius: 24px;
    background-color: #f6000032;
    margin-right: 4px;
    margin-bottom: 4px;
    align-items: center;
    justify-content: center;
    color: rgb(246, 0, 0);
    cursor: pointer;
}

.user-choose-move-all:hover {
    background-color: #ff0000;
    color: rgb(173, 0, 0);
}
</style>