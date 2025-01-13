<template>
  <div class="dict-management">
    <el-row :gutter="20">
      <!-- 字典类型列表 -->
      <el-col :span="8">
        <div class="type-header">
          <h3>字典类型</h3>
          <el-button type="primary" size="small" @click="handleAddType">
            <el-icon><Plus /></el-icon>新增类型
          </el-button>
        </div>
        <el-input
          v-model="typeSearchKey"
          placeholder="搜索字典类型"
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-table
          :data="dictTypeList"
          style="width: 100%"
          @row-click="handleTypeSelect"
          highlight-current-row
        >
          <el-table-column prop="name" label="类型名称" />
          <el-table-column prop="code" label="类型编码" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button link type="primary" @click.stop="handleEditType(row)">编辑</el-button>
              <el-button link type="danger" @click.stop="handleDeleteType(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!-- 字典数据列表 -->
      <el-col :span="16">
        <div class="data-header">
          <h3>字典数据</h3>
          <el-button 
            type="primary" 
            size="small" 
            @click="handleAddData"
            :disabled="!currentType"
          >
            <el-icon><Plus /></el-icon>新增数据
          </el-button>
        </div>
        <el-table :data="dictDataList" style="width: 100%">
          <el-table-column prop="label" label="数据标签" />
          <el-table-column prop="value" label="数据值" />
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEditData(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDeleteData(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 字典类型表单弹窗 -->
    <el-dialog
      v-model="typeDialogVisible"
      :title="isEdit ? '编辑字典类型' : '新增字典类型'"
      width="500px"
    >
      <el-form
        ref="typeFormRef"
        :model="typeForm"
        :rules="typeRules"
        label-width="100px"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="typeForm.name" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="类型编码" prop="code">
          <el-input v-model="typeForm.code" placeholder="请输入类型编码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="typeForm.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="typeForm.remark"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="typeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTypeSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 字典数据表单弹窗 -->
    <el-dialog
      v-model="dataDialogVisible"
      :title="isEdit ? '编辑字典数据' : '新增字典数据'"
      width="500px"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRules"
        label-width="100px"
      >
        <el-form-item label="数据标签" prop="label">
          <el-input v-model="dataForm.label" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据值" prop="value">
          <el-input v-model="dataForm.value" placeholder="请输入数据值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dataForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="dataForm.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dataDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDataSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

// 字典类型列表数据
const dictTypeList = ref([
  {
    id: 1,
    name: '用户状态',
    code: 'user_status',
    status: 1,
    remark: '用户状态字典'
  },
  {
    id: 2,
    name: '性别',
    code: 'gender',
    status: 1,
    remark: '性别字典'
  }
])

// 字典数据列表
const dictDataList = ref([
  {
    id: 1,
    typeId: 1,
    label: '正常',
    value: '1',
    sort: 1,
    status: 1
  },
  {
    id: 2,
    typeId: 1,
    label: '禁用',
    value: '0',
    sort: 2,
    status: 1
  }
])

const typeSearchKey = ref('')
const currentType = ref(null)
const typeDialogVisible = ref(false)
const dataDialogVisible = ref(false)
const isEdit = ref(false)

// 字典类型表单
const typeForm = ref({
  name: '',
  code: '',
  status: 1,
  remark: ''
})

// 字典数据表单
const dataForm = ref({
  label: '',
  value: '',
  sort: 0,
  status: 1
})

// 表单校验规则
const typeRules = {
  name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入类型编码', trigger: 'blur' }]
}

const dataRules = {
  label: [{ required: true, message: '请输入数据标签', trigger: 'blur' }],
  value: [{ required: true, message: '请输入数据值', trigger: 'blur' }]
}

// 选择字典类型
const handleTypeSelect = (row) => {
  currentType.value = row
  // 加载对应的字典数据列表
}

// 处理添加字典类型
const handleAddType = () => {
  isEdit.value = false
  typeForm.value = {
    name: '',
    code: '',
    status: 1,
    remark: ''
  }
  typeDialogVisible.value = true
}

// 处理编辑字典类型
const handleEditType = (row) => {
  isEdit.value = true
  typeForm.value = { ...row }
  typeDialogVisible.value = true
}

// 处理删除字典类型
const handleDeleteType = (row) => {
  ElMessageBox.confirm(
    `确认要删除字典类型"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 处理添加字典数据
const handleAddData = () => {
  if (!currentType.value) {
    ElMessage.warning('请先选择字典类型')
    return
  }
  isEdit.value = false
  dataForm.value = {
    label: '',
    value: '',
    sort: 0,
    status: 1
  }
  dataDialogVisible.value = true
}

// 处理编辑字典数据
const handleEditData = (row) => {
  isEdit.value = true
  dataForm.value = { ...row }
  dataDialogVisible.value = true
}

// 处理删除字典数据
const handleDeleteData = (row) => {
  ElMessageBox.confirm(
    `确认要删除该字典数据吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 处理状态变更
const handleStatusChange = (row) => {
  // 实现状态变更逻辑
  ElMessage.success('状态更新成功')
}

// 处理字典类型表单提交
const handleTypeSubmit = () => {
  // 实现表单提交逻辑
  ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
  typeDialogVisible.value = false
}

// 处理字典数据表单提交
const handleDataSubmit = () => {
  // 实现表单提交逻辑
  ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
  dataDialogVisible.value = false
}
</script>

<style scoped>
.dict-management {
  padding: 20px;
  background: #fff;
}

.type-header,
.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
  }
}

.search-input {
  margin-bottom: 20px;
}
</style> 