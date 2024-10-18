import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        messages: []
    },
    mutations: {
        add_message(state, message) {
            state.messages.push(message);
        },
        set_message(state, messages) {
            state.messages = messages;
        }
    },
    actions: {
        sendMessage({ commit }, message) {
            commit('add_message', message);

            // Сохранение сообщения в хранилище
            const currentMessages = JSON.parse(localStorage.getItem('messages')) || [];
                // Проверка против дублей
            if (!currentMessages.some(m => m.id === message.id)) {
                localStorage.setItem('messages', JSON.stringify([...currentMessages, message]));
            }
        },
        loadMessages({ commit }) {
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            commit('set_message', messages);
        }
    },
    modules: {
    }
})
