import { useEffect } from "react";
import { useLocation } from "react-router";
import { getDeviceID, getUserID } from "./utils";
import _ from "lodash";

type EventConfig = Record<string, any>;

interface Event {
  event_name: string;
  event_params: EventConfig;
  event_config: EventConfig;
}

class EventSDK {
  initialConfig: EventConfig = {};
  customConfig: EventConfig = {};
  private _clickHandler: any;
  private _clickKey = "data-click";
  private _viewKey = "data-view";
  private _eventSendQueue: Event[] = [];
  private _stop: number = 0;
  private _dispatchInterval = 200;
  private _maxDispatchLen = 5;
  private _intersectionThreshold = 0.3;
  private observers: IntersectionObserver[] = [];

  /**
   * 设置下初始的标签
   * @param config
   */
  config(config: EventConfig) {
    const userId = getUserID();
    const deviceId = getDeviceID();
    const navigatorConfig = _.pick(window.navigator, [
      "appCodeName",
      "appName",
      "appVersion",
      "cookieEnabled",
      "deviceMemory",
      "hardwareConcurrency",
      "language",
      "maxTouchPoints",
      "platform",
      "product",
      "productSub",
      "userAgent",
      "vendor",
      "vendorSub",
      "webdriver",
    ]);
    this.initialConfig = { deviceId, userId, ...navigatorConfig, ...config };
    window.addEventListener("load", () => this.startCollect());
  }

  getReportParams() {
    const selfCollectedConfig: EventConfig = _.pick(window.location, [
      "hash",
      "search",
      "host",
      "hostname",
      "href",
      "origin",
      "pathname",
      "port",
      "protocol",
    ]);
    return { ...selfCollectedConfig, ...this.initialConfig };
  }

  /**
   * 前置配置ready，开始自动化收集
   * 1. pv/uv 自动收集
   * 2. 耗时自动收集
   */
  startCollect() {
    this.dispatchEvent();
    this.domObserveListen();
  }

  /**
   * 点击/展现埋点方案
   */
  domObserveListen() {
    const clickKey = this._clickKey;
    const viewKey = this._viewKey;
    const sendEvent = this.sendEvent.bind(this);
    if (this._clickHandler) {
      document.body.removeEventListener("click", this._clickHandler);
    }
    this._clickHandler = (e: any) => {
      e.path.forEach(function (p: any) {
        const event = p.getAttribute?.(clickKey);
        if (event) {
          sendEvent(event, { text: p.innerText });
        }
      });
    };
    document.body.addEventListener("click", this._clickHandler);
    if (this.observers.length) {
      this.observers.forEach((ob) => ob.disconnect());
    }
    this.observers = [];
    const viewNodes = Array.from(document.querySelectorAll(`[${viewKey}]`));
    const intersectionRatio = this._intersectionThreshold;
    viewNodes.forEach((node) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio <= intersectionRatio) return;
        sendEvent(node.getAttribute?.(viewKey)!, {});
      });
      intersectionObserver.observe(node);
      this.observers.push(intersectionObserver);
    });
  }

  /**
   * 上报事件的外部方法
   * @param event_name
   * @param event_params
   */
  sendEvent(event_name: string, event_params: EventConfig) {
    this._eventSendQueue.push({
      event_name,
      event_params,
      event_config: this.getReportParams(),
    });
  }

  /**
   * 派发事件
   */
  dispatchEvent() {
    this._stop = window.setInterval(() => {
      if (!this._eventSendQueue.length) {
        return;
      } else {
        const len = Math.min(this._maxDispatchLen, this._eventSendQueue.length);
        const patch = this._eventSendQueue.splice(0, len);
        this.reportToRemote(patch);
      }
    }, this._dispatchInterval);
  }
  /**
   * 发送时间到remote，先mock成console
   * ip等信息再此对应接口处理
   * @param patch 事件列表
   */
  reportToRemote(patch: Event[]) {
    console.log(
      "Report",
      patch.length,
      "events(",
      patch.map((e) => e.event_name).join(","),
      "):",
      patch
    );
  }
  /**
   * 停止发送
   */
  stopSend() {
    clearInterval(this._stop);
  }
}

export const EventCollect = new EventSDK();

export const useEventCollect = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    EventCollect.domObserveListen();
    EventCollect.sendEvent("page_view", { route: pathname });
  }, [pathname]);
};

export default EventCollect;
