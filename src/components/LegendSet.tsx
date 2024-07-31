import { CloseOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { InputNumber, Popover, Tooltip } from "antd";
import { createStyles } from "antd-style";
import { useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "./Icon";
import Sortable from "./Sortable";

interface LegendSetProps {
  itemlist: API.DataItem[];
  changeLegends?: (data: [] | undefined) => void;
}

export const svgIcon = (symbol: string, color: string) => {
  let path = "" as any;
  switch (symbol) {
    case "circle_1":
      path = <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />;
      break;
    case "rect_1":
      path = (
        <rect
          x="7"
          y="7"
          width="10"
          height="10"
          stroke={color}
          strokeWidth="2"
        />
      );
      break;
    case "triangle_1":
      path = (
        <path
          d="M7.73205 16.1961L12 8.80383L16.2679 16.1961H7.73205Z"
          stroke={color}
          strokeWidth="2"
        />
      );
      break;
    case "line":
      path = <rect x="6" y="11" width="12" height="2" fill={color} />;
      break;
    case "plus":
      path = <path d="M13 6H11V11H6V13H11V18H13V13H18V11H13V6Z" fill={color} />;
      break;
    case "multiple_sign":
      path = (
        <path
          d="M10.2426 12L6 16.2426L7.41421 17.6568L11.6569 13.4142L15.8995 17.6568L17.3137 16.2426L13.0711 12L17.3137 7.75735L15.8995 6.34314L11.6569 10.5858L7.41421 6.34314L6 7.75735L10.2426 12Z"
          fill={color}
        />
      );
      break;
    case "line_o":
      path = (
        <path
          d="M5 11V9H3V11H5ZM7.10002 11V13H8.73483L9.06004 11.3979L7.10002 11ZM5 13H3V15H5V13ZM7.10002 13L9.06004 12.6021L8.73483 11H7.10002V13ZM16.9 13V11H15.2652L14.94 12.6021L16.9 13ZM19 13V15H21V13H19ZM19 11H21V9H19V11ZM16.9 11L14.94 11.3979L15.2652 13H16.9V11ZM5 13H7.10002V9H5V13ZM7 13V11H3V13H7ZM7.10002 11H5V15H7.10002V11ZM5.13999 13.3979C5.78874 16.5938 8.61113 19 12 19V15C10.551 15 9.33784 13.9706 9.06004 12.6021L5.13999 13.3979ZM12 19C15.3889 19 18.2113 16.5938 18.86 13.3979L14.94 12.6021C14.6622 13.9706 13.449 15 12 15V19ZM19 11H16.9V15H19V11ZM17 11V13H21V11H17ZM16.9 13H19V9H16.9V13ZM18.86 10.6021C18.2113 7.40616 15.3889 5 12 5V9C13.449 9 14.6622 10.0294 14.94 11.3979L18.86 10.6021ZM12 5C8.61113 5 5.78874 7.40616 5.13999 10.6021L9.06004 11.3979C9.33784 10.0294 10.551 9 12 9V5Z"
          fill={color}
          mask="url(#path-2-inside-1_56_14287)"
        />
      );
      break;
    case "diamond_1":
      path = (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.2426 12.0711L12 7.82843L7.75736 12.0711L12 16.3137L16.2426 12.0711ZM12 5L4.92893 12.0711L12 19.1421L19.0711 12.0711L12 5Z"
          fill={color}
        />
      );
      break;
    case "circle":
      path = <circle cx="12" cy="12" r="6" fill={color} />;
      break;
    case "rect":
      path = <rect x="6" y="6" width="12" height="12" fill={color} />;
      break;
    case "triangle":
      path = <path d="M12 6.80383L18 17.1961H6L12 6.80383Z" fill={color} />;
      break;
    case "diamond":
      path = (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 5L4.92893 12.0711L12 19.1421L19.0711 12.0711L12 5Z"
          fill={color}
        />
      );
      break;
    default:
      path = <circle cx="12" cy="12" r="5" stroke="red" strokeWidth="2" />;
      break;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      {path}
    </svg>
  );
};

function compareArrays(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

export function LegendSet(props: LegendSetProps) {
  const { styles } = blockStyles();
  const { itemlist, changeLegends } = props;
  const [clicked, setClicked] = useState(false);
  const [clicked2, setClicked2] = useState(false);

  const [newData, setNewData] = useState<API.DataItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeId, setActiveId] = useState("");

  const [list, setList] = useState([]);

  const refData = useRef(null);
  const refActive = useRef(0);
  const refActiveId = useRef(null);

  useEffect(() => {
    if (!compareArrays(newData, itemlist)) {
      setNewData(itemlist);
      // console.log(5555,itemlist)
      refData.current = itemlist;
      setNewList();
    }
  }, [itemlist]);

  const setNewList = () => {
    // console.log("setNewList");
    const result = [];
    refData.current.forEach((item, i) => {
      result.push({
        key: i,
        children: (
          <Popover
            content={<div>{IconsContent}</div>}
            title={refActiveId.current || item.id}
            trigger="click"
            arrow={false}
            placement={"leftTop"}
            onOpenChange={handleClickChange2}
            key={`popover-${i}`}
          >
            <div
              className={styles.items}
              onClick={() => {
                setActiveId(item.id);
                refActiveId.current = item.id;
                setNewActive();
              }}
              key={`item-${i}`}
            >
              <span className={styles.iconBox}>
                {svgIcon(item.symbol, item.color)}
              </span>

              <Tooltip title={item.label + "(" + item.version + ")"}>
                <label className={styles.itemslabel}>
                  {item.label + "(" + item.version + ")"}
                </label>
              </Tooltip>
            </div>
          </Popover>
        ),
      });
    });
    setList(result);
  };

  const setNewActive = () => {
    refData.current.forEach((item, index) => {
      if (item.id === refActiveId.current) {
        setActiveIndex(index);
        refActive.current = index;
      }
    });
  };

  const svgList = [
    "circle_1",
    "rect_1",
    "triangle_1",
    "line",
    "plus",
    "multiple_sign",
    "line_o",
    "diamond_1",
    "circle",
    "rect",
    "triangle",
    "diamond",
  ];
  const colorList = [
    "#FC3E28",
    "#FC7916",
    "#FEB809",
    "#FFEA2E",
    "#96D131",
    "#25A24E",
    "#16AE9D",
    "#2668E8",
    "#2689D2",
    "#49C1EE",
    "#8733D8",
    "#AB4FD0",
    "#959595",
    "#000000",
  ];

  const setItemIcon = (icon: string) => {
    const data = [...refData.current];
    if (icon == "line" && data[refActive.current].type == "scatter") {
      return;
    }
    data[refActive.current].symbol = icon;
    // setNewData([...data]);
    changeLegends?.([...data]);
    setNewList();
  };

  const setItemColor = (color: string) => {
    const data = [...refData.current];
    // console.log(7777,refActive.current);
    data[refActive.current].color = color;
    // setNewData([...data]);
    changeLegends?.([...data]);
    setNewList();
  };

  const onChangeSize = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    const data = [...refData.current];
    data[refActive.current].symbolSize = value;
    // setNewData([...data]);
    changeLegends?.([...data]);
    setNewList();
  };

  const onChangeOpacity = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    const data = [...refData.current];
    data[refActive.current].opacity = value;
    // setNewData([...data]);
    changeLegends?.([...data]);
    setNewList();
  };

  const IconsContent = useMemo(() => {
    // console.log(9999,activeIndex,newData)
    return (
      <div className={styles.contentBox}>
        <label className={styles.label1}>图标</label>
        <div className={styles.iconsList}>
          {svgList.map((item, i) => (
            <div
              className={
                newData.length &&
                item == refData.current[refActive.current].symbol
                  ? styles.iconBox
                  : styles.iconBox
              }
              // iconBoxActive
              style={{
                marginRight: "4px",
                marginBottom: "4px",
                cursor: "pointer",
              }}
              onClick={() => setItemIcon(item)}
              key={`icon-${i}`}
            >
              {svgIcon(item, "#000000")}
            </div>
          ))}
        </div>
        <div className={styles.spaceLine}></div>
        <label className={styles.label1}>颜色</label>
        <div className={styles.colorsList}>
          {colorList.map((item, i) => (
            <div
              className={styles.colorBox}
              style={{ background: item }}
              onClick={() => setItemColor(item)}
              key={`color-${i}`}
            >
              {newData.length &&
              item == refData.current[refActive.current].color
                ? ""
                : ""}
              {/* <Icon type="right" /> */}
            </div>
          ))}
        </div>
        <div className={styles.spaceLine}></div>
        <label className={styles.label1}>图标大小</label>
        <div>
          <InputNumber
            min={1}
            max={50}
            style={{ width: "100%" }}
            defaultValue={
              (newData.length &&
                refData.current[refActive.current].symbolSize) ||
              10
            }
            onChange={onChangeSize}
          />
        </div>
        <div className={styles.spaceLine}></div>
        <label className={styles.label1}>透明度</label>
        <div>
          <InputNumber
            min={0.1}
            max={1}
            style={{ width: "100%" }}
            step={0.1}
            defaultValue={
              (newData.length && refData.current[refActive.current].opacity) ||
              1
            }
            onChange={onChangeOpacity}
          />
        </div>
      </div>
    );
  }, [newData, activeIndex, list]);

  const hide = () => {
    setClicked2(false);
    setClicked(false);
  };

  const handleClickChange = (open: boolean) => {
    setClicked2(false);
    setClicked(open);
  };
  const handleClickChange2 = (open: boolean) => {
    setClicked2(open);
  };

  const clickContent = useMemo(() => {
    return (
      <div className={styles.contentBox} id="popContainer">
        <Sortable
          list={list}
          setList={setList}
          data={newData}
          setData={setNewData}
          changeData={() => {
            changeLegends?.([...newData]);
            refData.current = newData;
            setNewActive();
          }}
        ></Sortable>
      </div>
    );
  }, [newData, list, activeIndex, refData.current]);

  return (
    <Popover
      content={
        <div>
          {clickContent}
          <CloseOutlined
            onClick={() => {
              hide();
            }}
            className={styles.closeBtn}
          />
        </div>
      }
      title="图例样式"
      trigger="click"
      arrow={false}
      placement={"rightBottom"}
      open={clicked}
      onOpenChange={handleClickChange}
    >
      <div className={styles.legendBtn}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.220491 13.2724C0.360307 13.4129 0.549494 13.4925 0.747127 13.4937H0.747823H7.25203C7.40812 13.4937 7.55781 13.4313 7.66817 13.3203C7.77854 13.2092 7.84054 13.0586 7.84054 12.9015C7.84054 12.7445 7.77854 12.5938 7.66817 12.4828C7.55781 12.3717 7.40812 12.3093 7.25203 12.3093H1.43929L6.20858 2.71238L8.11741 6.55537C8.18863 6.69339 8.31095 6.79768 8.45794 6.84571C8.60494 6.89374 8.76481 6.88166 8.90303 6.81207C9.04125 6.74248 9.14671 6.62098 9.19665 6.4738C9.24658 6.32662 9.23698 6.16558 9.16991 6.02547L6.88126 1.41949C6.80822 1.27249 6.68996 1.15349 6.54388 1.07999C6.1724 0.893093 5.72163 1.04499 5.5359 1.41809L0.0807067 12.3975C0.0271426 12.5046 -0.000682907 12.6229 1.27301e-05 12.7426C0.00147124 12.9415 0.0806751 13.1318 0.220491 13.2724ZM8.16268 12.5783C8.80905 13.2286 9.68528 13.5945 10.5993 13.5958V13.6C11.5056 13.587 12.3705 13.2157 13.0069 12.5661C13.6432 11.9166 14 11.0412 14 10.1291C14 9.21696 13.6432 8.34151 13.0069 7.69199C12.3705 7.04247 11.5056 6.67109 10.5993 6.65813C9.6854 6.65943 8.80928 7.02523 8.16292 7.67537C7.51656 8.32552 7.15269 9.20699 7.15103 10.1266C7.1525 11.0464 7.5163 11.928 8.16268 12.5783ZM8.99385 8.50851C9.41975 8.08008 9.99709 7.83907 10.5993 7.83833H10.6L10.6014 7.83903C11.0507 7.83944 11.4898 7.97391 11.8632 8.22544C12.2366 8.47696 12.5275 8.83424 12.699 9.25211C12.8706 9.66997 12.9153 10.1297 12.8272 10.573C12.7392 11.0164 12.5225 11.4236 12.2046 11.743C11.8866 12.0625 11.4817 12.2799 11.0409 12.3678C10.6002 12.4557 10.1434 12.4101 9.72842 12.2368C9.31342 12.0635 8.95881 11.7702 8.70943 11.3941C8.46004 11.018 8.32708 10.576 8.32735 10.1238C8.32827 9.51783 8.56796 8.93694 8.99385 8.50851Z"
            fill="#262626"
          />
        </svg>
        &nbsp;
        <span className={styles.btnName}>图例样式</span>
        <DownOutlined
          className={styles.arrow}
          style={clicked ? { transform: "rotate(180deg)" } : {}}
        />
      </div>
    </Popover>
  );
}

