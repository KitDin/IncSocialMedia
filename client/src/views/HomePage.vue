<template>
    <div>
        <Header></Header>
        <div class="HomeContent">
            <NavMenu @makeNewPost="makeNewPost" />

            <div class="HC-Post" v-for="post in posts" :key="post.content.POST_Id">
                <div class="HC-Post-infor">
                    <img @click="goProfile(post.content.USER_Id)" :src="loadimg(post.content)" class="avatar">
                    <p @click="goProfile(post.content.USER_Id)" class="HC-Post-username name1"> {{
                        post.content.USER_NickName }} <span class="username-time">•
                            {{ timeRequest(post.content.POST_Time) }}</span></p>
                </div>
                <div class="HC-Post-imgs" ref="imageContainer" @scroll="onScroll(post, $event)">
                    <div class="img-container" v-for="(img, index) in post.images" :key="index">
                        <img :src="loadimgpost(img)" class="img">
                    </div>
                    <div style="color: brown; margin-left: 5px;">...</div>
                </div>

                <div class="HC-Post-scroll-bar">
                    <div class="HC-Post-scroll-bar-dots">
                        <div class="HC-Post-scroll-bar-dot" @click="goToImg(post, index)"
                            :class="{ 'activeWhite': index === post.activeIndex }" v-for="(img, index) in post.images"
                            :key="index">
                        </div>
                    </div>
                </div>

                <div class="HC-Post-icon">
                    <i @click="toggleHeart(post)"
                        :class="['bi', 'icon', { 'bi-heart': !post.isHeartFilled, 'bi-heart-fill': post.isHeartFilled }]"></i>
                    <i @click="showCommentBar(post)" class="bi bi-chat icon"></i>
                </div>

                <span class="like" v-if="post.countLike !== 0">{{ post.countLike }} likes</span>

                <div class="HC-Post-status">
                    <span @click="goProfile(post.content.USER_Id)" class="HC-Post-username name2">
                        {{ post.content.USER_NickName }}</span>
                    <span class="status">
                        <span v-if="post.showFullContent">
                            {{ shortenContent(post.content.POST_Content) }}
                        </span>
                        <span v-else>
                            {{ post.content.POST_Content }}
                            <span v-for="(tag, index) in post.hashtag" :key="index" class="hash-tag-post">
                                {{ tag.hashtag_name }} </span>
                        </span>
                    </span>
                    <span class="option-s-h" v-if="post.showFullContent" @click="post.showFullContent = false">
                        ... More
                    </span>
                    <span class="option-s-h" v-if="!post.showFullContent" @click="post.showFullContent = true">
                        ... Shorten
                    </span>
                </div>
                <div @click="showCommentBar(post)" class="allcomment">View {{ post.countComment > 0 ? post.countComment
                    : ''
                    }}
                    comment</div>
                <input class="inputcomment" type="text" @pointerenter="" placeholder="Add a comment...">
            </div>

            <NavRequestFriend></NavRequestFriend>

            <div v-if="showComment" @click="showCommentBar" class="Comment-prevent"></div>
            <CommentPost v-if="showComment" :postId="postId_Comment" :userid="userid" :loadImgPost="loadimgpost"
                :toggleHeart="toggleHeart" :loadImgUser="loadimg" :timeRequest="timeRequest" @updatePost="updatePost"
                :goProfile="goProfile" />
        </div>
    </div>
</template>

