<template>
    <div class="option-component">
        <ul class="options-list">
            <li @click="deleteConversation">Xoá</li>
            <!-- Bạn có thể thêm nhiều tùy chọn khác tại đây nếu cần -->
            <li class="option-time">{{ formatTimeConversation(conversationTime) }}</li>
        </ul>
    </div>
</template>

<script>
export default {
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
        deleteConversation() {
            this.$emit('delete-conversation', this.conversationId);
        }
    }
};
</script>

<style scoped>
.option-time {
    width: max-content;
    position: relative;
    font-size: 12px;
    bottom: 0;
    right: 0;
    margin: 0;
    border-top: #f0f0f0 1px solid;
}

.option-component {
    position: relative;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 5px;
    z-index: 100;
}

.options-list {
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
</style>
