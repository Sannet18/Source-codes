<script setup>
import { computed, inject } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'

const emit = defineEmits(['validate'])

const formData = defineModel()
const checkMark = inject('checkMark')

const submitted = ref(false)

const validateForm = () => {
  submitted.value = true
}

const isFormValid = computed(() => {
  const values = formData.value
  return (
    (values.title || '').trim() !== '' &&
    (values.author || '').trim() !== '' &&
    (values.type || '').trim() !== '' &&
    values.date !== '' &&
    values.date >= 1500 &&
    values.date <= 2030 &&
    (values.description || '').trim() !== ''
  )
})
</script>

<template>
  <div id="form">
    <div id="form-container">
      <header>Book Records</header>
      <br />
      <label for="title">Title</label>
      <input id="title" v-model="formData.title" placeholder="Book Title" />
      <span v-if="submitted && !formData.title" class="required-text">*Required</span>
      <label for="author">Author</label>
      <input id="author" v-model="formData.author" placeholder="Author" />
      <span v-if="submitted && !formData.author" class="required-text">*Required</span>
      <label for="type">Type</label>
      <select id="type" v-model="formData.type" class="type" placeholder="Genre">
        <option disabled value="">Select Type</option>
        <option value="Juvenile">Juvenile</option>
        <option value="Fiction">Fiction</option>
        <option value="Juv-Fic">Juv-Fic</option>
        <option value="Young Adult">Young Adult</option>
        <option value="Comic">Comic</option>
      </select>
      <span v-if="submitted && !formData.type" class="required-text">*Required</span>
      <label for="date">Date Published</label>
      <input
        id="date"
        type="Number"
        min="1500"
        max="2030"
        placeholder="Year : < 2030"
        v-model="formData.date"
      />
      <span v-if="submitted && !formData.date" class="required-text">*Required</span>
      <label for="description">Description</label>
      <textarea id="description" type="text" v-model="formData.description" />
      <span v-if="submitted && !formData.description" class="required-text">*Required</span>
      <button @click="validateForm" id="validate">Validate</button>
    </div>
    <div id="preview-container">
      <header>Preview</header>
      <img v-if="isFormValid" id="check-mark" :src="checkMark" alt="Check Mark" />
      <p><strong>Title:</strong> {{ formData.title }}</p>
      <p><strong>Author:</strong> {{ formData.author }}</p>
      <p><strong>Type:</strong> {{ formData.type }}</p>
      <p><strong>Date:</strong> {{ formData.date }}</p>
      <p><strong>Description:</strong> {{ formData.description }}</p>
    </div>
    <footer>©️ Sannet</footer>
  </div>
</template>

<style scoped>
footer {
  text-align: center;
  color: #f8f9ff;
  position: absolute;
  bottom: 10px;
}
#form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  min-height: 100vh;
  gap: 2rem;
  background: linear-gradient(135deg, #5f2eea, #3a86ff);
  padding: auto;
}

#form-container,
#preview-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 50px;
  margin: 15px;
  width: 280px;
  border: 1px solid;
  font-family: Spectral, system-ui;
  border-radius: 18px;
  color: #f8f9ff;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}
#form-container {
  overflow-y: auto;
}
#preview-container {
  overflow-y: auto;
  max-height: 400px;
}
#preview-container::-webkit-scrollbar {
  width: 8px;
  height: 10px;
}

#form-container::-webkit-scrollbar-thumb,
#preview-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 18px;
}

#form-container::-webkit-scrollbar-track,
#preview-container::-webkit-scrollbar-track {
  background-color: transparent;
}

header {
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
}

#form-container input,
#form-container textarea,
#form-container select {
  max-width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

#form-container input::placeholder,
#form-container textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

#form-container input:focus,
#form-container textarea:focus,
#form-container select:focus {
  background: rgba(255, 255, 255, 0.22);
  box-shadow: 0 0 0 2px rgba(72, 219, 251, 0.5);
}

textarea {
  min-height: 70px;
}
select {
  cursor: pointer;
}
#type option {
  color-scheme: dark;
  color: #000000;
}
#validate {
  margin-top: 12px;
  padding: 12px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  color: #0b132b;
  background: linear-gradient(135deg, #4dd8ff, #2ec4b6);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

#validate:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(46, 196, 182, 0.5);
}

#validate:active {
  transform: translateY(0);
}
.required-text {
  color: red;
  font-size: 0.7rem;
  font-weight: bold;
  font-family: cursive;
}
#check-mark {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 35px;
  right: 50px;
}
</style>
