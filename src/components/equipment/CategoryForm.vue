```vue
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="getDialogTitle"
    width="500px"
    @close="handleClose">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="上级分类" v-if="!isEdit">
        <el-cascader
          v-model="form.parentId"
          :options="categoryOptions"
          :props="{
            checkStrictly: true,
            label: 'name',
            value: 'id',
            emitPath: false
          }"
          placeholder="请选择上级分类"
          clearable
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number 
          v-model="form.sort" 
          :min="0" 
          :max="999"
          placeholder="数字越小越靠前" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入分类描述" />
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
import { ref, computed, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  isEdit: Boolean,
  parentCategory: {
    type: Object,
    default: () => null
  },
  categoryData: {
    type: Object,
    default: () => ({})
  },
  categoryOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = ref(false)
const formRef = ref(null)

const form = ref({
  name: '',
  parentId: null,
  sort: 0,
  description: ''
})

const getDialogTitle = computed(() => {
  if (props.isEdit) return '编辑分类'
  return props.parentCategory ? `添加 "${props.parentCategory.name}" 的子分类` : '新增顶级分类'
})

const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序值', trigger: 'blur' }
  ]
}

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    if (props.isEdit) {
      form.value = { ...props.categoryData }
    } else if (props.parentCategory) {
      form.value.parentId = props.parentCategory.id
    }
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

const handleClose = () => {
  formRef.value?.resetFields()
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
```