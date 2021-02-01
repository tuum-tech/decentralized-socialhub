export function useEduInstituteSearch(optionalCallback: any = noop) {

    const queryRequest = (keyword: any) => {
      /**
       * Request to get all educational institutes that matches the given keyword e.g. MIT
       */

      async function getData(url:any, keyword:string) {
        const response = await fetch(url + keyword, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            // 'Authorization': `${process.env.REACT_APP_BACKEND_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer'
        });

        return response.json();        
      }

      getData(`${process.env.REACT_APP_GET_EDUCATIONAL_INSTITUTE}`, keyword)
        .then(response => {
          // if(response.meta.code === 200) {
            optionalCallback(response);  
          // }
        },() => {
      });  
    }

    return [queryRequest] as [(obj: any) => void]
}

function noop() {}