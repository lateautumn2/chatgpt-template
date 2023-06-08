// 整合封装 vue3 composition api
import { ref } from 'vue'
import { StreamGpt, Typewriter } from '@/utils/scripts'
import { md } from '@/utils/markdown'

export const useGpt = (key, history = false) => {
  const streamingText = ref('')
  const streaming = ref(false)
  const msgList = ref([])
  const typewriter = new Typewriter((str) => {
    streamingText.value += str || ''
    // console.log('str', streamingText.value)
  })
  const gpt = new StreamGpt(key, {
    onStart: (prompt) => {
      streaming.value = true
      msgList.value.push({
        role: 'user',
        content: prompt
      })
    },
    onPatch: (text) => {
      //   console.log('onPatch', text)
      typewriter.add(text)
    },
    onCreated: () => {
      typewriter.start()
    },
    onDone: () => {
      typewriter.done()
      streaming.value = false
      msgList.value.push({
        role: 'system',
        content: md.render(streamingText.value)
      })
      streamingText.value = ''
    }
  })
  // 如果是history模式，则在strame时将msgList传入
  const stream = (prompt) => {
    gpt.stream(prompt, history ? msgList.value : undefined)
  }
  return {
    streamingText,
    streaming,
    msgList,
    stream
  }
}
