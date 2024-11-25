<template>
    <section class="py-4">
        <div class="container ">
            <div class="row d-flex align-items-center justify-content-center">
                <div style="max-width:420px;">
                    <form action="/home" autocomplete="off" class="bg-white border py-4 px-5" method="post">
                        <div class="text-center mb-3">
                            <img src="../assets/img_logo/logo.png" alt="" style="width: 25%;" class="py-4">
                            <p class="text-muted opacity-100">
                                Sign up to see photos and videos from your friends.
                            </p>
                        </div>
                        <div class="mb-3">
                            <a class="btn btn-primary d-block bg-gradient" href="#"><i class="fab fa-facebook"></i> Log
                                in
                                with facebook</a>
                            <p class="my-3 text-center or">
                                - OR -
                            </p>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control .bg-light" name="email" v-model="email"
                                placeholder="Mobile Number or Email" required="" type="email" /><label>Email</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" name="username" v-model="username" placeholder="Username"
                                required="" type="text" /><label>Username</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" name="password" v-model="password" placeholder="Password"
                                required="" type="password" /><label>Password</label>
                        </div>

                        <div class="form-floating mb-3">
                            <input class="form-control" name="repassword" v-model="repassword" placeholder="Password"
                                required="" type="password" /><label>Enter again Password</label>
                        </div>

                        <div v-html="error" class="error"></div>

                        <div class="mb-2">
                            <button @click.prevent @click="register"
                                class="btn btn-primary fw-bold w-100 bg-gradient">Sign
                                Up</button>
                        </div>
                        <div class="small text-center">
                            By signing up, you agree to our Terms , Data Policy and Cookies Policy.
                        </div>
                    </form>
                    <div class="bg-white py-4 px-5 text-center border mt-4 box-link">
                        <p class="m-0">
                            Have an account? <router-link to="/">Log In</router-link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    </section>
</template>

<script>
import Footer from '../components/Footer.vue';
import AuthenticationSevice from '../services/AuthenticationService'
export default {
    data() {
        return {
            id: '',
            email: '',
            fullname: '',
            username: '',
            password: '',
            repassword: '',
            error: '',
            status: '',
        }
    }, methods: {
        async register() {
            await AuthenticationSevice.register({
                "USER_Id": this.id,
                "USER_AccountName": this.username,
                "USER_Email": this.email,
                "USER_Password": this.password,
                "repassword": this.repassword,
                "USER_UpdateAt": "0"
            }).then(response => {
                this.error = response.data.error;
                this.status = response.data.status;
                if (response.data.status === "successful") {
                    this.$router.push(`/information/${this.id}`)
                }
            });
        }
    }, components: {
        Footer,
    }, mounted() {
        function makeRandomId(length) {
            let result = ''
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
        const randomLenght = Math.floor(Math.random() * 30);
        this.id = makeRandomId(randomLenght);
    }
}
</script>

<style>
label {
    opacity: .5;
}

.error {
    color: red;
    text-align: center;
    padding-bottom: 15px;
}

.box-link {
    margin-bottom: 30px;
}
</style>
