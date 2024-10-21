<template>
    <div class="tpl-fr-fl" @click="$emit('closeFollowers')">
        <div class="fr-fl">
            <div class="header">
                <p>Follow</p>
                <i class="bi bi-x" @click.stop="$emit('closeFollowers')"></i>
            </div>
            <div class="option">
                <div class="follower " :class="isFollower ? 'activeChoose' : ''" @click.stop="toggleFollow(true)">
                    Follower
                </div>

                <div class="following" :class="!isFollower ? 'activeChoose' : ''" @click.stop="toggleFollow(false)">
                    Following
                </div>
            </div>
            <div class="users">
                <div class="users-search">
                    <label for="input-search">
                        <i class="bi bi-search"></i>
                    </label>
                    <input type="text" id="input-search" placeholder="Tìm kiếm">
                </div>
                <div class="user-frame">

                    <div class="user">
                        <img src="../../../server/public/uploads/avatar/file_1698055731784.jpg" alt="">
                        <div class="user-info">
                            <p class="nickname">iamdtkiet</p>
                            <p class="fullname">Đinh Tuấn Kiệt</p>
                        </div>
                        <div class="btn-cancel">Huỷ theo dõi</div>
                    </div>
                    <div class="user">
                        <img src="../../../server/public/uploads/avatar/file_1698055731784.jpg" alt="">
                        <div class="user-info">
                            <p class="nickname">iamdtkiet</p>
                            <p class="fullname">Đinh Tuấn Kiệt</p>
                        </div>
                        <div class="btn-cancel">Huỷ theo dõi</div>
                    </div>
                    <div class="user">
                        <img src="../../../server/public/uploads/avatar/file_1698055731784.jpg" alt="">
                        <div class="user-info">
                            <p class="nickname">iamdtkiet</p>
                            <p class="fullname">Đinh Tuấn Kiệt</p>
                        </div>
                        <div class="btn-cancel">Huỷ theo dõi</div>
                    </div>
                    <div class="user">
                        <img src="../../../server/public/uploads/avatar/file_1698055731784.jpg" alt="">
                        <div class="user-info">
                            <p class="nickname">iamdtkiet</p>
                            <p class="fullname">Đinh Tuấn Kiệt</p>
                        </div>
                        <div class="btn-cancel">Huỷ theo dõi</div>
                    </div>
                    <div class="user">
                        <img src="../../../server/public/uploads/avatar/file_1698055731784.jpg" alt="">
                        <div class="user-info">
                            <p class="nickname">iamdtkiet</p>
                            <p class="fullname">Đinh Tuấn Kiệt</p>
                        </div>
                        <div class="btn-cancel">Huỷ theo dõi</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return { isFollower: true }
    }, methods: {
        toggleFollow(followStatus) {
            this.isFollower = followStatus;
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
    transition: all .3s ease-in-out;
}


/* 
12
14
10
13
5itYoMKx19SZkc0
lJ0297RxHTx7EMLwbUd
P1kYp50
3
6LKk1bX
8
9
aeQWGQCP0QCPJKV3n7KIfkFY
dPxJRffmYmUXMdduEhFJ
sPoU6SxJEyrTk31Nj8cf4YWhzQs */

/* 
12
14
15
10
13
5itYoMKx19SZkc0
lJ0297RxHTx7EMLwbUd
P1kYp50
3
6LKk1bX
8
9
aeQWGQCP0QCPJKV3n7KIfkFY
dPxJRffmYmUXMdduEhFJ
sPoU6SxJEyrTk31Nj8cf4YWhzQs */

.fr-fl .option .following.activeChoose,
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
    font-weight: 500;
    margin: 0;
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
</style>