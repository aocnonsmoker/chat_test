<template>
    <div>
        <div class="profiles" v-if="!selectedProfile">
            <h2>Выберите аккаунт</h2>
            <div class="profiles_list row mt-5">
                <div
                    v-for="account in profiles"
                    :key="account.id"
                    class="account col-md-4"
                    @click="() => (selectedProfile = account)"
                >
                    <b-avatar :text="account.name[0]" size="6rem"></b-avatar>
                    <div class="acc_name">{{ account.name }}</div>
                </div>
            </div>
        </div>
        <div v-else>
            <h3>Добро пожаловать, {{ selectedProfile.name }}</h3>
            <div class="chat row">
                <div class="chat_list col-md-3">
                    <div
                        v-for="item in profiles.filter(
                            (x) => x.id !== selectedProfile.id
                        )"
                        :key="'chat_item_' + item.id"
                        class="chat_item row m-2"
                        @click="() => (selectedChat = item)"
                    >
                        <b-avatar></b-avatar>
                        <div class="chat_item_name col-md-9 text-left">
                            <span>{{ item.name }}</span>
                            <template v-if="messages.length > 0">
                                <div class="chat_item_latest_msg">{{ latestMsg(item) }}</div>
                            </template>
                        </div>
                        <hr />
                    </div>
                </div>
                <div v-if="selectedChat" class="chat_window col-md-9">
                    <div class="chat_title mt-3">{{ selectedChat.name }}</div>
                    <hr />
                    <div class="messages">
                        <template v-if="messages.length > 0">
                            <div
                                class="message m-2"
                                :class="
                                    msg.author === selectedProfile.id
                                        ? 'text-right own_msg'
                                        : 'text-left recieve_msg'
                                "
                                v-for="msg in messages.filter(
                                    (x) =>
                                        (x.author === selectedProfile.id &&
                                            x.reciever === selectedChat.id) ||
                                        (x.author === selectedChat.id &&
                                            x.reciever === selectedProfile.id)
                                )"
                                :key="msg.id"
                            >
                                <div class="message_text">
                                    {{ msg.message }}
                                </div>
                                <div class="message_date">
                                    {{ msg.send_date }}
                                </div>
                            </div>
                        </template>
                        <div class="new_message">
                            <b-input-group class="mt-3">
                                <b-form-input
                                    v-model="messageText"
                                    placeholder="Напишите сообщение"
                                    @keydown.native="keydown_handler"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button
                                        @click="sendMessage()"
                                        variant="outline-success"
                                        >Отправить</b-button
                                    >
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </div>
                </div>
            </div>
            <b-btn class="mt-2" @click="() => (selectedProfile = null)"
                >Выйти</b-btn
            >
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'Home',
    data() {
        return {
            selectedProfile: null,
            selectedChat: null,
            messageText: '',
            profiles: [
                {
                    'id': 1,
                    'name': 'Арман'
                },
                {
                    'id': 2,
                    'name': 'Болат'
                },
                {
                    'id': 3,
                    'name': 'Айгуль'
                }
            ],
            messages: []
        }
    },
    created() {
        // Загружаем сообзения с хранилища 
        this.$store.dispatch('loadMessages');
        this.messages = this.$store.state.messages;

        // Слушатель на изменения хранилища
        window.addEventListener('storage', this.handleStorageChange);
    },
    mounted() {
        // Сброс при выходе с профиля
        this.$watch('selectedProfile', () => {
            this.selectedChat = null;
            this.messageText = '';
        });
        // Сортировка сообщении по датам
        if (this.messages.length > 0) {
            this.messages = this.messages.sort((a, b) => a.send_date.localeCompare(b.send_date));
        }
    },
    methods: {
        latestMsg(item) {
			const msgArray = this.messages.filter(x => (x.author === this.selectedProfile.id && x.reciever === item.id) || (x.reciever === this.selectedProfile.id && x.author === item.id));
			if (msgArray.length > 0) {
				const ltsMsg = msgArray[msgArray.length - 1];
				return ltsMsg.message
			}
			return ''
        },
        // Отправка сообщения
        sendMessage() {
            const msg = {
                id: this.messages.length + 1,
                author: this.selectedProfile.id,
                reciever: this.selectedChat.id,
                send_date: moment().locale('ru').format('DD MMMM YYYY, HH:mm'),
                message: this.messageText
            };
            this.$store.dispatch('sendMessage', msg);
            this.messageText = ''
        },
        // Добавление клавишы "Enter" для отправки сообщения
        keydown_handler(event) {
            if (event.which === 13) {
                this.sendMessage();
            }
        },
        // Изменение хранилища
        handleStorageChange(event) {
            if (event.key === 'messages') {
                this.$store.dispatch('loadMessages');
                this.messages = this.$store.state.messages;
            }
        }
    }
}
</script>

<style scoped>
.account {
    cursor: pointer;
}
.acc_img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 10px;
    border-style: solid;
}
.chat {
    height: 80vh;
}
.chat_item {
    cursor: pointer;
}
.chat_item_img {
    width: 50px;
    height: 50px;
    border: 1px solid black;
    border-radius: 50%;
}
.chat_window {
    border: 1px solid black;
    height: 80vh;
}
.messages {
    height: 80%;
    overflow: auto;
}
.own_msg {
    background-color: #90ee90;
}
.recieve_msg {
    background-color: #87cefa;
}
.new_message {
    position: absolute;
    bottom: 0;
    margin-bottom: 10px;
    width: 96%;
}
</style>
