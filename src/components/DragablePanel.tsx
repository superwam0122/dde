import { CloseCircleFilled } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useState, useRef } from "react";
import Draggable from "react-draggable";

import useT from "@/hooks/use-t";

import type { ControlPosition, DraggableBounds } from "react-draggable";

type DragablePanelProps = {
  visible?: boolean;
  title?: React.ReactNode;
  bounds?: DraggableBounds;
  defaultPosition?: ControlPosition;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
};

export const DragablePanel = (props: DragablePanelProps) => {
  const t = useT();
  const { styles } = blockStyles();

  const {
    visible = true,
    title,
    bounds,
    defaultPosition,
    style: userStyle,
    contentStyle,
    className,
    onClose,
    children,
  } = props;

  const [disable, setDisable] = useState(false);

  const noMove = {
    onTouchStart: () => !disable && setDisable(true),
    onMouseOver: () => !disable && setDisable(true),
    onMouseLeave: () => disable && setDisable(false),
  };

  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable
      bounds={bounds}
      defaultPosition={defaultPosition}
      disabled={disable}
      nodeRef={panelRef}
    >
      <div
        ref={panelRef}
        style={userStyle}
        className={`${className} ${styles.dragPanel} ${
          visible ? "" : styles.hide
        }`}
      >
        <div className={styles.header}>
          <div
            {...noMove}
            className={styles.title}
            title={typeof title === "string" ? title : ""}
          >
            {title}
          </div>
          {onClose && (
            <span
              {...noMove}
              className={styles.closebtn}
              title={"关闭"}
              onClick={onClose}
            >
              <CloseCircleFilled />
            </span>
          )}
        </div>
        <div {...noMove} className={styles.dragContent} style={contentStyle}>
          {children}
        </div>
      </div>
    </Draggable>
  );
};

const blockStyles = createStyles(({ css, token }) => ({
  dragPanel: css`
    cursor: move;
    display: flex;
    overflow: hidden;
    z-index: 2;
  `,
  hide: css`
    display: none;
  `,
  header: css``,
  title: css`
    position: absolute;
    top: 4px;
    left: 6px;
    display: inline-block;
    max-width: 150px;
    overflow: hidden;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: auto;
  `,
  closebtn: css`
    position: absolute;
    top: 0;
    right: 4px;
    z-index: 100;
    color: #00000073;
    font-size: 18px;
    cursor: pointer;
    transition: all ease 0.3s;
    :hover {
      color: #000;
    }
  `,
  dragContent: css`
    flex: 1;
    cursor: auto;
    overflow: auto;
  `,
}));
