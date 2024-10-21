<template>
    <div class="frame-post">
        <div class="prevent" @click="showPost()">
            <i class="bi bi-x-lg" @click.stop="showPost()"></i>
        </div>
        <form @submit.prevent="submitForm" method="POST" enctype="multipart/form-data">

            <div class="choose-img" v-if="imageUrl.length === 0">
                <div class="tittle">
                    <p>Create new post</p>
                </div>
                <div class="content">
                    <i class="bi bi-images"></i>
                    <p>Drag photos and videos here</p>
                    <input ref="file" type="file" class="input-img" id="img" name="img" multiple
                        @change="handleFileUpload">
                    <label class="label-img" for="img">Select from computer</label>
                </div>
            </div>
            <div class="choose-img char" v-show="imageUrl.length === 0">
                <div class="tittle tittle-char">
                    <p class="move" @click="turnOfChar">V</p>
                    <p>Create new post</p>
                    <button type="submit" class="share">Share</button>
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
                                    <i class="bi bi-chevron-down res-down"
                                        :class="showSelectFrame ? 'res-down' : ''"></i>
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
                            <textarea v-model="textarea" placeholder="Write a caption..." name="textarea" id="textarea"
                                class="more-text" :oninput="change()"></textarea>
                            <div class="more-option">
                                <p class="hashtag">#</p>
                                <p class="limit-char" :class="!changeColorLimit ? `color-limit` : `change-color-limit`">
                                    {{
                                        char
                                    }}/2.200</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hash-tag-selected"></div>
        </form>

    </div>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService';

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
            selected: { label: "Public", value: "Public", icon: "bi bi-globe-asia-australia" },
            options: [
                { label: "Public", value: "Public", icon: "bi bi-globe-asia-australia" },
                { label: "Private", value: "Private", icon: "bi bi-person-lock" }
            ],
            showSelectFrame: false,
        }
    }, methods: {
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
            const formData = new FormData();
            for (let i = 0; i < this.imageUrl.length; i++) {
                const file = this.dataURItoBlob(this.imageUrl[i]); // Chuyển base64 thành dạng Blob
                formData.append('file', file);
            }
            formData.append('POST_Id', this.uuid());
            formData.append('USER_Id', this.userid);
            formData.append('POST_Content', this.textarea)
            formData.append('POST_AccessModifies', this.selected.value)
            try {
                await AuthenticationService.uploadImgPost(formData);
                this.imageUrl = [];
                this.textarea = '';
                this.$emit('closePost');
            } catch (error) {
                console.log(error);
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
        textarea(value) {
            this.char = value.length;
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
            this.userid = response.data.userId
        } else {
            // Nếu không có token, điều hướng đến trang đăng nhập
            this.$router.push("/");
        }
        this.user = (await AuthenticationService.getUser(this.userid)).data
        console.log(this.user)
    }
}
</script>

<style>
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
    padding: 6px 0;
    padding-right: 26px;
    padding-left: 26px;
}

.frame-select .select .option:last-child {
    border-top: 1px silver solid;
}

.frame-select .select .option:hover {
    background-color: rgba(0, 0, 0, 0.1);
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

.frame-post .choose-img {
    transition: 0.5s ease-in-out;
}

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
    padding: 0 16px;
    display: flex;
    flex-direction: column;
}

.status .more .more-text::placeholder {
    color: silver;
}

.status .more .more-text {
    border: 0;
    width: 100%;
    height: 170px;
    resize: none;
    border-bottom: silver 1px solid;
    margin-bottom: 4px;
}

.content-char .status .more .more-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
}

.content-char .status .more .more-option .hashtag {
    font-size: 14px;
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