import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select,DatePicker ,message} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;



class TopForm extends Component {
  constructor(props) {
    super(props)
  }
  handleSearch =()=>{
    this.props.form.validateFields((err, values) => {
        let arr = Object.keys(values);
        let data = {}
        for(let i = 0;i<arr.length;i++){
          (values[arr[i]]) && (data[arr[i]] = values[arr[i]])
        }
        if(data){
          //默认查找第一页开始
          this.props.getSearch(data);
          data.currPage = 1;
          this.props.init(data)
        }
    });
  }
  clear = ()=>{
    this.props.form.resetFields();
    this.props.init({})
  }
  render(){
    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Form className = 'topForm clean'>
            <div className = 'fl'>
              <FormItem label = '车牌号码：' className = 'formItem'>
                {getFieldDecorator('carNum')(
                  <Input />
                )}
              </FormItem>
              
            </div>
            <div className = 'fl'>
              <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('carCompany')(
                  <Input />
                )}
              </FormItem>
          
            </div>
            <div className = 'fl'>
              <a className = 'empty' onClick = {this.clear} >清空</a>
            </div>
            <div className = 'fl'>
              <Button type="primary" onClick={this.handleSearch}>查找</Button>
            </div>
          </Form>
    )
  }
  
}
const SearchForm = Form.create({
  mapPropsToFields(props) {
    return {
      init: Form.createFormField({
        value: props.init,
      }),
      getSearch: Form.createFormField({
        value: props.getSearch,
      }),
    }
  },
})(TopForm)


// 收费信息弹窗
class TMsgDetail extends Component{
  constructor(props) {
    super(props)
    this.state = {
      navIndex : 0,
      data:[]
    }
    
  }
  handleSubmit = ()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        values.newCarId = this.props.detail.newCarId;
        values.vehicleId = this.props.detail.vehicleId;
        values.teamName = this.props.detail.teamName;
        values.inputMan = $Funs.cook.get('id');
        values.deadlineDate && (values.deadlineDate = new Date(values.deadlineDate._d).getTime())
        $Funs.$AJAX('charge','post',values,(res)=>{
          message.success('操作成功');
          this.props.cancel()
        })      
      }
    });
  }
  render(){
    const recodeColumns = [
      { title: '车辆ID', width: 100, dataIndex: 'newCarId',align: 'center' },
      { title: '公司车队', width: 150, dataIndex: 'teamName' ,align: 'center' },
      { title: '车牌号码', dataIndex: 'vehicleId', width: 150 ,align: 'center' },
      { title: '安装时间', dataIndex: '',  width: 150 ,align: 'center' },
      { title: '收费金额', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '有效期至', dataIndex: 'address', width: 150 ,align: 'center' },
      { title: '发票号码', dataIndex: 'address', width: 150 ,align: 'center' },
      { title: '支付方式', dataIndex: 'address', width: 150 ,align: 'center' },
      { title: '收费备注', dataIndex: 'address', width: 150 ,align: 'center' },
      { title: '收款人', dataIndex: 'address', width: 150 ,align: 'center' },
    ];
    const { getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let msgform = (
      <div className = 'detail'>
        <Form layout="inline"  className='clean'>
          <div className = 'clean'>
            <FormItem label='车牌号' className = 'formItem clean'>
              <Input  value={this.props.detail.vehicleId } disabled className = 'disabled'/>
            </FormItem>
            <FormItem label='公司或车队名' className = 'formItem clean'>
              <Input  value={this.props.detail.teamName } disabled className = 'disabled'/>
            </FormItem>
            <FormItem className = 'formItem clean'{...formItemLayout} label="收费金额">
              {getFieldDecorator('moneyAmont', {
                rules: [ {
                  required: true, message: '请输入收费金额',
                }],
              })(
                <Input className = 'pay' />
              )}
              <span  className = 'unit'>单位：元</span>
            </FormItem>
          </div>
          <div className = ' clean'>
            
            <FormItem className = 'formItem clean'{...formItemLayout} label="支付方式">
              {getFieldDecorator('payType', {
                rules: [ {
                  required: true, message: '请输入收费金额',
                }],
                initialValue:'现金'
              })(
                <Select  style={{ width: 120 }}>
                  <Option value="现金">现金</Option>
                  <Option value="转帐支票">转帐支票</Option>
                  <Option value="网银转账">网银转账</Option>
                  <Option value="支付宝">支付宝</Option>
                  <Option value="微信">微信</Option>
                  <Option value="其他">其他</Option>
                </Select>     
              )}
            </FormItem>
            <FormItem className = 'formItem clean'{...formItemLayout} label="截止时间">
              {getFieldDecorator('deadlineDate', {
                rules: [ {
                  required: true, message: '请输入截止时间',
                }],
              })(
                <DatePicker />
              )}
            </FormItem>
          </div>
          <div className = 'clean'>
            <FormItem className = 'formItem code clean'{...formItemLayout} label="发票（或收据）号码">
              {getFieldDecorator('invoiceNum', {
                rules: [ {
                  required: true, message: '请输入发票（或收据）号码',
                }],
              })(
                <Input className = 'pay' />
              )}
            </FormItem>
          </div>
          <FormItem label = '收费备注：' className = 'formItem fl clean'>
            {getFieldDecorator('remark', {
              
            })(
              <TextArea rows={3} />
            )}
          </FormItem>
        </Form>
        <div className = 'diaBtns fr'>
          <Button type="primary" onClick = {this.handleSubmit}>缴费确认</Button>
          <Button>取消</Button>
        </div>
      </div>
    )
    let recode = (
      <div>
        <Table  columns={recodeColumns} dataSource={this.state.data} scroll={{ x:1300,y:280}} pagination = {false}/>
        <Button type="primary" className = 'confirm'>确认</Button>
      </div>
    )
    return(
      <div className = 'dialog'>
        <div className = 'mask'></div>
        <div className = 'main'>
          <div className = 'nav clean'>
            <span className = {this.state.navIndex == 0 ? 'active' :''}>收费信息填写</span>
            <span className = {this.state.navIndex == 1 ? 'active' :''}>收费记录</span>
          </div>
            {this.state.navIndex == 0 ? msgform : recode}
        </div>
      </div>
    )
  }
}
const MsgDetail = Form.create()(TMsgDetail)

