<template lang="html">
  <div class="invite-box">
    <h1>填写企业信息</h1>
    <div class="content">
      <el-form class="invite-form" label-width="300px">
        <div class="form-box">
          <h2>企业信息</h2>
          <el-form-item label="企业名称">
            <el-input placeholder="广州资金有限公司"></el-input>
          </el-form-item>
          <el-form-item label="企业地址">
            <el-input placeholder="省市区地址"></el-input>
          </el-form-item>
          <el-form-item label="法定代表人">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="企业负责人">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="负责人手机">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="负责人邮箱">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="负责人地址">
            <el-input placeholder="地址"></el-input>
          </el-form-item>
        </div>
        <div class="form-box">
          <h2>企业开票信息</h2>
          <el-form-item label="开票企业名称">
            <el-input placeholder="广州资金有限公司"></el-input>
          </el-form-item>
          <el-form-item label="开票企业地址">
            <el-input placeholder="省市区地址"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="企业电话">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="开户银行">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="银行账号">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="发票类型">
            <el-input placeholder="请选择"></el-input>
          </el-form-item>
        </div>
        <div class="form-box">
          <h2>其他信息</h2>
          <el-form-item label="从事行业类型">
            <el-input placeholder="请选择"></el-input>
          </el-form-item>
          <el-form-item label="从事行业">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="服务类型">
            <el-input placeholder="请选择"></el-input>
          </el-form-item>
          <el-form-item label="预计月流水">
            <el-input placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="预计3万以上比例">
            <el-input placeholder="数字%"></el-input>
          </el-form-item>
        </div>
        <el-button type="danger">提交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.invite-box {
  h1 {
    font-size: 50px;
    line-height: 130px;
    text-align: center;
    margin: 0;
  }
  h2 {
    font-size: 42px;
    line-height: 50px;
    margin: 0;
    padding: 30px 50px;
    border-bottom: 1px solid #ccc;
    font-weight: normal;
  }
  .invite-form {
    background: #f2f2f2;
    padding: 30px;
  }
  .form-box {
    background: #fff;
  }
  .el-form-item {
    padding: 8px 50px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .el-input__inner {
    border: none;
    text-align: right;
  }
  .el-form-item__label,
  .el-input__inner {
    font-size: 36px;
  }
  .el-form-item__label,
  .el-form-item__content,
  .el-input__inner {
    height: 120px;
    line-height: 120px;
  }
  .el-button {
    width: 100%;
    font-size: 36px;
    padding: 28px 20px;
    margin: 20px 0 60px;
  }
}
</style>
