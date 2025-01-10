```vue
<template>
  <el-dialog
    v-model="dialogVisible"
    title="库存操作"
    width="500px">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-form-item label="操作类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="入库">入库</el-radio>
          <el-radio label="出库">出库</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number 
          v-model="form.quantity"
          :min="1"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="form.remarks"
          type="textarea"
          :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = ref(false)
const formRef = ref(null)

const form = ref({
  type: '入库',
  quantity: 1,
  remarks: ''
})

const rules = {
  type: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
  if (!val) {
    formRef.value?.resetFields()
  }
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', form.value)
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
```