export default class Save extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDiglog:false,
      currPage:1,
      pageSize:13,
      keyWord:{},//搜索关键字
      data:[],//table数据
      total:'',//总页数
      detail:{},//录入项对象
    }
  }
  componentWillMount(){
    this.init({})
  }
  init=(data)=>{
    !data.currPage && (data.currPage = this.state.currPage);
    data.pageSize = this.state.pageSize;
    $Funs.$AJAX('getChargelist','get',data,(res)=>{
      let data = res.data.map((v,i)=>{
        v.key = i;
        v.leaveFactoryInstall = v.leaveFactoryInstall == 0 ? '否' : '是';
        v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0];
        v.chargeTime ? (v.chargeTime = $Funs.formatDate(v.chargeTime)) : v.chargeTime = '未收费';
        v.deadlineDate ? (v.deadlineDate = $Funs.formatDate(v.deadlineDate)) : v.deadlineDate = '无';
        return v
      })
      this.setState({
        data : data,
        total: res.count
      })
    })
  }
  getSearch=(data)=>{
    if(data){
      this.setState({
        keyWord:data
      })
    }
  }
  pageChange = (page)=>{
    this.setState({
      currPage:page
    },()=>{
      this.init({})
    })
  }
  addEntry = (item)=>{
    console.log(item)
    this.setState({
      showDiglog:true,
      detail:item
    })
  }
  cancel = ()=>{
    this.setState({
      showDiglog:false
    })
  }
  render() {
    const columns = [
      { title: '车牌号码', width: 100, dataIndex: 'vehicleId',key: 'vehicleId',align: 'center' },
      { title: '车辆类型', width: 150, dataIndex: 'typeName' ,align: 'center' },
      { title: '公司车队', dataIndex: 'teamName', width: 150 ,align: 'center' },
      { title: '收费日期', dataIndex: 'chargeTime',  width: 150 ,align: 'center' },
      { title: '联系电话', dataIndex: 'phone',  width: 120 ,align: 'center' },
      { title: '有效期至', dataIndex: 'deadlineDate', width: 150 ,align: 'center' },
      { title: '安装日期', dataIndex: 'leaveFactoryDate', width: 150 ,align: 'center' },
      { title: '是否出厂安装', dataIndex: 'leaveFactoryInstall', width: 120 ,align: 'center' },
      { title: '厂家编号', dataIndex: 'factoryNumber', width: 100 ,align: 'center' },
      { title: '生产厂家', dataIndex: 'manufacturer', width: 100 ,align: 'center' },
      { title: '操作', dataIndex: '', key: 'action', render: (item) => <Button type="primary" onClick = {()=>{this.addEntry(item)}}>录入</Button> },
    ];
    
    return (
      <div className = 'save'>
      <SearchForm init={this.init} getSearch = {this.getSearch} />
        <Table  columns={columns} dataSource={this.state.data} scroll={{y:400}}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange }}/>
        {this.state.showDiglog && <MsgDetail detail = {this.state.detail} cancel = {this.cancel}/>}
      </div>
    )
  }
}
