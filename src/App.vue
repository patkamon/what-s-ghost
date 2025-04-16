<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { onUnmounted } from 'vue'
import Pagination from './components/Pagination.vue'
import { watchEffect } from 'vue'


const data_ref = ref([])
const audio = ref(null)
const isPlaying = ref(false)
const currentPage = ref(1)
const search = ref(false)
const searchQuery = ref('')
const currentPlay = ref('')


function get_ghost(){
  fetch(`https://u72h6lm16b.execute-api.ap-southeast-1.amazonaws.com/prod?page=${currentPage.value}&limit=12`, {
  method: 'GET',
})
  .then(response => 
  response.json()
)
  .then(data => {
    data_ref.value = data
    search.value = false
  })
  .catch(error => {
    console.error('Error:', error);
  });
}



async function sendPost(s3Key) {
  audio.value?.pause()
  if (currentPlay.value === s3Key) {
    currentPlay.value = ''
    return
  }else{
  currentPlay.value = s3Key
  const response = await fetch('https://u72h6lm16b.execute-api.ap-southeast-1.amazonaws.com/prod', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bucket_name: 'theghostbucketbrainbow2025',
      s3_object_key: s3Key,
    }),
  });

  const data = await response.json();
  audio.value = new Audio(data.url)
  audio.value?.play()
  }
}

const pause = () => {
  audio.value?.pause()
}

watchEffect(() => {
  get_ghost()
})

onMounted(() => {
  get_ghost()
})

const goToSearch = () => {
  if (searchQuery.value.trim()) {
    fetch(`https://u72h6lm16b.execute-api.ap-southeast-1.amazonaws.com/prod/search?keyword=${searchQuery.value}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        data_ref.value = data
        search.value = true
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

</script>

<template>
    <div class="search-bar w-[92%] flex gap-4 m-auto">
      <span class="p-inputgroup-addon border-2 bg-white rounded-full px-3 items-center flex justify-center" @click="get_ghost()">
      <i class="pi pi-home"></i>
    </span>
      <input
      class="bg-white border rounded-2xl px-4 py-2 w-full"
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        @keyup.enter="goToSearch"
      />
      <button @click="goToSearch">Search</button>
    </div>

    <template v-if="search == true">
      <div class="flex justify-between items-center mt-4">
        <h2 class="text-white text-2xl font-bold"> {{ data_ref.length }} Results Found for "{{searchQuery}}" </h2>
      </div>
    </template>

  <div class="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    <div v-for="(item, index) in data_ref" :key="index" class="rounded-xl shadow-lg p-4 bg-white">
      <img :src="item.thumbnail_url" alt="Thumbnail" class="w-full h-48 object-cover rounded-lg" />

      <div class="flex justify-between items-center mt-2">
        <h2 class="font-bold text-lg truncate">{{ item.video_title }}</h2>

      </div>

      <p class="mt-1 text-sm text-gray-700 overflow-y-scroll overflow-ellipsis h-24">
        {{ item.summary }}
      </p>

      <div class="flex justify-between mt-2 items-center mr-2">
        <button @click="sendPost(item.s3_key)" class="text-green-600 hover:text-green-800 ">
          <i v-if="currentPlay!=item.s3_key" class="pi pi-volume-up text-xl"></i>
          <i v-else class="pi pi-pause"></i>
        </button>

        <a :href="item.video_link" target="_blank" title="Watch Video">
          <i class="pi pi-external-link text-blue-500 text-xl hover:text-blue-700"></i>
        </a>
      </div>
    </div>
    <template v-if="search == false">
      <Pagination v-model="currentPage" :isLast="data_ref.length !=12" />
    </template>
  </div>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
i {
  font-size: 1.2rem;
  cursor: pointer;
}
/* Optional styling */
.p-inputgroup {
  max-width: 300px;
}
</style>