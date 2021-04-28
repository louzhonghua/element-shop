<template>
  <div class="goods-cate">
      <!--  面包屑  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-button type="primary" @click="_addCate">添加分类</el-button>
      <!--  商品分类表格  -->
      <zk-table :data="goodsCateData" :columns="columns" :show-index="true"
                :selection-type="false" :expand-type="false" border class="zk-table">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </zk-table>
    <!--  分页    -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!--  添加分类对话框  -->
    <el-dialog
        @close="addCateDialogClose"
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%">
      <!--  表单    -->
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
        <!--     级联选择器  options是数据源  props是   -->
          <el-cascader
              clearable
              v-model="selectKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {goodsCateDataList,addCate} from '@/network/goods_cate'
export default {
  name: "Goods_cate",
  created() {
    this.goodsCateDataRequest()
  },
  data() {
    return {
      //商品分类数据
      goodsCateData:[],
      columns:[{
        label:'分类名称',
        prop:'cat_name'
      },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }],
      //请求参数信息
      queryInfo: {
        type:3,
        pagenum:1,
        pagesize:5
      },
      //请求到的总的商品分类个数
      total: 0,
      //添加分类对话框是否可见
      addCateDialogVisible:false,
      //添加分类表单
      addCateForm:{
        //将要添加的分类名称
        cat_name:'',
        //将要添加的分类父id
        cat_pid:'',
        //将要添加的分类层级
        cat_level:''
      },
      //表单规则
      addCateRules:{
        cat_name:[
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ]
      },
      //父级分类数据
      parentCateList:[],
      //级联选择器props属性
      cascaderProps:{
        label:'cat_name',
        value:'cat_id',
        children:'children',
        checkStrictly:true,
        expandTrigger:'hover'
      },
      //选中的父级分类的id数组
      selectKeys:[],
    }
  },
  methods:{
    goodsCateDataRequest() {
      goodsCateDataList(this.queryInfo).then(res=>{
        this.goodsCateData = res.data.result
        this.total= res.data.total
        if (res.meta.status!==200) return this.$message.error('获取商品分类数据失败')
        this.$message.success('获取商品分类数据成功')
      })
    },
    //添加分类
    _addCate() {
      this.addCateDialogVisible=true
      //首先获取父级分类列表数据
      goodsCateDataList({type:2}).then(res=>{
        if (res.meta.status!==200) return this.$message.error('请求数据失败')
        this.parentCateList = res.data
      })
    },
    //size发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize=newSize
      this.goodsCateDataRequest()
    },
    //当前页发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum=newPage
      this.goodsCateDataRequest()
    },
    //级联选择器当前选择项发生变化
    handleChange() {
      console.log(this.selectKeys)
      //当选中项数组的长度大于0的时候，代表新添加的分类的id为父级分类的id
      if (this.selectKeys.length>0) {
        this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
        this.addCateForm.cat_level=this.selectKeys.length
      }
      else {
        this.addCateForm.cat_pid=0
        this.addCateForm.cat_level=0
      }

    },
    //当点击表单确定按钮后，发送添加分类请求
    submitCate() {
      addCate(this.addCateForm).then(res=>{
        if (res.meta.status!==201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.goodsCateDataRequest()
        this.addCateDialogVisible=false
      })
    },
    //添加分类对话框关闭的时候，重置整个表单数据
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys=[]
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
  }
  /*.icon-center {*/
  /*  display: flex;*/
  /*  justify-content: center;*/
  /*  padding-right: 40px;*/
  /*}*/

  .zk-table {
    margin-top: 10px;
  }
  .el-cascader {
    width: 100%;
  }
</style>