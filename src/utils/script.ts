export const getItemsFromData = (res: any, scriptName: string) => {
  if (res) {
    let data: any = res;
    if (res['response'] && res['response']['_status'] === 'OK') {
      data = res.response;
    }
    if (res['data'] && res['data']['_status'] === 'OK') {
      data = res.data;
    }

    if (
      data[scriptName] &&
      data[scriptName].items &&
      data[scriptName].items.length > 0
    ) {
      return data[scriptName].items;
    }
  }
  return [];
};
