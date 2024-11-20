<template>
    <div class="frame-post">
        <div v-if="isLoadingSubmit" class="loader"></div>

        <div class="prevent" @click="showPost()">
            <i class="bi bi-x-lg" @click.stop="showPost()"></i>
        </div>

        <div class="choose-img" v-if="imageUrl.length === 0">
            <div class="tittle">
                <p>Create new post</p>
            </div>
            <div class="content">
                <i class="bi bi-images"></i>
                <p>Drag photos and videos here</p>
                <input ref="file" type="file" class="input-img" id="img" name="img" multiple @change="handleFileUpload">
                <label class="label-img" for="img">Select from computer</label>
            </div>
        </div>
        <div class="choose-img char" v-else>
            <div class="tittle tittle-char">
                <p class="move" @click="turnOfChar">V</p>
                <p>Create new post</p>
                <button type="button" @click="submitForm" class="share">Share</button>
            </div>
            <div class="content content-char">
                <div class="frame-img-post">
                    <div class="img-post-item" v-for="(image, index) in imageUrl" :key="index">
                        <img class="img-post" ref="file" :src="image" alt="Uploaded Image">
                    </div>
                </div>
                <div class="status">
                    <div class="infor">
                        <div>
                            <img class="user-avatar" :src="loadimg(user)" alt="">
                            <h4 class="user-name">{{ user.USER_NickName }}</h4>
                        </div>
                        <div class="frame-select">
                            <div class="selected" @click="showSelect">
                                <i class="icon-selected" :class="selected.icon"></i>
                                {{ selected.label }}
                                <i class="bi bi-chevron-down res-down" :class="showSelectFrame ? 'res-down' : ''"></i>
                            </div>

                            <div class="select" v-if="showSelectFrame"
                                :class="showSelectFrame ? 'scale-in-ver-top' : ''">
                                <div class="option" @click="chooseOption(option)" v-for="option in options"
                                    :key="option.label">
                                    <i class="icon-option" :class="option.icon"></i> {{ option.label }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="more">

                        <textarea v-model="textarea" ref="textarea" placeholder="Write a caption..." name="textarea"
                            id="textarea" class="more-text" :oninput="change()" @keyup="handleKeyup($event)"></textarea>
                        <div class="more-option">
                            <p class="hashtag" @click="openHashTags()">#</p>
                            <p class="limit-char" :class="!changeColorLimit ? `color-limit` : `change-color-limit`">
                                {{
                                    char
                                }}/2.200</p>
                        </div>
                        <HashTag v-if="isHashtag" :hashTags="hashTagsDataSearch" @getHasgTag='getHasgTag'
                            :isLoading="isLoading" :hashTagsRecommend="hashTagRecommend" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService';
import HashTag from '../components/HashTag.vue'
import { debounce } from 'lodash';

export default {
    data() {
        return {
            userid: '',
            imageUrl: [],
            user: [],
            changeColorLimit: false,
            textarea: '',
            char: 0,
            isImage: false,
            limit: 2200,
            showPostBar: false,
            isLoadingSubmit: false,
            selected: { label: "Public", value: "Public", icon: "bi bi-globe-asia-australia" },
            options: [
                { label: "Public", value: "Public", icon: "bi bi-globe-asia-australia" },
                { label: "Private", value: "Private", icon: "bi bi-person-lock" },
                { label: "Friends", value: "Friends Only", icon: "bi bi-people-fill" }
            ],
            showSelectFrame: false,
            isHashtag: false,
            hashTagRecommend: [],
            hashTagsDataSearch: [],
            hashTagsSelected: [],
            isLoading: true,
        }
    }, methods: {
        handleKeyup(event) {
            const cursorPosition = event.target.selectionStart;
            const textBeforeCursor = this.textarea.slice(0, cursorPosition);
            const textAfterCursor = this.textarea.slice(cursorPosition);

            // Xác định từ chứa con trỏ bằng cách tìm khoảng trắng hoặc đầu dòng
            const startOfWord = textBeforeCursor.lastIndexOf(" ") + 1;
            const endOfWord = textAfterCursor.indexOf(" ") === -1 ? this.textarea.length : cursorPosition + textAfterCursor.indexOf(" ");

            // Lấy từ hiện tại chứa con trỏ
            let currentWord = this.textarea.slice(startOfWord, endOfWord);

            // Kiểm tra xem từ chứa con trỏ có bắt đầu bằng # không
            if (currentWord.startsWith("#")) {
                this.isHashtag = true;
                this.isLoading = true; // Bật loading trước khi gọi API
                this.debouncedFetchHashtag(currentWord);
            } else {
                this.isHashtag = false;
            }
        },
        // Hàm debounce tìm kiếm hashtag
        debouncedFetchHashtag: debounce(async function (currentWord) {
            try {
                const hashtag = await AuthenticationService.getHashTag(currentWord);
                if (hashtag.data.status) {
                    this.hashTagsDataSearch = hashtag.data.hashtag;
                } else {
                    this.hashTagsDataSearch = [];
                }
            } catch (error) {
                console.error("Error fetching hashtags:", error);
            } finally {
                this.isLoading = false; // Tắt loading sau khi hoàn tất
            }
        }, Math.floor((Math.random() * 800) + 500)),
        getHasgTag(hashTag) {
            const cursorPosition = this.$refs.textarea.selectionStart;
            const textBeforeCursor = this.textarea.slice(0, cursorPosition);
            const textAfterCursor = this.textarea.slice(cursorPosition);

            // Xóa từ `#` hoặc `#abc` đang được nhập
            const startOfWord = textBeforeCursor.lastIndexOf(" ") + 1;
            this.textarea = textBeforeCursor.slice(0, startOfWord) + textAfterCursor;

            // Chèn hashtag đã chọn và một khoảng trắng
            this.textarea = this.textarea.slice(0, startOfWord) + hashTag.hashtag_name + " " + textAfterCursor;

            // Cập nhật danh sách hashtag đã chọn
            this.hashTagsSelected.push(hashTag);

            // Đặt lại `isHashtag` để ẩn danh sách hashtag
            this.isHashtag = false;
        },
        openHashTags() {
            this.isHashTag != this.isHashtag
            this.textarea += "#"
        },
        loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        },
        handleFileUpload() {
            const files = this.$refs.file.files;
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.imageUrl.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }, change() {
            if (this.char >= this.limit) {
                this.changeColorLimit = true
                this.textarea = this.textarea.substring(0, 20);
            } else {
                this.changeColorLimit = false
            }
        }, turnOfChar() {
            this.imageUrl = [];
            this.textarea = ''
        },
        async submitForm() {
            try {
                this.isLoadingSubmit = true;
                const textWithoutHashtags = this.textarea.replace(/#\w+/g, '').trim();
                const formData = new FormData();

                for (let i = 0; i < this.imageUrl.length; i++) {
                    const file = this.dataURItoBlob(this.imageUrl[i]);
                    formData.append('file', file);
                }

                formData.append('POST_Id', this.uuid());
                formData.append('USER_Id', this.userid);
                formData.append('POST_Content', textWithoutHashtags);
                formData.append('POST_AccessModifies', this.selected.value);
                formData.append('HashTags', JSON.stringify(this.hashTagsSelected));
                // Kiểm tra phản hồi từ API
                const response = await AuthenticationService.uploadImgPost(formData);
                console.log(response)
                if (response && response.data && response.data.status) {
                    this.imageUrl = [];
                    this.textarea = '';
                    this.$emit('closePost');
                    alert("Your post is live!")
                } else {
                    alert("Ohh!, " + response.data.message)
                }
            } catch (error) {
                console.error("Lỗi trong submitForm:", error);
                this.$emit('errorPost', 'Lỗi khi kết nối tới máy chủ.');
            } finally {
                this.isLoadingSubmit = false;
            }
        },
        dataURItoBlob(dataURI) {
            const byteString = atob(dataURI.split(',')[1]);
            const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        },
        uuid() {
            var temp_url = URL.createObjectURL(new Blob());
            var uuid = temp_url.toString();
            URL.revokeObjectURL(temp_url);
            return uuid.substr(uuid.lastIndexOf('/') + 1);
        }, showPost() {
            this.$emit('closePost');
        }, showSelect() {
            this.showSelectFrame = !this.showSelectFrame
        }, chooseOption(option) {
            this.selected = option
            this.showSelectFrame = false
        }
    }, watch: {
        textarea(newText) {
            this.char = newText.length;
            const hashtagsInTextarea = newText.match(/#\w+/g) || [];

            // So sánh hashTagsSelected với hashtagsInTextarea để cập nhật
            this.hashTagsSelected.forEach((tag, index) => {
                const tagIndexInTextarea = hashtagsInTextarea.indexOf(tag.hashtag_name);
                if (tagIndexInTextarea === -1) {
                    // Xóa một lần xuất hiện của hashtag khỏi hashTagsSelected nếu nó bị xóa khỏi textarea
                    this.hashTagsSelected.splice(index, 1);
                } else {
                    // Xóa hashtag từ hashtagsInTextarea để tránh kiểm tra trùng lặp sau
                    hashtagsInTextarea.splice(tagIndexInTextarea, 1);
                }
            });
        }
    }
    , async mounted() {
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
        this.hashTagRecommend = (await AuthenticationService.getRecommendHashtag(this.userid)).data
    }, components: { HashTag }
}
</script>

<style>
.hashtag-highlight {
    color: #1E90FF;
    /* Màu xanh dương cho hashtag */
    font-weight: bold;
}

.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-image: linear-gradient(90deg, transparent, rgb(0, 255, 221));
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

.res-down {
    transform: rotate(90deg) !important;
    transition: transform 0.3s ease;
}

.scale-in-ver-top {
    -webkit-animation: scale-in-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: scale-in-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
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

.frame-post .prevent {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.frame-post .prevent i {
    position: absolute;
    right: 25px;
    top: 15px;
    color: white;
    font-size: x-large;
    cursor: pointer;
}

.frame-select {
    position: relative;
    border: none;
    display: inline;
    font-size: 12px;
    margin-left: auto;
    margin-bottom: 2px;
    text-align: center;
    justify-items: center;
    cursor: pointer;
}

.frame-select .selected {
    font-size: 14px;
    border-radius: 5px;
    padding: 3px 0;
    padding-right: 15px;
    padding-left: 10px;
}

.frame-select .selected:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.frame-select .selected>i {
    font-size: 15px !important;
    margin-left: 3px;
}

.frame-select .selected .icon-selected {
    font-size: 15px !important;
    margin: 10px;
}

.frame-select .select {
    border-radius: 5px;
    position: absolute;
    z-index: 1000;
    border: 1px silver solid;
    transition: all 0.5 ease;
}

.frame-select .select .option {
    font-size: 13px;
    display: flex;
    padding: 6px 0;
    padding-right: 26px;
    padding-left: 26px;
    background-color: white;
    z-index: 5000;
}

.frame-select .select .option:nth-child(2),
.frame-select .select .option:last-child {
    border-top: 1px silver solid;
}

.frame-select .select .option:hover {
    background-color: rgb(244, 244, 244);
}


.frame-select .select .option .icon-option {
    font-size: 15px !important;
    padding-right: 10px;
}

.frame-post {
    width: 100%;
    height: 750px;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 1000;
}

.frame-post .choose-img {}

.frame-post .choose-img .tittle {
    margin-bottom: 25%;
    border-bottom: 0.5px solid silver;
}

.frame-post .choose-img .tittle p {
    margin: 0;
    font-size: 16px;
    padding: 8px;
    font-weight: 600;
}

.frame-post .choose-img {
    position: absolute;
    background-color: white;
    width: 510px;
    height: 545px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    text-align: center;
}

.frame-post .choose-img .content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.frame-post .choose-img i {
    font-size: 80px;
}

.frame-post .choose-img p {
    font-size: 20px;
}

.frame-post .choose-img .input-img {
    display: none;
}

.frame-post .choose-img .label-img {
    padding: 7px 16px;
    width: 171px;
    color: white;
    font-weight: 500;
    font-size: 14px;
    border-radius: 8px;
    background-color: #0095F6;
    cursor: pointer;
}

.frame-post .char {
    width: 849px;
    height: fit-content;
}


.frame-post .char .tittle-char {
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.frame-post .char .tittle-char .move {
    transform: rotate(90deg);
    cursor: pointer;
    font-weight: 800;
    margin-left: 8px;
}


.frame-post .char .tittle-char .share {
    font-weight: 500;
    color: #0095F6;
    margin-right: 12px;
    border: none;
    background-color: white;
    border-radius: 22px;
    cursor: pointer;
}

.frame-post .char .tittle-char .share:hover {
    color: #011f32;
}

.frame-post .char .content-char {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
}

.frame-post .char .content-char .frame-img-post {
    width: 509px;
    height: 510px;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;
    border-bottom-left-radius: 14px;

}

.frame-post .char .content-char .frame-img-post::-webkit-scrollbar {
    display: none;
}

.content-char .frame-img-post .img-post-item {
    scroll-snap-align: center;
}

.content-char .frame-img-post .img-post-item .img-post {
    width: 509px;
    height: 510px;
    object-fit: cover;
}

.content-char .status {
    height: 510px;
    width: 340px;
}

.status .infor {
    display: flex;
    margin: 0 16px 0;
    padding: 16px 0;
}

.status .infor .user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 16px;
    object-fit: cover;
}

.status .infor .user-name {
    font-size: 14px;
    margin: 0;
    display: contents;
}

.content-char .status .more {
    width: 100%;
    /* padding: 0 16px; */
    display: flex;
    flex-direction: column;
}

.status .more .more-text::placeholder {
    color: silver;
}

.status .more .more-text {
    padding: 0 16px;
    border: 0;
    width: 100%;
    height: 170px;
    resize: none;
    margin-bottom: 4px;
}

.content-char .status .more .more-option {
    display: flex;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    border-bottom: silver 1px solid;
}

.content-char .status .more .more-option .hashtag {
    font-size: 14px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    width: 28px;
    height: 28px;
    cursor: pointer;
}

.content-char .status .more .more-option .hashtag:hover {
    background-color: rgba(192, 192, 192, 0.3);
    border-radius: 50%;
}

.color-limit {
    color: silver;
}

.change-color-limit {
    color: rgb(167, 3, 3);
}

.content-char .status .more .limit-char {
    right: 16px;
    font-size: 14px;
    margin: 0;
}
</style>