//定义了一些与地质时间刻度图相关的类型和接口
//这些类型和接口主要用于描述和管理地质时间数据以及D3.js相关的操作
import type { ZoomTransform } from "d3";

/** geo time data intervals schema **/
export type IntervalItem = {   //用于描述地质时间间隔的属性，包括ID、名称、颜色、时间范围等
  id: number;
  name: string;
  abbr?: string;
  color: string;
  textColor?: string;
  end: number;
  start: number;
  level?: number;
  parentId?: number;
  leaf?: boolean;
};

export type MarginOpts = {  //用于描述图表的边距设置
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export interface GeoTimeLineOptions {  //用于描述地质时间刻度图的配置选项，包括SVG宽度、高度、字体设置、回调函数、边距和填充等
  /** svg width, defaults to container's width */
  width?: number;
  /** svg height, defaults to 70 */
  height?: number;
  /** font size, defaults to 16px */
  fontSize?: number;
  /** font family, defaults to 'sans-serif' */
  fontFamily?: string;
  /** callback when handle's position or scale level changed */
  onChange?: (time: number, level: number) => void;
  /** dispatch when mouseup or zoom  */
  onAfterChange?: (time: number, level: number) => void;
  /** defaults to {
    top: 0, right: 0, bottom: 0, left: 0,
  } */
  margin?: MarginOpts;
  /** defaults to {
    top: 0, right: 0, bottom: 0, left: 0,
  } */
  padding?: MarginOpts;
  /** initial time, defaults to 0 */
  time?: number;
  /** initial level, defaults to 1 */
  level?: number;
  /** animation time, defaults to 450ms */
  transition?: number;
  /** interval transform setting, defaults to (d) => d.leaf ? 1 : 0 */
  intervalSum?: (d: IntervalItem) => number;
  /** min zoom level */
  minZoom?: number;
  /** max zoom level, defaults to 10 */
  maxZoom?: number;
}

export interface GeoTimeScaleOptions {  //类似于GeoTimeLineOptions，但更具体地用于地质时间刻度图的选项设置
  /** svg width, defaults to container's width */
  width?: number;
  /** svg height, defaults to 400px */
  height?: number;
  /** font size, defaults to 12px */
  fontSize?: number;
  /** font family, defaults to 'sans-serif' */
  fontFamily?: string;
  /** callback when handle's position or scale level changed */
  onChange?: (node: NodeItem) => void;
  /** defaults to {
    top: 0, right: 0, bottom: 0, left: 0,
  } */
  margin?: MarginOpts;
  /** defaults to {
    top: 0, right: 0, bottom: 0, left: 0,
  } */
  padding?: MarginOpts;
  /** animation time, defaults to 450ms */
  transition?: number;
  /** interval transform setting, defaults to d => d.leaf ? d.start - d.end : 0 */
  intervalSum?: (d: IntervalItem) => number;
  /** simplify show 2 levels or not, defaults to false */
  simplify?: boolean;
  /** focused node's neighbor node width, defaults to 100px */
  neighborWidth?: number;
  /** tick length, defaults to 15px */
  tickLength?: number;
  /** tick value unit */
  unit?: string;
}

export type NodeItem = HierarchyRectangularNode<IntervalItem> & {  //扩展了HierarchyRectangularNode，添加了一些用于可视化的数据属性，如目标位置和可见性
  target?: {
    x0: number;
    x1: number;
    y0?: number;
    y1?: number;
  };
  visible?: boolean;
};

export type TickNode = {  //用于描述刻度节点的属性，包括位置、深度、目标位置、文本和可见性
  x: number;
  y: number;
  depth: number;
  targetX: number;
  text: string;
  visible: boolean;
};

export type d3ZoomEvent = {  //描述D3.js的缩放事件，包括源事件、目标和变换信息
  sourceEvent: WheelEvent | MouseEvent;
  target: any;
  transform: ZoomTransform;
};

// copy from d3
export interface HierarchyLink<Datum> {  //这些接口从D3.js中复制过来，用于描述层次结构数据和节点操作
  /**
   * The source of the link.
   */
  source: HierarchyNode<Datum>;

  /**
   * The target of the link.
   */
  target: HierarchyNode<Datum>;
}

export interface HierarchyNode<Datum> {
  /**
   * The associated data, as specified to the constructor.
   */
  data: Datum;

  /**
   * Zero for the root node, and increasing by one for each descendant generation.
   */
  readonly depth: number;

  /**
   * Zero for leaf nodes, and the greatest distance from any descendant leaf for internal nodes.
   */
  readonly height: number;

  /**
   * The parent node, or null for the root node.
   */
  parent: this | null;

  /**
   * An array of child nodes, if any; undefined for leaf nodes.
   */
  children?: this[] | undefined;

  /**
   * Aggregated numeric value as calculated by `sum(value)` or `count()`, if previously invoked.
   */
  readonly value?: number | undefined;

  /**
   * Optional node id string set by `StratifyOperator`, if hierarchical data was created from tabular data using stratify().
   */
  readonly id?: string | undefined;

  /**
   * Returns the array of ancestors nodes, starting with this node, then followed by each parent up to the root.
   */
  ancestors(): this[];

  /**
   * Returns the array of descendant nodes, starting with this node, then followed by each child in topological order.
   */
  descendants(): this[];

  /**
   * Returns the array of leaf nodes in traversal order; leaves are nodes with no children.
   */
  leaves(): this[];

  /**
   * Returns the first node in the hierarchy from this node for which the specified filter returns a truthy value. undefined if no such node is found.
   * @param filter Filter.
   */
  find(filter: (node: this) => boolean): this | undefined;

  /**
   * Returns the shortest path through the hierarchy from this node to the specified target node.
   * The path starts at this node, ascends to the least common ancestor of this node and the target node, and then descends to the target node.
   *
   * @param target The target node.
   */
  path(target: this): this[];

  /**
   * Returns an array of links for this node, where each link is an object that defines source and target properties.
   * The source of each link is the parent node, and the target is a child node.
   */
  links(): Array<HierarchyLink<Datum>>;

  /**
   * Evaluates the specified value function for this node and each descendant in post-order traversal, and returns this node.
   * The `node.value` property of each node is set to the numeric value returned by the specified function plus the combined value of all descendants.
   *
   * @param value The value function is passed the node’s data, and must return a non-negative number.
   */
  sum(value: (d: Datum) => number): this;

  /**
   * Computes the number of leaves under this node and assigns it to `node.value`, and similarly for every descendant of node.
   * If this node is a leaf, its count is one. Returns this node.
   */
  count(): this;

  /**
   * Sorts the children of this node, if any, and each of this node’s descendants’ children,
   * in pre-order traversal using the specified compare function, and returns this node.
   *
   * @param compare The compare function is passed two nodes a and b to compare.
   * If a should be before b, the function must return a value less than zero;
   * if b should be before a, the function must return a value greater than zero;
   * otherwise, the relative order of a and b are not specified. See `array.sort` for more.
   */
  sort(compare: (a: this, b: this) => number): this;

  /**
   * Returns an iterator over the node’s descendants in breadth-first order.
   */
  [Symbol.iterator](): Iterator<this>;

  /**
   * Invokes the specified function for node and each descendant in breadth-first order,
   * such that a given node is only visited if all nodes of lesser depth have already been visited,
   * as well as all preceding nodes of the same depth.
   *
   * @param func The specified function is passed the current descendant, the zero-based traversal index, and this node.
   * @param that If that is specified, it is the this context of the callback.
   */
  each<T = undefined>(
    func: (this: T, node: this, index: number, thisNode: this) => void,
    that?: T,
  ): this;

  /**
   * Invokes the specified function for node and each descendant in post-order traversal,
   * such that a given node is only visited after all of its descendants have already been visited.
   *
   * @param func The specified function is passed the current descendant, the zero-based traversal index, and this node.
   * @param that If that is specified, it is the this context of the callback.
   *
   */
  eachAfter<T = undefined>(
    func: (this: T, node: this, index: number, thisNode: this) => void,
    that?: T,
  ): this;

  /**
   * Invokes the specified function for node and each descendant in pre-order traversal,
   * such that a given node is only visited after all of its ancestors have already been visited.
   *
   * @param func The specified function is passed the current descendant, the zero-based traversal index, and this node.
   * @param that If that is specified, it is the this context of the callback.
   */
  eachBefore<T = undefined>(
    func: (this: T, node: this, index: number, thisNode: this) => void,
    that?: T,
  ): this;

  /**
   * Return a deep copy of the subtree starting at this node. The returned deep copy shares the same data, however.
   * The returned node is the root of a new tree; the returned node’s parent is always null and its depth is always zero.
   */
  copy(): this;
}

export interface HierarchyRectangularLink<Datum> {
  /**
   * The source of the link.
   */
  source: HierarchyRectangularNode<Datum>;

  /**
   * The target of the link.
   */
  target: HierarchyRectangularNode<Datum>;
}
export interface HierarchyRectangularNode<Datum> extends HierarchyNode<Datum> {
  /**
   * The left edge of the rectangle.
   */
  x0: number;

  /**
   * The top edge of the rectangle
   */
  y0: number;

  /**
   * The right edge of the rectangle.
   */
  x1: number;

  /**
   * The bottom edge of the rectangle.
   */
  y1: number;

  /**
   * Returns an array of links for this node, where each link is an object that defines source and target properties.
   * The source of each link is the parent node, and the target is a child node.
   */
  links(): Array<HierarchyRectangularLink<Datum>>;
}
