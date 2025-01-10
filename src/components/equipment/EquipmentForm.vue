```vue
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑设备' : '新增设备'"
    width="600px">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-form-item label="设备编号" prop="code">
        <el-input v-model="form.code" placeholder="请输入设备编号" />
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备分类" prop="categoryId">
        <el-cascader
          v-model="form.categoryId"
          :options="categories"
          :props="{
            checkStrictly: true,
            label: 'name',
            value: 'id'
          }"
          placeholder="请选择设备分类"
        />
      </el-form-item>
      <el-form-item label="规格参数" prop="specifications">
        <el-input
          v-model="form.specifications"
          type="textarea"
          :rows="3"
          placeholder="请输入规格参数" />
      </el-form-item>
      <el-form-item label="售价" prop="price">
        <el-input-number 
          v-model="form.price"
          :min="0"
          :precision="2"
          :step="100"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="租赁价(天)" prop="rentPrice">
        <el-input-number 
          v-model="form.rentPrice"
          :min="0"
          :precision="2"
          :step="10"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="在库" value="在库" />
          <el-option label="租出" value="租出" />
          <el-option label="维修中" value="维修中" />
        </el-select>
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
  isEdit: Boolean,
  categories: {
    type: Array,
    required: true
  },
  equipmentData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = ref(false)
const formRef = ref(null)

const form = ref({
  code: '',
  name: '',
  categoryId: null,
  specifications: '',
  price: 0,
  rentPrice: 0,
  status: '在库'
})

const rules = {
  code: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择设备分类', trigger: 'change' }],
  specifications: [{ required: true, message: '请输入规格参数', trigger: 'blur' }],
  price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  rentPrice: [{ required: true, message: '请输入租赁价格', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val && props.isEdit) {
    form.value = { ...props.equipmentData }
  }
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