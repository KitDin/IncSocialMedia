<template>
    <div class="container-edit-alert">
        <div class="edit-alert-title">{{ title }}</div>
        <div class="btn-edit-true" @click="$emit('actionTrue')">{{ textBtnTrue }}</div>
        <!-- <div class="btn-edit-false" @click="$emit('actionFalse')">{{ textBtnFalse }}</div> -->
        <div class="btn-edit-cancel" @click="$emit('actionCancel')">Cancel</div>
    </div>
</template>

<script>
export default {
    props: {
        title: { type: String },
        textBtnTrue: { type: String },
        textBtnFalse: { type: String },
    }
}
</script>
<style>
.container-edit-alert {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    z-index: 10000;
    border-radius: 18px;
}

.container-edit-alert div {
    display: flex;
    justify-content: center;
}

.container-edit-alert div {
    padding: 13px 100px;
    font-size: 14px;

}

.container-edit-alert div:not(:first-child, :last-child) {
    font-weight: 600;
}

.container-edit-alert div:not(:first-child) {
    cursor: pointer;
}

.container-edit-alert div:not(:last-child) {
    border-bottom: 1px solid rgb(193, 193, 193);
}

.container-edit-alert .btn-edit-false {
    color: #ED4956;
}

.container-edit-alert .btn-edit-true {
    color: #0095F6;
}

.container-edit-alert div:first-child {
    padding: 24px 0px;
    font-size: 20px;
}
</style>