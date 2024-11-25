<template>
    <div class="CommentPost-container">
        <div style="display: flex;">


            <div class="HC-Post-imgs" ref="imageContainer">
                <div class="img-container" v-for="(img, index) in postId.images" :key="index">
                    <img :src="loadImgPost(img)" class="img">
                </div>
            </div>


            <div class="comment-post-full-content">
                <div class="comment">
                    <div class="user">
                        <img @click="goProfile(postId.content.USER_Id)" :key="postId.countLike" class="user-Avatar"
                            :src="loadImgUser(postId.content)" alt="">
                        <p @click="goProfile(postId.content.USER_Id)" class="user-name">{{ postId.content.USER_NickName
                            }}
                        </p>
                    </div>
                    <hr>
                    <!-- khung comment -->
                    <div class="frame">

                        <!-- content -->
                        <div class="user-comment">
                            <div class="user">
                                <img @click="goProfile(postId.content.USER_Id)" class="user-avatar"
                                    :src="loadImgUser(postId.content)" alt="">
                                <div class="user-comment-info">
                                    <div class="user-comment-content">
                                        <span @click="goProfile(postId.content.USER_Id)" class="user-name">{{
                                            postId.content.USER_NickName
                                        }}</span>
                                        <span class="content-comment">{{ postId.content.POST_Content }}</span>
                                        <span class="hashtags" v-for="hashtag in postId.hashtag"
                                            :key="hashtag.hashtag_id">
                                            {{ hashtag.hashtag_name }}
                                        </span>
                                    </div>
                                    <div class="user-comment-order">
                                        <p class="time">{{ timeRequest(postId.content.POST_Time) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- comment -->
                        <div class="user-comment" v-for="(comment, index) in comments" :key="index">
                            <div class="user">
                                <img @click="goProfile(comment.comment.USER_Id)" class="user-avatar"
                                    :src="loadImgUser(comment.comment)" alt="">
                                <div class="user-comment-info">
                                    <div class="user-comment-content">
                                        <span @click="goProfile(comment.comment.USER_Id)" class="user-name">{{
                                            comment.comment.USER_NickName
                                        }}</span>
                                        <span class="content-comment">{{ comment.comment.comment_Content }}</span>
                                    </div>
                                    <div class="user-comment-order">
                                        <p class="time">{{ timeRequest(comment.comment.comment_Time) || 'now' }}</p>
                                        <label for="textComment" class="btn-reply"
                                            @click="reply(comment, repli)">Reply</label>
                                    </div>
                                    <div class="view-option" v-if="countReplyOnComment(comment)"
                                        @click="showView(comment)">
                                        <div class="line-center"></div>{{ !comment.isShowView
                                            ?
                                            `View
                                        replies(${comment.reply.length})` : "Hide" }}
                                    </div>
                                    <div class="user-comment-reply" v-if="comment.isShowView">
                                        <div class="user" v-for="(replys, index) in comment.reply" :key="index">
                                            <img @click="goProfile(replys.USER_Id)" class="user-avatar"
                                                :src="loadImgUser(replys)" alt="">
                                            <div class="user-comment-info">
                                                <div class="user-comment-content">
                                                    <span @click="goProfile(replys.USER_Id)" class="user-name">{{
                                                        replys.USER_NickName
                                                    }}</span>
                                                    <span class="reple-to">@{{ replys.reply_to.USER_NickName }}</span>
                                                    <span class="content-comment">{{
                                                        replys.CommentReply_Content }}</span>
                                                </div>
                                                <div class="user-comment-order">
                                                    <p class="time">{{ timeRequest(replys.CommentReply_Time) || 'now' }}
                                                    </p>
                                                    <label for="textComment" class="btn-reply"
                                                        @click="reply(comment, replys)">Reply</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

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
import AuthenticationService from "../services/AuthenticationService"
import socket from "../services/Socket.io";

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
            showLoader: false, postData: []
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
        },
        //  async postComment() {
        //     try {
        //         if (this.textComment.startsWith('@')) {
        //             this.showLoader = true;
        //             const commentWithoutUsername = this.textComment.replace(/^@\S+\s/, '');
        //             setTimeout(async () => {
        //                 this.showLoader = false;
        //                 this.showIcon = true;
        //                 const response = await AuthenticationService.replyComment(this.postId.content.POST_Id, {
        //                     "POST_id": this.postId.content.POST_Id,
        //                     "replyComment": this.replyComment,
        //                     "USER_id": this.userid,
        //                     "USER_id_reply_to": this.repliedUsername,
        //                     "CommentReply_id": this.makeRandomId(Math.floor(Math.random() * 30)),
        //                     "CommentReply_Content": commentWithoutUsername
        //                 })

        //                 this.status = response.data.status;

        //                 if (this.status = 'success') {
        //                     setTimeout(async () => {
        //                         this.showIcon = false
        //                         const commentsData = (await AuthenticationService.getComment(this.postId.content.POST_Id)).data;
        //                         this.comments = commentsData.map(comment => {
        //                             return {
        //                                 ...comment,
        //                                 isShowView: true,
        //                             }
        //                         })
        //                         this.textComment = '';
        //                         this.repliedUsername = '';
        //                         this.replyComment = '';
        //                         this.updatePost(this.postId.content.POST_Id)
        //                     }, this.getRandomNumber(1500, 2000));
        //                 }
        //             }, this.getRandomNumber(500, 1000));
        //         } else {
        //             this.showLoader = true;
        //             setTimeout(async () => {
        //                 this.showLoader = false;
        //                 this.showIcon = true;
        //                 const response = await AuthenticationService.postComment(this.postId.content.POST_Id, {
        //                     "comment_id": this.makeRandomId(Math.floor(Math.random() * 30)),
        //                     "POST_id": this.postId.content.POST_Id,
        //                     "USER_id": this.userid,
        //                     "comment_Content": this.textComment,
        //                 })
        //                 this.status = response.data.status;

        //                 if (this.status === 'success') {
        //                     setTimeout(async () => {
        //                         this.showIcon = false
        //                         const commentsData = (await AuthenticationService.getComment(this.postId.content.POST_Id)).data;
        //                         this.comments = commentsData
        //                         // .map(comment => {
        //                         //     return {
        //                         //         ...comment,
        //                         //         isShowView: false,
        //                         //     }
        //                         // })
        //                         this.textComment = '';
        //                         this.repliedUsername = '';
        //                         this.replyComment = '';
        //                         this.updatePost(this.postId.content.POST_Id)
        //                     }, this.getRandomNumber(1500, 2000));
        //                 }
        //             }, this.getRandomNumber(500, 1000));
        //         }
        //     } catch (error) {
        //         console.error("Error posting comment:", error);
        //     }
        // }
        async postComment() {
            try {
                this.showLoader = true;
                let check = false
                setTimeout(() => {
                    this.showLoader = false;
                    this.showIcon = true;
                    if (this.textComment.startsWith('@')) {
                        const commentWithoutUsername = this.textComment.replace(/^@\S+\s/, '');

                        setTimeout(() => {
                            this.showIcon = false;
                            check = true
                            socket.emit('submitComment', {
                                POST_id: this.postId.content.POST_Id,
                                replyComment: this.replyComment, // Đánh dấu đây là reply
                                USER_id: this.userid,
                                USER_id_reply_to: this.repliedUsername, // Tên user được reply
                                CommentReply_id: this.makeRandomId(Math.floor(Math.random() * 30)),
                                CommentReply_Content: commentWithoutUsername
                            });
                        }, this.getRandomNumber(1500, 2000))
                        // Emit sự kiện submitComment cho reply comment


                    } else {
                        setTimeout(() => {
                            this.showIcon = false;
                            this.replyComment = ''
                            check = true
                            socket.emit('submitComment', {
                                POST_id: this.postId.content.POST_Id,
                                comment_id: this.makeRandomId(Math.floor(Math.random() * 30)),
                                comment_Content: this.textComment,
                                USER_id: this.userid
                            });
                        }, this.getRandomNumber(1500, 2000))
                    }
                }, this.getRandomNumber(1500, 2000))

                // Nghe sự kiện updateComments để cập nhật danh sách comment
                // if (check)
                // socket.on('updateComments', (data) => {
                //     console.log('Updated comments and replies received:', data);
                //     this.comments = data; // Gán dữ liệu nhận được từ server vào danh sách comments
                //     this.textComment = ''; // Reset input comment
                //     this.repliedUsername = ''; // Reset username được reply
                //     this.replyComment = ''; // Reset trạng thái reply
                // });
            } catch (error) {
                console.error('Error posting comment:', error);
            }
        }
        , getRandomNumber(min, max) {
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
                this.updatePost(post.content.POST_Id)
            } catch (error) { }
        },
        async updatePost(POST_Id) {
            const [updatedPostData] = (await AuthenticationService.APost(POST_Id)).data;
            const isCurrentUserLiked = updatedPostData.likes.includes(this.userid);

            this.postId = {
                ...updatedPostData,
                isHeartFilled: isCurrentUserLiked,
                activeIndex: 0,
                scrollTimeout: null,
                showFullContent: this.isContentOverFifteenWords(updatedPostData.content.POST_Content)
            }
            this.$emit('updatePost', this.postId)
        },
        isContentOverFifteenWords(content) {
            const words = content.split(' '); // Tách chuỗi thành mảng các từ
            return words.length > 15; // Kiểm tra xem mảng có nhiều hơn 15 từ hay không
        },

        async fetchComments() {
            try {
                const commentsData = (await AuthenticationService.getComment(this.postId.content.POST_Id)).data;
                this.comments = commentsData
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }, forceUpdate() {
            this.$forceUpdate(); // Buộc Vue render lại component
        }
    }, props: {
        userid: String,
        postId: Object,
        loadImgPost: Function,
        loadImgUser: Function,
        timeRequest: Function,
        goProfile: Function
    }, async mounted() {
        this.$nextTick(() => {
            this.forceUpdate();
        });
        // Đảm bảo socket tham gia đúng room
        socket.emit('joinPostRoom', { POST_ID: this.postId.content.POST_Id, USER_ID: this.userid });
        socket.on('updateComments', (data) => {
            console.log('Updated comments received:', data);
            this.comments = data; // Cập nhật comments
            this.textComment = ''; // Reset input
        });
    },
    beforeUnmount() {
        socket.emit('leavePostRoom', { POST_ID: this.postId.content.POST_Id, USER_ID: this.userid });
        socket.off('updateComments');
    }, watch: {
        textComment(value) {
            this.char = value.length;
        },
        postId: {
            handler(newValue) {
                if (newValue && newValue.content && newValue.content.POST_Id) {
                    this.fetchComments();
                    socket.emit('joinPostRoom', { POST_ID: newValue.content.POST_Id, USER_ID: this.userid });
                    socket.on('updateComments', (data) => {
                        console.log('Updated comments received:', data);
                        this.comments = data; // Cập nhật comments
                        this.textComment = ''; // Reset input
                    });
                }
            },
            immediate: true, // Kích hoạt khi component được mount
            deep: true, // Theo dõi thay đổi sâu trong object
        },
    }, beforeDestroy() {
        if (this.postId && this.postId.content && this.postId.content.POST_Id) {
            socket.emit("leavePostRoom", { POST_ID: this.postId.content.POST_Id, USER_ID: this.userid });
            socket.off('updateComments');
        }
    },
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
}

