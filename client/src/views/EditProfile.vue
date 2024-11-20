<template>
    <div class="edit-frame">
        <Nav></Nav>
        <div class="edit-profile">
            <h2>Edit profile</h2>

            <!-- Profile Picture and Username Section -->
            <div class="profile-header">
                <div class="profile">
                    <div class="profile-photo">
                        <img :src="profileImage" alt="Profile Photo" />
                    </div>
                    <div class="profile-info">
                        <h3>{{ username }}</h3>
                        <p>{{ name }}</p>
                    </div>

                </div>
                <button @click="changePhoto" class="btn-change-photo">Change photo</button>
            </div>

            <!-- Nickname section -->
            <div class="form-group">
                <label for="Name">Nick name</label>
                <input type="text" id="bio" placeholder="Bio" v-model="nickname" maxlength="150"></input>
            </div>

            <!-- name section -->
            <div class="form-group input-2-col">
                <div>
                    <label for="fn">First name</label>
                    <input type="text" id="fn" v-model="firstName" maxlength="150"></input>
                </div>
                <div>
                    <label for="ln">Last name</label>
                    <input type="text" id="ln" v-model="lastName" maxlength="150"></input>
                </div>
            </div>

            <!-- Bio Section -->
            <div class="form-group">
                <label for="bio">Bio</label>
                <textarea id="bio" placeholder="Bio" v-model="bio" maxlength="200"></textarea>
                <p class="character-count">{{ bio.length }} / 200</p>
            </div>

            <div class="gender-dropdown" ref="dropdown" @click="toggleDropdown()">
                <label for="gender">Gender</label>
                <input type="text" v-model="selectedGenderLabel" id="gender" readonly placeholder="Select Gender"
                    class="dropdown-input" />
                <div v-if="isDropdownOpen" class="dropdown-menu-gender">
                    <div v-for="(label, value) in genderOptions" :key="value" class="dropdown-gender-item"
                        @click="updateGender(value)">
                        <p class="label-gender">{{ label }}</p>
                        <div class="icon-tick"><i v-if="selectedGender === value" class="bi bi-check-circle-fill"></i>
                        </div>
                    </div>
                </div>
                <p class="note">This won’t be part of your public profile.</p>
            </div>
            <div class="btn-frame">
                <button class="btn-edit">Submit</button>
            </div>
        </div>
        <Footer class="footer"></Footer>
    </div>
</template>

<script>
import Nav from '../components/Nav'
import Footer from '../components/Footer.vue'
export default {
    data() {
        return {
            profileImage: "https://via.placeholder.com/150", // Replace with actual profile image URL
            username: "dung_choa_dom",
            nickname: "Đốm",
            firstName: 'Trần',
            lastName: "Dũng",
            bio: "Once you stop learning, you will start dying.",
            gender: 0,
            isDropdownOpen: false,
            selectedGender: "male", // Default selection
            genderOptions: {
                female: "Female",
                male: "Male",
            },
        };
    }, computed: {
        selectedGenderLabel() {
            return this.genderOptions[this.selectedGender];
        },
    }, mounted() {
        document.addEventListener("click", this.handleClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleClickOutside);
    },
    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        updateGender(value) {
            this.selectedGender = value
        }, changePhoto() {
            alert("Change photo functionality coming soon!");
        }, handleClickOutside(event) {
            if (!this.$refs.dropdown.contains(event.target)) {
                this.closeDropdown();
            }
        }, closeDropdown() {
            this.isDropdownOpen = false;
        },
    }, components: {
        Nav, Footer
    }
}
</script>

<style scoped>
.edit-profile {
    position: relative;
    /* left: 246px; */
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

.profile-photo img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #ddd;
    cursor: pointer;
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
    background-color: #0094f667;
    border: none;
    padding: 10px 104px;
    border-radius: 8px;
    font-weight: 500;
    color: #EFEFEF;
}
</style>