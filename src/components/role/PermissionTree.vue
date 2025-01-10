<template>
  <div class="permission-tree">
    <el-tree
      ref="treeRef"
      :data="permissions"
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedKeys"
      :props="{
        children: 'children',
        label: 'name'
      }"
      @check="handleCheck">
    </el-tree>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  permissions: {
    type: Array,
    required: true
  },
  checkedKeys: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:checkedKeys'])
const treeRef = ref(null)

const handleCheck = () => {
  if (!treeRef.value) return
  
  const checkedKeys = treeRef.value.getCheckedKeys()
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
  emit('update:checkedKeys', [...checkedKeys, ...halfCheckedKeys])
}
</script>