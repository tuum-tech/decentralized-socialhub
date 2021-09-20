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
      let items = data[scriptName].items;
      if ((items[0] as any).updated_at) {
        items = items.sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      }
      return items;
    }
  }
  return [];
};