const blockStyles = createStyles(({ css, token }) => ({
  legendBtn: css`
    position: absolute;
    top: 10px;
    right: 14px;
    display: flex;
    cursor: pointer;
    align-items: center;
    font-size: 13px;
    color: #262626;
    z-index: 11;
    padding-left: 14px;
    border-left: 1px solid #e1e3e7;
  `,
  btnName: css`
    color: #262626;
    font-size: 13px;
    margin-right: 4px;
  `,
  arrow: css`
    color: #b4b8c2;
    transition: transform ease 0.3s;
  `,
  closeBtn: css`
    position: absolute;
    top: 12px;
    right: 12px;
  `,
  contentBox: css`
    width: 100%;
    border-top: 1px solid #ecedf0;
    padding-top: 10px;
  `,
  items: css`
    display: flex;
    align-items: center;
    position: relative;
    padding: 6px 16px 6px 6px;
    color: #262626;
    font-size: 14px;
    min-width: 220px;
    cursor: pointer;
    border-radius: 4px;
  `,
  itemslabel: css`
    cursor: pointer;
    width: 170px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  iconBox: css`
    display: inline-block;
    width: 24px;
    height: 24px;
    background: #f1f2f4;
    margin-right: 10px;
    border-radius: 4px;
  `,
  iconsList: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 168px;
  `,
  colorsList: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 168px;
  `,
  colorBox: css`
    width: 20px;
    height: 20px;
    margin-right: 4px;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  spaceLine: css`
    width: 100%;
    background: #ecedf0;
    height: 1px;
    margin-top: 10px;
    margin-bottom: 12px;
  `,
  label1: css`
    color: #262626;
    font-size: 12px;
    margin-bottom: 6px;
    display: inline-block;
  `,
}));
