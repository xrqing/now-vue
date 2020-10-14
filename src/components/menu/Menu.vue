<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--搜索-->
      <el-form :inline="true" :model="queryInfo" size="small">
        <el-form-item label="菜单名称：">
          <el-input
            placeholder="请输入菜单名称"
            v-model="queryInfo.menuName"
            clearable
            @clear="getMenuList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getMenuList"
              >搜索</el-button
            >
          </el-input>
        </el-form-item>
      </el-form>

      <!--新增菜单-->
      <div>
        <el-tooltip
          effect="dark"
          content="新增菜单"
          placement="top"
          :enterable="false"
        >
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            round
            @click="addDialogVisible = true"
          ></el-button>
        </el-tooltip>

        <!--刷新-->
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button
            size="small"
            type="primary"
            round
            icon="el-icon-refresh"
            @click="refresh()"
          />
        </el-tooltip>
      </div>

      <!--列表-->
      <el-table
        :data="menuList"
        stripe
        row-key="id"
        :default-expand-all="false"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          label="编号"
          prop="id"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="菜单名称"
          prop="menuName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
        ></el-table-column>
        <el-table-column label="菜单路径" prop="path" align="center">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.path === null">一级菜单无路径</el-tag>
            <el-tag size="small" v-else type="success">{{ scope.row.path }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="菜单级数" prop="level" align="center">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.level === 0">一级</el-tag>
            <el-tag size="small" v-else type="success">二级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否隐藏" prop="hidden" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleHiddenChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="2"
              v-model="scope.row.hidden"
            ></el-switch> </template
        ></el-table-column>
        <el-table-column label="操作" align="center" width="210">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                round
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                round
                @click="removeMenuById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--新增对话框-->
    <el-dialog
      title="新增菜单"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="rulesAddForm"
        ref="addFormRef"
        label-width="90px"
      >
        <el-form-item label="菜单名称:" prop="menuName" style="width: 500px">
          <el-input v-model="addForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：">
          <el-select v-model="addForm.parentId" placeholder="请选择菜单">
            <el-option
              v-for="item in selectMenuList"
              :key="item.id"
              :label="item.menuName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单路径:" prop="path" style="width: 500px">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort" style="width: 500px">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏:" prop="hidden" style="width: 500px">
          <el-radio-group v-model="addForm.hidden">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑对话框-->
    <el-dialog
      title="编辑菜单"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFromRef"
        :model="editFrom"
        :rules="editFromRules"
        label-width="90px"
      >
        <el-form-item label="菜单名称:" prop="menuName" style="width: 500px">
          <el-input v-model="editFrom.menuName"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：">
          <el-select v-model="editFrom.parentId" placeholder="请选择菜单">
            <el-option
              v-for="item in selectMenuList"
              :key="item.id"
              :label="item.menuName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单路径:" style="width: 500px">
          <el-input v-model="editFrom.path"></el-input>
        </el-form-item>
        <el-form-item label="排序:" style="width: 500px">
          <el-input v-model="editFrom.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏:" style="width: 500px">
          <el-radio-group v-model="editFrom.hidden">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="editMenuInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询参数
      queryInfo: {
        menuName: ''
      },

      menuList: [],

      // 控制新增对话显示与隐藏
      addDialogVisible: false,

      // 新增菜单的表单数据
      addForm: {
        menuName: '',
        sort: 0,
        hidden: 1,
        parentId: ''
      },

      // 下拉菜单选择
      selectMenuList: [],

      // 添加表达的验证规则
      rulesAddForm: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ]
      },

      // 控制编辑管理员对话框显示与隐藏
      editDialogVisible: false,

      // 查询到的管理员信息对象
      editFrom: {},
      // 控制二级菜单列表显示与关闭
      menuChildrenDialogVisible: false,
      // 查询二级列表数据
      menuChildrenList: [],

      // 添加表达的验证规则
      editFromRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ]
      }
    }
  },
  // 生命周期函数
  created () {
    this.getMenuList()
    this.getMenuSelectList()
  },

  methods: {
    // 列表数据
    async getMenuList () {
      const { data: res } = await this.$http.get('/menu/list', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.menuList = res.data
    },

    // 监听是否隐藏
    handleHiddenChange (index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/menu/updateHidden/' + row.id + '/' + row.hidden)
            .then((response) => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          })
          this.getMenuList()
        })
    },

    // 监听对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    // 下拉菜单选择
    async getMenuSelectList () {
      const { data: res } = await this.$http.get('/menu/selectList')
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.selectMenuList = res.data
      this.selectMenuList.unshift({ id: 0, menuName: '无上级菜单' })
    },

    // 新增
    addMenu () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 通过发送api请求
        const { data: res } = await this.$http.post(
          '/menu/create',
          this.addForm
        )
        if (res.code !== 200) {
          this.$message.error(res.message)
        }
        this.$message.success(res.message)
        // 隐藏对话框
        this.addDialogVisible = false
        // 重新加载数据
        this.getMenuList()
      })
    },

    // 展示编辑菜单对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/menu/' + id)
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },

    // 监听编辑对话框关闭
    editDialogClosed () {
      this.$refs.editFromRef.resetFields()
    },

    // 修改菜单信息并提交
    editMenuInfo () {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return
        // 发起数据请求
        const { data: res } = await this.$http.post(
          '/menu/update/' + this.editFrom.id,
          {
            menuName: this.editFrom.menuName,
            parentId: this.editFrom.parentId,
            sort: this.editFrom.sort,
            hidden: this.editFrom.hidden
          }
        )
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.editDialogVisible = false
        this.getMenuList()
        this.$message.success(res.message)
      })
    },

    // 删除
    async removeMenuById (id) {
      // 提示信息
      const confirmResult = await this.$confirm(
        '此操作将永久删除该菜单, 是否继续?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('/menu/delete/' + id)
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
      this.getMenuList()
    },

    // 刷新
    refresh () {
      this.getMenuList()
      return this.$message.success('刷新成功')
    }
  }
}
</script>

<style scoped>
</style>
