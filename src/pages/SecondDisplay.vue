<template>
  <div class="crud">
    <el-card class="box-card" v-loading="searching">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="formInline" style="float: right">
          <el-form-item>
            <el-input v-model="formInline.CompanyId" placeholder="公司 ID"></el-input>
            <!--<el-select v-model="formInline.AzId" placeholder="请选择可用区">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.AccountId" placeholder="项目 ID"></el-input>
          </el-form-item>
          <el-button type="success" @click="createConnFormVisible=true"> 新增</el-button>
        </el-form>
        <p>2</p>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="display-table-expand">
              <el-form-item label="Vlan">
                <span>{{ props.row.Vlan }}</span>
              </el-form-item>
              <el-form-item label="专线号码">
                <span>{{ props.row.ConnNo }}</span>
              </el-form-item>
              <el-form-item label="PE 交换机">
                <span>{{ props.row.PeSwitch }}</span>
              </el-form-item>
              <el-form-item label="线路提供商">
                <span>{{ props.row.Provider }}</span>
              </el-form-item>
              <el-form-item label="可用区 ID">
                <span>{{ props.row.AzId }}</span>
              </el-form-item>
              <el-form-item label="占用接入点光纤芯(对)">
                <span>{{ props.row.Used }}</span>
              </el-form-item>
              <el-form-item label="ODF 端口">
                <span>{{ props.row.OdfPort }}</span>
              </el-form-item>
              <el-form-item label="专线互联IP 客户端">
                <span>{{ props.row.InterConnIpUcloud }}</span>
              </el-form-item>
              <el-form-item label="专线签约性质">
                <span><el-tag type="primary">{{ connTypeHash[props.row.ConnType] }}</el-tag></span>
              </el-form-item>
              <el-form-item label="专线互联IP UCloud">
                <span>{{ props.row.InterConnIpClient }}</span>
              </el-form-item>
              <el-form-item label="客户端地址(物理位置)">
                <span>{{ props.row.ClientAddr }}</span>
              </el-form-item>
              <el-form-item label="光电设备端口">
                <span>{{ props.row.ElecDevPort }}</span>
              </el-form-item>
              <el-form-item label="机房">
                <span>{{ props.row.Address }}</span>
              </el-form-item>
              <el-form-item label="交换机端口">
                <span>{{ props.row.SwitchPort }}</span>
              </el-form-item>
              <el-form-item label="接入时间">
                <span>{{ props.row.AccessDate | time_formatter }}</span>
              </el-form-item>
              <el-form-item label="光电设备">
                <span>{{ props.row.ElecDev }}</span>
              </el-form-item>
              <el-form-item label="UCloud 端地址(物理位置)">
                <span>{{ props.row.UcloudAddr }}</span>
              </el-form-item>
              <el-form-item label="描述">
                <span>{{ props.row.Description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="公司ID"
          width="100"
          prop="CompanyId">
        </el-table-column>
        <el-table-column
          label="项目ID"
          width="100"
          prop="AccountId">
        </el-table-column>
        <el-table-column
          label="公司名称"
          prop="CompanyName">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="State"
          width="100"
          :formatter="Stateformatter"
          :filters="[{ text: 'NaN', value: 'NaN' }, { text: '打通中', value: '打通中' }, { text: '专线实施中', value: '专线实施中' }, { text: '接入完成', value: '接入完成' }, { text: '暂停', value: '暂停' }]"
          :filter-method="filterState"
          >
          <template scope="scope">
            <el-tag
              :type="stateHash[scope.row.State]['type']"
              close-transition>{{stateHash[scope.row.State]['text']}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="带宽"
          width="100"
          prop="Bandwidth">
        </el-table-column>
        <el-table-column
          label="客户经理"
          width="100"
          prop="Manager">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="Remarks">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button
              size="small"
              @click="editConn(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteConn(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 创建模态框 -->
    <el-dialog title="专线客户信息创建" v-model="createConnFormVisible" size="full" class="motai">
      <el-form label-position="right" :model="formCreate" :rules="rules" ref="formCreate" inline class="create-table-expand">

        <el-form-item label="项目ID" prop="AccountId" required>
          <el-input v-model="formCreate.AccountId"></el-input>
        </el-form-item>
        <el-form-item label="专线签约性质" prop="ConnType" required>
          <el-select v-model="formCreate.ConnType" placeholder="请选择">
            <el-option
              v-for="item in optionConnTypeHash"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机房" prop="Address" required>
          <el-input v-model="formCreate.Address"></el-input> 
        </el-form-item>
        <el-form-item label="UCloud 端地址(物理位置)" prop="UcloudAddr" required>
          <el-input v-model="formCreate.UcloudAddr"></el-input> 
        </el-form-item>
        <el-form-item label="客户端地址(物理地址)" prop="ClientAddr" required>
          <el-input v-model="formCreate.ClientAddr"></el-input> 
        </el-form-item>
        <el-form-item label="PE 交换机" prop="PeSwitch" required>
          <el-input v-model="formCreate.PeSwitch"></el-input> 
        </el-form-item>
        <el-form-item label="交换机端口" prop="SwitchPort" required>
          <el-input v-model="formCreate.SwitchPort"></el-input> 
        </el-form-item>
        <el-form-item label="可用区 ID" prop="AzId" required>
          <el-input v-model="formCreate.AzId"></el-input> 
        </el-form-item>

        <!-- 非必填 -->
        <el-form-item label="状态">
          <el-select v-model="formCreate.State" placeholder="请选择">
            <el-option
              v-for="item in optionStateHash"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="带宽">
          <el-input v-model="formCreate.Bandwidth"></el-input> 
        </el-form-item>
        <el-form-item label="专线号码">
          <el-input v-model="formCreate.ConnNo"></el-input> 
        </el-form-item>
        <el-form-item label="线路提供商">
          <el-input v-model="formCreate.Provider"></el-input> 
        </el-form-item>
        <el-form-item label="接入时间">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="formCreate.AccessDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="占用接入点光纤芯(对)">
          <el-input v-model="formCreate.Used"></el-input> 
        </el-form-item>
        <el-form-item label="客户经理">
          <el-input v-model="formCreate.Manager"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formCreate.Remarks"></el-input> 
        </el-form-item>
        <el-form-item label="光电设备">
          <el-input v-model="formCreate.ElecDev"></el-input> 
        </el-form-item>
        <el-form-item label="光电设备端口">
          <el-input v-model="formCreate.ElecDevPort"></el-input> 
        </el-form-item>
        <el-form-item label="ODF 端口">
          <el-input v-model="formCreate.OdfPort"></el-input> 
        </el-form-item>
        <el-form-item label="专线互联 IP UCloud">
          <el-input v-model="formCreate.InterConnIpUcloud"></el-input> 
        </el-form-item>
        <el-form-item label="专线互联 IP 客户端">
          <el-input v-model="formCreate.InterConnIpClient"></el-input> 
        </el-form-item>
        <el-form-item label="VLAN">
          <el-input v-model="formCreate.Vlan"></el-input> 
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formCreate.Description"></el-input> 
        </el-form-item>
        <el-form-item label=" ">
          前面带 <code style="color: red;">*</code> 为必填项，由于字段较多，建议使用 <code>Tab</code> 或者 <code>↓</code> 切换输入框或选择
        </el-form-item>
      </el-form>
      <!--{{formCreate}}
      <br>
      {{formatedFormCreate}}-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="createConnFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createConn('formCreate')" :loading="creating">确 定</el-button>
        
      </div>
    </el-dialog>

    <!-- 编辑模态框 -->
    <el-dialog title="专线客户信息更新" v-model="editConnFormVisible" size="full" class="motai">
      <el-form label-position="right" :model="formEdit" :rules="rules" ref="formEdit" inline class="create-table-expand">

        <el-form-item label="项目ID" prop="AccountId" required>
          <el-input v-model="formEdit.AccountId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="专线签约性质" prop="ConnType" required>
          <el-select v-model="formEdit.ConnType" placeholder="请选择">
            <el-option
              v-for="item in optionConnTypeHash"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机房" prop="Address" required>
          <el-input v-model="formEdit.Address"></el-input> 
        </el-form-item>
        <el-form-item label="UCloud 端地址(物理位置)" prop="UcloudAddr" required>
          <el-input v-model="formEdit.UcloudAddr"></el-input> 
        </el-form-item>
        <el-form-item label="客户端地址(物理地址)" prop="ClientAddr" required>
          <el-input v-model="formEdit.ClientAddr"></el-input> 
        </el-form-item>
        <el-form-item label="PE 交换机" prop="PeSwitch" required>
          <el-input v-model="formEdit.PeSwitch"></el-input> 
        </el-form-item>
        <el-form-item label="交换机端口" prop="SwitchPort" required>
          <el-input v-model="formEdit.SwitchPort"></el-input> 
        </el-form-item>
        <el-form-item label="可用区 ID" prop="AzId" required>
          <el-input v-model="formEdit.AzId"></el-input> 
        </el-form-item>

        <!-- 非必填 -->
        <el-form-item label="公司名称">
          <el-input v-model="formEdit.CompanyName"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formEdit.State" placeholder="请选择">
            <el-option
              v-for="item in optionStateHash"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="带宽">
          <el-input v-model="formEdit.Bandwidth"></el-input> 
        </el-form-item>
        <el-form-item label="专线号码">
          <el-input v-model="formEdit.ConnNo"></el-input> 
        </el-form-item>
        <el-form-item label="线路提供商">
          <el-input v-model="formEdit.Provider"></el-input> 
        </el-form-item>
        <el-form-item label="接入时间">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="formEdit.AccessDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="占用接入点光纤芯(对)">
          <el-input v-model="formEdit.Used"></el-input> 
        </el-form-item>
        <el-form-item label="客户经理">
          <el-input v-model="formEdit.Manager"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formEdit.Remarks"></el-input> 
        </el-form-item>
        <el-form-item label="光电设备">
          <el-input v-model="formEdit.ElecDev"></el-input> 
        </el-form-item>
        <el-form-item label="光电设备端口">
          <el-input v-model="formEdit.ElecDevPort"></el-input> 
        </el-form-item>
        <el-form-item label="ODF 端口">
          <el-input v-model="formEdit.OdfPort"></el-input> 
        </el-form-item>
        <el-form-item label="专线互联 IP UCloud">
          <el-input v-model="formEdit.InterConnIpUcloud"></el-input> 
        </el-form-item>
        <el-form-item label="专线互联 IP 客户端">
          <el-input v-model="formEdit.InterConnIpClient"></el-input> 
        </el-form-item>
        <el-form-item label="VLAN">
          <el-input v-model="formEdit.Vlan"></el-input> 
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formEdit.Description"></el-input> 
        </el-form-item>
      </el-form>
      <!--{{formEdit}}
      <br>
      {{formatedEditCreate}}-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editConnFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditedConn('formEdit')" :loading="editing">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style scope>
  hr {
    color: #99a9bf;
  }
  .display-table-expand {
    font-size: 0;
  }
  .display-table-expand label {
    width: 190px;
    color: #99a9bf;
  }
  .display-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .create-table-expand {
    font-size: 0;
  }
  .create-table-expand label {
    width: 190px;
    color: #99a9bf;
  }
  .create-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  p {
    color: #99a9bf;
  }
  .motai .el-input__inner {
    width: 300px;
  }
  .motai .el-form-item {
    margin-bottom: 20px;
  }
</style>

<script>
import { stateHash, connTypeHash, optionConnTypeHash, optionStateHash } from '../hash/k_v'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
moment.locale('zh-cn')
import backendConf from '../config/backendConf'
const url = backendConf.url
export default {
  name: 'crud',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('值为空或类型不对'))
      } else {
        callback()
      }
    }
    return {
      optionStateHash,
      optionConnTypeHash,
      stateHash,
      connTypeHash,
      createConnFormVisible: false,
      editConnFormVisible: false,
      searching: false,
      creating: false,
      editing: false,
      formInline: {
        CompanyId: '',
        AccountId: ''
      },
      formCreate: {
        // required
        AccountId: '',
        ConnType: '',
        Address: '',
        UcloudAddr: '',
        ClientAddr: '',
        PeSwitch: '',
        SwitchPort: '',
        AzId: '',
        // not required
        State: '',
        Bandwidth: '',
        ConnNo: '',
        Provider: '',
        AccessDate: '',
        Used: '',
        Manager: '',
        Remarks: '',
        ElecDev: '',
        ElecDevPort: '',
        OdfPort: '',
        InterConnIpUcloud: '',
        InterConnIpClient: '',
        Vlan: '',
        Description: ''
      },
      formEdit: {
        // required
        AccountId: '',
        ConnType: '',
        Address: '',
        UcloudAddr: '',
        ClientAddr: '',
        PeSwitch: '',
        SwitchPort: '',
        AzId: '',
        // not required
        State: '',
        Bandwidth: '',
        ConnNo: '',
        Provider: '',
        AccessDate: '',
        Used: '',
        Manager: '',
        Remarks: '',
        ElecDev: '',
        ElecDevPort: '',
        OdfPort: '',
        InterConnIpUcloud: '',
        InterConnIpClient: '',
        Vlan: '',
        Description: ''
      },
      rules: {
        AccountId: [
          { validator: validatePass, trigger: 'blur' }
        ],
        ConnType: [
          { validator: validatePass, trigger: 'blur' }
        ],
        Address: [
          { validator: validatePass, trigger: 'blur' }
        ],
        UcloudAddr: [
          { validator: validatePass, trigger: 'blur' }
        ],
        ClientAddr: [
          { validator: validatePass, trigger: 'blur' }
        ],
        PeSwitch: [
          { validator: validatePass, trigger: 'blur' }
        ],
        SwitchPort: [
          { validator: validatePass, trigger: 'blur' }
        ],
        AzId: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      responseList: []
    }
  },
  filters: {
    time_formatter (value) {
      return moment(value, 'X').format('L')
    }
  },
  computed: {
    formatedFormCreate () {
      // let formatedForm
      // formatedForm = Object.assign({}, this.formCreate)
      // var formatedTime = moment(formatedForm['AccessDate']).format('X')
      // formatedForm['AccessDate'] = formatedTime
      // return formatedForm
      let timestamp = moment(this.formCreate['AccessDate']).format('X')
      return _.defaults({'AccessDate': timestamp}, this.formCreate)
    },
    formatedEditCreate () {
      // let formatedForm
      // formatedForm = Object.assign({}, this.formEdit)
      // var formatedTime = moment(formatedForm['AccessDate']).format('X')
      // formatedForm['AccessDate'] = formatedTime
      // return formatedForm
      let timestamp = moment(this.formEdit['AccessDate']).format('X')
      return _.defaults({'AccessDate': timestamp}, this.formEdit)
    },
    tableData () {
      // this.responseList.forEach((object) => {
      //   console.log(object)
      // })
      return this.responseList
    }
  },
  methods: {
    debounceLoadAccountInfo: _.debounce(
      function () {
        this.loadAccountInfo()
      },
    500
    ),
    loadAccountInfo () {
      let vm = this
      vm.searching = true
      var payload = {
        Action: 'UGetConn'
      }
      payload = _.merge(payload, this.formInline)
      axios.get(url + 'api-uhybird/account-crud', {
        params: payload
      })
      .then(function (response) {
        vm.$message({
          message: '信息加载成功',
          type: 'success'
        })
        vm.responseList = response.data['data']['LIST']
        vm.searching = false
      })
      .catch(function (error) {
        console.info(error)
        vm.$message.error('服务器提了一个错误，稍后再试')
        vm.searching = false
      })
    },
    createConn (formCreate) {
      this.$refs[formCreate].validate((valid) => {
        if (valid) {
          let vm = this
          vm.creating = true
          var payload = {
            Action: 'UCreateConn'
          }
          payload = _.merge(payload, vm.formatedFormCreate)
          axios.get(url + 'api-uhybird/account-crud', {
            params: payload
          })
          .then(function (response) {
            if (response.data.data.RetCode === 0) {
              vm.$message({
                message: response.data.data.Message,
                type: 'success'
              })
              vm.creating = false
              vm.createConnFormVisible = false
              vm.debounceLoadAccountInfo()
            } else {
              vm.$message({
                message: response.data.data.Message,
                type: 'warning'
              })
              vm.creating = false
            }
          })
          .catch(function (error) {
            console.info(error)
            vm.$message.error('服务器提了一个错误，稍后再试')
            vm.creating = false
          })
        } else {
          console.log('form invalid')
          return false
        }
      })
    },
    deleteConn (index, row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let vm = this
        var payload = row
        payload['Action'] = 'UDeleteConn'
        axios.get(url + 'api-uhybird/account-crud', {
          params: payload
        })
        .then(function (response) {
          if (response.data.data.RetCode === 0) {
            vm.$message({
              message: response.data.data.Message,
              type: 'success'
            })
            vm.debounceLoadAccountInfo()
          } else {
            vm.$message({
              message: response.data.data.Message,
              type: 'warning'
            })
          }
        })
        .catch(function (error) {
          console.info(error)
          vm.$message.error('服务器提了一个错误，稍后再试')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // payload = {}
      // _.merge()
    },
    editConn (index, row) {
      this.editConnFormVisible = true
      this.formEdit = row
      this.formEdit['AccessDate'] = moment(this.formEdit['AccessDate'], 'X').format('L')
    },
    saveEditedConn (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let vm = this
          vm.editing = true
          var payload = {
            Action: 'UModifyConn'
          }
          payload = _.merge(payload, vm.formatedEditCreate)
          axios.get(url + 'api-uhybird/account-crud', {
            params: payload
          })
          .then(function (response) {
            if (response.data.data.RetCode === 0) {
              vm.$message({
                message: response.data.data.Message,
                type: 'success'
              })
              vm.editing = false
              vm.editConnFormVisible = false
              vm.debounceLoadAccountInfo()
            } else {
              vm.$message({
                message: response.data.data.Message,
                type: 'warning'
              })
              vm.editing = false
            }
          })
          .catch(function (error) {
            console.info(error)
            vm.$message.error('服务器提了一个错误，稍后再试')
            vm.editing = false
          })
        } else {
          console.log('form invalid')
          return false
        }
      })
    },
    Stateformatter (row, column) {
      console.log(row.State)
      return this.stateHash[row.State]['text']
    },
    filterState (value, row) {
      return this.stateHash[row.State]['text'] === value
    },
    connTypeformatter (row, column) {
      console.log(row.State)
      return this.connTypeHash[row.ConnType]
    },
    filterConnType (value, row) {
      return this.connTypeHash[row.ConnType] === value
    }
  },
  watch: {
    formInline: {
      handler () {
        this.debounceLoadAccountInfo()
      },
      deep: true
    }
  },
  mounted () {
    document.title = '运营 · 专线客户信息管理'
    this.loadAccountInfo()
    console.log(url)
  }
}
</script>
