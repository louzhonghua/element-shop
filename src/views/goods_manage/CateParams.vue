<template>
    <div class="cate-params">
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card class="el-card">
        <!-- 警告区域 -->
        <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

        <!-- 选择商品分类区域 -->
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类：</span>
            <!-- 选择商品分类的级联选择框 -->
            <el-cascader  :options="catelist" :props="cateProps"
                         v-model="selectedCateKeys" @change="handleChange">
            </el-cascader>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" :disabled="isDisabled" @click="showDialog">添加参数</el-button>
                  <!--     动态参数表格       -->
            <el-table :data="manyTableData" border stripe class="el-table1">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable class="el-tag"
                          @close="handleClose(index,scope.row)">
                    {{item}}
                  </el-tag>
                  <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isDisabled" @click="showDialog">
              添加属性
            </el-button>
            <!--     动态属性面板         -->
            <el-table :data="onlyTableData" border stripe class="el-table1">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable class="el-tag"
                          @close="handleClose(index,scope.row)">
                    {{item}}
                  </el-tag>
                  <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!--  添加参数的对话框    -->
      <el-dialog
          :title="'添加'+dynamicText"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="resetForm">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="dynamicText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_addParams">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import {goodsCateDataList} from '@/network/goods_cate'
import {getParamsList,addParams,editSubmissionParameters} from '@/network/params_list'
export default {
  name: "CateParams",
  data() {
    return {
      catelist:[],
      cateProps:{
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger:'hover'
      },
      selectedCateKeys:[],
      //激活的属性名
      activeName:'many',
      //many选项卡的数据
      manyTableData:[],
      //only选项卡的数据
      onlyTableData:[],
      //添加参数的对话框的显示与隐藏
      addDialogVisible:false,
      //添加属性的表单
      addForm:{
        attr_name:''
      },
      //添加表单的验证规则
      addFormRules:{
        attr_name:[
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods:{
    getCateList() {
      goodsCateDataList({type:3}).then(res=>{
        this.catelist=res.data
      })
    },
    //级联选择器参数发生改变
    handleChange() {
      this.getParamsData()

    },
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData()
    },
    //根据选中的tab项动态获取相对应的参数
    getParamsData() {
      getParamsList(this.thirdId,this.activeName).then(res=>{
        if (this.selectedCateKeys.length!==3) {
          this.selectedCateKeys=[]
          this.manyTableData = []
          this.onlyTableData = []
          return
        }
        if (res.meta.status!==200) return this.$message.error('获取参数信息失败')

        res.data.forEach(item=>{
          item.attr_vals=item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible=false
          item.inputValue=''
        })
        if (this.activeName==='many') {
          this.manyTableData=res.data
        }
        if (this.activeName==='only') {
          this.onlyTableData=res.data
        }
        console.log(res.data)
      })
    },
    //显示对话框
    showDialog() {
        this.addDialogVisible=true
    },
    //重置表单
    resetForm() {
      this.$refs.addFormRef.resetFields()
    },
    //添加参数提交
    _addParams() {
      //首先进行预校验，通过才发起提交请求
        //发起添加动态参数或者静态属性请求
      console.log(this.addForm.attr_name)
        addParams(this.thirdId,this.addForm.attr_name,this.activeName).then(res=>{
          this.addDialogVisible=false
          if (res.meta.status!==201) return this.$message.error('添加'+this.dynamicText+'失败')
          this.$message.success('添加'+this.dynamicText+'成功')
          this.getParamsData()
        })
    },
    //当键盘抬起和失去焦点的时候触发事件
    handleInputConfirm(row) {
      //如果用户输入的是空字符串，那么将inputValue置为空字符串，
      if (row.inputValue.trim().length===0) {
        row.inputValue = ''
        row.inputVisible = false
        return null
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue=''
      row.inputVisible=false
     this.editAttr(row)
    },
    //编辑参数的提交函数
    editAttr(row) {
      //发起编辑提交参数的网络请求
      editSubmissionParameters(this.thirdId,row.attr_id,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      }).then(res=>{
        if (res.meta.status!==200) return this.$message.error('编辑提交参数失败')
        this.$message.success('编辑提价参数成功')
      })
    },
    //展示输入框
    showInput(row) {
      row.inputVisible=true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i,row) {
      row.attr_vals.splice(i,1)
      this.editAttr(row)
    }
  },
  computed:{
    //添加属性和参数的按钮是否禁用
    isDisabled() {
      if (this.selectedCateKeys.length!==3) return true
      return false
    },
    //当前选中的三级分类的id
    thirdId() {
      if (this.selectedCateKeys.length===3) return this.selectedCateKeys[2]
      return null
    },
    dynamicText() {
      if (this.activeName==='many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
  }
  .el-cascader {
    margin-top: 10px;
    width: 40%;
  }
  .el-tabs {
    margin-top: 10px;
  }
  .el-table1 {
    margin-top: 10px;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .el-tag {
    margin-left: 10px;
  }
</style>