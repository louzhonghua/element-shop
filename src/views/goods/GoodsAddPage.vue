<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/goods'}">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false" class="el-alert">
      </el-alert>
      <!--   步骤条区域   -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息" icon="el-icon-edit"></el-step>
        <el-step title="商品参数" icon="el-icon-document"></el-step>
        <el-step title="商品属性" icon="el-icon-document-copy"></el-step>
        <el-step title="商品图片" icon="el-icon-picture"></el-step>
        <el-step title="商品内容" icon="el-icon-reading"></el-step>
        <el-step title="完成"    icon="el-icon-success"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px"
               class="demo-ruleForm" label-position="top">
        <!--   tab标签   -->
        <el-tabs :tab-position="tabPosition"  v-model="activeIndex" :before-leave="beforeLeave"
                  @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader  :options="catelist" :props="cateProps"
                            v-model="selectedCateKeys" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item,index) in goodsParamsData"
                          :key="goodsParamsData.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1,index1) in item.attr_vals"
                              :key="index1" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,index) in onlyGoodsInfo" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                class="upload-demo"
                :action="baseURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :headers="headerObj"
                :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="_addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog
          title="图片预览"
          :visible.sync="previewDialogVisible"
          width="50%">
        <img :src="previewURL" class="previewImg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {goodsCateDataList} from "@/network/goods_cate";
import {getParamsList} from '@/network/params_list'
import {addGoods} from '@/network/addGoods'
import _ from 'lodash'
export default {
  name: "GoodsAddPage",
  data() {
    return {
      tabPosition:'left',
      //激活项
      activeIndex:'0',
      //添加表单的数据对象
      addForm:{
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      //添加表单的验证规则
      addFormRules: {
        goods_name:[{
          required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        goods_price:[{
          required: true, message: '请输入商品价格', trigger: 'blur'
        }],
        goods_weight:[{
          required: true, message: '请输入商品重量', trigger: 'blur'
        }],
        goods_number:[{
          required: true, message: '请输入商品数量', trigger: 'blur'
        }],
      },
      //分类列表数据
      catelist:[],
      cateProps:{
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger:'hover'
      },
      selectedCateKeys:[],
      //商品动态参数
      goodsParamsData:[],
      //only下请求的商品静态属性
      onlyGoodsInfo:[],
      //表单上传的目标网址
      baseURL:'http://timemeetyou.com:8889/api/private/v1/upload',
      //请求头对象
      headerObj: {
        Authorization : window.sessionStorage.getItem('token')
      },
      //图片预览地址
      previewURL:'',
      //预览对话框的显示与隐藏
      previewDialogVisible:false
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
    handleChange() {
      if (this.selectedCateKeys.length!==3) {
        this.selectedCateKeys=[]
      }
    },
    //控制标签页的切换情况
    beforeLeave(activeName,oldActiveName) {
        if (this.selectedCateKeys.length!==3) {
          this.$message.warning('请选择商品分类')
          return false
        }
    },
    //当前tab被选中，触发的事件
    tabClicked() {
      //如果当前选中tab项名字为‘1’,则发送网络请求
      if (this.activeIndex==='1') {
        getParamsList(this.thirdId,'many').then(res=>{
          //将attr_vals转为数组
          res.data.forEach(item=>{
            item.attr_vals = item.attr_vals.split(' ').length===0 ? [] : item.attr_vals.split(' ')
          })
          this.goodsParamsData = res.data
        })
      }
      if (this.activeIndex==='2') {
        getParamsList(this.thirdId,'only').then(res=>{
          this.onlyGoodsInfo = res.data
        })
      }
    },
    //图片预览事件
    handlePreview(file) {
      console.log(file)
      this.previewURL = file.response.data.url
      this.previewDialogVisible=true
    },
    //移除图片事件
    handleRemove(file) {
      //找到图片所在数组的索引值，进行删除
      let i = this.addForm.pics.findIndex(item=>file.response.data.tmp_path===item.pic)
      this.addForm.pics.splice(i,1)
      console.log(this.addForm)
    },
    //图片上传成功触发事件
    handleSuccess(response) {
      const picObj = {"pic" : response.data.tmp_path}
      this.addForm.pics.push(picObj)
    },
    //添加商品
    _addGoods() {
      //先进行表单的预校验，需要表单预校验通过才执行之后的操作
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return this.$message.error('请输入必填项')
        //发送提交添加商品请求
        const keys = _.cloneDeep(this.selectedCateKeys)
        this.addForm.goods_cat = keys.join(',')
        //对商品的参数进行处理
        //动态参数处理
       this.goodsParamsData.forEach(item=>{
         this.addForm.attrs.push({
           attr_id : item.attr_id,
           attr_value : item.attr_vals.join(' ')
         })
       })
        this.onlyGoodsInfo.forEach(item=>{
          this.addForm.attrs.push({
            attr_id : item.attr_id,
            attr_value : item.attr_vals
          })
        })
        const form = _.cloneDeep(this.addForm)
        addGoods(form).then(res=>{
          if (res.meta.status!==201) return this.$message.error('添加商品失败')
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
      })
    }
  },
  computed:{
    thirdId() {
      if (this.selectedCateKeys.length===3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 25px;
  }
  .el-steps {
    margin-top: 10px;
  }
  .el-tabs {
    margin-top: 15px;
  }
  .el-cascader {
    width: 300px;
  }
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
  .previewImg {
    width: 100%;
  }
  .addBtn {
    margin-top: 10px;
  }
</style>