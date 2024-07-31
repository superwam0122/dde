export const fetchDataByReference = async (object: string, reference: string) => {
  console.log('API request with:', { object, reference }); // 打印请求参数
  try {
    const response = await fetch('http://121.199.174.188:8082/deeptime/subtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ object, reference })
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const responseData = await response.json();
    console.log('API response data:', responseData); // 添加日志
    return responseData;
  } catch (error) {
    console.error('Error during API call:', error);
    throw error;
  }
};

export const fetchAllObjects = async () => {
  try {
    const response = await fetch('http://121.199.174.188:8082/deeptime/objects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error during API call:', error);
    throw error;
  }
};

export const fetchAllReferencesByObject = async (object: string) => {
  try {
    const response = await fetch(`http://121.199.174.188:8082/deeptime/references/${object}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('API response status:', response.status); // 打印响应状态
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const responseData = await response.json();
    console.log('API response data:', responseData); // 打印响应数据
    return responseData;
  } catch (error) {
    console.error('Error during API call:', error);
    throw error;
  }
};
