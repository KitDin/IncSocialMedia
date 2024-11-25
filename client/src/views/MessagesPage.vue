<template>
    <div class="MessBody" style="">
        <Nav></Nav>
        <div id="MessagesFrame">
            <div id="ListUser">
                <h4 class="UserName">{{ currentUser.USER_NickName }} <i @click="isShowCreate = !isShowCreate"
                        class="bi bi-pencil-square icon-pencil"></i>
                </h4>

                <input class="input-search" type="text" placeholder="Tìm kiếm hội thoại ..." @input="searchConversation"
                    v-model="searchQuery">
                <p class="Title">Messages</p>
                <div v-if="conversations.length > 0" class="List">

                    <div v-if="!isNull" class="User" v-for="conversation in conversations" :key="conversation.CON_ID"
                        @click="getAllMessagesInAConversation(conversation.CON_ID, conversation.USER_ID)"
                        :ref="'conversation-' + conversation.CON_ID"
                        :class="conversation.CON_ID === deConversation ? 'choose' : ''">
                        <img class="ImgUser" :src="loadimg(conversation, 0)" alt="">
                        <div class="InforUser" :class="conversation.isUnread ? 'unread-text' : ''">
                            <div class="NameUser">{{ conversation.USER_NICKNAME }} <div v-show="conversation.isUnread"
                                    class="unread-message"></div>
                            </div>
                            <div class="NewMessages">
                                <p v-if="conversation.MESSAGE !== '&altH1' && conversation.MESSAGE !== null"> {{
                                    conversation.MESSAGE }}
                                    <span class="DotCenter">• {{
                                        formatTimeConversation(conversation.CREATED_AT)
                                    }}</span>
                                </p>
                                <p v-else-if="conversation.MESSAGE !== null">
                                    <i class="bi bi-heart-fill" style="color: red;"></i>
                                    <span class="DotCenter">• {{ formatTimeConversation(conversation.CREATED_AT)
                                        }}</span>
                                </p>
                                <p v-else>Chat Together, Create Our Own Stories!
                                </p>
                            </div>
                        </div>
                        <div class="three-dots" @click.stop="toggleOptionComponent(conversation.CON_ID)">
                            <i class="bi bi-three-dots-vertical icon-three-dot"></i>
                            <OptionComponent class="option-message"
                                v-show="activeConversationId === conversation.CON_ID"
                                :conversationId="conversation.CON_ID" :style="optionComponentStyles"
                                :conversationTime="conversation.CON_TIMECREATE" :formatTimeConversation="formatTime"
                                @delete-conversation="handleDeleteConversation" />
                        </div>

                        <!-- Hiển thị OptionComponent khi bấm vào nút ba chấm -->

                    </div>
                    <div class="User" v-if="isNull" style="padding: 15px 28px;color: darkgray;">
                        No conversation found!
                    </div>
                </div>

                <div v-else class="List">

                    <div class="noticeList" @click="">
                        <p class="any">You don't have any!</p>

                        <i class="bi bi-send-plus iconList"></i>

                        <div class="Your-messagesList" @click="isShowCreate = !isShowCreate">Start</div>
                    </div>


                </div>
            </div>


            <div id="Messages" v-if="receiverUserId">
                <div class="MessagesOfUser">
                    <img @click="goProfile(receiverUserId.USER_Id)" class="ImgUser" :src="loadimg(receiverUserId, 1)"
                        alt="">
                    <div class="InforUser">
                        <div @click="goProfile(receiverUserId.USER_Id)" class="UserName">{{ receiverUserId.USER_NickName
                            }}</div>
                        <i class="bi bi-info-circle"></i>
                    </div>
                </div>

                <div class="Conversation" ref="messageContainer" @scroll="handleScroll">

                    <div v-if="showInformationReceiverUser" class="messInfor">
                        <div class="messFr">
                            <img class="messInforAvatar" :src="loadimg(receiverUserId, 1)" alt="">
                            <div class="messInforNickName">{{ receiverUserId.USER_NickName }}</div>
                            <div class="messInforSubFirst">{{ receiverUserId.USER_SubName + " " +
                                receiverUserId.USER_FirstName }}</div>
                            <div class="btnViewProfile" @click="goProfile(receiverUserId.USER_Id)">View Profile</div>
                        </div>
                    </div>


                    <div v-if="showInformationReceiverUser && conversationCreatedTime !== 'null'"
                        class="time-difference timeCreatedTimeConversatin">
                        You and <p @click="goProfile(receiverUserId.USER_Id)"
                            style="color: black; font-weight: 600;margin: 0 2px 0 2px; cursor: pointer;">
                            {{ receiverUserId.USER_NickName }}
                        </p> have been in contact since
                        <p style="color: black; font-weight: 600;margin: 0 0 0 2px;">
                            {{ formatTime(conversationCreatedTime) }}
                        </p>
                    </div>

                    <div v-if="showInformationReceiverUser && conversationCreatedTime === 'null'"
                        class="time-difference timeCreatedTimeConversatin">
                        Chat Together, Create Our Own Stories!
                    </div>


                    <div v-if="loadingMessages" class="loading-indicator"></div>

                    <div v-for="(message, index) in messages " :key="message.MESS_ID" class="messages">

                        <div v-if="index > 0 && messages[index].chenh && messages[index - 1].chenh"
                            class="time-difference">
                            {{ formatTimeDifference(messages[index - 1], messages[index]) }}
                        </div>

                        <div v-if="message.MESS_ID !== null && message.MESSAGE !== '&altH1'"
                            :class="{ 'my-message': message.SENDER_ID === currentUserId, 'their-message': message.SENDER_ID !== currentUserId }"
                            class="message">
                            <span>{{ message.MESSAGE }}</span>
                        </div>

                        <div v-else-if="message.MESS_ID !== null && message.MESSAGE === '&altH1'"
                            :class="{ 'my-message ': message.SENDER_ID === currentUserId, 'their-message ': message.SENDER_ID !== currentUserId }"
                            class="message sendIcon">
                            <i class="bi bi-heart-fill"></i>
                        </div>
                    </div>
                    <div v-if="isTyping" class="message their-message message-typing"
                        :class="isTyping ? 'text-focus-in' : 'text-blur-out'">
                        <span>...</span>
                    </div>
                </div>


                <div class="InputMessages">
                    <div class="InputFrame">
                        <input class="InputMess" @keyup.enter="sendMessage" type="text" v-model="newMessage"
                            placeholder="Message...">
                        <div class="Icon">
                            <i v-if="newMessage.length === 0" class="bi bi-heart" @click="sendIcon"></i>
                            <p class="Sent" @click="sendMessage" v-else>Sent</p>
                        </div>
                    </div>
                </div>

            </div>


            <div id="Messages" v-else>
                <div class="notice">
                    <i class="bi bi-chat-dots icon"></i>
                    <div class="Your-messages">Your messages</div>
                </div>
            </div>
        </div>
        <div class="bupple" v-show="isShowCreate" @click="isShowCreate = !isShowCreate"></div>
        <CreateConversation v-show="isShowCreate" :currentUserId="currentUserId" class="Create-Conversation"
            @close="isShowCreate = false" @createNewConversation="createNewConversation" @freshData="freshData">
        </CreateConversation>
    </div>
