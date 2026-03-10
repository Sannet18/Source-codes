<script setup>
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// Validation for username
const usernameRules = computed(() => ({
  length: userStore.username.length >= 5,
  startsLetter: /^[A-Za-z]/.test(userStore.username),
  lettersNumbers: /^[A-Za-z0-9]*$/.test(userStore.username),
}))

// Validation for password
const passwordRules = computed(() => ({
  length: userStore.password.length >= 8,
  uppercase: /[A-Z]/.test(userStore.password),
  lowercase: /[a-z]/.test(userStore.password),
  number: /\d/.test(userStore.password),
  special: /[^A-Za-z0-9]/.test(userStore.password),
}))

const usernameValid = computed(() => Object.values(usernameRules.value).every(Boolean))
const passwordValid = computed(() => Object.values(passwordRules.value).every(Boolean))
const allValid = computed(() => usernameValid.value && passwordValid.value)

function login() {
  if (allValid.value) {
    userStore.setUser(userStore.username, userStore.password)
    router.push('/home')
  }
}

const showPassword = ref(false)
</script>

<template>
  <div class="login-view view">
    <div class="login-content">
      <div class="login-form">
        <h1>Let's Go!</h1>
        <h3>Enter your credentials</h3>
        <div>
          <div class="form-item">
            <label class="usernameInput" for="usernameInput">Username</label>
            <input id="usernameInput" v-model="userStore.username" />
          </div>
          <div class="form-item">
            <label class="passwordInput" for="passwordInput">Password</label>
            <label class="switch align-right">
              <input type="checkbox" v-model="showPassword" />
              <span class="slider"></span>
            </label>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="passwordInput"
              v-model="userStore.password"
            />
          </div>
        </div>
        <button @click="login">Log in</button>
      </div>

      <div class="error-messages" :class="{ 'no-width': allValid }">
        <div v-if="!usernameValid">
          <span>Username</span>
          <ul>
            <li v-if="!usernameRules.length">
              <span>Must have at least 5 characters</span>
            </li>
            <li v-if="!usernameRules.startsLetter">
              <span>Must begin with a letter</span>
            </li>
            <li v-if="usernameRules.lettersNumbers">
              <span>Can only contain letters and numbers</span>
            </li>
          </ul>
        </div>

        <div v-if="!passwordValid">
          <span>Password</span>
          <ul>
            <li v-if="!passwordRules.length">
              <span>Must have at least 8 characters</span>
            </li>
            <li v-if="!passwordRules.uppercase">
              <span>Must have 1 uppercase character</span>
            </li>
            <li v-if="!passwordRules.lowercase">
              <span>Must have 1 lowercase character</span>
            </li>
            <li v-if="!passwordRules.number">
              <span>Must have 1 number</span>
            </li>
            <li v-if="!passwordRules.special">
              <span>Must have 1 special character</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
li::marker {
  display: list-item;
  unicode-bidi: isolate;
  font-variant-numeric: tabular-nums;
  text-transform: none;
  text-indent: 0px !important;
  text-align: start !important;
  text-align-last: auto !important;
}
.login-content {
  display: flex;
  justify-content: center;
  gap: 20px;
}
ul {
  padding-left: 15px;
  margin: 3px 0 10px;
}
input:checked + .slider:before {
  transform: translate(13px);
}
input:checked + .slider {
  background-color: #2196f3;
}
.slider::before {
  position: absolute;
  content: '';
  height: 13px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  transition: 0.4s;
  border-radius: 50%;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
}

.error-messages {
  align-self: center;
  color: #c70d0d;
  font-size: 12px;
  width: 200px;
  transition: width 1s linear;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.error-messages span {
  display: inline-block;
  min-width: max-content;
  white-space: nowrap;
}
.login-form > button {
  font-size: medium;
  color: #f8f8f8;
  background-color: #000;
  border-radius: 999px;
  padding: 5px 10px;
  border: 0;
}

.login-form > button:active {
  transform: scale(97%);
}

input[type='password' i] {
  -webkit-text-security: disc !important;
  padding-block: 1px;
  padding-inline: 2px;
}
.align-right {
  float: right;
}
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
}
label {
  cursor: default;
}
.form-item > label {
  display: inline-block;
  margin-bottom: 5px;
}
.form-item > input {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 5px;
}

.form-item {
  box-sizing: border-box;
  width: 160px;
  margin-bottom: 5px;
}
.login-form h3 {
  text-align: center;
}
.login-form h1 {
  margin: 0;
}
.login-form {
  background-color: #f8f8f8;
  box-sizing: border-box;
  padding: 20px;
  font-size: small;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 200px;
}
.login-view {
  flex: 1;
  background-color: #efeded;
  opacity: 97%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.view {
  position: relative;
}
.view::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background-image: url(/starfish.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: grayscale(100%);
  opacity: 0.05;
  z-index: -1;
}
.no-width {
  width: 0;
}
</style>
