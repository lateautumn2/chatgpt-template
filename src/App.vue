<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useGpt } from '@/hook/api.js'
import { md } from '@/utils/markdown'
import { useScroll } from '@vueuse/core'

const { msgList, streaming, streamingText, stream } = useGpt('your key', true)

const streamText = computed(() => {
  return md.render(streamingText.value)
})
// 滚动的元素
const listEl = ref()
const { y } = useScroll(listEl)
const scrollToBottom = () => {
  nextTick(() => {
    y.value = listEl.value?.scrollHeight || 0
  })
}
// 发送内容
const text = ref('')
const handleSubmit = (e, content) => {
  if (e.ctrlKey) {
    if (content === '') return
    stream(content)
    text.value = ''
    //主动滚动到最下
    scrollToBottom()
  }
}
// 监听streamingText变化，滚动到底部
watch(streamText, (val) => {
  if (val) {
    scrollToBottom()
  }
})
//文字流输出完后手动滚动
watch(streaming, (val) => {
  if (!val) {
    scrollToBottom()
  }
})
</script>

<template>
  <div class="box">
    <div class="left">
      <h1 class="title">ChatGPT Next</h1>
      <p>AI CAN HELP YOUR ?</p>
      <p>I DOT'T KNOW</p>
      <p>BUT YOU CAN TRY !</p>
      <div class="bottom">
        <div class="btn">配置</div>
        <div class="btn">清除上下文</div>
      </div>
    </div>
    <div class="right">
      <div class="head">ChatGPT 对话</div>
      <div class="chat" ref="listEl">
        <div v-for="(item, index) in msgList" :key="index">
          <div class="system" v-if="item.role == 'system'">
            <div class="img">{{ item.role }}</div>
            <div class="bubble" v-html="item.content"></div>
          </div>
          <div class="user" v-if="item.role == 'user'">
            <div class="img">USER</div>
            <div class="bubble">
              {{ item.content }}
            </div>
          </div>
        </div>
        <div class="system" v-if="streaming">
          <div class="img">system</div>
          <div class="bubble" v-html="streamText"></div>
        </div>
      </div>
      <div class="input">
        <div class="input_row">
          <textarea class="input_enter" rows="3" placeholder="Ctrl+Enter发送" type="text" v-model="text" @keydown.enter="handleSubmit($event, text)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 1200px;
  height: 800px;
  background-color: #fff;
  box-shadow: 0 0 10px 5px #eee;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
}
.left {
  position: relative;
  width: 300px;
  height: 100%;
  background: linear-gradient(to bottom, #bbe5f6, #e7f8ff);
  background-color: skyblue;
  padding: 16px;
  .bottom {
    width: calc(100% - 32px);
    position: absolute;
    bottom: 16px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    .btn {
      padding: 8px 8px;
      border-radius: 8px;
      background-color: #fff;
      cursor: pointer;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    }
  }
}
.right {
  flex: 1;
  height: 100%;
  .head {
    padding: 0 16px;
    width: 100%;
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #eee;
    font-weight: 700;
    font-size: 24px;
  }
  .chat {
    width: 100%;
    height: calc(100% - 80px - 100px);
    border-bottom: 1px solid #eee;
    padding: 16px;
    color: #3c4045;
    font-size: 14px;
    font-weight: 600;
    overflow-y: auto;
    .system {
      padding: 10px 0;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .img {
        min-width: 32px;
        height: 32px;
        overflow: hidden;
      }
      .bubble {
        max-width: calc(100% - 200px);
        display: inline-block;
        box-sizing: border-box;
        height: auto;
        background-color: #e7f8ff;
        padding: 16px;
        border-radius: 0 10px 10px 10px;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
      }
    }
    .user {
      padding: 10px 0;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .img {
        min-width: 32px;
        height: 32px;
        overflow: hidden;
      }
      .bubble {
        max-width: calc(100% - 200px);
        display: inline-block;
        box-sizing: border-box;
        height: auto;
        background-color: #f2f2f2;
        padding: 16px;
        border-radius: 10px 0 10px 10px;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
      }
    }
  }
  .input {
    padding: 16px;
    width: 100%;
    height: 100px;
    .input_row {
      height: 100%;
      width: 100%;
    }
    .input_enter {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      border-radius: 10px;
      border: 1px solid #dedede;
      box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.03);
      background-color: var(--white);
      color: var(--black);
      font-family: inherit;
      padding: 10px 10px 14px;
      resize: none;
      outline: none;
      &:focus {
        border: 1px solid #1d93ab;
      }
    }
  }
}
</style>
