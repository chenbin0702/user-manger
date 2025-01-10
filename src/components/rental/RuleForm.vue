<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑租赁规则"
    width="500px">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-form-item label="租期范围">
        <el-input-number v-model="form.minDuration" :min="1" class="duration-input" />
        <span class="duration-separator">至</span>
        <el-input-number v-model="form.maxDuration" :min="1" class="duration-input" />
        <span class="duration-unit">天</span>
      </el-form-item>
      <el-form-item label="押金" prop="depositAmount">
        <el-input-number 
          v-model="form.depositAmount"
          :min="0"
          :precision="2"
          :step="100"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="日租金" prop="dailyRate">
        <el-input-number 
          v-model="form.dailyRate"
          :min="0"
          :precision="2"
          :step="10"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="逾期费用/天" prop="overdueFee">
        <el-input-number 
          v-model="form.overdueFee"
          :min="0"
          :precision="2"
          :step="10"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="损坏赔偿" prop="damagePolicy">
        <el-input
          v-model="form.damagePolicy"
          type="textarea"
          :rows="3" />
      </el-form-item>
      <el-form-item label="状态" prop="isActive">
        <el-switch v-model="form.isActive" />
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
  visible: Boolean,
  ruleData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = ref(false)
const formRef = ref(null)

const form = ref({
  minDuration: 1,
  maxDuration: 30,
  depositAmount: 0,
  dailyRate: 0,
  overdueFee: 0,
  damagePolicy: '',
  isActive: true
})

const rules = {
  depositAmount: [{ required: true, message: '请输入押金金额', trigger: 'blur' }],
  dailyRate: [{ required: true, message: '请输入日租金', trigger: 'blur' }],
  overdueFee: [{ required: true, message: '请输入逾期费用', trigger: 'blur' }],
  damagePolicy: [{ required: true, message: '请输入损坏赔偿规则', trigger: 'blur' }]
}

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val && props.ruleData) {
    form.value = { ...props.ruleData }
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
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
.duration-input {
  width: 120px;
}

.duration-separator {
  margin: 0 10px;
}

.duration-unit {
  margin-left: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>