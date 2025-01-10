<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-form-item label="处理结果" prop="action">
        <el-radio-group v-model="form.action">
          <el-radio label="return">确认归还</el-radio>
          <el-radio label="cancel">取消订单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="form.remarks"
          type="textarea"
          :rows="3"
          placeholder="请输入处理备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '处理订单'
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = ref(false)
const formRef = ref(null)

const form = ref({
  action: 'return',
  remarks: ''
})

const rules = {
  action: [{ required: true, message: '请选择处理结果', trigger: 'change' }],
  remarks: [{ required: true, message: '请输入处理备注', trigger: 'blur' }]
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

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', form.value)
      handleClose()
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