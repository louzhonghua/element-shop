<template>
    <div class="goods-list">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="el-card">
        <!--  搜索框和添加商品      -->
        <el-row :gutter="20" class="el-row">
          <el-col :span="14"><div class="grid-content bg-purple">
            <div>
              <el-input placeholder="请输入内容"  class="input-with-select"
                         clearable v-model="goodListParams.query" @clear="_getGoodsList">
                <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
              </el-input>
            </div>
          </div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <el-button type="primary" @click="goAddGoods">添加商品</el-button>
          </div></el-col>
        </el-row>
      <!--    显示商品基本信息表格    -->
        <el-table
            :data="goodsListData"
            style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品名称">
                  <span>{{ props.row.goods_name }}</span>
                </el-form-item>
                <el-form-item label="价格">
                  <span>{{ props.row.goods_price }}</span>
                </el-form-item>
                <el-form-item label="库存">
                  <span>{{ props.row.goods_number }}</span>
                </el-form-item>
                <el-form-item label="重量">
                  <span>{{ props.row.goods_weight }}</span>
                </el-form-item>
                <el-form-item label="商品状态">
                  <span>{{ props.row.goods_state | productReview}}</span>
                </el-form-item>
                <el-form-item label="添加时间">
                  <span>{{ props.row.add_time | dateFormat}}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                  <span>{{ props.row.upd_time |  dateFormat}}</span>
                </el-form-item>
                <el-form-item label="是否是热销品">
                  <i v-if="props.row.is_promote" class="el-icon-success"></i>
                  <i class="el-icon-error" v-else></i>
                </el-form-item>
                <el-form-item label="热销品数量">
                  <span>{{ props.row.hot_mumber }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
              type="index"
              width="20">
          </el-table-column>
          <el-table-column
              prop="goods_name"
              label="商品名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="goods_price"
              label="商品价格(元)"
              width="80">
          </el-table-column>
          <el-table-column
              prop="goods_weight"
              label="商品重量(克)">
          </el-table-column>
          <el-table-column
              prop="add_time"
              label="创建时间">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
              label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="_editSubmitGoods(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="_deleteGoods(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--   商品分页     -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="goodListParams.pagenum"
            :page-sizes="[1,2,5,10]"
            :page-size="goodListParams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
        </el-pagination>
      </el-card>
      <!--  删除商品对话框    -->
      <el-dialog
          title="提示"
          :visible.sync="deleteDialogVisible"
          width="50%">
        <span>确定要删除吗</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="cancelDelete">取 消</el-button>
    <el-button type="primary" @click="ensureDelete">确 定</el-button>
  </span>
      </el-dialog>
      <!--   编辑提交商品对话框     -->
      <el-dialog
          title="提示"
          :visible.sync="editDialogVisible"
          width="50%">
        <el-input v-model="editParams.goods_name" label="商品名称"></el-input>
        <el-input v-model="editParams.goods_price" label="商品价格"></el-input>
        <el-input v-model="editParams.goods_number" label="商品数量"></el-input>
        <el-input v-model="editParams.goods_weight" label="商品重量"></el-input>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_editSubmit">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
import {getGoodsList,deleteGoods,editSubmitGoods} from '@/network/goodslist'
import {TimeFormat} from '@/ultils/format_date'
export default {
  name: "GoodsList",
  data() {
    return {
      //商品列表参数
      goodListParams:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      //表格数据源
      goodsListData:[
      ],
      //总条目数
      totalNum:0,
      //输入框输入的内容
      inputValue:'',
      //删除对话框是否可见
      deleteDialogVisible:false,
      //要删除的id项
      deleteId:'',
      //编辑对话框
      editDialogVisible:false,
      //编辑对话框的内容
      editParams:{
        goods_name:'',
        goods_price:'',
        goods_number:'',
        goods_weight:''
      },
      //要编辑的id项
      editId:''
    }
  },
  created() {
    this._getGoodsList()
  },
  methods:{
    _getGoodsList() {
      getGoodsList(this.goodListParams).then(res=>{
        console.log(res)
        this.goodsListData=res.data.goods
        this.totalNum=res.data.total
        if (res.meta.status!==200) return this.$message.error('获取商品列表失败')
        this.$message.success('获取商品列表成功')
      })
    },
    handleSizeChange(size) {
      this.goodListParams.pagesize=size
      this._getGoodsList()
    },
    handleCurrentChange(page) {
      this.goodListParams.pagenum=page
      this._getGoodsList()
    },
    searchGoodsList() {
      this._getGoodsList()
    },
    //删除商品
    _deleteGoods(id) {
      this.deleteDialogVisible=true
      this.deleteId=id
    },
    //确认删除
    ensureDelete() {
      deleteGoods(this.deleteId).then(res=>{
        if (res.meta.status!==200) return this.$message.error('删除商品失败')
        this.$message.success('删除商品成功')
        this.deleteDialogVisible=false
        this._getGoodsList()
      })
    },
    //取消删除
    cancelDelete() {
      this.$message.info('取消了删除')
      this.deleteDialogVisible=false
    },
    //编辑商品提交
    _editSubmitGoods(row) {
      this.editDialogVisible=true
      this.editId=row.goods_id
      this.editParams=row
    },
    //发送编辑提交的网络请求
    _editSubmit() {
      console.log(this.editParams.goods_name);
      editSubmitGoods(this.editId,this.editParams).then(res=>{
        console.log(res);
      })
    },
    //跳转到添加商品界面
    goAddGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>