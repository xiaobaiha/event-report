# 埋点方案

## 使用

```tsx
import EventSDK from "./sdk";

EventSDK.config({}); // 初始化埋点SDK，注入自定义用户或其他信息
```

```tsx
import { useEventCollect } from "./sdk";

useEventCollect(); // PV自动化收集
```

上报点击事件：

```tsx
<div data-click="click_a">text</div>
```

上报展现事件：

```tsx
<div data-view="page_b_show">text</div>
```

上报自定义事件

```tsx
import EventSDK from "./sdk";

EventSDK.sendEvent("custom_event", { name: "Jack", age: 10 });
```

## 原理

整体流程：
初始化/初始 tags（did/uid/navigation 数据） -> 注册点击/展现事件 -> Hooks PV 自动上报 -> 埋点上报（注入 location tags） -> 批量收集埋点数据，间隔上报

点击：事件委托
展现：IntersectionObserver

TODO：Beacon/Request HEADERS 信息收集
