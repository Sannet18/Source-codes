import sampleMsgs from '@/modules/Messages.js'
import Message from '@/models/Message.js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'

export const useMessageStore = defineStore('messageStore', () => {
  const userStore = useUserStore()

  const messages = ref(JSON.parse(localStorage.getItem('messages')) || [...sampleMsgs])

  function add(text, toId) {
    const currentUser = userStore.currentUser
    if (!currentUser || !toId) return

    const msg = new Message({
      id: Date.now(),
      userId: currentUser.id,
      toId: toId,
      message: text,
      redacted: false,
    })

    messages.value.push(msg)
    localStorage.setItem('messages', JSON.stringify(messages.value))
  }

  function redact(messageId) {
    const currentUser = userStore.currentUser
    const message = messages.value.find((m) => m.id == messageId)

    if (message.userId !== currentUser.id) {
      throw new Error('You can only redact your own message')
    }

    message.redacted = true
  }

  function unredact(messageId) {
    const currentUser = userStore.currentUser
    const message = messages.value.find((m) => m.id == messageId)

    if (message.userId !== currentUser.id) {
      throw new Error('You cannot unredact this message')
    }

    message.redacted = false
  }
  const messagesWithUsers = (friendId) => {
    const currentUser = userStore.currentUser
    if (!currentUser || !friendId) return []
    return messages.value.filter(
      (m) =>
        (m.userId === currentUser.id && m.toId === friendId) ||
        (m.userId === friendId && m.toId === currentUser.id),
    )
  }

  return {
    messages,
    add,
    redact,
    unredact,
    messagesWithUsers,
  }
})
