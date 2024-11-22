<template>
    <div class="edit-frame">
        <div v-if="showLoader" class="loader"></div>
        <Nav></Nav>
        <div class="edit-profile">
            <h2>Edit profile</h2>
            <!-- Profile Picture and Username Section -->
            <div class="profile-header">
                <div class="profile">
                    <div class="profile-photo">
                        <img :class="{ 'black-loading': isLoadingAvatar }" :src="loadimgpost(user.USER_AvatarURL)"
                            alt="Profile Photo" @click="changePhoto" />
                        <LoadingPage v-if="isLoadingAvatar" class="sub-class" :isWhite="true" />
                        <input type="file" @change="onFileChange" ref="fileInput" style="display: none;" />
                    </div>
                    <div class="profile-info">
                        <h3>{{ originalUser.USER_NickName }}</h3>
                        <p>{{ originalUser.USER_FirstName + " " + originalUser.USER_SubName }}</p>
                    </div>
                </div>
                <button @click="changePhoto" class="btn-change-photo">Change photo</button>
            </div>

            <!-- Nickname section -->
            <div class="form-group">
                <label for="Name">Nick name</label>
                <input type="text" id="nickname" placeholder="" v-model="user.USER_NickName"></input>
                <p class="note">You'll need to wait 14 more days before updating your nickname again.</p>
            </div>

            <!-- name section -->
            <div class="form-group input-2-col">
                <div>
                    <label for="fn">First name</label>
                    <input type="text" id="fn" v-model="user.USER_FirstName"></input>
                </div>
                <div>
                    <label for="ln">Last name</label>
                    <input type="text" id="ln" v-model="user.USER_SubName"></input>
                </div>
            </div>

            <!-- Bio Section -->
            <div class="form-group">
                <label for="bio">Bio</label>
                <textarea id="bio" placeholder="Bio" v-model="user.USER_Bio" maxlength="200"></textarea>
                <p class="character-count">{{ user.USER_Bio.length }} / 200</p>
            </div>

            <div class="gender-dropdown" ref="dropdown" @click="toggleDropdown()">
                <label for="gender">Gender</label>
                <input type="text" v-model="selectedGenderLabel" id="gender" readonly placeholder="Select Gender"
                    class="dropdown-input" />
                <div v-if="isDropdownOpen" class="dropdown-menu-gender">
                    <div v-for="(label, value) in genderOptions" :key="value" class="dropdown-gender-item"
                        @click="updateGender(value)">
                        <p class="label-gender">{{ label }}</p>
                        <div class="icon-tick"><i v-if="user.USER_Gender === value" class="bi bi-check-circle-fill"></i>
                        </div>
                    </div>
                </div>
                <p class="note">This will be part of your public profile.</p>
            </div>
            <div class="btn-frame">
                <button class="btn-edit" :disabled="isSubmitDisabled" :class="{ 'active-abled': !isSubmitDisabled }"
                    @click="submitUpdate">Submit</button>
            </div>

        </div>
        <Footer class="footer"></Footer>
        <div v-if="isAnnountion" class="annountion">{{ messageAnnoution }}</div>
        <Bur v-show="editAlert" @closeBur="closeOptionChoose" />
        <optionChoose v-if="editAlert" :textBtnTrue="'Upload photo'" :textBtnFalse="'Remove current photo'"
            :title="'Change Profile Photo'" @actionCancel="closeOptionChoose" @actionTrue="updateAvatar" />

    </div>
</template>

<script>
import Nav from '../components/Nav'
import Footer from '../components/Footer.vue'
import AuthenticationService from '../services/AuthenticationService';
import optionChoose from '../components/editProfile/optionChoose.vue';
import Bur from '../components/Bur.vue';
import LoadingPage from '../components/LoadingPage.vue';
export default {
    data() {
        return {
            user: [],
            gender: 0,
            isDropdownOpen: false,
            genderOptions: {
                Female: "Female",
                Male: "Male",
            },
            isAnnountion: false,
            editAlert: false,
            selectedFile: null,
            messageAnnoution: "Hello",
            originalUser: {},
            isLoadingAvatar: false, showLoader: false
        };
    }, computed: {
        selectedGenderLabel() {
            return this.genderOptions[this.user.USER_Gender];
        }, isSubmitDisabled() {
            return (
                this.user.USER_NickName === this.originalUser.USER_NickName &&
                this.user.USER_FirstName === this.originalUser.USER_FirstName &&
                this.user.USER_SubName === this.originalUser.USER_SubName &&
                this.user.USER_Bio === this.originalUser.USER_Bio &&
                this.user.USER_Gender === this.originalUser.USER_Gender
            );
        },
    }, async mounted() {
        const token = localStorage.getItem("token");
        let userId = ''
        if (token) {
            // Nếu có token, có thể gửi yêu cầu đến máy chủ để xác thực token
            const response = await AuthenticationService.verifyToken(token);
            if (response.status !== 200) {
                // Nếu token không hợp lệ, điều hướng đến trang đăng nhập
                localStorage.removeItem("token");
                this.$router.push("/");
            }
            userId = response.data.userId
        } else {
            // Nếu không có token, điều hướng đến trang đăng nhập
            this.$router.push("/");
        }
        this.freshData(userId)
        document.addEventListener("click", this.handleClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleClickOutside);
    },
    methods: {
        async freshData(userId) {
            const userData = (await AuthenticationService.getUser(userId)).data;
            this.user = { ...userData }; // Gán dữ liệu vào user
            this.originalUser = { ...userData }; // Lưu bản sao gốc
        },
        submitUpdate() {
            this.showLoader = true
            setTimeout(async () => {
                this.showLoader = false
                this.isAnnountion = true
                const updateInfo = (await AuthenticationService.updateAllInfo(this.user.USER_Id, this.user)).data
                this.freshData(this.user.USER_Id)
                this.messageAnnoution = updateInfo.message
                setTimeout(() => {
                    this.messageAnnoution = ''
                    this.isAnnountion = false
                }, 3000)
            }, 2000)
        },
        async onFileChange(event) {
            this.selectedFile = event.target.files[0];
            this.isLoadingAvatar = true
            this.editAlert = false
            setTimeout(async () => {
                if (this.selectedFile) {
                    const formData = new FormData();
                    this.isAnnountion = true
                    this.isLoadingAvatar = false
                    formData.append("file", this.selectedFile);
                    const data = (await AuthenticationService.updateAvatar(this.user.USER_Id, formData)).data
                    this.messageAnnoution = data.message
                    setTimeout(() => {
                        this.messageAnnoution = ''
                        this.isAnnountion = false
                    }, 3000)
                }
            }, 2000)
        },
        closeOptionChoose() {
            this.editAlert = false
        },
        loadimgpost(images) {
            if (images) {
                return require(`../../../server/public/uploads/avatar/${images}`);
            }
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        updateGender(value) {
            this.user.USER_Gender = value
        }, async updateAvatar() {
            this.$refs.fileInput.click();
        }
        , async changePhoto() {
            this.editAlert = true
        }, handleClickOutside(event) {
            if (!this.$refs.dropdown.contains(event.target)) {
                this.closeDropdown();
            }
        }, closeDropdown() {
            this.isDropdownOpen = false;
        },
    }, components: {
        Nav, Footer, optionChoose, Bur, LoadingPage
    }
}
</script>

<style scoped>
.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.8));
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

