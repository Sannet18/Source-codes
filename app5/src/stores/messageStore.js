import sampleMsgs from '../modules/Messages.js'
import Message from '@/models/Message.js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMessageStore = defineStore('messageStore', () => {
  const messages = ref([...sampleMsgs])

  function add(msg) {
    if (msg instanceof Message) {
      messages.value.push(msg)
    }
  }
  function redact(messageid, username) {
    const message = messages.value.find((msg) => msg.id == messageid)

    if (message.username !== username) {
      throw new Error('You can only redact your own message')
    }
    message.redacted = true
  }

  function unredact(messageid, username) {
    const message = messages.value.find((msg) => msg.id == messageid)

    if (message.username !== username) {
      throw new Error('You cannot unredact message')
    }
    message.redacted = false
  }

  const users = ref([
    {
      username: 'Johnny',
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      username: 'Jane',
      firstName: 'Jane',
      lastName: 'Smith',
    },
  ])
  const selectedUser = ref(JSON.parse(localStorage.getItem('selectedUser')) || null)

  const sender = computed(() => {
    return selectedUser.value
  })

  const receiver = computed(() => {
    return users.value.find((user) => user.username !== selectedUser.value?.username)
  })
  function setUser(user) {
    selectedUser.value = user
    localStorage.setItem('selectedUser', JSON.stringify(user))
  }

  return { add, redact, unredact, users, messages, selectedUser, setUser, sender, receiver }
})
