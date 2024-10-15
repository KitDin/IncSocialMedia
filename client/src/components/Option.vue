<template>
    <div class="option-component">
        <ul class="options-list">
            <li @click.stop="confirmDel" :class="isConfirm ? 'scale-up-hor-right' : ''">
                <span class="" v-if="!isConfirm">Xoá</span>
                <span v-if="isConfirm" @click="deleteConversation"><i class="bi bi-check-lg"></i></span>
            </li>
            <!-- Bạn có thể thêm nhiều tùy chọn khác tại đây nếu cần -->
            <li class="option-time" v-if="!isConfirm">{{ formatTimeConversation(conversationTime) }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isConfirm: false,
        }
    },
    props: {
        conversationId: {
            type: String,
            required: true,
        }, conversationTime: {
            type: String,
            required: true,
        }, formatTimeConversation: {
            type: Function,
            required: true
        }
    },
    methods: {
        confirmDel() {
            this.isConfirm = !this.isConfirm
        },
        deleteConversation() {
            if (this.isConfirm) {
                this.$emit('delete-conversation', this.conversationId);
            }
        }
    }
};
</script>

<style scoped>
.option-time {
    width: max-content;
    height: fit-content;
    position: relative;
    font-size: 12px;
    bottom: 0;
    right: 0;
    margin: 0;
    border-top: #f0f0f0 1px solid;
    transition: width 2s, height 4s;
}

.option-component {
    width: max-content;
    height: fit-content;
    position: relative;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 5px;
    z-index: 100;
}

.options-list {
    width: max-content;
    height: fit-content;
    list-style: none;
    margin: 0;
    padding: 0;
}

.options-list li {
    padding: 10px;
    cursor: pointer;
}

.options-list li:hover {
    background-color: #f0f0f0;
}

.scale-up-hor-right {
    -webkit-animation: scale-up-hor-right 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: scale-up-hor-right 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    background-color: rgba(255, 0, 0, 0.527);
    color: red;
}

@-webkit-keyframes scale-up-hor-right {
    0% {
        -webkit-transform: scaleX(0.4);
        transform: scaleX(0.4);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }

    100% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }
}

@keyframes scale-up-hor-right {
    0% {
        -webkit-transform: scaleX(0.4);
        transform: scaleX(0.4);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }

    100% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }
}
</style>
