<template>
  <div class="user-list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row :gutter="20" class="el-row">
        <el-col :span="14"><div class="grid-content bg-purple">
          <div>
            <el-input placeholder="请输入内容"  class="input-with-select"
            v-model="listInfo.query" clearable @clear="clearReset">
              <el-button slot="append" icon="el-icon-search"
                         @click="searchUser"></el-button>
            </el-input>
          </div>
        </div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </div></el-col>
      </el-row>
      <el-table
          :data="users"
          style="width: 100%"
          border stripe class="el-table">
        <el-table-column type="index"></el-table-column>
        <el-table-column
            prop="username"
            label="姓名"
           >
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
           >
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话">
        </el-table-column>
        <el-table-column
            prop="role_name"
            label="角色"
           >
        </el-table-column>
        <el-table-column
            prop="mg_state"
            label="状态"
           >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            prop="address"
            label="操作"
            width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="_deleteUser(scope.row.id)"></el-button>
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="true">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="distributeRole(scope.row)"></el-button>s
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listInfo.pagenum"
          :page-sizes="[1,2,5,10]"
          :page-size="listInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="50%"
        @close="formClosed">
      <el-form :model="userRuleForm" :rules="userRules" ref="ruleForm" label-width="100px" >
        <el-form-item label="用户名" prop="username" class="el-form-item">
          <el-input v-model="userRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="el-form-item">
          <el-input v-model="userRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="telephone" class="el-form-item">
          <el-input v-model="userRuleForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email" class="el-form-item">
          <el-input v-model="userRuleForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addSingleUser">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
          <!--   用户编辑表单   -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="preEditForms">确 定</el-button>
  </span>
    </el-dialog>
    <!--  展示分配角色的对话框  -->
    <el-dialog
        title="提示"
        :visible.sync="distributeDialogVisible"
        width="50%">
      <p>当前的用户：{{roleInfo.username}}</p>
      <p>当前的角色：{{roleInfo.role_name}}</p>
      <el-select v-model="selectRoleId" placeholder="请选择" class="el-select">
        <el-option
            v-for="item in roleListInfo"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
    <el-button @click="distributeDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="distributeUserRoleRequest">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
import {getUserList,userState,addUserRequest,getUserId,editUserInfo,deleteUser,distributeUserRole} from "@/network/userlist";
import {getRoleList} from '@/network/powerlist'

export default {
  name: "UserList",
  data() {
    let checkEmail = (rule, value, callback) => {
      let regMail = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/;
      if (regMail.test(value)) {
        callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    let checkPhone = (rule,value,callback) => {
      let regPhone = /^1[3|4|5|7|8][0-9]{9}$/
      if (regPhone.test(value)) {
        callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      users:[],
      total:8,
      currentPage4:1,
      listInfo:{
        query:'',
        pagenum: 1,
        pagesize: 2
      },
      dialogVisible:false,
      editDialogVisible:false,
      userRuleForm:{
        username:'',
        password:'',
        telephone:'',
        email:''
      },
      editForm:{},
      editFormRules:{
          mobile:[
            { validator: checkPhone, trigger: 'blur' },
          ],
        email:[
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      userRules:{
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入正确的邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ]
      },
      //分配角色的对话框参数是否可见
      distributeDialogVisible:false,
      //存储该行用户的所有信息
      roleInfo:{},
      //存储角色列表的数据
      roleListInfo:[],
      selectRoleId:''

    }
  },
  created() {
    this._getUserList(this.listInfo.query,this.listInfo.pagenum,this.listInfo.pagesize);
  },
  methods:{
    _getUserList(query,page,size) {
        getUserList(query,page,size).then(res=>{
          if (res.meta.status!==200) return this.$message.error('获取用户列表失败');

          this.users = res.data.users;
          this.total = res.data.total;
        })
    },
    handleSizeChange(size) {
      console.log(size)
      this.listInfo.pagesize = size
      this._getUserList(this.listInfo.query,this.listInfo.pagenum,this.listInfo.pagesize)

    },
    handleCurrentChange(page) {
        this.listInfo.pagenum=page;
        this._getUserList(this.listInfo.query,this.listInfo.pagenum,this.listInfo.pagesize)
    },
    userStateChange(state) {

      userState(state).then(res=>{
        if (res.meta.status!==200) {
          state.mg_state=!state.mg_state
          this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功')
      })

    },
    searchUser() {
      this._getUserList(this.listInfo.query,this.listInfo.pagenum,this.listInfo.pagesize)
    },
    clearReset() {
      this._getUserList('',this.listInfo.pagenum,this.listInfo.pagesize)
    },
    addUser() {
      this.dialogVisible=true
    },
    formClosed() {
      this.$refs.ruleForm.resetFields();
    },
    addSingleUser() {
      this.$refs.ruleForm.validate(valid=>{
        if (!valid) return;
        addUserRequest(this.userRuleForm.username,this.userRuleForm.password,
            this.userRuleForm.telephone,this.userRuleForm.email).then(res=>{
          console.log(res)
          if (res.meta.status!==201) return this.$message.error('添加新用户失败')
          this.dialogVisible=false;
          this._getUserList(this.listInfo.query,this.listInfo.pagenum,this.listInfo.pagesize)
          this.$message.success('添加新用户成功')
        })
      })
    },
    showEditDialog(id) {
      getUserId(id).then(res=>{
        console.log(res)
        if (res.meta.status!==200) {
          return this.$message.error('请求编辑用户数据失败')
        }
        this.editForm = res.data;
        this.editDialogVisible=true;
      })
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //在表单提交之前先进行预验证
    preEditForms() {
      this.$refs.editFormRef.validate(valid=>{
        if (!valid) return this.$message.error('表单验证失败')
        //发送真正的网络请求
        editUserInfo(this.editForm.id,this.editForm.email,this.editForm.mobile).then(res=>{
          console.log(res)

          if (res.meta.status!==200) return this.$message.error('修改用户信息失败')
          //关闭对话框 重新发起用户数据请求
          this.editDialogVisible=false;
          this._getUserList(this.listInfo.query,this.listInfo.pagenum,this.listInfo.pagesize)
          this.$message.success('编辑用户信息成功')
        })
      })
    },
    _deleteUser(id) {
       this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         deleteUser(id).then(res=>{
           if (res.meta.status!==200) return this.$message.error('删除失败')
           this._getUserList(this.listInfo.query,this.listInfo.pagenum,this.listInfo.pagesize)
           this.$message.success('删除成功')
         })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    distributeRole(role) {
      getRoleList().then(res=>{
        this.roleListInfo=res.data
      })
      this.roleInfo=role
      this.distributeDialogVisible=true
    },
    //分配用户角色
    distributeUserRoleRequest() {
      distributeUserRole(this.roleInfo.id,this.selectRoleId).then(res=>{
        if (res.meta.status!==200) return this.$message.error('设置角色失败')
        this.$message.success('设置角色成功')
        this._getUserList(this.listInfo.query,this.listInfo.pagenum,this.listInfo.pagesize)
        this.distributeDialogVisible=false;
      })
    }
  }
}
</script>

<style scoped>
.el-row {
  padding-top: 15px;
  margin-bottom: 10px;
}
.el-card {
  margin-top: 15px;
}
.el-table {
  font-size: 12px;
}
.el-form-item {
  padding-right: 40px;
}
p {
  padding: 7px;
}
.el-select {
  margin-top: 10px;
}
</style>