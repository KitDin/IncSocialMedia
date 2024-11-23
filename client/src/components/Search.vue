<template>
    <div class="Search-Frame" :class="isOpen ? 'animationOpen' : 'animationClose'">
        <h2 class="h2">Search</h2>
        <input v-model="searchQuery" @input="handleInput" type="text" class="inputSearch" placeholder="Search">
        <div class="search-loader" v-if="searching">
        </div>


        <h6 class="recent">Recent</h6>
        <div class="noResults" v-if="showNoResults">
            No results found.
        </div>
        <div class="SF-Found">

            <div class="NF-request" v-for="user in searchResults" :key="user.USER_Id"
                @click="goToProfile(user.USER_Id)">
                <div class="NF-request-user">
                    <img class="NF-request-user-avata pointer" :src="loadimg(user)" alt="">
                    <div class="NF-request-user-name">
                        <p class="username pointer">{{ user.USER_NickName }}</p>
                        <p class="fullname">{{ user.USER_SubName + " " + user.USER_FirstName }}
                            <span v-if="user.USER_Id != user_personal" class="status"></span>
                            <span v-if="user.USER_Id == user_personal" class="status" style="color: blue;">• It's
                                me</span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService'
export default {
    data() {
        return {
            user_personal: this.$router.history.current.params.id,
            user_other_profile: this.$router.history.current.params.idother,
            user: [],
            searchQuery: '',
            searchResults: [],
            searching: false,
            searchTimeout: null,
            showNoResults: false
        }
    },
    methods: {
        async searchUsers(query) {
            if (query.trim() === '') {
                this.searchResults = [];
                this.searching = false;
                this.showNoResults = false
                return;
            }

            const lowercaseQuery = query ? query.toLowerCase() : '';
            this.searchResults = this.user.filter(user => {
                const isCurrentUser = user.USER_Id == this.user_personal;
                const subName = user.USER_SubName ? user.USER_SubName.toLowerCase() : '';
                const nickName = user.USER_NickName ? user.USER_NickName.toLowerCase() : '';
                const firstName = user.USER_FirstName ? user.USER_FirstName.toLowerCase() : '';
                const fullname = subName.concat(' ', firstName)

                return !isCurrentUser &&
                    (subName.includes(lowercaseQuery) ||
                        nickName.includes(lowercaseQuery) ||
                        firstName.includes(lowercaseQuery) ||
                        fullname.includes(lowercaseQuery));
            });

            if (this.searchResults.length === 0) {
                this.showNoResults = true;
            } else {
                this.showNoResults = false;
            }
        },
        handleInput() {
            clearTimeout(this.searchTimeout);
            this.searching = true;
            this.searchTimeout = setTimeout(() => {
                this.searchUsers(this.searchQuery);
                setTimeout(() => {
                    this.searching = false;
                }, 0);
            }, 500);
        }, loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        },
        goProfilePersonal() {
            this.$router.push(`/profile`)
        },
        goProfileOther(idother) {
            this.$router.push(`/profile/${idother.USER_Id}`)
        }, goToProfile(id) {
            if (id === this.user_personal) {
                this.goProfilePersonal();
            } else {
                const targetRoute = `/profile/${id}`;
                if (this.$route.path !== targetRoute) {
                    this.$router.push(targetRoute);
                }
            }
        }
    }, async mounted() {
        this.user = (await AuthenticationService.getUsers()).data
    }, props: {
        isOpen: {
            type: Boolean
        }
    }
}

</script>

<style scoped>
.animationOpen {
    -webkit-animation: scale-in-hor-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: scale-in-hor-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.animationClose {
    -webkit-animation: scale-out-hor-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    animation: scale-out-hor-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

.Search-Frame {
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

    .h2 {
        margin: 0;
        font-size: 24px;
        padding-bottom: 36px;
    }

    .recent {
        font-size: 16px;
    }

    .inputSearch {
        width: 100%;
        height: 40px;
        padding: 3px 16px;
        background-color: #EFEFEF;
        font-size: 14px;
        border: none;
        border-radius: 8px;
        margin-bottom: 33px;
    }

    .SF-Found {
        width: 100%;
        height: 75%;
        overflow: scroll;
        overflow-x: hidden;
        overflow-y: scroll;

        .NF-request {
            cursor: pointer;
            display: flex;
            width: 100%;
            height: fit-content;
            padding: 8px 0 8px 8px;
            position: relative;
            border-radius: 12px;
            z-index: 1111111;

            &:hover {
                background-color: #EFEFEF;
            }

            .NF-request-user {
                display: flex;

                .NF-request-user-avata {
                    width: 44px;
                    height: 44px;
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
                        font-weight: 500;
                    }

                    .fullname {
                        margin: 0;
                        font-size: 14px;
                        color: #737373;
                        opacity: .7;
                        font-weight: 400;
                    }
                }

            }
        }
    }


    .noResults {
        position: fixed;
        width: 371px;
        height: 60%;
        text-align: center;
        display: flex;
        justify-content: center;
        background-color: white;
        flex-wrap: wrap;
        align-content: center;
        margin-left: -10px;
        color: #737373;
    }

}


/* Định nghĩa hiệu ứng transition cho phần Search */
.search-transition-enter-active,
.search-transition-leave-active {
    transition: transform 0.5s, opacity 0.8s;
}

.search-transition-enter,
.search-transition-leave-to {
    transform: translateX(-50%) scale(0.8);
    opacity: 0;
}

.loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    z-index: 99999;
    margin-top: 20px;
    width: 88%;
    height: 80%;
    background-color: white;
}

.loader-search {
    display: flex;
}

.rect-frame {
    width: 15px;
    height: 4px;
    margin: 0 2px;
    background: #3498db;
    border-radius: 2px;
    animation: loading 1.5s infinite;
}

.rect1 {
    animation-delay: 0s;
}

.rect2 {
    animation-delay: 0.1s;
}

.rect3 {
    animation-delay: 0.2s;
}

.rect4 {
    animation-delay: 0.3s;
}

.rect5 {
    animation-delay: 0.4s;
}

@keyframes loading {

    0%,
    80%,
    100% {
        transform: scale(0.3);
        background: #303030;
    }

    40% {
        transform: scale(1);
        background: #ccc;
    }
}


/* {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 117.5px;
    right: 39px;
    transform: translateY(-50%);
} */

.search-loader {
    position: absolute;
    top: 104.5px;
    right: 32px;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    border: 4px solid #ddd;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 2s cubic-bezier(0.5, 0.2, 0.3, 1) infinite;
}

/* Animation keyframes */
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(180deg);
        animation-timing-function: ease-in;
    }

    100% {
        transform: rotate(360deg);
        animation-timing-function: ease-out;
    }
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

@-webkit-keyframes scale-out-hor-left {
    0% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        opacity: 1;
    }
}

@keyframes scale-out-hor-left {
    0% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        opacity: 1;
    }
}
</style>