</template>

<script>
import Nav from "../components/Nav.vue";
import NavRequestFriend from "../components/NavRequestFriend.vue";
import CreateConversation from "../components/CreateConversation.vue"
import OptionComponent from "../components/Option.vue";
import AuthenticationService from "../services/AuthenticationService";
import Security from "../services/Security";
import socket from "../services/Socket.io";

export default {
    data() {
        return {
            currentUserId: '',
            currentUser: '',
            receiverUserId: "",
            conversations: '',
            newMessage: "",
            messages: [],
            loadingMessages: false,
            showInformationReceiverUser: false,
            totalMessages: 0,
            thresholdMax: 30,
            limit: 30,
            page: 1,
            conversationId: '',
            conversationCreatedTime: '',
            deConversation: '',
            isTyping: false,
            typingTimeout: null,
            isShowCreate: false,
            searchQuery: '',
            searchResults: [],
            resetData: true,
            isNull: false,
            activeConversationId: null,
            optionComponentStyles: {},
        }
    },
    components: {
        Nav,
        NavRequestFriend,
        CreateConversation, OptionComponent
    }, beforeRouteLeave(to, from, next) {
        if (socket.connected) {
            socket.disconnect(); // Ngắt kết nối hoàn toàn
        }
        next();
    }, methods: {
        // onTyping() {
        //     socket.emit("typing", { CON_ID: this.conversationId, SENDER_ID: this.currentUserId, RECEIVER_ID: this.receiverUserId.USER_Id });
        //     clearTimeout(this.typingTimeout);

        //     this.typingTimeout = setTimeout(() => {
        //         socket.emit("stopTyping", { CON_ID: this.conversationId, SENDER_ID: this.currentUserId, RECEIVER_ID: this.receiverUserId.USER_Id });
        //     }, 1000);
        // },
        toggleOptionComponent(conversationId) {
            // Toggle the active conversation for showing the OptionComponent
            if (this.activeConversationId === conversationId) {
                this.activeConversationId = null;
                this.optionComponentStyles = {};
            } else {
                this.activeConversationId = conversationId;
                this.calculateOptionPosition(conversationId);
            }
        },
        calculateOptionPosition(conversationId) {
            // Correctly reference the element using this.$refs
            const conversationElement = this.$refs[`conversation-${conversationId}`];

            // Ensure the element exists before proceeding
            if (conversationElement && conversationElement[0]) {
                const threeDots = conversationElement[0].querySelector('.three-dots');

                if (threeDots) {
                    const rect = threeDots.getBoundingClientRect();

                    const spaceAbove = rect.top;
                    const spaceBelow = window.innerHeight - rect.bottom;

                    // Sử dụng nextTick để đảm bảo OptionComponent đã được render
                    this.$nextTick(() => {
                        const optionComponent = threeDots.querySelector('.option-message'); // Chọn đúng lớp của OptionComponent
                        if (optionComponent) {
                            const optionComponentHeight = optionComponent.offsetHeight; // Lấy chiều cao của OptionComponent

                            if (spaceBelow < optionComponentHeight && spaceAbove > optionComponentHeight) {
                                this.optionComponentStyles = {
                                    position: 'absolute',
                                    bottom: `50px`,
                                    right: `0px`,
                                };
                            } else {
                                this.optionComponentStyles = {
                                    position: 'absolute',
                                    top: `50px`,
                                    right: `0px`,
                                };
                            }
                        }
                    });
                }
            }
        },
        async handleDeleteConversation(conversationId) {
            // Xử lý logic xóa cuộc trò chuyện ở đây
            const delCon = (await AuthenticationService.deleteConversation(this.currentUserId, { "conversationId": conversationId })).data;
            if (delCon.status) {
                this.conversations = (await AuthenticationService.getConversations(this.currentUserId)).data;
                this.activeConversationId = null;
            }
        },
        async createNewConversation(conId, userReceiv) {
            this.getAllMessagesInAConversation(conId, userReceiv)
        },
        async searchConversation() {

            if (this.searchQuery.length === 0) {
                this.conversations = (await AuthenticationService.getConversations(this.currentUserId)).data;
                this.resetData = true;
                this.isNull = false;
                return
            }
            if (this.searchQuery.trim()) {
                this.resetData = false;
                socket.emit("searchConversation", { searchQuery: this.searchQuery, userId: this.currentUserId })
                socket.on("searchConversationResults", (result) => {
                    if (result.length === 0) {
                        this.isNull = true;
                        this.conversations = []
                    } else {
                        this.conversations = result
                        this.isNull = false;

                    }
                })
            }
        },
        length(list) {
            return list.length;
        }, sendIcon() {
            socket.emit('sendMessage', { MESSAGE: "&altH1", SENDER_ID: this.currentUserId, CON_ID: this.conversationId, RECEIVER_ID: this.receiverUserId.USER_Id, CREATED_AT: new Date(), chenh: null });
            this.loadTime();
            this.scrollToEnd();
        },
        async sendMessage() {
            if (this.newMessage.trim() !== "") {
                socket.emit('sendMessage', { MESSAGE: this.newMessage, SENDER_ID: this.currentUserId, CON_ID: this.conversationId, RECEIVER_ID: this.receiverUserId.USER_Id, CREATED_AT: new Date(), chenh: null });
                this.newMessage = "";
                this.loadTime();
                this.scrollToEnd();
            }
            this.conversations = (await AuthenticationService.getConversations(this.currentUserId)).data;
        }, loadimg(user, u) {
            if (u === 0)
                return require(`../../../server/public/uploads/avatar/${user.USER_AVATARURL}`);
            else if (u === 1)
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
        }, async getAllMessagesInAConversation(conId, userReceiv) {
            this.$router.push({
                path: this.$route.path,
                query: { cid: Security.encodeID(conId) }
            });
            const conversation = this.conversations.find(c => c.CON_ID === conId);
            if (conversation) {
                conversation.isUnread = false;
            }
            this.page = 1;
            this.messages = [];
            this.showInformationReceiverUser = false;
            this.conversationId = '';
            this.receiverUserId = '';
            this.conversationId = Security.encodeID(conId);
            this.deConversation = conId;

            const response = (await AuthenticationService.getMessages(this.currentUserId, Security.encodeID(conId))).data;
            this.messages = response.messages;
            this.conversationCreatedTime = response.conversationCreatedTime;

            this.receiverUserId = (await AuthenticationService.getUser(userReceiv)).data;

            this.showInformationReceiverUser = false;
            if (socket.connected) {
                socket.disconnect();
            }
            socket.connect()
            socket.emit('userConnected', {
                USER_ID: this.currentUserId,
                CON_ID: this.conversationId,
                RECEIVER_ID: this.receiverUserId.USER_Id
            });

            this.loadTime();

            this.$nextTick(() => {
                this.scrollToEnd();
            });

            if (this.messages.length < this.limit) {
                this.showInformationReceiverUser = true;
                this.loadingMessages = false;
                return;
            }

        },
        formatTimeDifference(time1, time2) {
            if (time1.chenh && time2.chenh) {
                const date1 = new Date(time1.CREATED_AT);
                const date2 = new Date(time2.CREATED_AT);
                const now = new Date();

                const timeDifferenceNow = (now - date2) / (1000 * 60);
                const timeDifference = (date2 - date1) / (1000 * 60);

                if (timeDifference < this.thresholdMax) {
                    return this.formatTime(time1.CREATED_AT);
                } else return this.formatTime(time2.CREATED_AT)
            }


        }, loadTime() {
            for (let i = 0; i < this.messages.length - 1; i++) {
                const date1 = new Date(this.messages[i].CREATED_AT);
                const date2 = new Date(this.messages[i + 1].CREATED_AT);

                const timeDifference = (date2 - date1) / (1000 * 60);

                if (timeDifference > this.thresholdMax) {
                    this.messages[i].chenh = true;
                    this.messages[i + 1].chenh = true;
                } else {
                    if (this.messages[i].chenh === null) {
                        this.messages[i].chenh = false;
                    }
                    this.messages[i + 1].chenh = false;
                }
            }

            if (this.messages.length > 1) {
                const lastMessage = this.messages[this.messages.length - 1];
                const secondLastMessage = this.messages[this.messages.length - 2];
                const lastTimeDifference = (new Date(lastMessage.CREATED_AT) - new Date(secondLastMessage.CREATED_AT)) / (1000 * 60);
                if (lastTimeDifference > this.thresholdMax) {
                    lastMessage.chenh = true;
                } else {
                    lastMessage.chenh = false;
                }
            }

        }
        , loadMessages() {
            if (this.loadingMessages) return;
            const container = this.$refs.messageContainer;
            const currentScrollHeight = container.scrollHeight;
            const currentScrollTop = container.scrollTop;
            this.loadingMessages = this.showInformationReceiverUser ? false : true;
            setTimeout(async () => {
                try {
                    this.page += 1; // Tăng số trang để lấy thêm tin nhắn cũ
                    const response = (await AuthenticationService.getMessages(this.currentUserId, this.conversationId, this.page, this.limit)).data;
                    this.totalMessages = response.totalMessages;
                    const newMessages = response.messages;

                    if (newMessages.length > 0) {
                        this.messages = [...newMessages, ...this.messages];
                        this.loadTime();
                        this.$nextTick(() => {
                            const newScrollHeight = container.scrollHeight;
                            container.scrollTop = newScrollHeight - currentScrollHeight + currentScrollTop;
                        });
                    }

                    if (newMessages.length < this.limit || this.messages.length >= totalMessages) {
                        this.showInformationReceiverUser = true;
                        this.loadingMessages = false;
                        return;
                    }
                } catch (error) {
                    console.error('Failed to load messages:', error);
                } finally {
                    this.loadingMessages = false;
                }
            }, 1000);
        }
        ,
        handleScroll() {
            const container = this.$refs.messageContainer;
            if (container.scrollTop === 0) {
                this.loadMessages();
            }
        }
        ,
        formatTime(time) {
            function getStartOfWeek(date) {
                const day = date.getDay();
                const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Tính ngày đầu tiên của tuần
                return new Date(date.setDate(diff));
            }

            function isSameWeekWithToday(randomDate) {
                const today = new Date();

                const startOfWeekRandom = getStartOfWeek(new Date(randomDate));
                const startOfWeekToday = getStartOfWeek(today);

                return startOfWeekRandom.getFullYear() === startOfWeekToday.getFullYear() &&
                    startOfWeekRandom.getMonth() === startOfWeekToday.getMonth() &&
                    startOfWeekRandom.getDate() === startOfWeekToday.getDate();
            }

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const date = new Date(time);
            const now = new Date();
            const timeDate = date.getDate() * 24 + date.getHours() * 60 + date.getMinutes();
            const timeNow = now.getDate() * 24 + now.getHours() * 60 + now.getMinutes();
            const timeMinutes = timeNow - timeDate;
            if (date.toDateString() === now.toDateString()) {
                if (timeMinutes < 60) {
                    return " " + timeMinutes + " m ";
                } else {
                    return " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " ";
                }
            } else {
                if (isSameWeekWithToday(date)) {
                    return " " + daysOfWeek[date.getDay()] + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " ";
                } else
                    return " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " ";
            }
        }, formatTimeConversation(timeA) {
            const now = new Date();
            const a = new Date(timeA);

            // Lấy chênh lệch thời gian theo mili-giây
            const diffMs = now - a;
            const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Tổng số phút cách nhau
            const diffHours = Math.floor(diffMinutes / 60); // Tổng số giờ cách nhau
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Tổng số ngày cách nhau
            const diffWeeks = Math.floor(diffDays / 7); // Tổng số tuần cách nhau

            // Trường hợp cùng năm
            if (now.getFullYear() === a.getFullYear()) {
                // Trường hợp cùng tháng
                if (now.getMonth() === a.getMonth()) {
                    // Trường hợp cùng ngày
                    if (now.getDate() === a.getDate()) {
                        if (diffMinutes < 60) {
                            return `${diffMinutes}m`; // Hiển thị số phút
                        } else {
                            return `${diffHours}h`; // Hiển thị số giờ
                        }
                    }

                    if (diffDays === 0) return `${diffHours}h`
                    // Trường hợp khác ngày, kiểm tra hôm qua
                    if (diffDays === 1) {
                        return "Yesterday";
                    }

                    // Trường hợp khác tuần nhưng trong cùng tháng
                    if (diffDays >= 7) {
                        return `${diffWeeks}w`; // Trả về số tuần
                    }
                }
                if (diffWeeks === 0) {
                    if (diffDays === 0) {
                        return `${diffHours}h`
                    } return `${diffDays}d`
                }
                // Trường hợp khác tháng trong cùng năm
                return `${diffWeeks}w`; // Trả về số tuần cách nhau
            }
            if (diffWeeks === 0) {
                if (diffDays === 0) {
                    return `${diffHours}h`
                } return `${diffDays}d`
            }
            // Trường hợp khác năm
            return `${diffWeeks}w`; // Trả về số tuần cách nhau
        }
        , scrollToEnd(instant = false) {
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                if (container) {
                    if (instant) {
                        // Cuộn trực tiếp xuống cuối cùng
                        container.scrollTop = container.scrollHeight;
                    } else {
                        // Cuộn mượt xuống cuối cùng
                        container.scroll({
                            top: container.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }, async freshData() {
            this.conversations = (await AuthenticationService.getConversations(this.currentUserId)).data;
        }, goProfile(userId) {
            if (userId == this.currentUserId) {
                this.$router.push(`/profile`)
            } else {
                this.$router.push(`/profile/${userId}`)
            }
        }
    }, async mounted() {
        const token = localStorage.getItem("token");

        if (token) {
            // Nếu có token, có thể gửi yêu cầu đến máy chủ để xác thực token
            const response = await AuthenticationService.verifyToken(token);
            if (response.status !== 200) {
                // Nếu token không hợp lệ, điều hướng đến trang đăng nhập
                localStorage.removeItem("token");
                this.$router.push("/");

            }
            this.currentUserId = response.data.userId
        } else {
            // Nếu không có token, điều hướng đến trang đăng nhập
            this.$router.push("/");
        }

        this.currentUser = (await AuthenticationService.getUser(this.currentUserId)).data;
        this.conversations = ((await AuthenticationService.getConversations(this.currentUserId)).data) || [];
        this.loadTime();
        this.scrollToEnd();

        setInterval(async () => {
            if (this.resetData) {
                this.conversations = (await AuthenticationService.getConversations(this.currentUserId)).data;
            }
        }, 5000);

        socket.on('newMessage', (message) => {
            this.messages.push(message);
            this.loadTime();
            this.scrollToEnd();
        });

        // socket.on('userTyping', (typing) => {
        //     this.isTyping = typing.typing
        //     this.scrollToEnd();
        // })
    },
};

</script>

<style scoped>
.MessBody {
    position: relative;
}

.Create-Conversation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
}

.bupple {
    position: absolute;
    background-color: black;
    opacity: 0.5;
    z-index: 1000;
    top: 0;
    width: 100%;
    height: 111%;
}

.text-blur-out {
    -webkit-animation: text-blur-out 1.2s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    animation: text-blur-out 1.2s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

@-webkit-keyframes text-blur-out {
    0% {
        -webkit-filter: blur(0.01);
        filter: blur(0.01);
    }

    100% {
        -webkit-filter: blur(12px) opacity(0%);
        filter: blur(12px) opacity(0%);
    }
}

@keyframes text-blur-out {
    0% {
        -webkit-filter: blur(0.01);
        filter: blur(0.01);
    }

    100% {
        -webkit-filter: blur(12px) opacity(0%);
        filter: blur(12px) opacity(0%);
    }
}

.text-focus-in {
    -webkit-animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

@-webkit-keyframes text-focus-in {
    0% {
        -webkit-filter: blur(12px);
        filter: blur(12px);
        opacity: 0;
    }

    100% {
        -webkit-filter: blur(0px);
        filter: blur(0px);
        opacity: 1;
    }
}

@keyframes text-focus-in {
    0% {
        -webkit-filter: blur(12px);
        filter: blur(12px);
        opacity: 0;
    }

    100% {
        -webkit-filter: blur(0px);
        filter: blur(0px);
        opacity: 1;
    }
}

#MessagesFrame {
    width: 83%;
    height: 634px;
    margin-left: 246px;
    display: flex;
}

.input-search {
    margin: 12px 28px 14px;
    padding: 6px 18px;
    border-radius: 28px;
    width: 90%;
    border: #d7d6d6 solid 1px;
}


#ListUser {
    width: 35%;
    border-right: 1px solid silver;
    height: 111%;
    padding-top: 32px;
}

#ListUser .UserName {
    font-size: 20px;
    font-weight: 700;
    padding-left: 28px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    margin-right: 15px;
}

.icon-pencil {
    size: 15px;
    cursor: pointer;
}

#ListUser .Title {
    font-size: 16px;
    font-weight: 500;
    padding-left: 28px;
    margin-bottom: 0px;
}

#ListUser .List {
    height: 81.5%;
    overflow-y: scroll;

}

