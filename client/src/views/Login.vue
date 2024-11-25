<template>
    <section class="py-4">
        <div v-if="isTrueSignUp" class="dataMess">You have successfully completed your registration.</div>
        <div v-show="!isLoadingPage" class="container ">
            <div class="row d-flex align-items-center justify-content-center">
                <div style="max-width:420px;">
                    <form action="/home" autocomplete="off" class="bg-white border py-4 px-5" method="get">
                        <div class="text-center mb-3">
                            <img src="../assets/img_logo/logo.png" alt="" style="width: 25%;" class="py-4">
                        </div>

                        <div class="form-floating mb-3">
                            <input class="form-control .bg-light" name="email" v-model="email"
                                placeholder="Mobile Number or Email" required="" type="email" /><label>Email</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" name="password" v-model="password" placeholder="Password"
                                required="" type="password" /><label>Password</label>
                        </div>

                        <div v-html="error" class="error"></div>

                        <div class="mb-2">
                            <button @click.prevent @click="login()" @enter="login"
                                class="btn btn-primary fw-bold w-100 bg-gradient">Sign
                                Up</button>
                        </div>
                        <div class="mb-3 text-center">
                            <p class="my-3">- OR -</p>
                            <a class="LoginFb" href="#"><i class="bi bi-facebook"></i> Log in
                                with facebook</a><br><br>
                            <a class="Forgetpw" href="#">Forgot password?</a>
                        </div>
                    </form>
                    <div class="bg-white py-4 px-5 text-center border mt-4 join">
                        <p class="m-0">
                            Want to join? <router-link to="/register">Join up now</router-link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
        <LoadingPage v-show="isLoadingPage" class="loading-page-login" />
        <router-view />
    </section>
</template>

<script>
import AuthenticationSevice from '../services/AuthenticationService'
import Footer from "../components/Footer.vue";
import LoadingPage from '../components/Loading.vue';

export default {
    data() {
        return {
            email: '',
            password: '',
            user: '',
            error: '',
            status: '',
            isTrueSignUp: false,
            isLoadingPage: false
        }
    }, methods: {
        async login() {
            await AuthenticationSevice.login({
                "email": this.email,
                "password": this.password,
            }).then(response => {
                this.error = response.data.error;
                this.status = response.data.status;
                localStorage.setItem("token", response.data.assetToken);
                if (response.data.status === "successful" && response.status === 200) {
                    // this.user = response.data.user.USER_Id;
                    this.isLoadingPage = true

                    setTimeout(() => {
                        this.$router.push("/home")
                        this.isLoadingPage = false

                    }, 2500)
                }
            });
        }
    }, mounted() {
        if (this.$route.query.sp) {
            this.isTrueSignUp = true; // Ẩn hoặc điều chỉnh giao diện đăng ký
            setTimeout(() => {
                this.isTrueSignUp = false; // Ẩn hoặc điều chỉnh giao diện đăng ký
            }, 3000)
        } else {
            this.isTrueSignUp = false; // Giao diện mặc định nếu không có tham số
        }
    }, components: {
        Footer, LoadingPage
    }
}
</script>

<style scoped>
.loading-page-login {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.dataMess {
    background-color: #00b9f6;
    height: 40px;
    width: 100%;
    position: fixed;
    z-index: 111111111;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    -webkit-animation: scale-up-ver-top 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: scale-up-ver-top 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}


@-webkit-keyframes scale-up-ver-top {
    0% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
    }

    100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
    }
}

@keyframes scale-up-ver-top {
    0% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
    }

    100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
    }
}

label {
    opacity: .5;
}

.error {
    color: red;
    text-align: center;
    padding-bottom: 15px;
}

.LoginFb {
    font-size: 16px;
    text-decoration: none;
    font-weight: 700;
}

.Forgetpw {
    font-size: 14px;
    text-decoration: none;
    color: gray;
}

.join {
    margin-bottom: 30px !important;
}
</style>