.edit-profile {
    position: relative;
    width: calc(1024px/1.5);
    margin: 0 100px;
    padding: 30px 20px 30px;
    left: 50%;
    transform: translateX(-50%);
}

h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    justify-content: space-between;
    background: #EFEFEF;
    padding: 18px;
    border-radius: 20px;
}

.profile {
    display: flex;
    align-items: center;
    gap: 18px;
}

.profile-photo {
    width: 54px;
    height: 54px;
    position: relative;
}

.profile-photo img {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    transition: filter 0.3s;
}

.sub-class {
    position: absolute;
    top: 3px;
    left: 17px;
}

.profile-photo img.black-loading,
.profile-photo img:hover {
    filter: brightness(0.7);
}

.profile-info h3 {
    margin: 0;
    font-size: 18px;
}

.profile-info p {
    color: #888;
    margin: 0;
}

.btn-change-photo {
    font-size: 14px;
    background-color: #0095f6;
    color: white;
    border: none;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 8px;
    cursor: pointer;
}

.btn-change-photo:hover {
    background-color: #0089e5;
}

.form-group {
    margin-bottom: 20px;
}

.input-2-col {
    display: flex;
    gap: 15px;
}

.input-2-col div {
    width: calc(100%/2);
}

label {
    font-weight: bold;
    display: block;
    margin-bottom: 8px;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 12px;
    font-size: 14px;
}

textarea {
    height: 80px;
    resize: none;
}

.note {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
}

.character-count {
    text-align: right;
    font-size: 12px;
    color: #888;
}

.toggle-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 20px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #0095f6;
}

input:checked+.slider:before {
    transform: translateX(20px);
}

.footer {
    position: relative !important;
    left: 50%;
    transform: translateX(-40%);
    width: 1024px;
}

.gender-dropdown {
    position: relative;
    margin-bottom: 20px;
}

.dropdown-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}

.dropdown-menu-gender {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 50%;
    height: fit-content;
    top: -80%;
    right: 0;
    margin-top: 5px;
    z-index: 10;
}

.dropdown-gender-item {
    padding: 14px;
    display: flex;
    cursor: pointer;
    justify-content: space-between;
}

.dropdown-gender-item p {
    margin: 0;
}

.dropdown-gender-item div {
    width: 24px;
    height: 24px;
    border: 1px solid black;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.dropdown-gender-item div i {
    font-size: 24px;
    /* opacity: .4; */
}

.dropdown-gender-item:hover {
    background-color: #f1f1f1;
}

.custom-input {
    padding: 8px;
    margin-top: 5px;
    cursor: pointer;
}

.note {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
}

.btn-frame {
    width: 100%;
    display: flex;
    justify-content: end;
}

.btn-edit {
    background-color: #0094f663;
    border: none;
    padding: 10px 104px;
    border-radius: 8px;
    font-weight: 500;
    color: #EFEFEF;
}


.btn-edit.active-abled {
    background-color: #0094f6;
    cursor: pointer;
}

.annountion {
    position: fixed;
    color: #f0f0f0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 24px;
    height: 45px;
    width: 100%;
    background-color: #020202;
    bottom: 0;
    left: 0;
    z-index: 1000000000000;
    -webkit-animation: scale-up-ver-bottom 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: scale-up-ver-bottom 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

.scale-out-ver-bottom {
    -webkit-animation: scale-out-ver-bottom 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    animation: scale-out-ver-bottom 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

@keyframes scale-out-ver-bottom {
    0% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 0% 100%;
        transform-origin: 0% 100%;
        opacity: 1;
    }

    100% {
        -webkit-transform: scaleY(0);
        transform: scaleY(0);
        -webkit-transform-origin: 0% 100%;
        transform-origin: 0% 100%;
        opacity: 1;
    }
}

@keyframes scale-up-ver-bottom {
    0% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
        -webkit-transform-origin: 0% 100%;
        transform-origin: 0% 100%;
    }

    100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 0% 100%;
        transform-origin: 0% 100%;
    }
}
</style>