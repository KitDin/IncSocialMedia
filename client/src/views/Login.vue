<template>
    <section class="py-4">
        <div class="container ">
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
                            <button @click.prevent @click="login()" class="btn btn-primary fw-bold w-100 bg-gradient">Sign
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
        <router-view />
    </section>
</template>

<script>
import AuthenticationSevice from '../services/AuthenticationService'
import Footer from "../components/Footer.vue";

export default {
    data() {
        return {
            email: '',
            password: '',
            user: '',
            error: '',
            status: '',
        }
    }, methods: {
        async login() {
            await AuthenticationSevice.login({
                "email": this.email,
                "password": this.password,
            }).then(response => {
                this.error = response.data.error;
                this.status = response.data.status;
                if (response.data.status === "successful" && response.status === 200) {
                    this.user = response.data.user.USER_Id,
                        this.$router.push(
                            {
                                name: `Home`,
                                params: { id: this.user }
                            }
                        )
                } console.log(response);
            });
        }
    }, components: {
        Footer
    }
}
</script>

<style scoped>
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
