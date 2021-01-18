<template>
  <d2-container class="page">
    <div class="cell">
      <div class="item">
        <div class="title">Redis 内存实时占用情况</div>
        <memory-info />
      </div>
      <div class="item">
        <div class="title">Redis key的实时数量</div>
        <key-info />
      </div>
    </div>
  </d2-container>
</template>

<script>
import MemoryInfo from './components/memoryInfo'
import KeyInfo from './components/keyInfo'

export default {
  components: { MemoryInfo, KeyInfo }
}
</script>

<style lang="scss" scoped>
.page {
  .cell {
    display: flex;
    flex-direction: column;
    .item {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 300px;
      & + .item {
        margin-left: 20px;
      }
      .title {
        border-left: 4px solid #000;
        line-height: 18px;
        text-indent: 5px;
        font-size: 18px;
        font-weight: bold;
        color: #555;
      }
    }
  }
}
</style>
