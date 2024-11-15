<template>
    <div class="CommentPost-container">
        <div style="display: flex;">


            <div class="HC-Post-imgs" ref="imageContainer">
                <div class="img-container" v-for="(img, index) in postId.images" :key="index">
                    <img :src="loadImgPost(img)" class="img">
                </div>
            </div>

            <div class="comment">
                <div class="user">
                    <img @click="goProfile(postId.content.USER_Id)" :key="postId.countLike" class="user-Avatar"
                        :src="loadImgUser(postId.content)" alt="">
                    <p @click="goProfile(postId.content.USER_Id)" class="user-name">{{ postId.content.USER_NickName }}
                    </p>
                </div>
                <hr>

                <!-- comment -->
                <div class="frame">

                    <div class="user-comment" v-for="(comment, index) in comments" :key="index">
                        <div class="user">
                            <img @click="goProfile(comment.comment.USER_Id)" class="user-Avatar"
                                :src="loadImgUser(comment.comment)" alt="">
                            <p @click="goProfile(comment.comment.USER_Id)" class="user-name">{{
                                comment.comment.USER_NickName
                                }}</p>
                            <p class="content-comment">{{ comment.comment.comment_Content }}</p>
                            <div class="reply">
                                <p class="time">{{ timeRequest(comment.comment.comment_Time) }}</p>
                                <label for="textComment" class="btn-reply" @click="reply(comment, repli)">Reply</label>
                            </div>
                        </div>


                        <div class="reply-content" v-if="countReplyOnComment(comment)">
                            <hr>
                            <p class="view-option" v-if="!comment.isShowView" @click="showView(comment)">View replies
                                ({{
                                    comment.reply.length }})
                            </p>
                            <p class="view-option" v-if="comment.isShowView" @click="showView(comment)">Hide</p>
                            <div class="user" v-if="comment.isShowView" v-for="replys in comment.reply">
                                <img @click="goProfile(replys.USER_Id)" class="user-Avatar" :src="loadImgUser(replys)"
                                    alt="">
                                <p @click="goProfile(replys.USER_Id)" class="user-name">{{ replys.USER_NickName }}
                                </p>
                                <p class="content-comment" style="width: 55%;"> <span class="tag-name">@{{
                                    replys.reply_to.USER_NickName
                                        }}</span> {{
                                            replys.CommentReply_Content }}</p>
                                <div class="reply-more">
                                    <p class="time">{{ timeRequest(replys.CommentReply_Time) }}</p>
                                    <label for="textComment" class="btn-reply"
                                        @click="reply(comment, replys)">Reply</label>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <!--   end commet -->
                <hr>
                <div class="excute">
                    <div class="icons">
                        <i @click="like(postId)"
                            :class="['bi', 'icon', { 'bi-heart': !postId.isHeartFilled, 'bi-heart-fill': postId.isHeartFilled }]"></i>

                        <label for="textComment">
                            <i class="bi bi-chat icon"></i>
                        </label>
                    </div>
                    <div class="about">
                        <h5 v-if="postId.countLike > 0">{{ postId.countLike }} likes</h5>
                        <h5 v-else>---</h5>
                        <p>{{ timeRequest(postId.content.POST_Time) }}
                        </p>
                    </div>
                    <div class="addComment">
                        <input autocomplete="off" @keyup.enter="postComment" v-model="textComment" name="textComment"
                            id="textComment" class="textComment" type="text" placeholder="Add a comment...">
                        <button v-if="!showLoader && !showIcon" :class="char > 0 ? 'btn-active' : ``" class="btn-post"
                            @click="char > 0 ? postComment() : null">Post</button>
                        <div v-if="showLoader" class="lds-dual-ring"></div>
                        <i v-if="showIcon" class="tick-icon bi bi-check-circle-fill"
                            :class="showIcon ? 'heartbeat' : ''"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import AuthenticationService from "../services/AuthenticationService"


