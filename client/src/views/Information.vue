<template>
    <div class="JoinUsForm">
        <div class="container-form">
            <img class="logo" src="../assets/img_logo/logo.png" alt="">
            <h3 class="tille">BECOME A INC MEMBER</h3>
            <p class="Terms" style="font-size: 13px;">Account unlocked! Spruce up your profile to hop into the INC social
                fun with amazing posts and a joyful community.</p>
            <form @submit.prevent="submitForm" method="POST" enctype="multipart/form-data">
                <div class="avatar">
                    <img class="img-avatar" v-if="imageUrl" :src="imageUrl" alt="Uploaded Image">
                    <input ref="file" type="file" class="file" id="avatar" name="avatar" @change="handleFileUpload">
                    <label class="button-file" for="avatar">Upload your avatar</label>
                </div>

                <!-- lấy user làm nick cũng dc. -->
                <input type="text" v-model="nickname" class="name nickname" id="nickname" name="nickname"
                    placeholder="Nick name">
                <input type="number" v-model="phone" class="email" id="phone" name="phone" placeholder="Number phone"
                    required>
                <div class="fullname">
                    <input type="text" v-model="firstname" class="email firstname" id="firstname" name="firstname"
                        placeholder="First Name">
                    <input type="text" v-model="subname" class="email subname" id="subname" name="subname"
                        placeholder="Sub Name">
                </div>
                <input type="date" v-model="bday" class="email" id="bday" name="bday" placeholder="Date of Birth" required>
                <div class="sex">
                    <i class="bi bi-check a" :style="{ display: isMale ? 'block' : 'none' }"></i>
                    <input type=" button" value="Male" @click="setGender('male')" :class="{ colorChange: isMale }"
                        class="male" name="male" placeholder="Male">
                    <i class="bi bi-check b" :style="{ display: !isMale ? 'block' : 'none' }"></i>
                    <input type="button" value="Female" @click="setGender('female')" :class="{ colorChange: !isMale }"
                        class="female" name="female" placeholder="Fermale">
                </div>
                <textarea style="height: 100px;" v-model="bio" class="email" id="bio" name="bio"
                    placeholder="Bio"></textarea>

                <label for="rememberMe" class="label">
                    <input type="checkbox" name="rememberMe" id="rememberMe">
                    <span class="text-span"> I'm confident that this is my accurate information when using it on the INC
                        social network.</span>
                </label>
                <p class="Terms">By entering your information, you agree to INC's <a href="">Privacy Policy</a> and <a
                        href="">Terms of Use</a>.</p>
                <button type="submit" name="btn-sbm-js" class="btn-sbm">JOIN US</button>
                <p class="Terms">No worries, I'll enter my information later! <a class="click-sign-in">Sign In</a>.</p>
            </form>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import AuthenticationService from '../services/AuthenticationService'