.comment .frame {
    overflow-y: scroll;
    scrollbar-width: none;
    width: 486px;
    height: 458px;
}


.comment .frame::-webkit-scrollbar {
    display: none;
}


.comment .user {
    display: flex;
    padding: 10px 15px 10px 20px;
}

hr {
    padding: 0;
    margin: 0;
    opacity: .1;
}

.comment>.user>.user-Avatar {
    width: 38px;
    height: 38px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 5px;
}

.comment>.user>.user-name {
    margin: 0;
    font-size: 13px;
    text-align: center;
    position: relative;
    top: 50%;
    transform: translate(10px, 2px);
    font-weight: 600;
    cursor: pointer;
}

.comment>.user>.content-comment {
    position: relative;
    top: 50%;
    transform: translate(10px, 2px);
    margin-left: 3px;
}

.comment>.user>.content-comment>.tag-name {
    color: rgb(17, 64, 151);
    cursor: pointer;
}

.comment-post-full-content {
    display: flex;
    flex-direction: column;
    height: 655.5px;
}

.user-comment {
    position: relative;
    display: flex;
    flex-direction: column;
    font-size: 13px;
}

.user-comment .user {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

.user-comment .user .user-avatar {
    height: 45px;
    width: 45px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 5px;
}

.user-comment .user .user-comment-info {
    width: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.user-comment .user .user-comment-info .user-comment-content span:first-child {
    cursor: pointer;
    font-weight: 600;
}

.user-comment .user .user-comment-info .user-comment-content .hashtags {
    cursor: pointer;
    color: #004c93;
}

.user-comment .user .user-comment-info .user-comment-order {
    display: flex;
    gap: 8px;
}

.user-comment .user .user-comment-info .user-comment-order p {
    font-size: 12px;
    color: #737373;
    margin: 0;
}

.user-comment .user .user-comment-info .user-comment-order label {
    color: #737373;
    font-weight: 500;
    cursor: pointer;
}

.user-comment .user .user-comment-info .view-option {
    color: #737373;
    font-weight: 500;
    cursor: pointer;
    align-items: center;
    display: flex;
    gap: 28px;
}

.user-comment .user .user-comment-info .view-option .line-center {
    width: 24px;
    height: .1px;
    background-color: #000000;
}

.excute {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.excute .icons {
    margin: 0;
    padding: 8px 22px 8px 22px;
    font-size: 24px;
    -webkit-text-stroke: 0.7px;
    cursor: pointer;
    transition: all 0.5s ease;
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
    padding: 0 22px 0 22px;
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
    align-items: center;
    height: 100%;
}

.excute .addComment input {
    margin-left: 22px;
    height: 100%;
    border: none;
    font-size: 14px;
    width: 90%;
}

.excute .addComment .btn-post {
    border: none;
    background-color: transparent;
    padding-right: 22px;
    height: 100%;
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

.reple-to {
    color: rgb(17, 64, 151) !important;
    cursor: pointer;
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
