<template>
  <div class="role-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table
          class="el-table"
          :data="roleListData"
          border stripe
          style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id"
                    :class="['flexCenter','borderBottom',index1===0?'borderUp':'']">
              <el-col :span="5">
                <el-tag class="el-tag" closable @close="removeRoleRights(scope.row,item1.id)">
                  {{item1.authName}}
                  <i class="el-icon-caret-right"></i>
                </el-tag>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2!==0 ? 'borderUp' : '','flexCenter']">
                  <el-col :span="6">
                    <el-tag class="el-tag" type="success" closable @close="removeRoleRights(scope.row,item2.id)">
                      {{item2.authName}}
                      <i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                      <el-tag  type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" closable
                                @close="removeRoleRights(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="角色名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="roleDesc"
            label="角色描述"
            width="180">
        </el-table-column>
        <el-table-column
            prop="level"
            label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showRolesDialog(scope.row.id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)"></el-button>
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="true" >
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightsDialog(scope.row)"></el-button>s
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="50%"
          >
          <el-form :model="editRoles" status-icon :rules="editRolesRules" ref="editRolesRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input  v-model="editRoles.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input  v-model="editRoles.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" >取 消</el-button>
    <el-button type="primary" @click="changeRoleSubmit">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
    <el-dialog
        title="提示"
        :visible.sync="roleDialogVisible"
        width="50%"
    >
      <el-form :model="addRoles" status-icon :rules="addRolesRules" ref="editRolesRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input  v-model="addRoles.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  v-model="addRoles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="roleDialogVisible = false" >取 消</el-button>
    <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
  </span>
    </el-dialog>
<!--  展示树形权限结构对话框  -->
    <el-dialog
        title="提示"
        :visible.sync="treeRightsDialogVisible"
        width="50%"
        @close="clearKeyList">
        <!--  树形组件    -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="keysList" ref="tree"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="treeRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="ensureCheckRequest">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
import {getPowerList,getRoleList,lookforRoleInfo,editSubmit,
  addRoleRequest,deleteRoleRequest,deleteRoleRights,roleSetRights} from '@/network/powerlist'
export default {
name: "PowerRoleList",
  data() {
    return {
      roleListData:[],
      //树形属性传入对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      //权限列表数据
      rightsList:[],
      editRoles:{},
      editRolesRules:{
        roleName:[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ]
      },
      //控制编辑角色的对话框的显示与隐藏
      dialogVisible:false,
      roleDialogVisible:false,
      addRoles:{},
      addRolesRules:{
        roleName:[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ]
      },
      treeRightsDialogVisible:false,
      //默认勾选的key的数组
      keysList:[],
      roleId:null,
    }
  },
  created() {
  this._getRoleList();
  },
  methods:{
    _getRoleList() {
      getRoleList().then(res=>{
        if (res.meta.status!==200) return this.$message.error('获取角色列表失败')
        this.$message.success('获取角色列表成功')
        this.roleListData=res.data
      })
    },
    showRolesDialog(id) {
      lookforRoleInfo(id).then(res=>{
        if (res.meta.status!==200) return this.$message.error('请求用户信息失败')
        this.editRoles = res.data
      })
      this.dialogVisible=true;
    },
    //发送编辑提交角色请求，同时关闭窗口
    changeRoleSubmit() {
      editSubmit(this.editRoles.roleId,this.editRoles.roleName,this.editRoles.roleDesc).then(res=>{
        if (res.meta.status!==200) return this.$message.error('编辑角色信息失败')
        this.dialogVisible=false;
        this.$message.success('编辑角色信息成功')
        this._getRoleList()
      })
    },
    addRole() {
      this.roleDialogVisible=true
    },
    addRoleSubmit() {
      addRoleRequest(this.addRoles.roleName,this.addRoles.roleDesc).then(res=>{
        if (res.meta.status!==201) return this.$message.error('添加新角色失败')
        this.$message.success('添加新角色成功')
        this.roleDialogVisible=false
        this._getRoleList();
      })
    },
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleRequest(id).then(res=>{
          if (res.meta.status!==200) this.$message.error('删除失败')
          this.$message.success('删除成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    removeRoleRights(role,rightsId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleRights(role.id,rightsId).then(res=>{
          if (res.meta.status!==200) return this.$messaage.error('删除角色权限失败')
          this.$message.success('删除角色权限成功')
          role.children=res.data
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    showRightsDialog(role) {
        this.roleId = role.id
        getPowerList('tree').then(res=>{
          if (res.meta.status!==200) return this.$message.error('获取树形数据失败')
          this.$message.success('获取树形数据成功')
          this.rightsList=res.data
      })
      this.getTreeList(role,this.keysList)
      this.treeRightsDialogVisible=true
    },
    //递归获取三级节点
    getTreeList(node,treeList) {
      if (!node.children) return treeList.push(node.id)
      node.children.forEach(item=>
        this.getTreeList(item,treeList)
      )
    },
    //关闭对话框重置保存三级权限ID的数组
    clearKeyList() {
      this.keysList=[]
    },
    ensureCheckRequest() {
      let keys = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
      let keysArr = keys.join(',');
      roleSetRights(this.roleId,keysArr).then(res=>{
        if (res.meta.status!==200) return this.$message.error('分配用户角色失败')
        this.$message.success('分配用户角色成功')
        this._getRoleList()
        this.treeRightsDialogVisible=false
      })
    },
    distributeRole(role) {
      this.distributeDialogVisible=true;
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;

}
.borderUp {
  border-top: 1px solid #eeeeee;
}
.borderBottom {
  border-bottom: 1px solid #eeeeee;
}
.flexCenter {
  display: flex;
  align-items: center;
}
</style>