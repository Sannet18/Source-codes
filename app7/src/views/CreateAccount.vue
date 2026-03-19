<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import NavBar from './NavBar.vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')

// Validation for username
const usernameRules = computed(() => ({
  length: username.value.length >= 5,
  startsLetter: /^[A-Za-z]/.test(username.value),
  lettersNumbers: /^[A-Za-z0-9]*$/.test(username.value),
}))

// Validation for password
const passwordRules = computed(() => ({
  length: password.value.length >= 8,
  uppercase: /[A-Z]/.test(password.value),
  lowercase: /[a-z]/.test(password.value),
  number: /\d/.test(password.value),
  special: /[^A-Za-z0-9]/.test(password.value),
}))

const usernameValid = computed(() => Object.values(usernameRules.value).every(Boolean))
const passwordValid = computed(() => Object.values(passwordRules.value).every(Boolean))
const allValid = computed(() => usernameValid.value && passwordValid.value)

function createAccount() {
  if (allValid.value) {
    userStore.createUser(username.value, password.value)
    router.push('/home')
  }
}

const showPassword = ref(false)
</script>

<template>
  <NavBar />
  <div class="login-view view">
    <div class="login-content">
      <div class="login-form">
        <h3>Create Account</h3>
        <div>
          <div class="form-item">
            <label for="usernameInput">Username</label>
            <input id="usernameInput" v-model="username" />
          </div>

          <div class="form-item">
            <label for="passwordInput">Password</label>
            <label class="switch align-right">
              <input type="checkbox" v-model="showPassword" />
              <span class="slider"></span>
            </label>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="passwordInput"
              v-model="password"
            />
          </div>
        </div>

        <button :disabled="!allValid" @click="createAccount">Create Account</button>
      </div>

      <!-- Validation messages -->
      <div class="error-messages" :class="{ 'no-width': allValid }">
        <div v-if="!usernameValid">
          <span>Username</span>
          <ul>
            <li :class="{ valid: usernameRules.length }">Must have at least 5 characters</li>
            <li :class="{ valid: usernameRules.startsLetter }">Must begin with a letter</li>
            <li :class="{ valid: usernameRules.lettersNumbers }">
              Can only contain letters and numbers
            </li>
          </ul>
        </div>

        <div v-if="!passwordValid">
          <span>Password</span>
          <ul>
            <li :class="{ valid: passwordRules.length }">Must have at least 8 characters</li>
            <li :class="{ valid: passwordRules.uppercase }">Must have 1 uppercase character</li>
            <li :class="{ valid: passwordRules.lowercase }">Must have 1 lowercase character</li>
            <li :class="{ valid: passwordRules.number }">Must have 1 number</li>
            <li :class="{ valid: passwordRules.special }">Must have 1 special character</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-form > button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none; 
}
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
  background-color: #3f3f41;
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

.valid {
  color: green;
}

.login-form > button {
  font-size: medium;
  color: #f8f8f8;
  background-color: #000;
  border-radius: 999px;
  padding: 5px 10px;
  border: 0;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #222831;
  margin-bottom: 8px;
  display: inline-block;
}

.login-form > button:active {
  transform: scale(97%);
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

  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.form-item {
  box-sizing: border-box;
  width: 160px;
  margin-bottom: 5px;
}

.login-form h3 {
  text-align: center;
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
  border-radius: 15px;
}

.login-view {
  flex: 1;
  background-color: #efeded;
  opacity: 97%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-width {
  width: 0;
}
</style>
