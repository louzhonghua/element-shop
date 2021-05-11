<template>
  <div class="power-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-table
          :data="powerListData"
          border stripe
          style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="path"
            label="路径"
            width="180">
        </el-table-column>
        <el-table-column
            prop="level"
            label="权限等级">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level==='0'">等级一</el-tag>
            <el-tag type="info" v-else-if="scope.row.level==='1'">等级二</el-tag>
            <el-tag type="warning" v-else="scope.row.level==='2'">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getPowerList} from "@/network/powerlist";
import Sortable from 'sortablejs'


export default {
  name: "PowerList",
  data() {
    return {
      powerListData:[]
    }
  },
  created() {
    this._getPowerList();
  },
  mounted() {
    let el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    let sortable = Sortable.create(el)
  },
  methods: {
    //获取权限列表
    _getPowerList() {
      getPowerList('list') .then(res=>{
        console.log(res)
        if (res.meta.status!==200) return this.$message.error('获取权限列表失败')
        this.$message.success('获取权限列表成功')
        this.powerListData=res.data
      })
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
</style>