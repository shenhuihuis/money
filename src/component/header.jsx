import React, { Component  } from 'react'
import { NavLink,Link,withRouter } from 'react-router-dom'


const nav = [
  {id:0,name:'首页',href:'/',active:false},
  {id:1,name:'车辆基本信息',href:'/carInfo/entry',active:false,child:[
    {name:'车辆录入',href:'/carInfo/entry',active:true},
    {name:'车辆资料',href:'/carInfo/info',active:false},
    {name:'变更记录查询',href:'/carInfo/dataQuery',active:false}
  ]},
  {id:2,name:'打印审核',href:'/print/prove',active:false,child:[
    {name:'证明打印',href:'/print/prove',active:true},
    {name:'证明作废',href:'/print/invalid',active:false},
    {name:'打印审核',href:'/print/audit',active:false}
  ]},
  {id:3,name:'收费管理',href:'/charge/save',active:false,child:[
    {name:'收费录入',href:'/charge/save',active:true},
    {name:'收费查询',href:'/charge/query',active:false},
    {name:'集体收费',href:'/charge/group',active:false},
    {name:'收费修改',href:'/charge/modify',active:false}
  ]},
  {id:4,name:'信息管理',href:'/information/stop',active:false,child:[
    {name:'车辆报停/恢复',href:'/information/stop',active:true},
    {name:'信息变更',href:'/information/change',active:false},
    {name:'安装维修记录',href:'/information/recode',active:false},
    {name:'维修通知',href:'/information/notice',active:false}
  ]},
  {id:5,name:'系统管理',href:'/system/log',active:false,child:[
    {name:'日志查询',href:'/system/log',active:true},
    {name:'信息维护',href:'/system/maintenance',active:false},
  ]},
  {id:6,name:'人员管理',href:'/person',active:false,child:[
    // {name:'车辆录入',href:'/carInfo/entry',active:true},
    // {name:'车辆资料',href:'/carInfo/info',active:false},
    // {name:'车辆数据查询',href:'/carInfo/dataQuery',active:false}
  ]},
]
let navArr = [
  {id:0,name:'首页',href:'/',exact:true,active:false}
]


class THeader extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      reNew:true
    })
  }
  componentWillMount(){
    let url = this.props.location.pathname.split('/');
    if(this.props.location.pathname == '/'){
      navArr[0].active = true;
      return
    }
    let newNav = nav.filter((v)=>{
      return v.id != 0 && v.href.indexOf(url[1]) != -1
    })[0]
    if(!newNav){return }
    newNav.active = true;
    if(newNav.child){
      newNav.child = newNav.child.map(v=>{
        (v.href.indexOf(url[2]) != -1) ? (v.active = true) : (v.active = false)
        return  v
      })
    }
    navArr.push(newNav)
  }


  componentWillReceiveProps(nextProps){
    if(nextProps.navIdx == this.props.navIdx && this.props.location.pathname != '/'){return} 
    if(nextProps.navIdx == 0){return}//首页不添加
    navArr.push(nav[nextProps.navIdx])
    navArr = [...new Set(navArr)]//数组去重
    navArr.map(v=>{
      v.active = false;
      return v
    })
    navArr[navArr.length-1].active = true//当前激活nav
  }
  navchange = (i) =>{
    navArr = navArr.map((v)=>{
      v.active = false;
      return v
    })
    navArr[i].active = true;
  }
  subchange = (i) =>{//子路由下标
    let index = '';
    let item = navArr.find((v,i)=>{
      index = i
      return v.active == true
    })
    let child = item.child;
    child = child.map((v,idx)=>{
      v.active = false;
      (idx == i) && (v.active = true)
      return  v
    })
    navArr[index].child = child;

  }
  close = (id)=>{
    if(id == 0){return}
    let idx = navArr.findIndex(v=>{
      return v.id == id
    })
    navArr.splice(idx,1)
    let href = navArr[navArr.length - 1].href;
    navArr[navArr.length - 1].active = true;
    this.props.history.push(href)
  }

  render() {
    const { match, location, history } = this.props
    const navs = navArr.map((v,i)=>{
      return (
        <div  key={i} className="nav">
          <div style={{position:'relative'}}>
            <Link  className={v.active ? "select navItem" :'navItem' }  to={v.href} onClick={()=>{this.navchange(i)}}>
              {v.name}
            </Link>
            <b onClick = {(e)=>{this.close(v.id)}}>&times;</b>
          </div>
          { (v.child && v.active) && <div className="subNav">{v.child.map((v,idx)=>{
            return  (
              <Link className={v.active ? "subActive" :'' } to={v.href} key={idx} onClick={()=>{this.subchange(idx)}}>
                {v.name}
              </Link>
            )
        })}</div>}
        </div>
      )
    })
    return (
      <header>
        <div className = 'logo'></div>
        <div className = 'loginInfo'>
          {$Funs.cook.get('userName')}<img src={require('../assets/img/exit.png')}/>
        </div>
        <div className = 'top_nav'>
          {navs}
        </div>
      </header>
    )
  }
}

const Header=withRouter(THeader)

export default Header

