import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { getToken, setToken } from '../../util/auth'

export const useMessageStore = defineStore('messageStore', () => {
  const userStore = useUserStore()

  const messages = ref([])

  const groupMessages = ref([])

  const URL = 'https://stingray-app-u3bsh.ondigitalocean.app'

  async function createGroup(group_name) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ group_name, chat_type: 'group' }),
    }

    try {
      const res = await fetch(`${URL}/chat`, options)

      if (!res.ok) {
        throw new Error('Failed to create group chat')
      }

      const data = await res.json()

      console.log('API RESPONSE:', data)

      const newGroup = {
        id: data._id,
        name: data.group_name,
        lastMessage: 'No messages yet',
        members: data.users || [],
        owner: data.owner?.user_id || null,
      }

      console.log(newGroup)
      groupMessages.value.push(newGroup)

      return newGroup
    } catch (err) {
      throw err
    }
  }

  async function chatInvite(chatId, userId) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    }

    try {
      const res = await fetch(`${URL}/chat/${chatId}/invitation/${userId}`, options)
      if (res.status === 409) {
        throw new Error('Invite already sent to this user')
      }
      if (!res.ok) {
        throw new Error('Could not send request')
      }

      const text = await res.text()
      return text ? JSON.parse(text) : null
    } catch (err) {
      throw err
    }
  }

  async function chatRequestDecision(chatId, requestId, accept) {
    const options = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    }
    try {
      const res = await fetch(
        `${URL}/chat/${chatId}/invitation/${requestId}?accept=${accept}`,
        options,
      )
      if (!res.ok) {
        throw new Error('Failed to accept/deny group chat invite')
      }
      const text = await res.text()
      return text ? JSON.parse(text) : null
    } catch (err) {
      throw err
    }
  }

  async function leaveChat(chatId) {
    const options = {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    }

    try {
      const res = await fetch(`${URL}/chat/${chatId}/membership`, options)

      if (!res.ok) {
        throw new Error('Failed to leave chat')
      }
    } catch (err) {
      throw err
    }
  }

  async function sendChat(message, chatId) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ message }),
    }
    try {
      const res = await fetch(`${URL}/chat/${chatId}/message`, options)

      if (!res.ok) {
        throw new Error('Failed to send message')
      }
      const data = await res.json()
      return data
    } catch (err) {
      throw err
    }
  }

  async function getMessages(chatId, { limit = 20, offset = 10, search = '' } = {}) {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    }

    const chatRes = await fetch(`${URL}/chat/${chatId}`, options)
    const chatData = await chatRes.json()
    const memberMap = {}
    ;(chatData.users || []).forEach((m) => {
      memberMap[m.user_id] = m.username
    })

    // this updates the group memeber
    const group = groupMessages.value.find((g) => String(g.id) === String(chatId))
    if (group) group.members = chatData.users || []

    console.log('group members:', group?.members)

    try {
      const res = await fetch(
        `${URL}/chat/${chatId}/messages?limit=${limit}&offset=${offset}&search=${encodeURIComponent(search)}`,
        options,
      )
      if (!res.ok) throw new Error('Could not retrieve messages')
      const data = await res.json()

      messages.value = data.map((msg) => ({
        id: msg._id,
        userId: msg.sender,
        username: memberMap[msg.sender] || 'Unknown',
        message: msg.content,
        date: msg.createdAt,
        toId: chatId,
      }))

      if (group) {
        const last = data[data.length - 1]
        group.lastMessage = last ? last.content : 'No messages yet'
      }

      return messages.value
    } catch (err) {
      throw err
    }
  }

  async function add(text, chatId) {
    if (!text || !chatId) return

    const res = await sendChat(text, chatId)

    const msg = new Message({
      id: res._id,
      userId: res.sender,
      username: res.sender_name,
      message: res.content,
      date: res.createdAt,
      toId: chatId,
    })

    const group = groupMessages.value.find((g) => String(g.id) === String(chatId))
    if (group) {
      group.lastMessage = text
    }

    messages.value.push(msg)

    return msg
  }

  const messagesWithUsers = (friendId) => {
    const currentUser = userStore.currentUser
    if (!currentUser || !friendId) return []
    return messages.value.filter(
      (m) =>
        (m.sender_id === currentUser.id && m.receiver_id === friendId) ||
        (m.sender_id === friendId && m.receiver_id === currentUser.id),
    )
  }

  // to fetch for groups
  async function fetchGroups() {
    const userStore = useUserStore()
    await userStore.getUser()

    const chatIds = userStore.currentUser?.chat_sessions || []

    const options = {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    }

    try {
      const results = await Promise.all(
        chatIds.map((id) => fetch(`${URL}/chat/${id}`, options).then((r) => r.json())),
      )

      groupMessages.value = results.map((chat) => ({
        id: chat._id,
        name: chat.group_name,
        lastMessage: 'No messages yet',
        members: chat.users || [],
        owner: chat.owner?.user_id || null,
      }))

      console.log(groupMessages.value)
    } catch (err) {
      throw err
    }
  }

  return {
    createGroup,
    chatInvite,
    chatRequestDecision,
    leaveChat,
    sendChat,
    getMessages,
    messages,
    groupMessages,
    add,
    messagesWithUsers,
    fetchGroups,
  }
})
