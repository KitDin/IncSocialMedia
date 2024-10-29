<template>
    <div class="alert-component">
        <div class="alert-header">
            <p>Xác nhận</p>
            <i class="bi bi-x" @click="closeAlert"></i>
        </div>
        <div class="alert-btn">
            <button class="green" v-if="SetUpAlert === 1" @click="acceptAlert">Oke</button>
            <button class="red" v-if="SetUpAlert === 2" @click="deleteAlert">Xoá</button>
            <button class="nomal" @click="closeAlert">Huỷ</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    }
    , props: {
        SetUpAlert: {
            type: Number,
            default: 1
        }, dataAlert: {
            type: Object
        }, action: {
            type: String,
        }
    }, methods: {
        deleteAlert() {
            this.$emit(this.action, this.dataAlert)
        }, acceptAlert() {
            this.$emit(`${this.action}`, this.dataAlert)
        }, closeAlert() {
            this.$emit('closeAlert')
        }
    }
}
</script>

<style>
.alert-component {
    position: fixed;
    top: 50%;
    left: 50%;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: -20px -20px 60px #bebebe,
        20px 20px 60px #ffffff;
    width: 200px;
    -webkit-animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    transform: translate(-50%, -50%) !important;
}

@-webkit-keyframes slide-in-fwd-center {
    0% {
        -webkit-transform: translateZ(-1400px);
        transform: translateZ(-1400px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

@keyframes slide-in-fwd-center {
    0% {
        -webkit-transform: translateZ(-1400px);
        transform: translateZ(-1400px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

.alert-component .alert-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45px;
    border-bottom: 1px solid silver;
    font-weight: 600;
}

.alert-component .alert-header p {
    margin: 0;
}

.alert-component .alert-header i {
    position: absolute;
    right: 15px;
    font-size: 25px;
    cursor: pointer;
}

.alert-component .alert-btn {
    display: flex;
    justify-content: space-evenly;
}

.alert-component .alert-btn button {
    border: none;
    border-radius: 12px;
    padding: 6px 28px;
    margin: 18px 0 12px 0;
    transition: all .5s ease-in-out;
}

.alert-component .alert-btn .red {
    background-color: rgba(255, 0, 0, 0.534);
    color: #ffffff;
}

.alert-component .alert-btn .green {
    background-color: rgba(0, 149, 255, 0.534);
    color: #ffffff;
}

.alert-component .alert-btn .green:hover {
    background-color: rgba(0, 149, 255, 0.836);
}

.alert-component .alert-btn .red:hover {
    background-color: rgba(255, 0, 0, 0.795);
}

.alert-component .alert-btn .nomal:hover {
    background-color: #86868684;
}
</style>