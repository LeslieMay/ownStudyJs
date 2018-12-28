// redux 
// 组件数据的传递  父子组件通信 靠的就是属性 Context Api
// 平级组件交互 兄弟组件 (需要找到共同的父级)
// redux方式 统一资源状态管理 (解决组件间数据传递的问题)
// 流程store >  state > getState > 再组件中发布一个action > reducer管理员 > 更改这个状态

function createStore(reducer) {
    let state
    // 对外还要暴露state属性，暴露的属性不希望别人能改，就算你改了应该也不会影响原有的状态
    let listeners = [];
    let getState = () => JSON.parse(JSON.stringify(state));
    function dispatch(action) {
      state = reducer(state, action); // reducer返回的结果
      listeners.forEach(fn=>fn());
    }
    dispatch({type:'@INIT'}); // 派发初始动作 目的是拿到用户自定义个状态
    let subscribe = (fn)=>{
      listeners.push(fn);
      return ()=>{
        listeners = listeners.filter(l=>l!=fn);
      }
    }
    return {
      getState,
      dispatch,
      subscribe
    }
  }
  // 当前的初始值
  let initState = {
    title: { color: 'red', text: '标题-zfpx' },
    content: { color: 'green', text: '内容-zfpx' }
  }
  // 管理员  (纯函数 给他同样的东西 出来的结果永远一样)
  function reducer(state = initState,action) { // 默认状态
    switch (action.type) {
      case 'CHANGE_TITLE_COLOR':
        return { ...state, title: { ...state.title, color: action.color } }
        break;
      case 'CHANGE_CONTENT_TEXT':
        return { ...state, content: { ...state.content, text: action.text } }
        break
    }
    return state
  }
  let store = createStore(reducer);
  function renderTitle() {
    let title = document.getElementById('title');
    title.style.color = store.getState().title.color;
    title.innerHTML = store.getState().title.text;
  }
  function renderContent() {
    let content = document.getElementById('content');
    content.style.color = store.getState().content.color;
    content.innerHTML = store.getState().content.text;
  }
  function render() {
    renderTitle();
    renderContent();
  }
  render();
  // 我们要定义一个方法 实现更新状态的方法
  
  // 先写好一个更新函数 ,先把这个函数保存起来 每次状态变化（我们调用了dispatch）了 就执行这个函数
  store.subscribe(render);
  // 订阅事件执行后返回的是一个取消订阅
  let unsubcribe = store.subscribe(function () {
    console.log('状态更新了')
  });
  
  // 尽可能让状态被保护起来
  setTimeout(() => {
    store.dispatch({ type: 'CHANGE_TITLE_COLOR', color: 'yellow' });
  }, 1000);
  setTimeout(() => {
    store.dispatch({ type: 'CHANGE_TITLE_COLOR', color: 'blue' });
    unsubcribe();
  }, 2000);
  
  setTimeout(() => {
    store.dispatch({ type: 'CHANGE_TITLE_COLOR', color: 'pink' });
  }, 3000);
  