export default {
    data() {
        return {
            textComment: '',
            repliedUsername: '',
            replyComment: '',
            char: 0,
            comments: [],
            status: '',
            showIcon: false,
            showLoader: false
        };
    },
    methods: {
        reply(comment, reply) {
            this.textComment = '';
            this.repliedUsername = '';
            this.replyComment = '';
            this.textComment = !reply ? `@${comment.comment.USER_NickName + ' '}` : `@${reply.USER_NickName + ' '}`;
            this.repliedUsername = !reply ? comment.comment.USER_id : reply.USER_id;
            this.replyComment = comment.comment.comment_id;
            console.log(this.repliedUsername);
        },
        countReplyOnComment(comment) {
            return comment.reply.length > 0
        },
        makeRandomId(length) {
            let result = ''
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        },
        showView(comment) {
            comment.isShowView = !comment.isShowView
        }, async postComment() {
            try {
                if (this.textComment.startsWith('@')) {
                    this.showLoader = true;
                    const commentWithoutUsername = this.textComment.replace(/^@\S+\s/, '');
                    setTimeout(async () => {
                        this.showLoader = false;
                        this.showIcon = true;
                        const response = await AuthenticationService.replyComment(this.postId.content.POST_Id, {
                            "POST_id": this.postId.content.POST_Id,
                            "replyComment": this.replyComment,
                            "USER_id": this.userid,
                            "USER_id_reply_to": this.repliedUsername,
                            "CommentReply_id": this.makeRandomId(Math.floor(Math.random() * 30)),
                            "CommentReply_Content": commentWithoutUsername
                        })

                        this.status = response.data.status;

                        if (this.status = 'success') {
                            setTimeout(async () => {
                                this.showIcon = false
                                const commentsData = (await AuthenticationService.getComment(this.postId.content.POST_Id)).data;
                                this.comments = commentsData.map(comment => {
                                    return {
                                        ...comment,
                                        isShowView: true,
                                    }
                                })
                                this.textComment = '';
                                this.repliedUsername = '';
                                this.replyComment = '';
                            }, this.getRandomNumber(1500, 2000));
                        }
                    }, this.getRandomNumber(500, 1000));
                } else {
                    this.showLoader = true;
                    setTimeout(async () => {
                        this.showLoader = false;
                        this.showIcon = true;
                        const response = await AuthenticationService.postComment(this.postId.content.POST_Id, {
                            "comment_id": this.makeRandomId(Math.floor(Math.random() * 30)),
                            "POST_id": this.postId.content.POST_Id,
                            "USER_id": this.userid,
                            "comment_Content": this.textComment,
                        })
                        this.status = response.data.status;

                        if (this.status === 'success') {
                            setTimeout(async () => {
                                this.showIcon = false
                                const commentsData = (await AuthenticationService.getComment(this.postId.content.POST_Id)).data;
                                this.comments = commentsData.map(comment => {
                                    return {
                                        ...comment,
                                        isShowView: false,
                                    }
                                })
                                this.textComment = '';
                                this.repliedUsername = '';
                                this.replyComment = '';
                            }, this.getRandomNumber(1500, 2000));
                        }
                    }, this.getRandomNumber(500, 1000));
                }


            } catch (error) {
                console.error("Error posting comment:", error);
            }
        }, getRandomNumber(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }, async like(post) {
            post.isHeartFilled = !post.isHeartFilled
            try {

                if (post.isHeartFilled) {

                    await AuthenticationService.like(this.userid, {
                        POST_Id: post.content.POST_Id
                    });
                    this.fetchComments()
                } else if (!post.isHeartFilled) {

                    await AuthenticationService.unlike(this.userid, {
                        POST_Id: post.content.POST_Id
                    });
                    this.fetchComments()
                }

                const [updatedPostData] = (await AuthenticationService.APost(post.content.POST_Id)).data;
                const isCurrentUserLiked = updatedPostData.likes.includes(this.userid);

                this.postId = {
                    ...updatedPostData,
                    isHeartFilled: isCurrentUserLiked,
                    activeIndex: 0,
                    scrollTimeout: null,
                    showFullContent: this.isContentOverFifteenWords(updatedPostData.content.POST_Content)
                }
                this.$emit('updatePost', this.postId)
            } catch (error) { }
        },

        isContentOverFifteenWords(content) {
            const words = content.split(' '); // Tách chuỗi thành mảng các từ
            return words.length > 15; // Kiểm tra xem mảng có nhiều hơn 15 từ hay không
        },

        async fetchComments() {
            try {
                const commentsData = (await AuthenticationService.getComment(this.postId.content.POST_Id)).data;
                this.comments = commentsData.map(comment => {
                    return {
                        ...comment,
                        isShowView: false, // Add your property or any transformations you need
                    };
                });
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        },
    }, props: {
        userid: String,
        postId: Object,
        loadImgPost: Function,
        loadImgUser: Function,
        timeRequest: Function,
        goProfile: Function
    }, async mounted() {
        this.fetchComments(); // Fetch comments initially when the component is mounted
        // this.startPolling();
    }, watch: {
        textComment(value) {
            this.char = value.length;
        },
    }, beforeDestroy() {
        this.stopPolling();  // Ensure polling stops when the component is destroyed
    }
}
</script>

<style>
.heartbeat {
    -webkit-animation: heartbeat 1.5s ease-in-out infinite both;
    animation: heartbeat 1.5s ease-in-out infinite both;
}

@-webkit-keyframes heartbeat {
    from {
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transform-origin: center center;
        transform-origin: center center;
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
    }

    10% {
        -webkit-transform: scale(0.91);
        transform: scale(0.91);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    17% {
        -webkit-transform: scale(0.98);
        transform: scale(0.98);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
    }

    33% {
        -webkit-transform: scale(0.87);
        transform: scale(0.87);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    45% {
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
    }
}

@keyframes heartbeat {
    from {
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transform-origin: center center;
        transform-origin: center center;
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
    }

    10% {
        -webkit-transform: scale(0.91);
        transform: scale(0.91);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    17% {
        -webkit-transform: scale(0.98);
        transform: scale(0.98);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
    }

    33% {
        -webkit-transform: scale(0.87);
        transform: scale(0.87);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }

    45% {
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out;
    }
}

.CommentPost-container {
    background-color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
}

.HC-Post-imgs::-webkit-scrollbar {
    display: none;
}

.HC-Post-imgs {
    width: 584px;
    height: 655.5px;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.HC-Post-imgs .img-container {
    flex-shrink: 0;
    scroll-snap-align: start;
}

.HC-Post-imgs .img-container .img {
    width: 584px;
    height: 655.5px;
    object-fit: cover;
    margin: 0;
}



.comment {
    border-left: 1px silver solid;
    width: 486px;
    /* height: 655.5px; */
    height: 655.5px;
}

.comment .frame {
    overflow-y: scroll;
    scrollbar-width: none;
    width: 486px;
    /* height: 655.5px; */
    height: 450px;
}


.comment .frame::-webkit-scrollbar {
    display: none;
}

.comment .user {
    width: 470px;
    height: fit-content;
    display: flex;
    padding: 10px 15px 10px 20px;
}

hr {
    padding: 0;
    margin: 0;
    opacity: .1;
}

.comment .user .user-Avatar {
    width: 38px;
    height: 38px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 5px;
}

.comment .user .user-name {
    margin: 0;
    font-size: 13px;
    text-align: center;
    position: relative;
    top: 50%;
    transform: translate(10px, 2px);
    font-weight: 600;
    cursor: pointer;
}

.comment .user .content-comment {
    position: relative;
    top: 50%;
    transform: translate(10px, 2px);
    margin-left: 3px;
}

.comment .user .content-comment .tag-name {
    color: rgb(17, 64, 151);
    cursor: pointer;
}

.user-comment {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    font-size: 13px;
}



.user-comment .reply {
    display: flex;
    position: absolute;
    width: 50px;
    top: 28px;
    left: 72px;
    color: #737373;
}

.user-comment .reply p {
    margin: 0;
}

.user-comment .reply .time {
    margin-right: 14px;
}

.user-comment .reply .btn-reply {
    font-weight: 500;
    cursor: pointer;
}

.user-comment .reply-content {
    margin: 12px 0 12px 0;
    position: relative;
    left: 72px;
    width: 30%;
}

.user-comment .reply-content hr {
    width: 24px;
    opacity: 1;
}

.user-comment .reply-content .view-option {
    margin: 0;
    padding-left: 48px;
    height: fit-content;
    position: absolute;
    top: -10px;
    color: #737373;
    font-weight: 500;
    cursor: pointer;
}

.reply-content .user {
    position: relative;
    margin: 0;
    padding: 25px 0 0 0;
}

.reply-content .user .reply-more {
    display: flex;
    position: absolute;
    width: 50px;
    top: 44px;
    left: 52px;
    color: #737373;
}

.reply-content .user .reply-more .time {
    margin-right: 14px;
}

.reply-content .user .reply-more .btn-reply {
    cursor: pointer;
    font-weight: 500;
}

.excute {
    height: 145.5px;
    /* margin: 18px 22px; */
}

.excute .icons {
    margin: 0;
    padding: 12px 22px 8px 22px;
    font-size: 24px;
    -webkit-text-stroke: 0.7px;
    cursor: pointer;
    transition: all 0.5 ease;
}

.excute .icons .icon {
    padding-right: 8px;
}

.excute .icons .bi-heart-fill {
    color: red;
}

.excute .icons .bi-heart-fill:hover {
    opacity: .8;
}

.excute .icons .bi-chat:hover {
    opacity: .6;
}

.excute .about {
    font-size: 14px;
    margin: 0;
    padding: 0 22px 10px 22px;
}

.excute .about h5 {
    margin: 0;
    font-size: 14px;
    font-weight: bold;
}

.excute .about p {
    margin: 0;
    font-size: 10px;
    color: silver;
}

.excute .addComment {
    border-top: #eae8e8 1px solid;

    display: flex;
    justify-content: space-between;
}

.excute .addComment input {
    margin-left: 22px;
    padding: 12px 0 0 0;
    border: none;
    font-size: 14px;
    width: 90%;
}

.excute .addComment .btn-post {
    border: none;
    padding: 12px 0 0 0;
    padding-right: 22px;
    background-color: white;
    font-weight: bolder;
    color: rgb(186, 196, 215);
}

.btn-active {
    color: rgb(17, 64, 151) !important;
}

.tick-icon {
    font-size: 25px;
    position: relative;
    left: -22px;
    top: 6px;
    color: rgb(17, 64, 151) !important;
    /* opacity: 0; */
    transition: opacity 0.5s, transform 0.5s;
}

.rotate-scale-down {
    -webkit-animation: rotate-scale-down 0.65s linear both;
    animation: rotate-scale-down 0.65s linear both;
}

@-webkit-keyframes rotate-scale-down {
    0% {
        -webkit-transform: scale(1) rotateZ(0);
        transform: scale(1) rotateZ(0);
    }

    50% {
        -webkit-transform: scale(0.5) rotateZ(180deg);
        transform: scale(0.5) rotateZ(180deg);
    }

    100% {
        -webkit-transform: scale(1) rotateZ(360deg);
        transform: scale(1) rotateZ(360deg);
    }
}

@keyframes rotate-scale-down {
    0% {
        -webkit-transform: scale(1) rotateZ(0);
        transform: scale(1) rotateZ(0);
    }

    50% {
        -webkit-transform: scale(0.5) rotateZ(180deg);
        transform: scale(0.5) rotateZ(180deg);
    }

    100% {
        -webkit-transform: scale(1) rotateZ(360deg);
        transform: scale(1) rotateZ(360deg);
    }
}

.lds-dual-ring {
    display: inline-block;
}

.lds-dual-ring:after {
    content: " ";
    display: block;
    width: 20px;
    height: 20px;
    margin: 14px 24px 0 0;
    border-radius: 50%;
    border: 6px solid #fff;
    border-color: #384d45 transparent #1f1d1d transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