export default {
    data() {
        return {
            userid: this.$router.history.current.params.id,
            userName: '',
            nickname: '',
            firstname: '',
            subname: '',
            bday: '',
            bio: '',
            phone: '',
            isMale: true, // Mặc định là nam
            isAvatar: false,
            imageUrl: ''
        }
    }, methods: {
        setGender(gender) {
            this.isMale = gender === 'male';
        },
        handleFileUpload() {
            const file = this.$refs.file.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        async submitForm() {
            const formData = new FormData();
            formData.append('file', this.$refs.file.files[0]); // Sử dụng tên trường "file" để khớp với phía server
            formData.append("USER_Id", this.userid);
            formData.append("USER_NickName", this.nickname);
            formData.append("USER_FirstName", this.firstname);
            formData.append("USER_SubName", this.subname);
            formData.append("USER_NumberPhone", this.phone);
            formData.append("USER_BirthDay", this.bday);
            formData.append("USER_Bio", this.bio);
            formData.append("USER_Sex", this.sex);

            try {
                await AuthenticationService.uploadAvata(formData).then(response => {
                    // this.error = response.data.error;
                    this.status = response.data.status;
                    if (response.data.status === "successful") {
                        this.$router.push(`/home/${this.userid}`)
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
    ,
}

</script>
<style scoped>
.JoinUsForm {
    margin-top: 50px;
}

.JoinUsForm .container-form {
    position: relative;
    height: auto;
    width: 320px;
    margin: auto;
}

.JoinUsForm .logo {
    display: block;
    height: 40px;
    width: 50px;
    margin: auto auto 15px;
}

.JoinUsForm .tille {
    font-size: 18px;
    font-weight: 800;
    text-align: center;
}

.JoinUsForm .email,
.JoinUsForm .name {
    display: block;
    height: 36px;
    width: 305px;
    border-radius: 3px;
    border: #dcdcdc 1px solid;
    color: #b0afaf;
    margin: auto;
    margin-bottom: 15px;
    padding-left: 15px;
}

.JoinUsForm .name {
    margin-top: 30px;
}

.fullname {
    display: flex;
}

.fullname .subname,
.fullname .firstname {
    width: 45% !important;
}

.avatar {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: center;
    align-items: center;
}

.avatar .img-avatar {
    height: 120px;
    width: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
}

.avatar .file {
    display: none;
}

.avatar .button-file {
    color: rgb(0, 149, 246);
    font-weight: 700;
    cursor: pointer;
}

.avatar .button-file:hover {
    color: rgb(2, 87, 145);
}

input[type=checkbox] {
    /* Double-sized Checkboxes */
    -ms-transform: scale(2);
    /* IE */
    -moz-transform: scale(2);
    /* FF */
    -webkit-transform: scale(2);
    /* Safari and Chrome */
    -o-transform: scale(2);
    /* Opera */
    transform: scale(1.2);
    padding: 10px;
    position: absolute;
    left: 6px;
}

/*  */

.JoinUsForm .label {
    position: relative;
    display: flex;
    font-size: 11px;
    opacity: .7;
    margin: auto;
    text-align: center;
    align-items: flex-start;
}

.label .text-span {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 8px;
    padding-left: 25px;
}

.JoinUsForm .forgot {
    font-size: 12px;
    color: #000;
    opacity: .5;
    text-decoration: none;
    float: right;
    margin: auto;
    margin-top: 2px;
}

.JoinUsForm .Terms {
    margin-top: 28px;
    padding: 0 10px 0 10px;
    font-size: 12px;
    color: #000;
    opacity: .7;
    text-align: center;
}

.JoinUsForm .Terms a {
    color: #000;
}

.JoinUsForm .btn-sbm {
    margin-top: 28px;
    width: 100%;
    height: 36px;
    background-color: black;
    color: white;
    font-size: 12px;
    font-weight: bolder;
    border-radius: 5px;
    cursor: pointer;
}

.JoinUsForm .sex {
    display: flex;
    position: relative;
    justify-content: space-between;
    margin-bottom: 25px;
    padding: 0 6px 0;
}

.JoinUsForm .sex input {
    width: 46%;
    height: 36px;
    opacity: 0.3;
    border-radius: 3px;
    background-color: white;
}

.JoinUsForm .sex .a {
    position: absolute;
    font-size: 20px;
    font-weight: 600;
    transform: translateY(16%);
    display: none;
    left: 10%;
}


.JoinUsForm .sex .b {
    position: absolute;
    font-size: 20px;
    font-weight: 600;
    transform: translateY(16%);
    display: none;
    right: 34%;
}

.tickshow {
    display: block;
}

.inputshow {
    font-size: 15px;
}

.male {
    padding-left: 50px;
}

.female.colorChange,
.male.colorChange {
    border: #000 1px solid !important;
    opacity: 1 !important;
}

.btn-sbm-js {
    margin-top: 28px;
    width: 100%;
    height: 36px;
    background-color: #0d6efd;
    color: white;
    font-size: 12px;
    font-weight: bolder;
    border-radius: 5px;
    cursor: pointer;
}
</style>