#ListUser .List .User {
    display: flex;
    padding: 8px 24px;
}

#ListUser .List .User .ImgUser {
    border-radius: 50%;
    width: 56px;
    height: 56px;
    object-fit: cover;
    margin: 0px 12px 0px 0px;
}

#ListUser .List .User:hover {
    background-color: rgb(250, 250, 250);
}

#ListUser .List .User .InforUser {
    margin: auto 0;
    font-size: 14px;
    width: 80%;
}

#ListUser .List .InforUser .NameUser {
    display: flex;
}

.unread-text {
    font-weight: 600;
}

#ListUser .List .InforUser .NameUser .unread-message {
    position: relative;
    top: 1px;
    left: 2px;
    height: 6px;
    width: 6px;
    background-color: #3797F0;
    border-radius: 50%
}

.NewMessages p {
    margin: 0;
    color: #737373;
    font-size: 12px;
}

#Messages {
    height: 111%;
    width: 65%;
}

#Messages .MessagesOfUser {
    /* height: 70px; */
    padding: 8px 16px;
    display: flex;
    margin: auto 0;
    border-bottom: 1px solid silver;
}

#Messages .MessagesOfUser .ImgUser {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    object-fit: cover;
    margin: auto 6px;
    cursor: pointer;
}

#Messages .MessagesOfUser .InforUser {
    display: flex;
    width: 100%;
    margin: auto 0;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 700;
}

