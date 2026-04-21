<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/messageStore'
import { useUserStore } from '@/stores/userStore'
import SideBarNav from './SidebarNav.vue'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const messageStore = useMessageStore()
const userStore = useUserStore()

const showModal = ref(false)
const newGroupName = ref('')

const groupChats = messageStore.groupMessages

function openChat(chat) {
  if (!chat?.id) return

  const currentId = route.params.id

  if (currentId === String(chat.id)) {
    closeChat()
  } else {
    router.push(`/home/chat/${chat.id}`)
  }
}

function closeChat() {
  router.push('/home')
}

function resetModal() {
  showModal.value = false
}

async function createGroup() {
  const name = newGroupName.value.trim()
  if (!name) return

  try {
    const newGroup = await messageStore.createGroup(name)
    newGroupName.value = ''
    resetModal()
  } catch (err) {
    console.log('Can not create Group')
    console.error(err)
  }
}

const currentUser = computed(() => userStore.currentUser)

const chatInvites = computed(() =>
  (currentUser.value?.requests || []).filter((req) => req.kind === 'ChatInvite'),
)

async function handleChatInvite(invite, accept) {
  console.log('chatId:', invite.chat.chatId)
  console.log('requestId:', invite._id)
  try {
    await messageStore.chatRequestDecision(invite.chat.chatId, invite._id, accept)
    if (accept) {
      messageStore.groupMessages.push({
        id: invite.chat.chatId,
        name: invite.chat.name,
        lastMessage: 'No messages yet',
        members: [],
      })
      localStorage.setItem('groups', JSON.stringify(messageStore.groupMessages))
    }
    await userStore.getUser()
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await messageStore.fetchGroups()
})
</script>

<template>
  <div class="side-bar">
    <SideBarNav />

    <div class="section-header">
      <span class="label">Group chats</span>
      <button class="plus-btn" @click="showModal = true" title="New group chat">+</button>
    </div>

    <div class="chat-list">
      <p v-if="!groupChats?.length" class="empty">No group chats yet</p>
      <div
        v-else
        v-for="chat in groupChats"
        :key="chat.id"
        class="chat-row"
        @click="openChat(chat)"
      >
        <div class="chat-icon">#</div>
        <div class="chat-info">
          <p class="chat-name">{{ chat.name }}</p>
          <p class="chat-last">{{ chat.lastMessage }}</p>
        </div>
      </div>
    </div>
    <div class="section-header" v-if="chatInvites.length">
      <span class="label">Group Invites</span>
    </div>

    <div class="invite-list" v-if="chatInvites.length">
      <div v-for="invite in chatInvites" :key="invite._id" class="invite-row">
        <div class="chat-icon">#</div>
        <div class="chat-info">
          <p class="chat-name">{{ invite.chat.name }}</p>
          <p class="chat-last">from {{ invite.sender.username }}</p>
        </div>
        <div class="invite-actions">
          <button class="accept-btn" @click="handleChatInvite(invite, true)">✓</button>
          <button class="decline-btn" @click="handleChatInvite(invite, false)">✕</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-bg" @click.self="resetModal">
        <div class="modal">
          <p class="modal-title">New group chat</p>

          <input
            v-model="newGroupName"
            placeholder="Group name"
            @keyup.enter="createGroup"
            autofocus
          />

          <div class="modal-actions">
            <button class="cancel-btn" @click="resetModal">Cancel</button>
            <button class="create-btn" @click="createGroup">Create</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.invite-list {
  padding: 0 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.invite-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
}

.invite-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
  flex-shrink: 0;
}

.accept-btn,
.decline-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accept-btn {
  background: rgba(100, 220, 140, 0.2);
  color: #64dc8c;
}

.decline-btn {
  background: rgba(220, 100, 100, 0.2);
  color: #dc6464;
}

.accept-btn:hover {
  background: rgba(100, 220, 140, 0.35);
}
.decline-btn:hover {
  background: rgba(220, 100, 100, 0.35);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 12px;
  color: white;
}

.chip-remove {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  line-height: 1;
}

.chip-remove:hover {
  color: white;
}

.search-results {
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.result-row:hover {
  background: rgba(255, 255, 255, 0.08);
}

.result-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.result-add {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.4);
}

.hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
  margin: 8px 0;
}

.side-bar {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: white;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 6px;
  flex-shrink: 0;
}

.label {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.plus-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.plus-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.chat-list {
  flex: 1;
  padding: 0 8px 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.chat-row:hover {
  background: rgba(255, 255, 255, 0.08);
}

.chat-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.6);
}

.chat-info {
  min-width: 0;
}

.chat-name {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: white;
}

.chat-last {
  margin: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
  margin-top: 16px;
}

.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #2d3441;
  border-radius: 12px;
  padding: 20px;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.modal input {
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.07);
  color: white;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.modal input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-btn {
  padding: 7px 14px;
  border-radius: 999px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 12px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.create-btn {
  padding: 7px 14px;
  border-radius: 999px;
  border: none;
  background: white;
  color: #222831;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.create-btn:hover {
  background: rgba(255, 255, 255, 0.88);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}
</style>
