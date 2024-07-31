import { createGlobalStyle, createStyles } from "antd-style";
import { useState, useEffect } from "react";
import { Modal, Button, Input } from 'antd';
import ChartPanel from "@/components/ChartPanel";
import DataPanel from "@/components/DataPanel";
import Header from "@/components/Hearder";
import NoSelectMain from "@/components/NoSelectMain";
import Tools from "@/components/Tools";
import useT from "@/hooks/use-t";
import { fetchDataByReference, fetchAllObjects } from "@/service/api"; // 引入API调用函数

export type ScreenStateType = "normal" | "full";

export default function Home() {
  const { styles } = blockStyles();
  const t = useT("site");
  const [screenState, setScreenState] = useState<ScreenStateType>("normal");
  const [checkedIds, setCheckedIds] = useState<API.DataItem[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [object, setObject] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制弹窗显示

  useEffect(() => {
    const fetchObjects = async () => {
      setLoading(true);
      try {
        const objects = await fetchAllObjects();
        console.log('Fetched objects:', objects);
      } catch (error) {
        console.error('Error fetching objects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchObjects();
  }, []);

  const selectedModeChange = (state: boolean) => {
    setIsSelectMode(state);
  };

  const screenStateChange = (state: ScreenStateType) => {
    setScreenState(state);
  };

  const checkedIdsChange = (list: API.DataItem[]) => {
    setCheckedIds(list);
  };

  const handleFetchData = async () => {
    setLoading(true);
    console.log('Fetching data with:', { object, reference });
    try {
      const response = await fetchDataByReference(object, reference);
      console.log('API response:', response);
    } catch (error) {
      console.error('Error calling API', error);
    } finally {
      setLoading(false);
      setIsModalVisible(false); // 关闭弹窗
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <GlobalStyle />
      <Header />
      <div className={styles.main}>
        <DataPanel
          screenState={screenState}
          checkedIds={checkedIds}
          checkedIdsChange={checkedIdsChange}
          setLoading={setLoading} // 传递 setLoading 函数
        />
        <div className={styles.right}>
          <Tools
            screenState={screenState}
            screenStateChange={screenStateChange}
            isSelectMode={isSelectMode}
            selectedModeChange={selectedModeChange}
          />
          {checkedIds.length > 0 ? ( // 仅在选中了 references 时渲染 ChartPanel
            <ChartPanel
              items={checkedIds}
              isSelectMode={isSelectMode}
              setLoading={setLoading} // 传递 setLoading 函数
            />
          ) : (
            <NoSelectMain checkedIdsChange={checkedIdsChange} />
          )}
        </div>
      </div>
      <Modal
        title="Enter objects and references"
        visible={isModalVisible}
        onOk={handleFetchData}
        onCancel={handleCancel}
        okText="获取数据"
        cancelText="取消"
      >
        <div>
          <label>object:</label>
          <Input value={object} onChange={(e) => setObject(e.target.value)} />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>reference:</label>
          <Input value={reference} onChange={(e) => setReference(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  ::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #00000040;
  }
  ::-webkit-scrollbar-track {
    background: #0000000f;
    border-radius: 10px;
  }
`;

const blockStyles = createStyles(({ css, token }) => ({
  container: css`
    height: 100vh;
    display: flex;
    flex-direction: column;
  `,
  main: css`
    flex: 1;
    overflow: hidden;
    display: flex;
  `,
  right: css`
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    background: #f2f3f9;
  `,
  loading: css`
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 9999;
  `,
  spinner: css`
    border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
  `,
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
}));
