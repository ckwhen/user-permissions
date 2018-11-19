# user-permissions

> 透過此元件設定個頁面允許的功能與動作，再向server取得目前角色具有權限進行比對後進行隱藏或顯示

## 目錄
- [Flow](#flow)
- [Demo](#demo)
- [Usage](#usage)

## Flow

![image](https://github.com/ckwhen/user-permissions/blob/master/img/flow.png)

## Demo

```bash
git clone https://github.com/ckwhen/user-permissions.git
cd ./user-permissions
npm install
npm run start
```

demo page: [http://localhost:8081/complex-hoc](http://localhost:8081/complex-hoc)

## Usage

### HoC:

```JSX
import { withPermission } from 'user-permissions';

const permissionConfig = {
  permission: 'foo',
  // 允許的功能
  functionCode: 'functionCode1',
  // 允許的動作
  actionCode: 'actionCode1',
};

class Foo extends Component {
  render() {
    // propName 預設為 permission
    // 可使用 propNamespace 在 config 修改
    const { permission } = this.props;
    return ( ... );
  }
}

export default withPermission(permissionConfig)(Hoc);
```

### reducer

```JS
import { combineReducers } from 'redux';
import { reducer as permissionReducer } from 'user-permissions';
import foo from './fooReducer';
import bar from './barReducer';

export default combineReducers({
  foo,
  bar,
  permission: permissionReducer,
});
```

### component

使用 Can, Cannot 元件包裹需要進行驗證的功能

```JSX
import { Can, Cannot } from ‘user-permissions’;


class Foo extends Component {
  render() {
    return (
      <div>
        <Can
          run="read"
          on="function1"
          render={() => <YourComponent1 />}
        />
        <Cannot
          run="write"
          on="function2"
          render={() => <YourComponent2 />}
        />
      </div>
    );
  }
}
```

### permissionMiddleware

定時向 server 取得角色允許的功能與動作權限

```JS
// store.js
import { createStore, applyMiddleware } from 'redux';import { permissionMiddleware } from 'user-permissions';import rootReducer from './reducers';

const store = createStore(rootReducer, {}, applyMiddleware(
  permissionMiddleware,
));

export default store;
```
