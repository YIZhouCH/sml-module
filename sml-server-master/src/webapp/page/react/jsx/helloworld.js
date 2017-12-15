
var name='world';
var myStyle = {
   fontSize: 10,
   color: '#002000'
};
var arr = [
    <h1>教程</h1>,
    <h2>学的不仅是技术，更是梦想！</h2>,
    <h3>hello {name}</h3>,
];
/**
定义标签属性通过this.props.   获取属性保留字  class-->className, for-->htmlFor
标签可以组合   getDefaultProps可以为属性添加默认值
render 返回中最外层只能包含一类标签
*/
var Name=React.createClass({
	render:function(){
		return <h1>hello {this.props.name}</h1>;
	}
});
var Link=React.createClass({
	render:function(){
		return <a href={this.props.name} target='_blank'>{this.props.name}</a>;
	}
});
var HelloMessage = React.createClass({
  getDefaultProps: function() {
    return {
      name: 'Runoob'
    };
  },
  render: function() {
    return (
    <div>
    	<Name name={this.props.name}/>
    	<Link name={this.props.link}/>
    </div>
    );
  }
});
/**
状态组件,可在state中定义多个状态标识,或变量标识
*/
 var LikeButton = React.createClass({
        getInitialState: function() {
          return {liked: false,show:true};
        },
        handleClick: function(event) {
           this.setState({liked: !this.state.liked});
        },
        showClick:function(event){
           this.setState({show:!this.state.show});
        },
        render: function() {
          var text=this.state.liked?'喜欢':'不喜欢';
          var showorhide=this.state.show?'显示':'隐藏';
          var dispaly_=this.state.show?'block':'none';
          return (
          	<div>
	            <p>
	              	你<b onClick={this.handleClick}>{text}</b>我。点我切换状态，<b onClick={this.showClick}>{showorhide}</b>
	            </p>
	            <p style={{dispaly:{dispaly_},visibility:{dispaly_}}}>
	            	目录文字看情况显示{dispaly_};
	            </p>
            </div>
          );
        }
      });
/**
下面为常量例子
*/
 var Hello = React.createClass({
        getInitialState: function () {
          return {
            opacity: 1.0
          };
        },
        /**组件挂载完执行*/
        componentDidMount: function () {
          this.timer = setInterval(function () {
            var opacity = this.state.opacity;
            opacity -= .05;
            if (opacity < 0.1) {
              opacity = 2.0;
            }
            this.setState({
              opacity: opacity
            });
          }.bind(this), 200);
        },

        render: function () {
          return (
            <div style={{opacity: this.state.opacity}}>
              Hello {this.props.name}
            </div>
          );
        }
      });
ReactDOM.render(
  <div style={myStyle}>
  	{arr}
  	{/**复合组件*/}
  	<HelloMessage name="world" link="http://localhost:1202/master/server"/>
  	<HelloMessage link="测试"/>
  	{/**状态组件state*/}
  	<LikeButton/>
  	<Hello name="huangwen"/>
  
  </div>,
   document.getElementById('example')
);