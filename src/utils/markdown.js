import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

export const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span></div><div class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></div></div>`
      } catch (__) {
        console.log(__, 'error')
      }
    }
    return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span></div><div class="hljs"><code>${md.utils.escapeHtml(str)}</code></div></div>`
  }
})