#Messages .MessagesOfUser .InforUser .UserName {
    cursor: pointer;
    margin: 6px;
}

#Messages .MessagesOfUser .InforUser i {
    font-size: 25px;
    cursor: pointer;
}

.three-dots {
    position: relative;
    right: 0;
    display: flex;
    align-items: center;
}

.icon-three-dot {
    height: fit-content;
    border-radius: 8px;
}

.three-dots:hover .icon-three-dot {
    background-color: #d6d6d6;
    align-items: center;
}

.InputMessages {
    height: 78px;
    width: 100%;
    display: flex;
}

.DotCenter {
    font-weight: normal !important;
}

.InputMessages .InputFrame {
    display: flex;
    height: 44px;
    width: 96%;
    justify-content: space-between;
    border-radius: 30px;
    border: 1px #d7d6d6 solid;
    padding: 0px 16px 0 16px;
    margin: auto auto;
}

.InputMessages .InputFrame .InputMess {
    border: none;
    border-radius: 15px;
    margin-top: 2px;
    width: 95%;
    font-size: 15px;
}

.InputMessages .InputFrame .Icon {
    margin: auto;
    padding-top: 5px;
}

.InputMessages .InputFrame .Icon i {
    font-size: 20px;
    cursor: pointer;
}

.InputMessages .InputFrame .Icon .Sent {
    margin: auto;
    position: relative;
    top: -2px;
    font-size: 14px;
    color: #0095F6;
    font-weight: 700;
    cursor: pointer;
}

