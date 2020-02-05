<template>
  <svg viewBox="0 0 300 400" @click="reflesh">
    <defs>
      <linearGradient id="line-grad">
        <stop :offset="animData.xPos - 0.65" stop-color="rgba(50,10,0,0)" />
        <stop :offset="animData.xPos - 0.35" stop-color="rgba(50,10,0,0.2)" />
        <stop :offset="animData.xPos - 0.2" stop-color="rgba(205,20,0,0.5)" />
        <stop :offset="(animData.xPos || 0)" stop-color="rgba(255,150,0,1)" />
        <stop :offset="(animData.xPos || 0) + 0.01" stop-color="rgba(50,10,0,0.0)" />
      </linearGradient>
    </defs>
    <line x1="0" y1="100" x2="300" y2="100" stroke="rgb(30,40,50)" stroke-width="0.2" />
    <path 
      class="path" 
      fill="none" 
      stroke="url(#line-grad)" 
      stroke-width="1.5" 
      stroke-linecap="round" 
      :d="pathStr"
     />
  </svg>
</template>

<script lang="ts">
import { createComponent, computed, reactive, onMounted, ref } from '@vue/composition-api'

const ANCHOR_COUNT = 13 // アンカーポイントの数
const WIDTH = 300 // ステージの幅
const XSCALE = WIDTH / (ANCHOR_COUNT - 1) // アンカーポイントの間隔(X)
const YSCALE = 50 // 振幅の最大値
const YBASE = 100 // Y方向ベースライン
const CT_DELTA = 0.35 // ベジェ曲線のコントロール点の位置（0-0.5）。山の尖り方が変わる
const ANIMDUR = 1200 // アニメーション一周の長さ(ms)

interface Point {
  x: number,
  y: number
}

export default createComponent({
  setup(props, ctx) {
    
    /** パスの情報を保持 */
    const pathData = reactive({
      anchors: [0] //y座標(0-1)の配列
    })

    /** アニメーションに関する情報を保持 */
    const animData = reactive({
      startTime: 0, // アニメーション開始時刻(ms)
      xPos: 0 // 横方向アニメーションの進捗(0-1)
    })

    /** 新しいパスを作成し、アニメーションをリスタートします */
    const reflesh = () => {
      pathData.anchors = new Array(ANCHOR_COUNT).fill(0).map((_, index) => Math.random() * (index % 2 ? 1 : -1))
      animData.startTime = Date.now()
      animData.xPos = 0
    }

    /** パスの文字列表現を返します */
    const pathStr = computed<string>(() => {
      if(pathData.anchors.length < 2) { return '' }
      const pts: Point[] = []
      for (let index = 0; index < pathData.anchors.length - 1; index++) {
        const p1 = { x: index, y: pathData.anchors[index]}
        const p2 = { x: index + 1, y: pathData.anchors[index + 1]}
        const c1 = { x: p1.x + CT_DELTA, y: p1.y }
        const c2 = { x: p2.x - CT_DELTA, y: p2.y }
        pts.push(c1, c2, p2)
      }

      // 0-1のy座標配列を元に、アンカーポイントの配列を生成
      const ptsScaled: Point[] = pts.map(p => {
        // 画面中央で山が高くなるよう元のy座標を増幅する
        const xr = (p.x / ANCHOR_COUNT - 0.5) * Math.PI * 1.5
        const wave = Math.pow(Math.max(0, Math.cos(xr)) * 1.5, 2)
        return { x: p.x * XSCALE, y: p.y * YSCALE * wave  + YBASE }
      })

      // アンカーポイントの配列をパス文字列に変換
      const firstP = { x: 0, y: ptsScaled[0].y } //ptsScaled[0]
      if (!firstP){ return '' }
      return `M${firstP.x},${firstP.y} C` + ptsScaled.map(p => `${p.x},${p.y}`).join(' ')
    })

    onMounted(() => {
      reflesh()
      const updateAnim = () => {
        window.requestAnimationFrame(updateAnim)
        const time = Date.now() - animData.startTime
        animData.xPos = time / ANIMDUR
        // アニメーションが端まで到達したら、少し空けて次のアニメーションを開始
        if (animData.xPos >= 1.3) {
          reflesh()
        }
      }
      updateAnim()
    })

    return {
      pathData,
      pathStr,
      reflesh,
      animData
    }
  }
})
</script>

<style lang="scss" scoped>
</style>