<script>
import Footer from "../components/Footer.vue"
import NavMenu from "../components/Nav.vue"
import NavRequestFriend from "../components/NavRequestFriend.vue"
import AuthenticationService from "../services/AuthenticationService"
import CommentPost from "../components/CommentPost.vue"
export default {
    name: 'Home',
    data() {
        return {
            currentImageIndex: 0,
            isHeartFilled: false,
            userid: '',
            user: [],
            posts: [],
            postId_Comment: [],
            showComment: false,
            hashTagsDataSearch: [],
        }
    },
    components: {
        Footer,
        NavMenu,
        NavRequestFriend,
        CommentPost
    },
    props: ['id'],
    methods: {
        async makeNewPost() { console.log(">> hlo"); await this.fetchPosts() },
        test(post) {
            console.log(post);
        },
        async toggleHeart(postAll) {
            if (this.posts) {
                const postIndex = this.posts.findIndex(post => post.content.POST_Id === postAll.content.POST_Id);

                if (postIndex > -1) {
                    this.$set(this.posts[postIndex], 'isHeartFilled', !this.posts[postIndex].isHeartFilled);
                }
            }

            try {

                if (postAll.isHeartFilled) {
                    console.log("like");

                    await AuthenticationService.like(this.userid, {
                        POST_Id: postAll.content.POST_Id
                    });

                } else if (!postAll.isHeartFilled) {
                    console.log("un like");

                    await AuthenticationService.unlike(this.userid, {
                        POST_Id: postAll.content.POST_Id
                    });

                }

                const updatedPosts = (await AuthenticationService.getposts()).data;
                if (this.posts) {
                    this.posts = updatedPosts.map(post => {
                        const isCurrentUserLiked = post.likes.includes(this.userid);
                        return {
                            ...post,
                            isHeartFilled: isCurrentUserLiked,
                            activeIndex: 0,
                            scrollTimeout: null,
                            showFullContent: this.isContentOverFifteenWords(post.content.POST_Content)
                        };
                    });
                }
            } catch (error) {

            }
        }, loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        }, loadimgpost(img) {
            if (img) {
                return require(`../../../server/public/uploads/post/${img}`);
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
        }, goProfile(userId) {
            if (userId == this.userid) {
                this.$router.push(`/profile`)
            } else {
                this.$router.push(`/profile/${userId}`)
            }
        }, onScroll(post, event) {
            if (event && event.target) {
                clearTimeout(post.scrollTimeout);
                post.scrollTimeout = setTimeout(() => {
                    const container = event.target;
                    const scrollPosition = container.scrollLeft;
                    const imageWidth = container.offsetWidth;
                    post.activeIndex = Math.floor(scrollPosition / imageWidth);
                }, 0);
            }
        }, shortenContent(content, hashtags) {
            const words = content.split(' '); // Tách chuỗi thành mảng các từ
            const shortenedWords = words.slice(0, 15); // Lấy 15 từ đầu tiên
            return `${shortenedWords.join(' ')}`;
        }, isContentOverFifteenWords(content) {
            const words = content.split(' '); // Tách chuỗi thành mảng các từ
            return words.length > 15; // Kiểm tra xem mảng có nhiều hơn 15 từ hay không
        }, showCommentBar(post) {
            this.showComment = !this.showComment
            this.postId_Comment = post // Lấy id bình luận bài đăng 
        }, async updatePost(updatedPost) {
            const postIndex = this.posts.findIndex(post => post.content.POST_Id === updatedPost.content.POST_Id);
            if (postIndex > -1) {
                this.posts[postIndex] = updatedPost;
            }
        }, async fetchPosts() {
            let postsData = (await AuthenticationService.getposts(this.userid)).data;
            this.posts = postsData.map(post => {
                const isCurrentUserLiked = post.likes.includes(this.userid);
                return {
                    ...post,
                    isHeartFilled: isCurrentUserLiked,
                    activeIndex: 0,
                    scrollTimeout: null,
                    showFullContent: this.isContentOverFifteenWords(post.content.POST_Content),
                };
            });
        },
    },
    async mounted() {
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
        this.user = (await AuthenticationService.getUser(this.userid)).data

        // Fetch posts
        await this.fetchPosts();
    },

}
</script>

<style scoped>
.Comment-prevent {
    position: fixed;
    width: 100%;
    height: 100%;
    background: black;
    opacity: .5;
    top: 0;
    z-index: 1000;
}

.HomeContent {
    top: 0;
    margin: 0;
    width: 100%;
    height: fit-content;
    position: relative;

    .HC-Post {
        width: 478px;
        height: fit-content;
        margin: 0px 462px 0px 400px;
        padding-top: 28px;
        border-bottom: #737373 solid 0.5px;

        .HC-Post-infor {
            width: 100%;
            display: flex;
            margin: 0 12px 12px 8px;

            .avatar {
                width: 42px;
                height: 42px;
                object-fit: cover;
                border-radius: 50%;
                cursor: pointer;
            }

            .HC-Post-username {
                margin: 0;
                font-size: 14px;
                text-align: center;
                position: relative;
                top: 50%;
                transform: translate(10px, 10px);
                font-weight: 600;
                cursor: pointer;

                .username-time {
                    cursor: default;
                    font-weight: 500;
                    color: #737373;
                }
            }
        }




        .HC-Post-icon {
            padding-top: 8px;

            .icon {
                font-size: 24px;
                padding: 8px;

                &:hover {
                    opacity: .5;
                }
            }

            .bi-heart-fill {
                color: red;
            }

        }

        .HC-Post-like {
            font-size: 14px;
            font-weight: 500px;
            margin-bottom: 8px;
        }

        .HC-Post-status {
            font-size: 14px;
            margin-bottom: 8px;

            .HC-Post-username {
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
            }

            .status {
                margin-left: 3px;
            }

            .status-hashtag {
                .hashtag {
                    color: #00376b;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }

        .allcomment {
            font-size: 14px;
            color: #737373;
            cursor: pointer;
            margin-bottom: 8px;
        }

        .inputcomment {
            width: 100%;
            border: none;
            /* background-color: #fafafa; */
            font-size: 14px;
            margin-bottom: 8px;
        }
    }
}

.HC-Post-imgs::-webkit-scrollbar {
    display: none;
}

.HC-Post-imgs {
    position: relative;
    width: 469px;
    height: 589px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.HC-Post-imgs .img-container {
    scroll-snap-align: center;
}

.HC-Post-imgs .img-container .img {
    width: 469px;
    height: 589px;
    object-fit: cover;
}

.HC-Post-scroll-bar {
    position: relative;
    bottom: 22px;
}

.HC-Post-scroll-bar-dots {
    display: flex;
    align-items: center;
    justify-content: center;
}

.HC-Post-scroll-bar-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #aeacac;
    margin: 0 2px;
}

.activeWhite {
    background-color: white;

}

.like {
    display: block;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 8px;
    cursor: pointer;
}


.option-s-h {
    margin: 0;
    color: #737373;
    cursor: pointer;
}

.option-s-h:hover {
    color: #3d3d3d;
}

.hash-tag-post {
    color: #0095f6;
    cursor: pointer;

    &:hover {
        color: #005994;
    }
}
</style>
