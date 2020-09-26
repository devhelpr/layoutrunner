export interface IRootLayout {
  name: string;
  layout: any;
  context: any;
  styles?: any;
  getValueFromLocalStore?: any;
  setValueFromLocalStore?: any;
}

export interface IElements {
  elements: any[];
  caption: string;

  renderElementType?: any;
  rootLayout: IRootLayout;
}
