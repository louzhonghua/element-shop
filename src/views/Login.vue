<template>
  <div class="login">
    <div class="center">
      <div class="img-box">
        <img src="@/assets/img/avator.jpg" alt="">
      </div>
      <el-form ref="form"  label-width="0px" class="form" :model="loginForm" :rules="formRules">
        <el-form-item prop="username">
          <el-input placeholder="用户名" prefix-icon="iconfont icon-user"
          v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="密码" prefix-icon="iconfont icon-3702mima"
          v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="button">
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {adminLogin} from '@/network/login'
export default {
name: "Login",
  data() {
    return {
      loginForm :{
        username:'admin',
        password:'123456'
      },
      formRules:{
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
    },
    submitForm() {
      this.$refs.form.validate(res=>{
        });
      adminLogin(this.loginForm.username,this.loginForm.password).then(res=>{
        if (res.meta.status!==200) return this.$message.error('登录失败，请重新输入账号和密码')
        this.$message.success('登录成功');
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
        })
    }
    }
}

</script>

<style scoped>
.login {
  height: 100%;
  background-color: #324057;
}
.center {
  width: 372px;
  height: 250px;
  background-color: #F5F5F5;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.img-box {
  width: 100px;
  height: 100px;
  position: relative;
  left: 50%;
  transform: translate(-50%);
  top: -50px;
 box-shadow: 0 0 10px #dddddd;
  border-radius: 50%;


}
.img-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.form {
  position: relative;
  top: -20px;

  margin-top: -20px;
  box-sizing: border-box;
  padding: 0 20px;

}
.button {
  display: flex;
  justify-content: flex-end;
  position: relative;
  margin-right: 40px;
  margin-top: -20px;
}
</style>