.InputMessages .InputFrame .Icon .Sent:hover {
    color: rgba(0,
            55,
            107);
}


.Conversation {
    height: 79%;
    overflow-y: scroll;
    scroll-behavior: smooth;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
}

.message {
    margin-bottom: 10px;
    padding: 7px 12px;
    font-size: 15px;
    border-radius: 20px;
    max-width: 60%;
    word-wrap: break-word;
    margin: 1px 0;
}

.my-message {
    background-color: #3797F0;
    align-self: flex-end;
    color: #FFFFFF;
    border-radius: 10px 10px 0 10px;
}

.their-message {
    background-color: rgba(239, 239, 239);
    align-self: flex-start;
    border-radius: 10px 10px 10px 0px;
}

.message-time {
    font-size: 10px;
    display: none;
}

.my-time {
    color: black;
    background-color: transparent;
}

.their-time {
    background-color: transparent;
    color: black;
    height: 4px;
}

.messages:hover .my-time,
.messages:hover .their-time {
    display: block;
}

.message-typing {
    width: fit-content;
    margin: 10px;
}

.loading-indicator {
    text-align: center;
    font-size: 16px;
    color: #999;
}

.loading-indicator::after {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid #999;
    border-radius: 50%;
    border-top: 3px solid transparent;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.time-difference {
    align-self: center;
    font-size: 12px;
    color: #65676B;
}


.notice {
    position: relative;
    width: fit-content;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.icon {
    border-radius: 100%;
    padding: 8px;
    font-size: 96px;
}

.your-messages {
    font-size: 14px;
}

.noticeList {
    cursor: pointer;
    position: relative;
    width: fit-content;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    background-color: #0095F6;
    padding: 8px 16px;
    color: rgb(255, 255, 255);
    border-radius: 8px;
}

.any {
    position: absolute;
    color: #8b8d8f;
    margin: 0;
    top: -22px;
    width: 150px;
    left: -9px;
    font-size: 14px;
}

.iconList {
    border-radius: 100%;
    padding-right: 8px;
    font-size: 18px;
}

.your-messagesList {
    margin: 0;
    font-size: 18px;
}


.messInfor {
    height: 254px;
    margin-top: 38px;
    width: 100%;
}

.messFr {
    position: relative;
    width: fit-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.messInforAvatar {
    border-radius: 50%;
    width: 96px;
    height: 96px;
    object-fit: cover;
    margin: auto 6px;
}

.messInforNickName {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    padding: 14px 0 0;
}

.messInforSubFirst {
    font-size: 14px;
    color: #65676B;
}

.btnViewProfile {
    cursor: pointer;
    height: 32px;
    padding: 1px 18px 0;
    background-color: rgb(242, 242, 242);
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin: 18px 0 24px;
}

.btnViewProfile:hover {
    background-color: rgb(224, 224, 224);
}

.timeCreatedTimeConversatin {
    display: flex;
    justify-content: center;
    padding-bottom: 32px;
}

.choose {
    background-color: rgb(239,
            239,
            239);
}

.sendIcon {
    background-color: transparent;
    color: red;
    font-size: 25px;
}

.option-message {
    position: absolute;
    z-index: 1000;
    width: fit-content;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>