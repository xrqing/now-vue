<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--搜索-->
      <el-form :inline="true" :model="queryInfo" size="small">
        <el-form-item label="姓名：">
          <el-input
            placeholder="请输入姓名"
            v-model="queryInfo.username"
            clearable
            @clear="getAdminList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getAdminList"
              >搜索</el-button
            >
          </el-input>
        </el-form-item>
      </el-form>

      <!--添加-->
      <div>
        <el-tooltip
          effect="dark"
          content="新增管理员"
          placement="top"
          :enterable="false"
        >
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addDialogVisible = true"
            round
          ></el-button>
        </el-tooltip>
      </div>

      <!--列表-->
      <el-table :data="adminList" stripe>
        <el-table-column
          label="编号"
          prop="id"
          align="center"
          width="70"
        ></el-table-column>
        <el-table-column
          label="姓名"
          prop="username"
          align="center"
          width="130"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="telephone"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="头像"
          prop="icon"
          align="center"
          width="130"
        ></el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          label="昵称"
          prop="nickName"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          width="170"
        ></el-table-column>
        <el-table-column label="状态" align="center" width="90">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="所属角色"
          prop="roleName"
          align="center"
          width="130"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="200">
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
                @click="removeAdminById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                round
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!--添加对话框-->
    <el-dialog
      title="添加管理员"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="rulesAddForm"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="姓名:" prop="username" style="width: 500px">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password" style="width: 500px">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称:" prop="nickName" style="width: 500px">
          <el-input v-model="addForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email" style="width: 500px">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="telephone" style="width: 500px">
          <el-input v-model="addForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="note" style="width: 500px">
          <el-input v-model="addForm.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑管理员对话框-->
    <el-dialog
      title="编辑管理员"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFromRef"
        :model="editFrom"
        :rules="editFromRules"
        label-width="70px"
      >
        <el-form-item label="姓名:">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称:" prop="nickName">
          <el-input v-model="editFrom.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="telephone">
          <el-input v-model="editFrom.telephone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="editAdminInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号码的规则
    var checkTelephone = (rule, value, cb) => {
      const regTelephone = /^1[34578]\d{9}$/
      if (regTelephone.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }

    return {
      // 查询参数
      queryInfo: {
        username: '',
        pageNum: 1,
        pageSize: 10
      },
      adminList: [],
      total: 0,
      // 控制添加对话显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        nickName: '',
        email: '',
        telephone: '',
        note: ''
      },
      // 添加表达的验证规则
      rulesAddForm: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkTelephone, trigger: 'blur' }
        ],
        note: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },

      // 控制编辑管理员对话框显示与隐藏
      editDialogVisible: false,

      // 查询到的管理员信息对象
      editFrom: {},

      // 修改表单的验证规则
      editFromRules: {
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkTelephone, trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getAdminList()
  },

  methods: {
    async getAdminList () {
      const { data: res } = await this.$http.get('/admin/list', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.adminList = res.data.list
      this.total = res.data.total
      console.log(res)
    },

    // 监听pageSize
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getAdminList()
    },
    // 监听pageNum
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getAdminList()
    },
    // 监听状态改变
    handleStatusChange (index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/admin/' + row.id + '/' + row.status)
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
          this.getAdminList()
        })
    },

    // 监听对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    // 新增
    addAdmin () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 通过发送api请求
        const { data: res } = await this.$http.post('/admin/add', this.addForm)
        if (res.code !== 200) {
          this.$message.error(res.message)
        }
        this.$message.success(res.message)
        // 隐藏对话框
        this.addDialogVisible = false
        // 重新加载数据
        this.getAdminList()
      })
    },

    // 展示编辑管理员对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/admin/' + id)
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

    // 修改管理员信息并提交
    editAdminInfo () {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return
        // 发起数据请求
        const { data: res } = await this.$http.post(
          '/admin/edit/' + this.editFrom.id,
          {
            nickName: this.editFrom.nickName,
            email: this.editFrom.email,
            telephone: this.editFrom.telephone
          }
        )
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.editDialogVisible = false
        this.getAdminList()
        this.$message.success(res.message)
      })
    },

    // 根据id删除对应的管理员
    async removeAdminById (id) {
      // 提示信息
      const confirmResult = await this.$confirm(
        '此操作将永久删除该管理员, 是否继续?',
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
      const { data: res } = await this.$http.post('/admin/delete/' + id)
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
      this.getAdminList()
    }
  }
}
</script>

<style scoped>
.add_row {
  margin-top: 10px;
}
</style>>
