import BaseComponent from "./BaseComponent";
import highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(highcharts);
class WebComponent extends BaseComponent {
  highChartsInstance!: Highcharts.Chart;
  highChartsOptions: Highcharts.Options = {};
  bindReflow: () => void;
  constructor() {
    super();
    this.bindReflow = this.reflow.bind(this);
  }
  render() {
    super.render();

    let container = document.createElement("div");
    container.classList.add("highchars-container");
    this.shadowRoot!.appendChild(container);
    this.highChartsInstance = highcharts.chart(container, this.highChartsOptions);
  }
  getHighChartClass() {
    return highcharts
  }
  getHighChartsInstance() {
    return this.highChartsInstance;
  }
  getHighChartsOptions() {
    return this.highChartsOptions;
  }
  setOptions(options: Highcharts.Options, update: boolean, redraw: boolean = true) {
    this.highChartsOptions = options;
    this.highChartsInstance.update(options, update, redraw);
  }

  reflow() {
    this.highChartsInstance?.reflow();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.bindReflow);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.bindReflow);
  }
}

const define = (name: string, options?: ElementDefinitionOptions) => {
  customElements.define(name, WebComponent, options);
};

export { define };
export default WebComponent;
